# {{ TITLE }}

## Getting Started

Make sure you are in the project folder - `cd project` - and then run `npm run dev`

The entry point - `main.js` is already configured with the minimum config which looks like this:

```javascript
import { createApp } from 'leviate';

createApp(appConfig);
```

## Configuration options

`createApp` accepts a single `appConfig` argument with options as follows:

### plugins: Array
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

### components: Array
An array of components to be automatically loaded via `Vue.component`. Each component will be registered using its `name` property.

**example**:
```javascript
createApp({
  components: [
    CustomInput,
    GlobalComponent
  ]
});
```

### endpoints: Object
A map of keys to baseUrls. It is recommended to store these in an .env file which will be automatically included by vite.
```javascript
endpoints: {
  calc: import.meta.env.VITE_API_CALC,
  pdf: import.meta.env.VITE_API_DOC,
},
```
Using the api in a component or module looks like this:
```javascript
import { useApi } from 'leviate'
const api = useApi();
api.calc('/some/path', { some: 'data' });
```