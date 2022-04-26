import { blue, green, bgRed } from 'ansi-colors';
import lr from 'line-reader';
import path from 'path';
import glob from 'glob';
import { pressAnyKey } from '../helpers';

let log = console.log;

export default {
  name: 'checklang',
  description: 'Check the project src folder for hardcoded language strings',
  usage: 'checklang <dir> [--page --silent]',
  async run(options = {}) {
    if (options.silent) log = () => {};

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

    await printResult(langStringMatches, options.page);

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

async function printResult(langStringMatches, pageResults) {
  if (langStringMatches.length === 0) {
    return log(green('Great stuff, no hardcoded strings could be found!'));
  }

  log(bgRed(`\n${langStringMatches.length} files contain possible hardcoded strings:`))

  for (const { filepath, matches } of langStringMatches) {

    pageResults && await pressAnyKey();

    const matchesStr = matches.length === 1 ? 'match' : 'matches'
    log(`\n${filepath} - ${matches.length} ${matchesStr}\n`)

    matches.forEach(({ line, text}) => {
      const ref = blue(filepath + ':' + line);
      log(`    ->  ${ref}${text}`);
    })
  }

  log('');
}
