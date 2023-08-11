import * as yup from 'yup';
import mapValues from 'lodash/mapValues';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { convertFromSI } from '@crhio/leviate/extensions/units';


function getNewPath(currentPath, currentKey) {
  if (!currentKey) return '';
  if (!currentPath) return currentKey;
  return `${currentPath}.${currentKey}`;
}

yup.addMethod(yup.mixed, 'reach', function reach(path) {
  return yup.reach(this, path);
});

// this only handles objects;
yup.addMethod(yup.mixed, 'coerce', function coerce(value = {}, path = null, key = null) {
  const condition = this.conditions[0]; // mvp - only handle one condition
  const schema = condition ? condition.resolve(this, { parent: get(value, path, value) }) : this;
  if (schema.type !== 'object') return schema;
  const newSchema = schema.clone();
  const newFields = mapValues(schema.fields, (v, k) => coerce.call(v, value, getNewPath(path, key), k));
  return Object.assign(newSchema, { fields: newFields });
});

yup.addMethod(yup.mixed, 'options', function options(path = null, key = null) {
  if (this.fields) {
    return omitBy(
      mapValues(this.fields, (v, k) => options.call(v, getNewPath(path, key), k)),
      isEmpty,
    );
  }
  if (this.innerType) {
    return options.call(this.innerType, path, key);
  }
  return [...(this._whitelist?.list || [])]; // eslint-disable-line
});

yup.addMethod(yup.mixed, '$validate', function $validate(value) {
  try {
    this.validateSync(value, { abortEarly: false });
    return {};
  } catch (e) {
    console.log('e', e);
    return e.inner.reduce((errors, error) => ({
      ...errors,
      [error.path]: [
        ...(errors[error.path] || []),
        error.path !== ''
          ? error.message.replace(`${error.path} `, '')
          : error.message,
      ],
    }), {});
  }
});

yup.addMethod(yup.mixed, '$validateAt', function $validateAt(path, value) {
  const schema = yup.reach(this, path);
  return schema.$validate(value);
});

yup.addMethod(yup.mixed, 'units', function units(value) {
  return this.meta({ units: value });
});

yup.addMethod(yup.mixed, 'search', function search(value) {
  return this.meta({ search: value });
});

yup.addMethod(yup.mixed, 'getSearchTerm', function getSearchTerm(path) {
  const search = yup.reach(this, path).describe().meta?.search;
  if (search) return search;
  // if there's no search term, return the last subpath
  if (path.includes('.')) return path.slice(path.lastIndexOf('.') + 1);
  // if there are no subpaths, just return the whole path
  return path;
});

yup.addMethod(yup.number, 'minConverted', function minConverted(value) {
  const unit = this.describe().meta?.units;
  const val = unit ? convertFromSI(value, unit) : value;
  const message = `must be greater than or equal to ${val}${unit}`;
  return this.min(value, message);
});

yup.addMethod(yup.number, 'maxConverted', function maxConverted(value) {
  const unit = this.describe().meta?.units || '';
  const val = unit ? convertFromSI(value, unit) : value;
  const message = `must be less than or equal to ${val}${unit}`;
  return this.max(value, message);
});

const version = 1; // parameter space schema version number

export {
  yup,
  version,
};
