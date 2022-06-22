import { createApp } from '@crhio/leviate';

// Project imports
import defaultConfig from './defaultConfig';
import mockConfig from './mock.config';


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
    // You can also pass options using an array e.g. [MyPlugin, myPluginConfig]
  ],
};

createApp(appConfig, import.meta.env);
