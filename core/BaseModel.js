import { Entity } from '@crhio/normie'
import { set, get, last } from 'lodash-es';
import logger from './utils/logger';


class BaseModel extends Entity {
  constructor(props) {
    super(props);

    const { name, schema } = this.constructor;

    if (!schema) {
      logger.warn(`${name} must have a schema property`)
    }
  }

  static get baseFields() {
    return {
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };
  }

  static onUpdate(instance) {
    instance.updated_at = new Date().getTime();
  }

  validate() {
    return this.constructor.schema.$validate(this);
  }

  get coercedSchema() {
    return this.constructor.schema.coerce(this);
  }

}

export default BaseModel;
