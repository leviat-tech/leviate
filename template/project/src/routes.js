import Entity from '@/views/Entity.vue';
import NotFound from '@/views/NotFound.vue';
import Home from '@/views/Home.vue';
import { useRootStore } from '@crhio/leviate';


function entityGuard(to, from) {
  // Do some validation here ie checking an entity with the given id exists
  const store = useRootStore();
  const { id, entity } = to.params;
  const current = store.getEntity(entity, id);

  if (!current) return { name: 'home' };
}

const routes = [
  {
    name: 'entities',
    path: '/entities/:entity/:id',
    component: Entity,
    meta: {
      before: entityGuard,
    },
  },
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'not-found',
    path: '/not-found',
    component: NotFound,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found',
  },
];

export default routes;
