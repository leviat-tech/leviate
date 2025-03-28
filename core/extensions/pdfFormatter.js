const getValueType = (str) => {
  const isNumRegex = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
  const isBooleanRegex = /^(true|false)$/i;
  if (isNumRegex.test(str)) return Number(str);
  else if (isBooleanRegex.test(str)) return str.toLowerCase() === 'true';
  else if (str) return str;
  return null;
} 

const formatPropertyName = (str) => {
  const regex = /[()[\]\\}]/g;
  const clearStr = str.replace(regex, '');
  return clearStr.split(' ').join('_').toLowerCase();
}


const getColumnsProperties = (text, columnPropertyLine) => {
  const columnsStr = new RegExp(columnPropertyLine + ' 0 obj\\[<(.*?)>\\]', 's').exec(text)[1];
  const columnPropertyRegex = /\/Name\((.*?)\)/g;
  let columnPropertyMatch;
  let propertiesArray = [];

  while ((columnPropertyMatch = columnPropertyRegex.exec(columnsStr)) !== null) {
    propertiesArray.push(formatPropertyName(columnPropertyMatch[1]));
  }
  return propertiesArray
}

export const getColumnsData = (text, columnPropertyLine) => {
  const propertiesArray = getColumnsProperties(text, columnPropertyLine)
  let dataMatch;
  let columnDataMatch;
  let columnsData = [];
  let i = 0;

  const columnDataStr = /BSIColumnData\[(.*?)\]/g;
  const columnDataRegex = /\((.*?)\)/g;

  while ((dataMatch = columnDataStr.exec(text)) !== null) {
    let data = {};
    while ((columnDataMatch = columnDataRegex.exec(dataMatch[1])) !== null) {
      data[propertiesArray[i]] = getValueType(columnDataMatch[1])
      i++;
    }
    columnsData.push(data);
    data = {}
    i = 0
  }
  return columnsData;
}
