import { Entity } from '@crhio/normie'
import logger from './utils/logger';
import { useErrorStore } from './store/errors';
import { isEmpty, each } from 'lodash-es';

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
    instance.$validate();

    this.updated_at = new Date().getTime();
  }

  getInputId(path) {
    return [this.constructor.id, this.id, path].join('_');
  }

  $validate() {
    const { inputErrors } = useErrorStore();
    const errors = this.constructor.schema.$validate(this);
    const id = [this.constructor.id, this.id].join('_');

    if (isEmpty(errors)) {
      // Remove any remaining errors in the store
      if (inputErrors[id]) delete inputErrors[id];
    } else {
      inputErrors[id] = errors;
    }
  }

  get coercedSchema() {
    return this.constructor.schema.coerce(this);
  }

}

export default BaseModel;
