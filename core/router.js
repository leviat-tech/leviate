import {
  createWebHashHistory,
  createRouter as _createRouter,
} from 'vue-router'
import { useHost, hostIsConnected } from './plugins/host';
import LvReleaseNotesPage from './components/LvReleaseNotesPage.vue';


export function createRouter(routes) {
  const router = _createRouter({
    base: import.meta.env.BASE_URL,
    history: createWebHashHistory(),
    routes: [
      {
        name: 'release-notes',
        path: '/release-notes',
        component: LvReleaseNotesPage,
      },
      ...routes,
    ],
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
