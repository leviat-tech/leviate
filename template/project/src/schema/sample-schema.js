/* eslint-disable */
import { yup } from './';


export default yup.object().shape({
  //common props
  description: yup.string().default(''),
  quantity: yup.number().typeError('must be a number').integer().required().positive().default(1),
  remark: yup.string().default('')
});
