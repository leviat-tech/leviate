import VuexORM from '@vuex-orm/core';

// Import models here
import SampleModel from './sample-model';

const database = new VuexORM.Database();

// Register models here
database.register(SampleModel);

export default database;
