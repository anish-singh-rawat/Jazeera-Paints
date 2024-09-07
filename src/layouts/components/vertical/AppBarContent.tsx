// ** MUI Imports
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";
import LanguageDropdown from "src/@core/layouts/components/shared-components/LanguageDropdown";

// ** Components
import ModeToggler from "src/@core/layouts/components/shared-components/ModeToggler";
import UserDropdown from "src/@core/layouts/components/shared-components/UserDropdown";

// ** i18n imports
import { useTranslation } from "react-i18next";

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const pathData = router.pathname.slice(1).split("/");
  const pathDataChild = `${pathData[0]?.replace(/-/g, "_")}`;
  const pathDataParent = `${pathData[1]?.replace(/-/g, "_")}`;

  const pathCreateRole = `${pathData[2]?.replace(/-/g, "_")}`;

  const { slug, isEdit, id } = router.query;

  const conditionResult =
    pathDataChild == "roles" &&
    ((id ?? "").length > 1 || (slug ?? "").length > 1);
  const addRole = pathCreateRole === "create_role" && !isEdit;
  const editPrice =
    pathDataChild == "pricelist" &&
    ((id ?? "").length > 1 || (slug ?? "").length > 1) &&
    isEdit;
  const priceList = pathCreateRole === "pricelist" && !isEdit;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        className="actions-left"
        sx={{ mr: 2, display: "flex", alignItems: "center" }}
      >
        {hidden && !settings.navHidden ? (
          <IconButton
            color="inherit"
            sx={{ ml: -2.75 }}
            onClick={toggleNavVisibility}
          >
            <Icon fontSize="1.5rem" icon="tabler:menu-2" />
          </IconButton>
        ) : null}
        <Typography
          variant="body1"
          style={{ textTransform: "capitalize", fontWeight: 600 }}
        >
          {pathData.length > 1 ? (
            <div style={{ display: "flex" }}>
              {addRole ? (
                <div>{t("ADD_NEW_ROLE")}</div>
              ) : conditionResult ? (
                <div>{t("EDIT_NEW_ROLE")}</div>
              ) : editPrice ? (
                <div>
                  {t("PRICE_LIST")} <>&nbsp; &#62; &nbsp;</> {t("EDIT_PRICE")}
                </div>
              ) : priceList ? (
                <div>{t("PRICE_LIST")}</div>
              ) : (
                <>
                  {" "}
                  {pathDataChild && (
                    <>
                      {" "}
                      <div>{t(pathDataChild.toUpperCase())}</div>
                      <>&nbsp; &#62; &nbsp;</>
                    </>
                  )}
                  <div>{t(pathDataParent.toUpperCase())}</div>
                </>
              )}
            </div>
          ) : (
            <div>{t(pathDataChild.toUpperCase())}</div>
          )}
        </Typography>
        {/* Global Search will came here */}
      </Box>
      <Box
        className="actions-right"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <LanguageDropdown settings={settings} saveSettings={saveSettings} />
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {/* <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
      <NotificationDropdown settings={settings} notifications={notifications} /> */}
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  );
};

export default AppBarContent;
