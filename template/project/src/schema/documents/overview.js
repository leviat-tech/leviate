/* eslint-disable */
import { yup } from '../';


export default yup.object()
  .shape({
    name: yup.string().required().default('Overview'),
    file_type: yup.string().required().default('PDF'),
    size: yup.string().oneOf(['A4', 'A3', 'A2', 'A1']).default('A4'),
    general_notes: yup.string().default(''),
  });
