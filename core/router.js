import {
  createWebHashHistory,
  createRouter as _createRouter,
} from 'vue-router'
import { useHost, hostIsConnected } from './plugins/host';


export function createRouter(routes) {
  const router = _createRouter({
    base: import.meta.env.BASE_URL,
    history: createWebHashHistory(),
    routes,
  })

  router.beforeEach((to, from) => {
    if (to.meta.before) {
      return to.meta.before(to, from);
    }
  });

  router.afterEach(async (to) => {
    await hostIsConnected()
    const host = useHost();
    host.setUrl(to.path);
  });

  return router;
}
