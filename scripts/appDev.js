const chokidar = require('chokidar');
const fs = require('fs-extra');
const logger = require('../cli/logger.js');

const watcher = chokidar.watch('./template/project', {
  ignored: /node_modules|index\.html/,
  ignoreInitial: true,
});

watcher.on('add', updateFile);
watcher.on('change', updateFile);
watcher.on('unlink', removeFile);

function updateFile(filepath) {
  const appPath = getAppFilePath(filepath);

  fs.copySync(filepath, appPath);

  logger.log(`updated ${appPath}`);
}

function removeFile(filepath) {
  const appPath = getAppFilePath(filepath);

  fs.removeSync(appPath);

  logger.log(`removed ${appPath}`);
}

function getAppFilePath(filepath) {
  return filepath.replace(/\\/g, '/').replace('template/project', 'app');
}
