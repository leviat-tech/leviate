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

logger.log('dev server running in /app');
logger.log('watching files in /template/project...');

function updateFile(filepath) {
  const appPath = getAppFilePath(filepath);

  fs.copySync(filepath, appPath);

  logger.log(`${appPath} was updated`);
}

function removeFile(filepath) {
  const appPath = getAppFilePath(filepath);

  fs.removeSync(appPath);

  logger.log(`${appPath} was deleted`);
}

function getAppFilePath(filepath) {
  return filepath.replace(/\\/g, '/').replace('template/project', 'app');
}
