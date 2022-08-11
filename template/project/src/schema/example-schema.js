import { string, number, object } from 'yup';


export default object().shape({
  name: string().required(),
  width: number().default((Math.random() * 200) + 50),
  height: number().default(Math.round(Math.random() * 200) + 50),
  depth: number().default(Math.round(Math.random() * 200) + 50),
});
