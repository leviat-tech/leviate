import Vue from 'vue';
import VueRouter from 'vue-router';
import Panel from '@/views/k-panel.vue';
import NotFound from '@/views/k-not-found.vue';
import Home from '@/views/k-home.vue';
import guards from './guards';


Vue.use(VueRouter);


const routes = [
  {
    name: 'panel',
    path: '/panels/:id',
    component: Panel,
    meta: {
      before: guards.panel,
    },
  },
  {
    path: '/',
    component: Home,
  },
  {
    path: '/not-found',
    component: NotFound,
  },
  {
    path: '*',
    redirect: '/not-found',
  },
];

const router = new VueRouter({
  base: import.meta.env.BASE_URL,
  routes,
});


router.beforeEach((to, from, next) => {
  if (to.meta.before) to.meta.before(to, from, next);
  else next();
});

router.afterEach((to) => {
  Vue.prototype.$host.setUrl(to.path);
});

export default router;
