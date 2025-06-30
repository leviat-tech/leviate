import { string, number, array, object, boolean } from 'yup';

const random = () => Math.round(Math.random() * 200) + 50

export const defaultShape = [
  { x: 0, y: 0, bulge: 0 },
  { x: 3.0, y: 0, bulge: 0 },
  { x: 3.0, y: 2.0, bulge: 0 },
  { x: 0, y: 2.0, bulge: 0 },
];

export default object().shape({
  name: string().ensure().required(),
  entityStatus: string().nullable().default(null),
  width: number().default(random).min(50).max(300),
  height: number().default(random).min(50).max(300),
  thickness: number().default(0.2),
  perimeter: array().default(defaultShape),
  openings: array().default([]),
  depth: number().default(random).min(50).max(300),
  color: object().shape({
    top: string().oneOf(['red', 'orange', 'yellow', 'green', 'blue', 'purple']).default('red').search('color_top'),
    side: string().oneOf(['red', 'orange', 'yellow', 'green', 'blue', 'purple']).default('blue').search('color_side')
  }),
  hasBorder: boolean().default(true).search('border')
});
