# Configuration

Leviate automatically generates the minimum necessary configuration from the exports in the folders described on the [Directory Structure](/directory-structure) page. Just to summarise, they are as follows:
```javascript
import '@/schema';
import globalComponents from '@/components';
import models from '@/models';
import locales from '@/locales';
import routes from '@/routes';
import storeConfig from '@/store';
import migrations from '@/migrations';
```

You can also specify the following additional optional config parameters in `leviate.config.js`:

## globalConfig

Anything defined in the `globalConfig` will be attached to the app instance and be made available to all components in the app.

Imagine we defined a `destinationYear: 1955` property in `globalConfig`. We would access it in components as per the following example:

```vue
<template>
  <div>Travel to {{ $config.destinationYear }}</div>
</template>

<script setup>
import { inject } from 'vue';

const { destinationYear } = inject('$config');

if (destinationYear === 1955) {
  console.log('We\'re sending you back to the future');
}
</script>
```

## endpoints
A map of keys to baseUrls. It is recommended to store these in an .env file which will be automatically included by vite as long as it is prefixed with `VITE_`
```javascript
endpoints: {
  calc: import.meta.env.VITE_API_CALC,
  pdf: import.meta.env.VITE_API_DOC,
},
```
Using the api in a component or module looks like this:
```javascript
import { useApi } from '@crhio/leviate'
const api = useApi();
api.calc('/some/path', { some: 'data' });
```

To find out more please refer to [useApi](/core.html#useapi)

## plugins
An array of plugins to be included via `Vue.use`.
Each item can be the plugin export, or an array where the first item is the plugin and the second item is any options to be passed in.

**example**:
```javascript
createApp({
  plugins: [
    VDragged,
    ShortKey,
    [SomePlugin, { ...options }]
  ]
});
```
