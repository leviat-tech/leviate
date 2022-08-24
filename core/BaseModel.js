import { Entity } from '@crhio/normie'
import logger from './extensions/logger';
import { useMessageStore } from './store/message';
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

  static beforeUpdate(patch) {
    patch.updated_at = new Date().getTime();
  }

  static afterUpdate(instance) {
    instance.$validate();
    instance.afterUpdate?.();
  }

  $validate() {
    const { inputStatus } = useMessageStore();
    const errors = this.constructor.schema.$validate(this);
    const id = [this.constructor.id, this.id].join('_');

    if (isEmpty(errors)) {
      // Remove any remaining errors in the store
      if (inputStatus[id]) delete inputStatus[id];
    } else {
      inputStatus[id] = errors;
    }
  }

  get coercedSchema() {
    return this.constructor.schema.coerce(this);
  }

}

export default BaseModel;
