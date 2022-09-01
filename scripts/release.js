// Runs on standard version prebump to keep
// template in sync with newly bumped version

const { exec } = require('child_process');
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

exec(`git commit -m "chore(release): bump template to ${newVersion}"`);