import { get } from 'lodash-es';
import { ref } from 'vue';
import logger from '../extensions/logger';
import { fallbackPhraseDictionary } from '../fallbackPhraseDictionary';

const locale = ref('en');
let dictionary = {};
let availableLanguages = [];

function localize(phrase, options = {}) {
  const capitalize = (string) =>
    string.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
  let translation = get(dictionary, [locale.value, phrase]) || options.default;

  if (translation === undefined) {
    const fallback = fallbackPhraseDictionary[phrase];
    let error = `Unable to translate phrase: "${phrase}"`;
    if (fallback) {
      translation = fallback;
      logger.warn(
        `${error}, English fallback phrase: "${fallback}" used instead`
      );
    } else {
      logger.warn(error);
      return `{${phrase}}`;
    }
  }

  return options.capitalize ? capitalize(translation) : translation;
}

const $l = (phrase, options) => localize(phrase, options);
const $L = (phrase, options) =>
  localize(phrase, { ...options, capitalize: true });

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
  };
};

export default {
  install(app, { locales }) {
    Object.assign(dictionary, locales);
    availableLanguages = Object.keys(dictionary);

    Object.assign(app.config.globalProperties, {
      $availableLanguages: availableLanguages,
      $l,
      $L,
    });
  },
};
