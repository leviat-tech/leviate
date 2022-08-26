# Core API

Leviate core exports the following methods:

```javascript
export {
  useRootStore,
  transact,
  useHost,
  useLocalize,
  useApi,
};
```

## `useRootStore`

Returns the root pinia store which contains the following state, actions and getters

### state

The root state will contain any properties defined in the `state` property of the project's `@/store/index.js` file.

### actions

Any actions defined in the `actions` property of the project's `@/store/index.js` file will be attached to the root store.

### getters

As well as containing any getters defined in the `getters` property of the project's `@/store/index.js` file, this also contains some useful getters and methods:

**`idToEntityName`**

A reactive map of entity ids to entity constructor id. The store maintains this map to make it easy to retrieve a single model instance by id when there are multiple entities defined.

**`currentEntity`**

The current entity instance determined by the `entity` and `id` parameter on the `entities` route.

**`getEntityById(id)`**

Return an instance of an `Entity` by its id. This getter saves you the trouble of iterating through multiple different entity types to find out which one the id belongs to.

**`getEntryFromId(id)`**

Returns a translated string by passing in the id in the same format that the form inputs use, `[instanceId]_[path]`.

**`getModel(name)`**

Returns the Entity's model definition by its name. Normally it would be easier to import the model directly from `@/models`

**`getEntity(name, id)`**

Returns an entity by passing in its name and id. Normally you would just use `getEntityById`

## `useHost`

Returns the host instance, or mock host instance in dev mode.

## `useLocalize`

Returns the localization module which contains two methods - `$l and $L`

**`$l: function(key: string, options: object)`** returns a translated string based on the current locale.

**`$L: function(key)`** returns a capitalized translation - equivalent to calling:

`$l(key, { capitalize: true })`

**Example**

Let's assume we have a property `tagline: 'write more, do less'` in our locales config:

```javascript
import { useLocalize } from '@crhio/leviate';

const { $l, $L } = useLocalize();

const a = $l('tagline');
const b = $l('tagline', { capitalize: true });
const c = $L('tagline');

// a = 'write more, do less'
// b = 'Write More, Do Less'
// c = 'Write More, Do Less'
```

These methods are also available gloablly in Vue templates:

```vue
<template>
  <div>{{ $L('tagline') }}</div>
</template>
```

## `useApi`

returns an api for sending authorized `POST` requests to endpoints specified in the `appConfig`. Each key in the enpoints property is bound to the api instance as a method.

For example, if you had an endpoints config of
```javascript
{
  endpoints: {
    myEndpoint: import.meta.env.VITE_MY_ENDPOINT
  }
}
```

You can call your endpoint by doing the following:

```javascript
import { useApi } from '@crhio/leviate';

const api = useApi();
const res = await api.myEndpoint({ data });

// You can also use destructuring of course:

const { myEndpoint } = useApi();
const res = await myEndpoint({ data });

// The examples above POST to the base endpoint.
// You can also specify a path in the first argument and data in the second
const res = await myEndpoint('/some-path/', data);
const res = await myEndpoint('/some/other/path/', data);
```
