import { v4 as uuid } from 'uuid';
import { Model } from '@vuex-orm/core';
import set from 'lodash/set';
import get from 'lodash/get';
import last from 'lodash/last';


class KModel extends Model {
  static parameterFields(defaults) {
    return Object.entries(defaults).reduce((attrs, [k, v]) => ({
      ...attrs,
      [k]: this.attr(v),
    }), {});
  }

  static get baseFields() {
    return {
      id: this.uid(uuid),
      created_at: this.attr(() => new Date().getTime()),
      updated_at: this.attr(() => new Date().getTime()),
    };
  }

  async $update(field, value, schema) {
    await this.constructor.update({
      where: this.$id,
      data(instance) {
        set(instance, field, value);
        if (schema) {
          try {
            Object.assign(instance, schema.cast(instance));
          } catch (e) {
            return; // eslint-disable-line
          }
        }
      },
    });
  }

  // Push a new value to an array field
  async $push(field, value, schema) {
    await this.constructor.update({
      where: this.$id,
      data(instance) {
        const arr = get(instance, field);
        arr.push(value);

        if (schema) {
          try {
            Object.assign(instance, schema.cast(instance));
          } catch (e) {
            return; // eslint-disable-line
          }
        }
      },
    });
  }

  static async insertOne(data) {
    const res = await this.insert({ data });
    return last(res[this.entity]);
  }

  static beforeUpdate(instance) {
    instance.updated_at = new Date().getTime(); // eslint-disable-line
  }

  validate() {
    return this.constructor.schema.kValidate(this);
  }

  get coercedSchema() {
    return this.constructor.schema.coerce(this);
  }

}

export default KModel;
