const fs = require('fs');
const axios = require('axios');
const merge = require('lodash/merge');

const translationUrl = 'https://leviatdesignstudio.com/service/translations/api/translations'; // TODO: get the url from env
const localesFolderName = 'src/locales';

export default async function translationPlugin(projectName) {
  try {
    if (!fs.existsSync(localesFolderName)) {
      fs.mkdirSync(localesFolderName);
    }
    if (!projectName.length) {
      throw new Error(
        'Please specify the app name in the script by adding argument. Example build:translation "Project Name"',
      );
    }
  } catch (err) {
    console.error(err);
  }

  let jsonData = {};
  const fileName = `${localesFolderName}/index.json`;
  const languages_data = await axios.get(translationUrl);
  const languages = languages_data.data.filter(app => app.name === projectName[0])[0].dictionaries;
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