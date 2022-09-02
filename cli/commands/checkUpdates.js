import fs from 'fs-extra';
import { execSync  } from 'child_process';
import semver from 'semver';
const { Confirm } = require('enquirer');
import logger from '../logger';
import { getLocalVersion, getGlobalVersion } from '../helpers';

export default {
  async run(options) {
    logger.log('Checking for updates...');

    const isGlobal = options.global || Object.values(options).includes('-g');
    const currentVersion = (isGlobal) ? getGlobalVersion() : getLocalVersion();
    const latestVersion = execSync('npm view @crhio/leviate version').toString().trim();
    const isUpdateAvailable = semver.gt(latestVersion, currentVersion);

    if (!isUpdateAvailable) return logger.success(`You are currently on the latest version (v${currentVersion})`);

    logger.error(`You are currently on version ${currentVersion}. Version ${latestVersion} is available`);

    const shouldUpdate = await new Confirm({
      message: `Do you want to update now?`
    }).run();

    if (!shouldUpdate) return;

    const globalSwitch = options.global ? '-g' : ''

    try {
      logger.log(`Updated to version ${latestVersion}...`)
      execSync(`npm install ${globalSwitch} @crhio/leviate@${latestVersion}`, { stdio: 'inherit' });
      logger.success(`Successfully updated to version ${latestVersion}`)
    } catch (e) {
      logger.error('Error updating to latest version');
    }

    process.exit();
  }
}