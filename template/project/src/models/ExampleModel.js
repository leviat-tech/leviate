import { BaseModel } from '@crhio/leviate';
import exampleSchema from '@/schema/example-schema';

class ExampleModel extends BaseModel {
  static id = 'rectangles';

  static schema = exampleSchema;

  static get fields() {
    if (!this.useStore) return {};

    return {
      ...this.schema.cast(),
      ...this.baseFields,
      name: `Rectangle ${this.read().length + 1}`,
    };
  }
}

export default ExampleModel;
