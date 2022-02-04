import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import VDragged from 'v-dragged';
import ShortKey from 'vue-shortkey';
import { sync } from 'vuex-router-sync';
import Concrete from '@crhio/concrete';
import inject from '@crhio/inject';
import { InjectVuePlugin } from '@crhio/inject/plugins';
import App from './app.vue';
import Dev from './dev.vue';
import '~/directives/v-search';
import '~/directives/v-find';
import globalize from './components/ui';
import router from './router';
import store from './store';
import mocked from './mocked';
import locales from '@/locales';
import '@/assets/styles/tailwinds.scss';


// setup plugins
Vue.use(VueCompositionAPI);
globalize();
Vue.use(Concrete, { size: 'sm' });
Vue.use(ShortKey);
Vue.use(VDragged);
sync(store, router);
Vue.config.productionTip = false;

// set root app
let app = App;

// dev: mock host api when not loaded as a plugin and also load a different base app to fake host ui
if (!inject.hosted && import.meta.env.DEV) {
  inject.mock(mocked);
  app = Dev;
}

// setup inject plugin
Vue.use(InjectVuePlugin, {});
Vue.prototype.$l = (phrase, options = {}) => Vue.prototype.$host.localize(phrase, { ...options, fallback: locales });
Vue.prototype.$transact = (f) => store.dispatch('transaction/transact', f);

// load initial url and initial state if host provided it
const initialState = Vue.prototype.$host.getState();
const context = Vue.prototype.$host.getMeta();
store.initialize(initialState, context);

const initialUrl = Vue.prototype.$host.getUrl();
if (initialUrl) {
  router.replace(initialUrl).catch(() => {});
}

// setup app
new Vue({
  router,
  store,
  render: (h) => h(app),
}).$mount('#app');
