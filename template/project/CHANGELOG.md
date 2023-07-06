# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.5.0](https://github.com/leviat-tech/leviate/compare/v3.4.0...v3.5.0) (2023-06-28)


### Features

* enable update locale ([fdd200c](https://github.com/leviat-tech/leviate/commit/fdd200c49152d00963c5abc4696c6e632ed33057))


### Bug Fixes

* ensure local storage state is restored before app mounts in dev ([3a11f4d](https://github.com/leviat-tech/leviate/commit/3a11f4d8a34a36e6dcdc49ef7c22f60a8f7ff6e2))

## [3.4.0](https://github.com/leviat-tech/leviate/compare/v3.3.0...v3.4.0) (2023-04-06)


### Features

* cache getters from host ([88e8507](https://github.com/leviat-tech/leviate/commit/88e8507c5ab60fa8a536fd3b491a74a15ba1ad1a))
* use async inject, wait for host to attach before mounting app ([7cf55b1](https://github.com/leviat-tech/leviate/commit/7cf55b1d3dfef9304df6e43b488cabad047d3ad1))

## [3.3.0](https://github.com/leviat-tech/leviate/compare/v3.2.1...v3.3.0) (2023-03-03)


### Features

* add useApiGateway to core ([fcb39bd](https://github.com/leviat-tech/leviate/commit/fcb39bd0e359d7cd98e60525134fecd9df220208))
* add useEnum composable ([817b308](https://github.com/leviat-tech/leviate/commit/817b3086cf63afb0184d2318eafdd8dfaafaec7d))


### Bug Fixes

* authorizedGetRequest ([5d9cecc](https://github.com/leviat-tech/leviate/commit/5d9cecced0f0813b62a657991a5be68f82deb0ff))

## [3.3.0](https://github.com/leviat-tech/leviate/compare/v3.2.1...v3.3.0) (2023-03-03)


### Features

* add useApiGateway to core ([fcb39bd](https://github.com/leviat-tech/leviate/commit/fcb39bd0e359d7cd98e60525134fecd9df220208))


### Bug Fixes

* authorizedGetRequest ([5d9cecc](https://github.com/leviat-tech/leviate/commit/5d9cecced0f0813b62a657991a5be68f82deb0ff))

### [3.2.2](https://github.com/leviat-tech/leviate/compare/v3.2.1...v3.2.2) (2023-01-06)


### Fixes

* authorizedGetRequest ([6aca348](https://github.com/leviat-tech/leviate/commit/6aca34854952090806c4364dda7b2823d87550d6))

### [3.2.1](https://github.com/leviat-tech/leviate/compare/v3.2.0...v3.2.1) (2022-12-16)


### Fixes

* ensure nested model updates are reactive ([c41ddb2](https://github.com/leviat-tech/leviate/commit/c41ddb23b44176e469f732f4603d2001338657e0))

## [3.2.0](https://github.com/leviat-tech/leviate/compare/v3.0.0...v3.2.0) (2022-12-16)


### Features

* use host mock in standalone mode ([6ac933d](https://github.com/leviat-tech/leviate/commit/6ac933def43eb239dcbe57c54f290aa69a9f3a9e))

### [3.1.1](https://github.com/leviat-tech/leviate/compare/v3.1.0...v3.1.1) (2022-12-13)

## [3.1.0](https://github.com/leviat-tech/leviate/compare/v3.0.0...v3.1.0) (2022-12-12)


### Features

* use host mock in standalone mode ([4d70e66](https://github.com/leviat-tech/leviate/commit/4d70e66e71f14f9c9dce96d184225ea6670d53ad))

## [3.0.0](https://github.com/leviat-tech/leviate/compare/v2.2.0...v3.0.0) (2022-11-11)


### Fixes

* simplify entry point and make app/store globally available for e2e testing ([943f4bb](https://github.com/leviat-tech/leviate/commit/943f4bb9921b40cc004ef3b5e7a81243192cc178))

## [2.2.0](https://github.com/leviat-tech/leviate/compare/v2.1.6...v2.2.0) (2022-11-02)


### Features

* allow passing concrete options to createApp ([49696ab](https://github.com/leviat-tech/leviate/commit/49696ab950d82957481b82b119453f5a4df11246))


### Fixes

* allow store modules in global input handler ([aa1e94b](https://github.com/leviat-tech/leviate/commit/aa1e94bf7dd63dcc87ba20ddf7abe62a128d9109))
* revert label formatter to underscore ([7b8fd73](https://github.com/leviat-tech/leviate/commit/7b8fd73bc8ad3abb50cd7837778546f8294f657d))

### [2.1.8](https://github.com/leviat-tech/leviate/compare/v2.1.6...v2.1.8) (2022-10-03)


### Fixes

* allow store modules in global input handler ([aa1e94b](https://github.com/leviat-tech/leviate/commit/aa1e94bf7dd63dcc87ba20ddf7abe62a128d9109))
* revert label formatter to underscore ([d370a0f](https://github.com/leviat-tech/leviate/commit/d370a0fe8c7ab84dfa09abf7ce9720bff48255c9))

### [2.1.7](https://github.com/leviat-tech/leviate/compare/v2.1.6...v2.1.7) (2022-09-29)


### Fixes

* allow store modules in global input handler ([02f2ca8](https://github.com/leviat-tech/leviate/commit/02f2ca83f75babe030d90162f4517b53a4a19447))

### [2.1.6](https://github.com/leviat-tech/leviate/compare/v2.1.5...v2.1.6) (2022-09-20)


### Fixes

* complete refactor of input id separator ([a5e7c32](https://github.com/leviat-tech/leviate/commit/a5e7c3296be5c5c52c524fcb0cfd385cc31cf195))

### [2.1.5](https://github.com/leviat-tech/leviate/compare/v2.1.4...v2.1.5) (2022-09-20)


### Fixes

* change input id separator to colon ([832f6ca](https://github.com/leviat-tech/leviate/commit/832f6caee0959ea95af58e3ae66112be11d24dc4))

### [2.1.4](https://github.com/leviat-tech/leviate/compare/v2.1.3...v2.1.4) (2022-09-20)

### [2.1.3](https://github.com/leviat-tech/leviate/compare/v2.1.2...v2.1.3) (2022-09-15)

### [2.1.2](https://github.com/leviat-tech/leviate/compare/v2.1.0...v2.1.2) (2022-09-15)

### [2.1.1](https://github.com/leviat-tech/leviate/compare/v2.1.0...v2.1.1) (2022-09-14)

## [2.1.0](https://github.com/leviat-tech/leviate/compare/v2.0.1...v2.1.0) (2022-09-01)


### Features

* update label formatter to use input ids ([d0c0d2e](https://github.com/leviat-tech/leviate/commit/d0c0d2e6613b9b205cfbb0c573e065bca274efaf))


### Fixes

* revision plugin (undo/redo) ([184bc29](https://github.com/leviat-tech/leviate/commit/184bc29da59b306338ec01cfd23d80afedd4f8c2))

### [2.0.1](https://github.com/leviat-tech/leviate/compare/v2.0.0...v2.0.1) (2022-08-29)


### Fixes

* fetch-access-token error ([63e44b6](https://github.com/leviat-tech/leviate/commit/63e44b66c32b79afb3b8cf4f0bbe6b8e2e1f6d83))

## 2.0.0 (2022-08-28)


### Features

* add husky, commitlint and standard-version ([90e017a](https://github.com/leviat-tech/leviate/commit/90e017a2a9d28f9b3b5e36283f7b62924167a050))
* add normie store to root store ([2dbc378](https://github.com/leviat-tech/leviate/commit/2dbc37837a38102ce56d59cb1bdfa271f7719209))
* add version, checkUpdates and dev commands ([09a45e9](https://github.com/leviat-tech/leviate/commit/09a45e9971a66e7de5fe403965c3bc1505258e55))
* call initialize in store modules and remove deprecated next from router guard ([31586b5](https://github.com/leviat-tech/leviate/commit/31586b58536470dd660a374de876dad82e3d1f8a))
* **cli:** enable checking for local and global updates ([0b396cb](https://github.com/leviat-tech/leviate/commit/0b396cb9dd67d3968613ca0fbcb06e213e4825f2))
* **cli:** enable shorthand switch in checkUpdates command ([9626240](https://github.com/leviat-tech/leviate/commit/96262402839fc36d533a0206a8fd8413d2c8781d))
* **core:** add concrete labelFormatter option ([4d87b53](https://github.com/leviat-tech/leviate/commit/4d87b53ee37358394e9e295a90e387f288dcb3d3))
* fetch proxy access token automatically ([a9d2e5f](https://github.com/leviat-tech/leviate/commit/a9d2e5f2c2d2cec45ff205381bf1eb5fde0f3590))
* move entry point to core and split into dev and build ([06856a6](https://github.com/leviat-tech/leviate/commit/06856a6b35e4008fda0dbe292809b71c61758f6a))
* update host bar styling in core ([2fb5843](https://github.com/leviat-tech/leviate/commit/2fb58435f3560c1f326d57f992086a889861b553))
* update template ([8b80a03](https://github.com/leviat-tech/leviate/commit/8b80a03fdd79cdcf83e7674700c2f48b4e0e4374))


### Fixes

* add includes to vite and tailwind config ([6622d99](https://github.com/leviat-tech/leviate/commit/6622d99e9e625e864f089b70eb8a6f423b90db65))
* **cli:** replace placeholder text in mock config ([b774353](https://github.com/leviat-tech/leviate/commit/b77435320c8e59d7aafd15367cca1005ca30ae38))
* **cli:** wait for previous command to finish in compound command ([73d9649](https://github.com/leviat-tech/leviate/commit/73d9649873697ab3ecb2dc523226ee1fcfa843db))
* init command not working ([a67b2c3](https://github.com/leviat-tech/leviate/commit/a67b2c3ef56769dc2384e99e87257acefa01139f))
* init replace function error ([2d5d75a](https://github.com/leviat-tech/leviate/commit/2d5d75a9ad2763a32e8252df5180579b7aecfa85))
* return value from router navigation guard ([f5bbbff](https://github.com/leviat-tech/leviate/commit/f5bbbff3d922ca9b65ab93bf54e224e39f2bd898))
* soft error when fetching proxy token fails ([d97b9ec](https://github.com/leviat-tech/leviate/commit/d97b9ec692695d17419f447323a86121079a377f))
* update normie reference in BaseModel ([5d1dfdf](https://github.com/leviat-tech/leviate/commit/5d1dfdf7c5e0715dfc9e692184ee0ae2844893ac))
* update normie references ([dd95b7f](https://github.com/leviat-tech/leviate/commit/dd95b7f633a0674d0078e6c00adf044e5781646c))

## 1.2.0 (2022-07-05)


### Features

* add husky, commitlint and standard-version ([90e017a](https://github.com/leviat-tech/leviate/commit/90e017a2a9d28f9b3b5e36283f7b62924167a050))
* fetch proxy access token automatically ([a9d2e5f](https://github.com/leviat-tech/leviate/commit/a9d2e5f2c2d2cec45ff205381bf1eb5fde0f3590))


### Fixes

* init command not working ([a67b2c3](https://github.com/leviat-tech/leviate/commit/a67b2c3ef56769dc2384e99e87257acefa01139f))

## 1.1.0 (2022-05-04)


### Features

* add husky, commitlint and standard-version ([bd8f49c](https://github.com/leviat-tech/leviate/commit/bd8f49c451db003ba1dc31f9d3e7d3c94e350a6d))


### Fixes

* init command not working ([fc21a17](https://github.com/leviat-tech/leviate/commit/fc21a1727b963bc0eadc447f55f138ead6613fb9))