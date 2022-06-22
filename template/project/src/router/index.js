import Entity from '@/views/entity.vue';
import NotFound from '@/views/not-found.vue';
import Home from '@/views/home.vue';


function guard(to, from, next) {
  // Do some validation here ie checking an entity with the given id exists
  const valid = !!to.params.id;
  if (!valid) next('/not-found');
  else next();
}

const routes = [
  {
    name: 'entity',
    path: '/entity/:id',
    component: Entity,
    meta: {
      before: guard,
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
    path: '/:pathMatch(.*)*',
    redirect: '/not-found',
  },
];

export default routes;
