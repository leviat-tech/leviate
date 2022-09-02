import { useApi } from '../plugins/host';
import logger from './logger.js';


const exportPdf = (template, payload, meta) => {
  const doc = template(payload, meta);
  const api = useApi();

  if (!api.pdf) {
    logger.warn(`You must specify a 'pdf' property in leviate.config.js endpoints config`)
  }

  const options = {
    responseEncoding: 'binary',
    responseType: 'arraybuffer',
    dataType: 'blob',
  };

  return api.pdf({ doc }, options);
};

export default exportPdf;
