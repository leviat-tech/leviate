import fs from 'fs-extra';
import { execSync } from 'child_process';

export async function pressAnyKey() {
  console.log('\nPress any key to continue...')

  process.stdin.setRawMode(true)

  return new Promise(resolve => process.stdin.once('data', data => {
    const byteArray = [...data]
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C')
      process.exit(1)
    }
    process.stdin.setRawMode(false)
    resolve();
  }))
}

export function parseOptions(options) {
  const rxNumbersOnly = /^\d+$/;

  return options.reduce((options, option, i) => {
    if (option.slice(0, 2) !== '--') return { ...options, [i]: option };

    const [key, val] = option.replace('--', '').split('=');

    if (val === undefined) return { ...options, [key]: true };

    if (rxNumbersOnly.test(option)) return { ...options, [key]: parseInt(val) };

    return { ...options, [key]: val };
  }, {})
}

export function getLocalVersion() {
  try {
    return fs.readJSONSync(process.cwd() + '/node_modules/@crhio/leviate/package.json').version
  } catch(e) {
    throw 'Could not locate local leviate package';
  }
}

export function getGlobalVersion() {
  const globalPackages = execSync('npm list -g').toString().trim();
  const matches = globalPackages.match(/@crhio\/leviate@([\w.-]+)/);

  if (!matches) throw 'Could not locate global leviate package';

  return matches[1];
}