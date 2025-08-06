// module.exports = {
//   i18n: {
//     defaultLocale: 'en',
//     locales: ['en', 'fr', 'es', 'de', 'zh', 'ar'],
//     localeDetection: true,
//   },
// };









// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'de', 'zh', 'ar'],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
