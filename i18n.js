// // i18n.js
// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// import en from './public/locales/en/common.json';
// import fr from './public/locales/fr/common.json';
// import es from './public/locales/es/common.json';

// i18n
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: { translation: en },
//       fr: { translation: fr },
//       es: { translation: es },
//     },
//     lng: 'en', // default
//     fallbackLng: 'en',
//     interpolation: {
//       escapeValue: false
//     }
//   });

// export default i18n;












// i18n.js
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'de', 'zh', 'ar'],
    backend: {
      loadPath: '/locales/{{lng}}/common.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
