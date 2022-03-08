// Required imports
import Vue from 'vue';
import { createApp } from 'leviate';

// Project imports
import VDragged from 'v-dragged';
import ShortKey from 'vue-shortkey';
import globalize from './components/ui';

globalize();
Vue.use(ShortKey);
Vue.use(VDragged);

const appConfig = {
  globalConfig: {
    // Anything here will be accessible in Vue components via this.$config
  },
  endpoints: {
    calc: import.meta.env.VITE_API_CALC,
    pdf: import.meta.env.VITE_API_DOC,
  },
  plugins: [
    ShortKey, VDragged,
    // You can also pass options using an array e.g. [MyPlugin, pluginConfig]
  ],
  components: [
    // components to be included globally e.g. CustomInput, CustomView etc.
  ],
};

createApp(appConfig);
