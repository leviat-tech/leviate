# The Basics

## Importing Project Modules

The `src` folder has been aliased with `@` in `vite.config.js` so you can import modules like so:
```javascript
import SomeModel from '@/models/SomeModel'
import MyForm from '@/components/forms'
// etc
```

## Levatiate Exports

Leviate core exports the following methods:

```javascript
export {
  createApp,
  useRootStore,
  useHost,
  useLocalize,
  useApi,
};
```

### `createApp`
### `useRootStore`
### `useHost`

Returns the host instance, or mock host instance in dev mode.

### `useLocalize`

Returns the localization module which contains two methods - `$l and $L`

`$l: function(key: string, options: object)` - returns a translated string based on the current locale.

`$L: function(key)` - returns a capitalized translation (equivalent to calling `$l(key, capitalize: true);`)

### `useApi`
