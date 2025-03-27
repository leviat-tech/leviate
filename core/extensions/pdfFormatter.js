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

export const getColumnsData = (text, columnPropertyLine, columnDataStr) => {
  const columnsStr = new RegExp(columnPropertyLine + ' 0 obj\\[<(.*?)>\\]', 's').exec(text)[1];
  const columnPropertyRegex = /\/Name\((.*?)\)/g;
  const columnDataRegex = /\((.*?)\)/g;
  let columnPropertyMatch;
  let dataMatch;
  let dataArray = [];
  let i = 0
  let columnData = {};

  while ((dataMatch = columnDataRegex.exec(columnDataStr)) !== null) {
    dataArray.push(dataMatch[1]);
  }

  while ((columnPropertyMatch = columnPropertyRegex.exec(columnsStr)) !== null) {
    columnData[formatPropertyName(columnPropertyMatch[1])] = getValueType(dataArray[i]);
    i++;
  }
  return columnData;
}
