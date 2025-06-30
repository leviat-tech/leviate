import { setToCounterClockwise } from '../utils';

/**
 * Mirror a path on the y axis
 * @param path
 * @return the mirrored path
 */
export default function mirrorPath(path) {
  const newPath = path.map(({ x, y, bulge }) => {
    return {
      y,
      x: -x,
      bulge: -bulge,
    };
  });
  setToCounterClockwise(newPath);
  return newPath;
}
