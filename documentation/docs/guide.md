# Guide

## Introduction

Leviate is a framework for building data-centric product configurators and design tools, so configuration via forms and inputs is at the heart of the application. One of the most powerful features of Leviate is the way it uses a specific format for input ids to automatically do the following:

- Retrieve the value from the data model
- Set the value when the user hits return or the input is blurred
- Validate the user's input against the model schema
- Render the translated label

Let's look at this in action.

## Step One: Define the data structure

First of all, lets define a schema and data model. We'll also define the corresponding language strings.

**`schema/section-schema.js`**

```javascript
import { string, number, object } from 'yup';

export default object().shape({
  name: string().ensure().required(),
  width: number().default(0.2).min(0.1).max(0.5),
  height: number().default(0.5).min(0.2).max(1),
  thickness: object().shape({
    min: number().default(0.04).min(0.04).max(0.06),
    max: number().default(0.06).min(0.06).max(0.08),
  })
});

```


**`models/SectionModel.js`**

```javascript
import BaseModel from '@crhio/leviate/BaseModel';
import sectionsSchema from '@/schema/section-schema';

class SectionModel extends BaseModel {
  static id = 'sections';

  static schema = sectionsSchema;

  static get fields() {
    return {
      // This is required
      ...this.baseFields,
      // This automatically casts the schema using its default values
      ...this.schema.cast(),
      // We can also specify our own fields and default values 
      name: `Section ${this.read().length + 1}`,
    };
  }
}

export default SectionModel;

// Don't forget to export this in models/index.js!

```

**`locales/en.js`**
```javascript
export default {
  name: 'name',
  width: 'width',
  height: 'height',
  thickness_min: 'minimum thickness',
  thickness_max: 'maximum thickness'
}
```

## Step Two: Build the form

This is where the magic happens. Using the format `[instanceId]:[key]` for the input ids, the inputs will render the respective label and value, update the state, and display any validation errors.

::: tip
`instanceId` can be either a normie model's uuid, or a store submodule key. For the examples below we'll be using the entity id from a normie model
:::


**`components/forms/SectionForm.vue`**

```vue
<template>
  <CTextInput :id="`${id}:name`" />
  <CNumericInput :id="`${id}:width`" />
  <CNumericInput :id="`${id}:height`" />
  <CFormElement label="thickness">
    <div class="w-full flex space-x-4">
      <CNumericInput :id="`${id}:thickness.min`" />
      <CNumericInput :id="`${id}:thickness.max`" />
    </div>
  </CFormElement>
</template>

<script setup>
import Section from '@/models/SectionModel'

const section = Section.create();
const { id } = section;

</script>
```

::: tip
As you can see in the example above, nested properties can be bound using dot notation
:::

## More on form inputs

Leviate is very opinionated and assumes the following:
- all inputs will be wrapped in a `<CFormElement>` wrapper containing a label and some basic styling
- all labels should be generated from the input id and translated
- all inputs should use the id to create a two way binding

We understand that although this functionality is incredibly powerful, and leads to less boilerplate code, you may not want this behaviour every time. All of it can be overridden by specifying additional props. Here are some examples:

```vue
// Renders an unwrapped input
<CTextInput :id="`${id}:name`" no-wrap />

// Renders a wrapped input without a label (still shows errors)
<CTextInput :id="`${id}:name`" no-label />

// Renders an input with a custom label (still translates the label)
<CNumericInput :id="`${id}:thickness.max`" label="max" />

// Renders an input with a custom label and no translation
<CNumericInput :id="`${id}:thickness.max`" label="mm" no-translate />

// Renders an input with a local data binding
<CNumericInput id="height`" v-model="myData.height" />
```

You can find documentation on each of the different input components on the [Concrete Docs Site](https://leviat-concrete.netlify.app/)

## Updating the state

```javascript
import { transact } from '@crhio/leviate';

transact(async () => {
  // Do your updates here!
})
```

Transactions are at the heart of state management and persistence. See below for a quick reference when to use and when not to use transactions, and continue reading for a more detailed explanation.

::: tip DO USE TRANSACTIONS
For changes to data and settings and anything else that you wish to persist between sessions
:::

::: danger DON'T USE TRANSACTIONS
For trivial UI changes e.g. changing the zoom, current editing tool, or displaying messages
:::

Whilst you can update the state directly, wrapping the update action in a `transaction` will ensure that the update:
- is committed to the persistent state by calling `host.setState()`
- is stored in the undo history
- will be reverted if any errors occur

By using the form inputs in the way described in the examples above the update will automatically be wrapped in a `transaction`.

`transact` is asynchronous so you can `await` any changes before performing additional actions. E.g.

```javascript
import { transact } from '@crhio/leviate';
import Model from '@/models/Model'

async function updateStore() {
  const id = await transact(() => {
    const data = fetchSomethingFromServer();
    const model = Model.create(data);
    return model.id;
  });
  
  doSomethingWithId(id);
}
```

::: tip
You can create and directly import local pinia stores but only stores exported in the `modules` property of `@/store/index.js` will be saved to the persistent state.
:::

## Displaying messages

The configuration section in the template is automatically configured to display any config or calculation errors as 'toast' messages using Concrete's `<CStatusBar>` component. You need to call the message store actions yourself but as long as you follow the examples below the messages will automatically be displayed for you.

### Config errors

A simplified example of how to set a config error

```javascript
import { useMessageStore } from '@crhio/leviate';

const messageStore = useMessageStore();
const { calc } = useApi();

function validateConfig() {
  if (!configIsValid()) {
    messageStore.setConfigError('There are errors in your configuration');
  }
}
```

### Calculation errors

Calculation errors are a bit more complicated as we need to specify the entity id and path

```javascript
import { useMessageStore, useApi } from '@crhio/leviate';
import Model from '@/Models/Model';s

async function getDataFromEndpoint(id) {
  const modelData = Model.find(id).$toJSON();
  const res = await calc(modelData);
  
  if (res.errors) {
    messageStore.setCalculationErrors(Model.id, id, errorPath, res.errors);
  }
} 
```

### Global messages

Global messages aren't configured to display anywhere in the template but it's easy to do so. The following example uses `concrete`'s `<CStatusBar>` but you don't have to use this.

**`MyComponent.vue`**
```vue
<template>
  <CStatusBar :messages="messages" @dismiss="messageStore.removeMessage($event)" />
</template>

<script setup>
import { computed } from 'vue';
import { useMessageStore } from '@crhio/leviate';

const messageStore = useMessageStore();
const messages = computed(() => messageStore.globalMessages);
</script>
```

Find the complete reference in the [useMessageStore](/core.html#usemessagestore) section of the Core API page
