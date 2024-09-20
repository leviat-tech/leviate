import { string, object, array } from 'yup';

export default object().shape({
  name: string().ensure().required(),
  positions: array().ensure(),
  layers: array().ensure(),
  parentId: string().nullable(true).default(null),
});
