'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/clientI18n';

export default function TranslationsProvider({ children, locale, namespaces, resources }) {
  if (!i18n.hasResourceBundle(locale, namespaces[0])) {
    i18n.addResourceBundle(locale, namespaces[0], resources[namespaces[0]]);
  }
  i18n.changeLanguage(locale);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
