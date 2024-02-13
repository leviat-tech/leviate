import { createApp } from '@crhio/leviate';

// Project imports
import defaultConfig from './defaultConfig';
import mockConfig from './mock.config';
import VDragged from 'v-dragged';
import ShortKey from 'vue-shortkey';


const appConfig = {
  ...defaultConfig,
  mockConfig: import.meta.env.DEV ? mockConfig : {},
  globalConfig: {
    // Anything here will be accessible in Vue components via this.$config
  },
  endpoints: {
    calc: import.meta.env.VITE_API_CALC,
    pdf: import.meta.env.VITE_API_DOC,
  },
  plugins: [
    ShortKey, VDragged,
    // You can also pass options using an array e.g. [MyPlugin, myPluginConfig]
  ],
};

createApp(appConfig);
