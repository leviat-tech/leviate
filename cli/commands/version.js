import logger from '../logger';
import { getVersion } from '../helpers';

export default {
  async run(options) {
    logger.log('version: ' + getVersion());
  }
}