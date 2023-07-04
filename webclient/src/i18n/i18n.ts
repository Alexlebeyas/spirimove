import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJson from './en.json';
import frJson from './fr.json';
import { getCurrentLanguage } from '@/utils/languages';

const resources = {
  en: enJson,
  fr: frJson,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: resources,
    lng: getCurrentLanguage(),
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18n;
