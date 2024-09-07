import { useCallback, useEffect } from "react";
import generateTranslations from "src/@core/utils/generateTranslations";
import AppStorage from "src/app/AppStorage";
import { axiosInstance } from "src/configs/axios";
import i18n from "src/configs/i18n";

export default function useTranslations() {
  const currentLang = AppStorage.getData("lang");

  const populateLanguage = useCallback((translations: any) => {
    for (const language in translations) {
      if (translations.hasOwnProperty(language)) {
        i18n.addResourceBundle(
          language,
          "translation",
          translations[language].translation
        )
      }
    }
    if (!currentLang) {
      const lang = 'en-US'
      AppStorage.setData("lang", lang);
      i18n.changeLanguage(lang).then(() => console.log('Revest Language en-US')).catch(e => console.error("unable to change Revest Lang : ", e));
    } else {

      i18n.changeLanguage(currentLang).then(() => console.log(`Revest Language ${currentLang}`)).catch(e => console.error("unable to change Revest Lang : ", e));

    }
  }, [currentLang])

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = (await axiosInstance("/translations?appType=web"))
          .data;
        const translations = generateTranslations(response);
        populateLanguage(translations);
        AppStorage.setData("trans-list", response);
      } catch (error) {
        console.error(error);
      }
    };
    const translationData = AppStorage.getData("trans-list");
    if (!translationData) {
      fetchTranslations();
      return;
    }
    if (translationData) {
      const translations = generateTranslations(translationData);
      populateLanguage(translations)
      AppStorage.setData("trans-list", translationData);
    } else if (!translationData?.data)
      fetchTranslations();

  }, [populateLanguage]);
}
