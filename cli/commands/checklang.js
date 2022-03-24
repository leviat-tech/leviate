import { blue, green } from 'ansi-colors';
import lr from 'line-reader';
import path from 'path';
import glob from 'glob';


export default {
  name: 'checklang',
  description: 'Check the project src folder for hardcoded language strings',
  usage: 'checklang <dir>',
  async run(options = []) {
    const dir = options[0];
    const cwd = (process.env.NODE_ENV === 'test') ? process.cwd() + '/.cwd' : process.cwd();
    const src = dir ? `${cwd}/${dir}` : `${cwd}/src`;
    const files = glob.sync('+(components|views)/**/*.vue', {
      nodir: true,
      cwd: src
    });

    let langStringMatches = [];

    await Promise.all(files.map(async filepath => {
      const fileMatches = await getFileLangStringMatches(src, filepath);

      if (fileMatches) langStringMatches = [...langStringMatches, fileMatches];
    }));

    printResult(langStringMatches);
  }
}

async function getFileLangStringMatches(src, filepath) {
  const fullpath = path.resolve(src, filepath);
  const rxTemplate = /<\/?template>/;
  const rxLangString = /(^[\w ]+$)|(>([\w\s]+)<)|(\w>(\s+)?(\w+))|(([\w.]+)\s?<)/;
  const matches = [];

  let lineCount = 0;
  let isChecking = false;

  await new Promise(resolve => {
    lr.eachLine(fullpath, (lineContent, last) => {
      lineCount++;

      const isTemplateTag = rxTemplate.test(lineContent);

      if (isTemplateTag) {
        // Stop checking for lang strings at the end of the template content
        if (isChecking) {
          resolve();
          return false;
        }
        isChecking = true;
      }

      const lineMatches = lineContent.match(rxLangString);
      if (lineMatches) matches.push({ line: lineCount, text: lineContent });
      if (last) resolve();
    });
  });

  return matches.length > 0 ? { filepath, matches } : null;
}

function printResult(langStringMatches) {
  if (langStringMatches.length === 0) {
    return console.log(green('Great stuff, no hardcoded strings could be found!'));
  }

  langStringMatches.forEach(({ filepath, matches }) => {
    matches.forEach(({ line, text}) => {
      const ref = blue(filepath + ':' + line);
      console.log(ref + text);
    })
  })
}
