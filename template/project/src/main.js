// Required imports
import Vue from 'vue';
import { createApp } from '@core';
import VDragged from 'v-dragged';
import ShortKey from 'vue-shortkey';
// Project imports

import globalize from './components/ui';

globalize();
Vue.use(ShortKey);
Vue.use(VDragged);

const appConfig = {
  endpoints: {
    calc: import.meta.env.VITE_API_CALC,
    pdf: import.meta.env.VITE_API_PDF,
  },
};

console.log(import.meta.env);


createApp(appConfig);
