/**
 * Function that returns an immutable enum-like object.
 * Takes any number of string arguments and returns an object with uppercase keys and their values.
 * The returned object is frozen to prevent modification.
 *
 * @param  {...T} values - The string values for the enum.
 * @returns {Readonly<Record<Uppercase<T>, T>> & { values: () => Uppercase<T>[] }} The immutable enum-like object with uppercase keys.
 */
export function useEnum<T extends string>(
  ...values: T[]
): Readonly<Record<Uppercase<T>, T>> & {
  values: T[];
  lower: Lowercase<T>[];
  upper: Uppercase<T>[];
} {
  const enumObject: Record<Uppercase<T>, T> = {} as Record<Uppercase<T>, T>;

  // Create the enum-like object with uppercase keys
  values.forEach(value => {
    enumObject[value.toUpperCase() as Uppercase<T>] = value;
  });

  // Add the `values` method to return the array of all keys (uppercase)
  const result = Object.freeze({
    ...enumObject,
    values: Object.freeze(values.slice()) as T[],
    lower: Object.freeze(values.map(key => key.toLowerCase())) as Lowercase<T>[],
    upper: Object.freeze(values.map(key => key.toUpperCase())) as Uppercase<T>[],
  });

  return result;
}