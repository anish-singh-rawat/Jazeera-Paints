import React from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  formAction: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    gap: "12px",
  },
  formActionSave: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
  formActionCancel: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    background: "#A8AAAE",
    color: "#ffffff",
    "&:hover": {
      background: "#A8AAAE",
      color: "#ffffff",
    },
  },
});

const CommonFormActionButtons = (props: any) => {
  const {
    handleCloseDrawer,
    addMoreBtn = false,
    setAddMoreForm,
    padding,
    height,
    onClickFunc,
    disabled = false,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div
      className={classes.formAction}
      style={{ padding: padding || "0 24px", height: height || "80px" }}
    >
      <Button
        type="submit"
        variant="contained"
        onClick={() =>
          onClickFunc ? onClickFunc : addMoreBtn && setAddMoreForm("close")
        }
        sx={{ textTransform: "unset" }}
        disabled={disabled}
        className={classes.formActionSave}
      >
        {t("SAVE")}
      </Button>
      {addMoreBtn && (
        <Button
          type="submit"
          variant="outlined"
          sx={{ textTransform: "unset" }}
          onClick={() => setAddMoreForm("open")}
          className={classes.formActionSave}
        >
          {t("ADD_MORE")}
        </Button>
      )}
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleCloseDrawer}
        sx={{ textTransform: "unset" }}
        className={classes.formActionCancel}
      >
        {t("CANCEL")}
      </Button>
    </div>
  );
};

export default CommonFormActionButtons;
