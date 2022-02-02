import SampleModel from '@/models/sample-model';


function panel(to, from, next) {
  if (!SampleModel.find(to.params.id)) next('/not-found');
  else next();
}

export default {
  panel,
};
