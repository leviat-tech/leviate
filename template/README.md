# {{ TITLE }}

## Getting Started

Make sure you are in the project folder - `cd project` - and then run `npm run dev`

The entry point - `main.js` is already configured with the minimum config which looks like this:

```javascript
import { createApp } from '@crhio/leviate';

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
import { useApi } from '@crhio/leviate'
const api = useApi();
api.calc('/some/path', { some: 'data' });
```

## Additional config

Anything exported in `src/components/routes.js` will be automatically registered globally as a component

Anything exported in `src/models/routes.js` will be automatically registered as a model in the VuexORM database

## Updates to architecture and implementation

### Host

The host api is still available in components by using `this.$host` but two major things have changed.

**decoupling from global `Vue`**

Instead of calling `Vue.prototype.$host|$l` the modules should be used as follows:
```js
import { useHost, useLocalize } from '@crhio/leviate/plugins/host';

const $host = useHost();
const state = $host.getState();

const $l = useLocalize();
const translated = $l(phrase);
```

**config and functionality has been separated**

- The host mock api is safely tucked away in leviate core and is unlikely to need updating
- The mock configuration which gets passed to the host instance is stored with the project files in `src/mock.config.js`
