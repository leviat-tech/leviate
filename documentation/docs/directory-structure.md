# Directory Structure

## Assets directory

The assets folder is often not used. At present apps are bundled in a single JavaScript file and injected into an iframe. This is likely to change in the future. You can however import svgs, which will be bundled in the JavaScript.

## Components directory

With the exception of router views, all of the project's Vue components should be stored in the  `components` directory. These should be organised into folders in order to keep things tidy and group similar component types together. The project template starts off with several component folders:

### configuration

The configuration is basically the form section of the app where the user will input most of their data. Out of the box the configuration has a search bar for locating inputs by label, an example form and also renders any messages and errors set in `leviate`'s `message` store.

### forms

This should contain all the forms used in the project

### project

This folder contains all the component's for the 'Project Explorer' section of the app including the toolbar and a menu for creating, duplicating and deleting 'Entities'.

### scaffold

The `scaffold` folder contains the layout and section containers for the project. You may not need to edit these at all as most of the project specific implementation is in the respective section's directory. You probably won't need to add anything here either. However, in order to allow for a degree of flexibility the scaffold folder lies within the project itself and is editable if need be. 

### styled

This directory should contain functional components for presentation/styling/layout purposes only. 

### viewport

The viewport folder should contain all components related to the image/drawing section of the app.

### index.js

The index file should export a default array of components that you wish to make globally available throughout the app via `app.component(Component)` without having to import them explicitly each time.

## Composables directory

The `composables` directory should include any functionality shared by Vue components and called in the component's `setup` function. 

## Documents directory

The `documents` directory should contain configurations for each document type available within the project.

## Locales directory

The `locales` directory contains all the translation keys for each available language in the project. Each langauge file should contain a shallow map of keys to lower case strings. Hard-coded strings should be avoided. This directory must contain an `index.js`file which exports all available translation files.

::: tip
The CLI's `checklang` command helps check for any hard-coded language strings in the project. [Find out more](/cli.html#checklang)
:::

## Migrations directory

The `migrations` directory contains migration definitions to be executed when the data model changes in a live app. These migrations ensure that any new properties added to the state are not overwritten when persisting data between multiple sessions.


Further documentation and examples coming soon

## Models directory

The `models` directory contains the models to be used by `normie` and should extend `leviate`'s `BaseModel` in order to make full use of `leviate`'s functionality including input id and form validation mappings. This directory must contain an `index.js` file which exports an array of all models to be included.

[https://github.com/leviat-tech/normie](https://github.com/leviat-tech/normie)

## Schema directory

The `schema` directory contains the `yup` schemas corresponding to each `normie` entity definition in the `models` directory. The index file contains `yup` extended methods and helpers. Individual schema files do not need to be exported in the index but are imported directly when needed.

[Find the yup documentation here](https://github.com/jquense/yup)

## Store directory

The `store` directory contains the root store config and submodules, each defined as its own store using pinia's `defineStore` method. This directory must contain an `index.js` file which exports `state`, `actions` and `getters` to merge with the root store, and a `modules` array which should include all stores that will be stored in the persistent state. 

::: tip
You can also define and use stores whose data doesn't need to persisted between sessions. Simply import these as needed and don't export them in the `modules` config.
:::

## Views directory

The `views` directory contains all the root views rendered by `vue-router`, defined in `src/routes`. All other Vue components should be placed in the `components` directory.

## Config and entry

