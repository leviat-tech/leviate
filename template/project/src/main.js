import { createApp } from '@crhio/leviate';

// Project imports
import mockConfig from './mock.config';
import baseConfig from './base.config';


const appConfig = {
  ...baseConfig,
  mockConfig: import.meta.env.DEV ? mockConfig : {},
  globalConfig: {
    // Anything here will be accessible via $config in
    // - Vue component templates,
    // - `this` in the Options API
    // inject('$config') in the Composition API
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
