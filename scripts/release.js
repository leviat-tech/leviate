// Runs on standard version postbump to keep
// template in sync with newly bumped version

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../')

const packagePath = root + '/package.json';
const templatePackagePath = root + '/template/project/package.json';

const newVersion = require(packagePath).version;
const templatePackage = require(templatePackagePath);

templatePackage.dependencies['@crhio/leviate'] = '^' + newVersion;

const json = JSON.stringify(templatePackage, null, '  ');

fs.writeFileSync(templatePackagePath, json);

