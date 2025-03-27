export const getValueType = (str) => {
  const isNumRegex = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
  const isBooleanRegex = /^(true|false)$/i;
  if (isNumRegex.test(str)) return Number(str);
  else if (isBooleanRegex.test(str)) return str.toLowerCase() === 'true';
  else if (str) return str;
  return null;
} 

export const formatPropertyName = (str) => {
  const regex = /[()[\]\\}]/g;
  const clearStr = str.replace(regex, '');
  return clearStr.split(' ').join('_').toLowerCase();
}
