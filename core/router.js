import {
  createWebHashHistory,
  createRouter as _createRouter,
} from 'vue-router'
import { useHost, hostIsConnected } from './plugins/host';
import LvPageReleaseNotes from './components/LvPageReleaseNotes.vue';


export function createRouter(routes) {
  const router = _createRouter({
    base: import.meta.env.BASE_URL,
    history: createWebHashHistory(),
    routes: [
      {
        name: 'release-notes',
        path: '/release-notes',
        component: LvPageReleaseNotes,
      },
      ...routes,
    ],
  })

  router.beforeEach((to, from) => {
    const hasPathChanged = to.path !== from.path;

    // Ensure projectTab query param is not lost on navigation
    // If the path has not changed then the project tab has been toggled
    if (hasPathChanged) {
      const { projectTab } = from.query;
      if (projectTab) {
        to.query.projectTab = projectTab
      }
    }

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
