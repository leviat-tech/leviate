import { get } from 'lodash-es';
import { computed, ref } from 'vue';
import logger from '../extensions/logger';


const locale = ref('en');
const dictionary = {};
let availableLanguages = [];

function localize(phrase, options = {}) {
  const capitalize = string => string.replace(/(^|\s)\S/g, l => l.toUpperCase());
  const translation = get(dictionary, [locale.value, phrase])
    || options.default

  if (translation === undefined) {
    console.error(`Unable to translate ${phrase}`);
    return `{${phrase}}`;
  }
  return options.capitalize
    ? capitalize(translation)
    : translation;
}

const $l = (phrase, options) => localize(phrase, options)
const $L = (phrase, options) => localize(phrase, { ...options, capitalize: true })

export const useLocalize = () => {
  return {
    availableLanguages,
    setLocale: (val) => {
      if (!availableLanguages.includes(val)) {
        logger.error(`Language '${val}' is unavailable for this application`);
        return;
      }

      locale.value = val;
    },
    locale,
    $l,
    $L,
  }
}

export default {
  install(app, { locales }) {
    Object.assign(dictionary, locales);
    availableLanguages = Object.keys(dictionary);
    Object.assign(app.config.globalProperties, { $availableLanguages: availableLanguages, $l, $L });
  }
}