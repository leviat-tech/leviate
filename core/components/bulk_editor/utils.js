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

export const getPropTree = (defaultInstance) => {
  const allObjs = [];
  const getNestedObjs = (nestedObj, depth, parent) => {
    if (!Object.keys(nestedObj).length || !(nestedObj instanceof Object)) {
      return;
    }
    Object.keys(nestedObj).forEach(o => {
      if (nestedObj[o] instanceof Object) {
        allObjs.push({
          name: parent !== '' ? `${parent}.${o}` : o,
          obj: nestedObj[o],
          depth,
        });
      }
    });
    Object.keys(nestedObj).forEach(o => {
      getNestedObjs(nestedObj[o], depth + 1, o);
    });
  };

  allObjs.push({
    name: 'Properties',
    obj: defaultInstance,
    depth: 0,
  });
  getNestedObjs(defaultInstance, 1, '');

  return allObjs.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}
