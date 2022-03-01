import path from 'path';
import glob from 'glob';
import md5 from 'md5';
import fs from 'fs-extra';
import { Confirm, MultiSelect } from 'enquirer';
import { CORE_DIR } from '../paths';

export default {
  name: 'sync',
  description: 'Sync your project core with the latest leviate core files',
  usage: 'sync <options>',
  async run(options) {
    const dest = '__core__';
    const destFiles = glob.sync(`**/*`, { nodir: true, cwd: dest });

    const changedFiles = getChangedFiles(dest, destFiles);
    let filesToKeep = [];

    if (changedFiles) {
      const confirm = new Confirm({
        message: 'Some core files have been modified and will be overwritten by this operation. Do you wish to continue?',
      })

      const shouldContinue = await confirm.run();
      if (!shouldContinue) return;

      filesToKeep = await getFilesToKeep(changedFiles);
    }

    const srcFiles = glob.sync('**/*', { nodir: true, cwd: CORE_DIR });

    srcFiles.forEach(file => {
      if (filesToKeep.includes(file)) return console.log(`skipping ${file}`);
      fs.copySync(`${CORE_DIR}/${file}`, `${dest}/${file}`);
    })
  }
}

function getChangedFiles(dest, destFiles) {
  const manifestPath = `${dest}/.leviate/manifest.json`;
  const manifestData = fs.readJsonSync(manifestPath);

  const changedFiles = destFiles.filter(filepath => {
    const expectedHash = manifestData.files[filepath];

    // A non-core file has been added
    if (!expectedHash) return true;

    const contents = fs.readFileSync(`${dest}/${filepath}`, 'utf8');
    const actualHash = md5(contents);

    return expectedHash !== actualHash;
  });

  return (changedFiles.length > 0) ? changedFiles : null;
}

function getFilesToKeep(files) {
  const prompt = new MultiSelect({
    name: 'selection',
    message: 'The following files have changed. Please select the ones you wish to keep. All others will be updated with the latest core files.',
    choices: files
  })

  return prompt.run();
}

function writeManifest(dest, files) {
  const manifestPath = `${dest}/.leviate/manifest.json`;
  const manifestData = files.reduce((data, file) => {
    const content = fs.readFileSync(`${dest}/${file}`, 'utf8');
    data.files[file] = md5(content);
    return data;
  }, { files: {} });

  fs.writeJsonSync(manifestPath, manifestData, { spaces: 2 });
}
