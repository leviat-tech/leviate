import { string, number, object } from 'yup';

const random = () => Math.round(Math.random() * 200) + 50

export default object().shape({
  name: string().ensure().required(),
  width: number().default(random).min(50).max(300),
  height: number().default(random).min(50).max(300),
  depth: number().default(random).min(50).max(300),
});
