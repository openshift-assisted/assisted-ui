import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from 'openshift-assisted-ui-lib/dist/locales/en/translation.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: enTranslation,
    },
  },
  supportedLngs: ['en'],
  fallbackLng: 'en',
  load: 'languageOnly',
  detection: { caches: [] },
  defaultNS: 'translation',
  nsSeparator: '~',
  keySeparator: false,
  debug: false,
  react: {
    useSuspense: true,
    transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
  },
  missingKeyHandler: function (lng, ns, key) {
    window.windowError = `Missing i18n key "${key}" in namespace "${ns}" and language "${lng}."`;
    console.error(window.windowError);
  },
});

export default i18n;
