import {
  createWebHashHistory,
  createRouter as _createRouter,
} from 'vue-router'
import { useHost } from './plugins/host';

export function createRouter(routes) {
  const router = _createRouter({
    base: import.meta.env.BASE_URL,
    history: createWebHashHistory(),
    routes,
  })

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
