import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en', // default, will be overridden
  resources: {}, // populated dynamically
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
