import { blue, green, bgRed } from 'ansi-colors';
import lr from 'line-reader';
import path from 'path';
import glob from 'glob';
import { pressAnyKey } from '../helpers';

export default {
  name: 'checklang',
  description: 'Check the project src folder for hardcoded language strings',
  usage: 'checklang <dir> [--page --silent]',
  async run(options = {}) {
    const dir = options[0];
    const cwd = process.cwd();
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

    await printResult(langStringMatches, options);

    if (process.env.NODE_ENV === 'test') {
      return langStringMatches
    }

    process.exit(0);
  }
}

async function getFileLangStringMatches(src, filepath) {
  const fullpath = path.resolve(src, filepath);
  const rxTemplate = /<\/?template>/;
  const rxLangString = /(^[\w ]+$)|(>([\w\s]+)<)|(\w>(\s+)?(\w+))|(([\w.]+)\s?<)/;
  const rxTitleAttrString = /[^:]title=".+"/
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

      const lineTextMatches = lineContent.match(rxLangString);
      const lineTitleMatches = lineContent.match(rxTitleAttrString);

      if (lineTextMatches || lineTitleMatches) {
        matches.push({ line: lineCount, text: lineContent });
      }

      if (last) resolve();
    });
  });

  return matches.length > 0 ? { filepath, matches } : null;
}

async function printResult(langStringMatches, options) {
  if (langStringMatches.length === 0) {
    return console.log(green('Great stuff, no hardcoded strings could be found!'));
  }

  console.log(bgRed(`\n${langStringMatches.length} files contain possible hardcoded strings`));

  if (options.silent) return;

  for (const { filepath, matches } of langStringMatches) {

    options.page && await pressAnyKey();

    const matchesStr = matches.length === 1 ? 'match' : 'matches'
    console.log(`\n${filepath} - ${matches.length} ${matchesStr}\n`)

    matches.forEach(({ line, text}) => {
      const ref = blue(filepath + ':' + line);
      console.log(`    ->  ${ref}${text}`);
    })
  }

  console.log('');
}
