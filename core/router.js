import VueRouter from 'vue-router';
import { useHost } from './plugins/host';

export function createRouter(_Vue, routes) {
  _Vue.use(VueRouter);

  const router = new VueRouter({
    base: import.meta.env.BASE_URL,
    routes,
  });

  router.beforeEach((to, from, next) => {
    if (to.meta.before) to.meta.before(to, from, next);
    else next();
  });

  router.afterEach((to) => {
    const host = useHost();
    host.setUrl(to.path);
  });

  return router;
}