# CLI

## `init`

**Usage**

```shell
leviate init [<dir>]
```

**Description**

This command copies the project template files into the specified directory and installs its dependencies via the `npm install` command. 
The destination must be empty otherwise the command will exit with an error message.

**Options**

`dir` - Spcifies a directory to create for the new project. 

## `checklang`
**Usage**

```shell
leviate checklang [[<dir>] --page --silent]
```

**Description**
Checks the `views` and `components` directories within the specified directory for hardcoded language strings within html tags and title attributes, and displays the file and line reference, and matching text content in the terminal.


::: warning
This check is not guaranteed to be 100% accurate and may possibly return false positives or fail to locate some strings.
Care should always be taken when writing and reviewing code to use translation keys wherever possible.
:::

**Options**

`page` - require that the user press a key after each file is displayed in the terminal

`silent` - display the results summary only

## `version`
**Usage**

```shell
leviate version [-g]
```

**Description**
Checks the current version of `leviate`.

**Options**

`g` - checks the globally installed version. Otherwise the local version in `node_modules` is checked

