/**
 * @typedef Enum
 * @property lower: Enum
 * @property upper: Enum
 * @property is: object,
 * @property isValid: (testValue: string) => boolean
 *
 * @param { ...string | array } values
 * @returns { Enum }
 */
export function useEnum(...values) {
  const items = typeof values[0] === 'string' ? values : values[0];

  items.forEach((item, i) => {
    Object.defineProperty(items, item, { get: () => item });
  });

  Object.defineProperty(items, 'lower', {
    get() {
      const itemsLower = items.map(item => item.toLowerCase());

      return useEnum(itemsLower);
    }
  });

  Object.defineProperty(items, 'upper', {
    get() {
      const itemsUpper = items.map(item => item.toUpperCase())

      return useEnum(itemsUpper);
    }
  });

  Object.defineProperty(items, 'is', {
    get: () => items.reduce((isEqual, item) => {
      return {
        ...isEqual,
        [item]: (compareValue) => compareValue === item,
      }
    }, {})
  });

  Object.defineProperty(items, 'isValid', {
    get: () => (testValue) => items.includes(testValue)
  });

  Object.freeze(items);

  return items;
}