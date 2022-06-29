/* Copyright Contributors to the Open Cluster Management project */

/* istanbul ignore file */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translation from './locales/en/translation.json';
/** Localization */
// the translations
// the translations
const resources = {
  en: {
    /* eslint-disable @typescript-eslint/camelcase */
    assisted_installer: translation,
  },
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  /// detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    supportedLngs: ['en'],
    fallbackLng: 'en',
    load: 'languageOnly',
    detection: { caches: [] },
    contextSeparator: '~',
    defaultNS: 'translation',
    nsSeparator: '~',
    keySeparator: false,
    debug: true,
    react: {
      useSuspense: true,
      transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
    },
    missingKeyHandler: function (lng, ns, key) {
      window.windowError = `Missing i18n key "${key}" in namespace "${ns}" and language "${lng}."`;
      // eslint-disable-next-line no-console
      console.error(window.windowError);
    },
  });

export default i18n;
