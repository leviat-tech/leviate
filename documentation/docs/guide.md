# Guide

## Introduction

Leviate is a framework for building data-centric product configurators and design tools, so configuration via forms and inputs is at the heart of the application. One of the most powerful features of Leviate is the way it uses a specific format for input ids to automatically do the following:

- Retrieve the value from the data model
- Set the value when the user hits return or the input is blurred
- Validate the user's input against the model schema
- Render the translated label

Let's look at this in action

## Step One: Define the data structure

First of all, lets define a schema and data model. We'll also define the corresponding language strings.

### `schema/section-schema.js`

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


### `models/SectionModel.js`

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

### `locales/en.js`
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

The most important thing here is that 

### `components/forms/SectionForm.vue`

```vue
<template>
  <CTextInput :id="`sections_${id}_name`" />
  <CNumericInput :id="`sections_${id}_width`" />
  <CNumericInput :id="`sections_${id}_height`" />
  <CFormElement label="Date of Birth">
    <div class="w-full flex space-x-4">
      <CNumericInput :id="`sections_${id}_thickness.min`" />
      <CNumericInput :id="`sections_${id}_thickness.max`" />
    </div>
  </CFormElement>
</template>

<script setup>
import Section from '@/models/SectionModel'

const section = Section.create();
const { id } = section;

</script>
```

This is where the magic happens.
