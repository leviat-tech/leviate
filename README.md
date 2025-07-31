# leviate

A tool for building Single Page Applications (plugins) to be hosted on the Leviat Design Studio platform.

In essence this module can be broken down into three separate parts:

- a CLI for initialising apps and running helpful utility functions
- a project template
- core files consisting of
  - essential application files used within all host plugins
  - additional extensions which are often but not always used

Full documentation can be found at [https://leviate-docs.netlify.app/](https://leviate-docs.netlify.app/)

## Running the development app

```
# install the core project dependencies
npm i

# install the development app dependencies
cd app
npm i

# run the app
npm run dev
```

## Editing core and template files

Once the app is running you shouldn't need to edit anything in the /app folder. Everything is pulled in from
- `/core` - the equivalent of installing `@crhio/leviate` in a project
- `/template/project` - the template project files

## Developing leviate locally within a plugin project

This section describes how to run your local version of leviate in a plugin, watch for changes, and automatically reload the project with the latest updates.

```shell
# Ensure you have the required development tools installed globally
npm i -g nodemon yalc

# Watch files for changes and push to project on every update. In leviate root:
npm run watch

# Link leviate to the plugin and start the dev server. In your plugin's project folder:
yalc link @crhio/leviate
npm run dev
```

For more info see https://github.com/wclr/yalc
