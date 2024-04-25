import { get } from 'lodash-es';
import { ref } from 'vue';
import logger from '../extensions/logger';

const locale = ref('en');
let dictionary = {};
let availableLanguages = [];

let defaultDictionary = {
  en: {
    warning_app_mismatch:
      'This design was created in an earlier version of the software. Please see: ',
  },
  de: {
    warning_app_mismatch:
      'Dieses Design wurde in einer früheren Version der Software erstellt. Bitte sehen: ',
  },
  fr: {
    warning_app_mismatch:
      "Cette conception a été créée dans une version antérieure du logiciel. S'il te plait regarde: ",
  },
  it: {
    warning_app_mismatch:
      'Questo disegno è stato creato in una versione precedente del software. Perfavore guarda: ',
  },
  pl: {
    warning_app_mismatch:
      'Projekt ten powstał we wcześniejszej wersji oprogramowania. Proszę zobaczyć: ',
  },
};

function localize(phrase, options = {}) {
  const capitalize = (string) =>
    string.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
  const translation =
    get(dictionary, [locale.value, phrase]) || options.default;

  if (translation === undefined) {
    console.error(`Unable to translate ${phrase}`);
    return `{${phrase}}`;
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
    const localeKeys = Object.keys(locales);

    //remove defaultDictionary keys not in locales and combine both
    dictionary = Object.keys(defaultDictionary).reduce((iterator, key) => {
      if (localeKeys.includes(key))
        iterator[key] = { ...locales[key], ...defaultDictionary[key] };
      return iterator;
    }, {});

    availableLanguages = Object.keys(dictionary);

    Object.assign(app.config.globalProperties, {
      $availableLanguages: availableLanguages,
      $l,
      $L,
    });
  },
};
