import { Entity } from '@crhio/normie'
import logger from './extensions/logger';

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
      errors: {
        input: {},
        config: {},
        calculation: {},
      },
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
    try {
      this.constructor.schema.validateSync(this.$toJSON(), { abortEarly: false });
      // Clear errors if validation succeeds
      this.errors.input = {};
    } catch (e) {
      this.errors.input = e.inner.reduce((errors, error) => ({
        ...errors,
        [error.path]: [
          ...(errors[error.path] || []),
          error.path !== ''
            ? error.message.replace(`${error.path} `, '')
            : error.message,
        ],
      }), {});
    }
  }

  get coercedSchema() {
    return this.constructor.schema.coerce(this);
  }
}

export default BaseModel;
