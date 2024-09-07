import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { t } from "i18next";
import router from "next/router";

export default function PricelistProductLoader() {
  if (!router.query?.reload) return <></>;

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.appBar - 1,
        width: "auto",
      }}
      open={true}
    >
      <CircularProgress color="inherit" />
      <Typography
        variant="body1"
        sx={{
          color: "#fff",
          position: "absolute",
          top: "58%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        {t("PRODUCTS_ADDING_HINT")}
      </Typography>
    </Backdrop>
  );
}
