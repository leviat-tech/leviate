import Panel from '@/views/panel.vue';
import NotFound from '@/views/not-found.vue';
import Home from '@/views/home.vue';
import SampleModel from '@/models/sample-model';


function panelGuard(to, from, next) {
  if (!SampleModel.find(to.params.id)) next('/not-found');
  else next();
}

const routes = [
  {
    name: 'panel',
    path: '/panels/:id',
    component: Panel,
    meta: {
      before: panelGuard,
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

export default routes;
