import VuexORM from '@vuex-orm/core';
import SampleModel from './sample-model';

const database = new VuexORM.Database();

database.register(SampleModel);

export default database;
