import { spawnSync } from 'child_process'
import path from 'path';
import fs from 'fs-extra';
import { prompt } from 'enquirer';
import logger from '../logger.js'
import checkUpdates from './checkUpdates';
import packageJSON from '../../template/project/package';

const questions = [
  {
    type: 'input',
    name: 'packageName',
    message: 'Package name:',
    validate(value, state, item, index) {
      if (value === '') {
        return 'You must specify a package name'
      }
      return true;
    }
  },
  {
    type: 'input',
    name: 'url',
    message: 'Repository URL'
  }
]

export default {
  name: 'init',
  description: 'Initialise a host app project in the given directory, or CWD if none given',
  usage: 'init <dir>',
  async run(options = []) {
    if (!process.env.NPM_AUTH_TOKEN) {
      return logger.error('Cannot initialise a project without a valid NPM_AUTH_TOKEN')
    }

    await checkUpdates.run({ global: true });

    const dir = options[0];
    const src = path.resolve(__dirname + '../../../template');
    const cwd = (process.env.NODE_ENV === 'test') ? process.cwd() + '/.cwd' : process.cwd();
    const dest = dir ? `${cwd}/${dir}` : cwd;

    if (!isDestEmpty(dest)) {
      logger.error('Cannot create new project in a non empty folder')
      return false;
    }

    fs.copySync(src, dest, {
      // Ignore modules in project folder during development
      filter: (src, dest) => !/project\/node_modules/.test(src)
    });

    logger.log(`Initialising project in ${dest}`);

    const { packageName, url } = dir ? { packageName: dir } : await prompt(questions);
    const name = packageName.toLowerCase().replace(/\W+/g, '-');
    const title = name[0].toUpperCase() + name.slice(1).replace(/-(\w)/g, (a, b) => ' ' + b.toUpperCase());

    const packagePath = `${dest}/project/package.json`
    packageJSON.name = name;
    if (url) packageJSON.repository = { type: 'git', url }
    fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, '  '));

    const titlePlaceholder = '{{ TITLE }}';
    const filePathsWithPlaceholder = [
      '/project/index.html',
      '/README.md',
      '/project/src/mock.config.js'
    ];

    for (const relativePath of filePathsWithPlaceholder) {
      await replaceInFile(dest, relativePath, titlePlaceholder, title);
    }

    logger.log('Installing dependencies...')

    try {
      spawnSync(`npm install`, {
        cwd: dest + '/project',
        stdio: 'inherit',
        shell: true
      })
    } catch (e) {
      logger.error(e)
    }

    return true;
  }
}

function isDestEmpty(dest) {
  const pathExists = fs.pathExistsSync(dest)

  if (!pathExists) return true;

  const containsVisibleFilesOrFolders = fs.readdirSync(dest).filter(filename => filename[0] !== '.').length > 0;

  return !containsVisibleFilesOrFolders;
}

async function replaceInFile(dest, relativePath, toReplace, replacement) {
  const filePath = dest + relativePath;
  const contents = await fs.readFileSync(filePath, 'utf8');
  const compiled = contents.replace(toReplace, replacement);
  fs.writeFileSync(filePath, compiled);
}
