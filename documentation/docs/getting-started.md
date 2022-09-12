# Getting Started

## Prerequisites

You'll need a valid npm token set as an environment variable in order to install leviate and some of its dependencies:
```shell
export NPM_AUTH_TOKEN="TOKEN"

npm config set //registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}
```

::: tip
You may wish to add this to your `.bashrc` or `.zshrc` file to ensure the variable is set for every new session.
:::

## Installation

Install leviate globally to access the command line tools anywhere and initiate new projects in a directory of your choosing.

```shell
npm install -g @crhio/leviate
```

## Creating a project

Create a leviate project in the given directory.

More about this command in the [CLI](/cli) documentation.

```shell
leviate init <project-name>
```

## Starting the dev server

`cd` in to the `project` folder and run `npm run dev`

Click the link in the terminal and the app template will open in your default browser. Hot Module Reloading is enabled so the browser should update everytime you save your local changes

## Importing project modules

The `src` folder has been aliased with `@` in `vite.config.js` so you can import modules like so:
```javascript
import SomeModel from '@/models/SomeModel'
import MyForm from '@/components/forms/MyForm.vue'
// etc
```

::: danger Please Note
You must specify the `.vue` extension when importing Vue components
:::

## Styling

There are no scss/css files included in the project template. Leviate used tailwind and the prefered approach is to use tailwind classes exclusively.

For reusable styled elements/components the recommendation is to use the [styled](/directory-structure.html#styled) components directory.

There may be certain instances where tailwind classes are insufficient e.g. nested selectors, in which case the `<style>` tag should be used in the SFC.

External stylesheets should be a last reort.
