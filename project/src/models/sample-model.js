import schema from '@/schema/sample-schema';
import KModel from './k-model';


export default class SampleModel extends KModel {
  static entity = 'sample-model'

  static schema = schema

  static fields() {
    return {
      ...this.baseFields,
      ...this.parameterFields(this.schema.default()),
      panel_id: this.attr(null),
      // TODO
      // shape: this.hasOne('loadbearing_shapes', 'loadbearing_layer_id'),
    };
  }
}
