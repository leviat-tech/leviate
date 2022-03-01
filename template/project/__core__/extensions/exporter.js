import Vue from 'vue';
import overview from './templates/pdf/overview';

const pdfExporter = (doc) => {
  const url = 'https://659asa3aoe.execute-api.us-east-1.amazonaws.com/pdf';
  const options = {
    responseEncoding: 'binary',
    responseType: 'arraybuffer',
    dataType: 'blob',
  };

  return Vue.prototype.$host.authorizedPostRequest(url, { doc }, options);
};

export default {
  pdf: {
    overview: (payload, meta) => pdfExporter(overview(payload, meta)),
  },
};
