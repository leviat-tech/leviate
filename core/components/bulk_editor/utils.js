export const getFlatObject = (obj, prefix = '') =>
  Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    }
    if (typeof obj[el] === 'object' && obj[el] !== null) {
      return { ...res, ...getFlatObject(obj[el], `${prefix + el}.`) };
    }

    return { ...res, [prefix + el]: obj[el] };
  }, {});

export const getFlatProps = obj => {
  return Object.keys(getFlatObject(obj));
};
