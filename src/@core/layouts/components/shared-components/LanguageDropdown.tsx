// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Import
import { useTranslation } from "react-i18next";
// ** Custom Components Imports
import OptionsMenu from "src/@core/components/option-menu";

// ** Type Import
import { useDispatch } from "react-redux";
import { Settings } from "src/@core/context/settingsContext";
import AppStorage from "src/app/AppStorage";

interface Props {
  settings: Settings;
  saveSettings: (values: Settings) => void;
  size?: string;
}

const LanguageDropdown = ({ settings, saveSettings, size }: Props) => {
  // ** Hook
  const { i18n } = useTranslation();

  const dispatch = useDispatch<any>();
  const handleLangItemClick = (
    lang: "en-US" | "fr-FR" | "ar-SA" | "key-KEY"
  ) => {
    i18n.changeLanguage(lang);
  };

  const handleClick = () => {
    // setfirst("vkmfk")
  };

  return (
    <OptionsMenu
      iconButtonProps={{ color: "inherit" }}
      icon={<Icon fontSize={size ? size : "1.5rem"} icon="tabler:language" />}
      menuProps={{ sx: { "& .MuiMenu-paper": { mt: 4.5, minWidth: 130 } } }}
      options={[
        {
          text: "English",
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === "en-US",
            onClick: () => {
              handleLangItemClick("en-US");
              saveSettings({ ...settings, direction: "ltr" });
              AppStorage.setData("lang", "en-US");
              AppStorage.setData("dir", "ltr");
            },
          },
        },
        {
          text: "Français",
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === "fr-FR",
            onClick: () => {
              handleLangItemClick("fr-FR");
              saveSettings({ ...settings, direction: "ltr" });
            },
          },
        },
        {
          text: "العربي",
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === "ar-SA",
            onClick: () => {
              handleLangItemClick("ar-SA");
              saveSettings({ ...settings, direction: "rtl" });
              AppStorage.setData("lang", "ar-SA");
              AppStorage.setData("dir", "rtl");
            },
          },
        },
      ]}
    />
  );
};

export default LanguageDropdown;
