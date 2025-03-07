const fs = require('fs-extra');
const axios = require('axios');
const merge = require('lodash/merge');

const translationUrl = process.env.VITE_TRANSLATE_BASE_URL;

if (!translationUrl) {
  throw new Error('Please ensure environment variable VITE_TRANSLATE_BASE_URL is defined.');
}

const localesFolderName = 'src/locales';

module.exports = async function translationPlugin() {
  const { translationName } = fs.readJsonSync(`${process.cwd()}/manifest.json`);

  try {
    if (!fs.existsSync(localesFolderName)) {
      fs.mkdirSync(localesFolderName);
    }
    if (!translationName.length) {
      throw new Error(
        'Make sure that you specify the project name in order to get translations keys',
      );
    }
  } catch (err) {
    console.error(err);
  }

  let jsonData = {};
  const fileName = `${localesFolderName}/index.json`;
  const languages_data = await axios.get(translationUrl);
  const languages = languages_data.data.filter(app => app.name === translationName)[0].dictionaries;
  const countries = languages_data.data.filter(app => app.name === 'Countries')[0].dictionaries;

  Object.keys(languages).forEach(translation => {
    if (Object.keys(languages[translation]).length !== 0) {
      jsonData = {
        ...jsonData,
        [translation]: merge(languages[translation], countries[translation]),
      };
    }
  });
  fs.writeFileSync(fileName, JSON.stringify(jsonData));
}
