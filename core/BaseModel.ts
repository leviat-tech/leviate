import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@crhio/normie'
import logger from './extensions/logger';
import { find, reject } from 'lodash-es';
import { useRootStore } from './store';

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

  static beforeAll(actionType, data) {
    const { transactionDepth } = useRootStore();

    if (transactionDepth === 0) {
      logger.warn(`${this.name} ${actionType} called outside transact(). Data will not be persisted`, data)
    }
  }

  static beforeUpdate(patch, id) {
    patch.lastUpdatedFields = Object.keys(patch);
    patch.updated_at = new Date().getTime();
  }

  static afterUpdate(instance) {
    if (instance.lastUpdatedFields.includes('errors')) return;
    const lastNonErorUpdate = instance.lastUpdatedFields.reduce((patch, field) => ({ ...patch, [field]: instance[field] }),{})

    instance.$validate();
    instance.afterUpdate?.(lastNonErorUpdate);
  }

  $validate() {
    this.clearInputErrors();

    try {
      this.constructor.schema.validateSync(this, { abortEarly: false });
    } catch (e) {
      e.inner?.forEach(error => {
        const { _errCategory = 'input' , _isDismissable = false, _errType = 'error' } = error.params || {};
        this.createError(_errCategory, error.path, error.message, _isDismissable, _errType);
      });
    }
  }

  get coercedSchema() {
    return this.constructor.schema.coerce(this);
  }

  clearInputErrors() {
    this.errors = reject(this.errors, { category: 'input' });
  }

  createError(category = 'input', path, text, isDismissable = false, type = 'error') {
    this.errors.push({
      id: uuidv4(),
      category,
      type,
      path,
      text,
      isDismissable
    });
  }

  createErrorMessage({ category = 'input', path, text, isDismissable = false, type = 'error' }) {
    this.createError(category, path, text, isDismissable, type)
  }

  deleteError(id) {
    this.errors = reject(this.errors, { id });
  }

  getInputErrorByPath(path) {
    return find(this.errors, { category: 'input', path });
  }
}

export default BaseModel;
