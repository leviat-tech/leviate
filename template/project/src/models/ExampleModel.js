import { BaseModel, useLocalize } from '@crhio/leviate';
import exampleSchema from '@/schema/example-schema';

class ExampleModel extends BaseModel {
  static id = 'rectangles';

  static schema = exampleSchema;

  static get fields() {
    if (!this.useStore) return {};

    const name = useLocalize().$L('rectangle');
    const statusList = ['none', 'unknown','success','warning','magic','danger'];
    return {
      ...this.schema.cast(),
      ...this.baseFields,
      name: `${name} ${this.read().length + 1}`,
      entityStatus: statusList[Math.floor(Math.random() * statusList.length)],
      features: null,
    };
  }
}

export default ExampleModel;
