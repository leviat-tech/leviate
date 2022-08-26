# Getting Started

## Prerequisites

You'll need a valid npm token set as an environment variable in order to install leviate and some of its dependencies:
```shell
export NPM_AUTH_TOKEN="TOKEN"
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
