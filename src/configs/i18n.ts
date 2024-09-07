import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // resources,
    // lng: 'en-US',
    fallbackLng:  "", // default language
    keySeparator: false, // we do not use keys in form messages.welcome
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
      formatSeparator: ",",
    },
  });

export default i18n;
