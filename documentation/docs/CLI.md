# CLI

## init

### Usage

```shell
leviate init [<dir>]
```

### Description
This command copies the project template files into the specified directory and installs its dependencies via the `npm install` command. 
The destination must be empty otherwise the command will exit with an error message.


## checklang
### Usage

```shell
leviate checklang [[<dir>] --page --silent]
```

### Description
Checks the `views` and `components` directories within the specified directory for hardcoded language strings within:
- html tags
- title attributes

*This check is not foolproof and may fail to find some strings, and return others that don't need translating.*
*Care should always be taken when writing and reviewing code to use translation keys wherever possible.*

