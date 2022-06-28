import fs from 'fs-extra';

export function getVersion() {
  try {
    return fs.readJSONSync(process.cwd() + '/node_modules/@crhio/leviate/package.json').version
  } catch(e) {
    throw 'Could not locate leviate package';
  }
}