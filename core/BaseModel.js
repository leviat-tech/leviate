import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@crhio/normie'
import logger from './extensions/logger';
import { find, reject } from 'lodash-es';

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
      errors: [],
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    };
  }

  static beforeUpdate(patch) {
    patch.lastUpdatedFields = Object.keys(patch);
    patch.updated_at = new Date().getTime();
  }

  static afterUpdate(instance) {
    if (instance.lastUpdatedFields.includes('errors')) return;

    instance.$validate();
    instance.afterUpdate?.();
  }

  $validate() {
    this.clearInputErrors();

    try {
      this.constructor.schema.validateSync(this.$toJSON(), { abortEarly: false });
    } catch (e) {
      e.inner.forEach(error => {
        this.createError('input', error.path, error.message, false);
      });
    }
  }

  get coercedSchema() {
    return this.constructor.schema.coerce(this);
  }

  clearInputErrors() {
    this.errors = reject({ category: 'input' });
  }

  createError(category = 'input', path, text, isDismissable = false) {
    this.errors.push({
      id: uuidv4(),
      category,
      type: 'error',
      path,
      text,
      isDismissable
    });
  }

  deleteError(id) {
    this.errors = reject(this.errors, { id });
  }

  getInputErrorByPath(path) {
    return find(this.errors, { category: 'input', path });
  }
}

export default BaseModel;
