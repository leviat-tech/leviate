import BaseModel from '@crhio/leviate/BaseModel';
import schema from '@/schema/sample-schema';


export default class SampleModel extends BaseModel {
  static entity = 'sample-model'

  static schema = schema

  static fields() {
    return {
      ...this.baseFields,
      ...this.parameterFields(this.schema.default()),
      panel_id: this.attr(null),
    };
  }
}
