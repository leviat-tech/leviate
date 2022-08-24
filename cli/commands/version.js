import logger from '../logger';
import { getGlobalVersion, getLocalVersion } from '../helpers';

export default {
  async run(options) {
    const isGlobal = options.global || Object.values(options).includes('-g');
    const version  = isGlobal ? getGlobalVersion() : getLocalVersion();
    logger.log('version: ' + version);
  }
}