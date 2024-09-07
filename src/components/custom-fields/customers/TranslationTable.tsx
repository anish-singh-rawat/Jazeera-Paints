import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";
import CommonInput from "src/components/common/CommonInput";
import { Card, FormHelperText, Stack } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  drawerWrapper: {
    height: "100vh",
  },
  form: {
    height: "calc(100vh - 80px)",
  },
  formContent: {
    height: "calc(100% - 80px)",
    overflow: "auto",
    padding: "8px 24px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  formContent_row: {
    display: "flex",
    gap: "20px",
  },
  formContent_card: {
    padding: "15px",
    background: "#F4F4F4",
    boxShadow: "none",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
  },
  formContent_cardContent: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "none",
    gap: "18px",
    minHeight: "156px",
  },
  viewContent: {
    display: "grid",
    columnGap: "8px",
    rowGap: "24px",
    margin: "24px 0",
    paddingBottom: "24px",
    borderBottom: "6px solid #3586C7",
    borderRadius: "0px 0px 6px 6px",
  },
  viewContent_label: {
    color: "#a7a5aa",
    fontWeight: 400,
    fontSize: "15px",
  },
  viewContent_value: {
    color: "#6f6b7d",
    fontWeight: 600,
    fontSize: "15px",
  },
  downLoadBtn: {
    display: "flex",
    justifyContent: "flex-end",
  },
  radioContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
    "& .MuiFormControlLabel-root": {
      height: "30px",
    },
  },
  radioError: {
    color: "#EA5455",
    fontSize: "12px",
    marginTop: "-2px",
  },
  errorMsg: {
    color: "#EA5455",
    margin: 0,
    marginTop: "-20px",
  },
  "@global": {
    ".MuiDataGrid-columnHeaderTitleContainerContent": {
      fontSize: "12px",
      fontWeight: 600,
      lineHeight: "normal",
      letterSpacing: "1px",
    },
  },
});

const CustomFieldsTranslationTable = (props: any) => {
  const { item, control, errors } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  interface UserStatusType {
    [key: string]: ThemeColor;
  }

  return (
    <div className={classes.formContent}>
      <Card className={classes.formContent_card}>
        <Card className={classes.formContent_cardContent}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              alt="us-flag"
              sx={{ width: 38, height: 38, p: 2 }}
              src="/icons/us.svg"
            />
            <Typography variant="body1" style={{ fontSize: "15px" }}>
              English
            </Typography>
          </Stack>
          <CommonInput
            name="nameLang.en_US"
            id="nameLang.en_US"
            label="Translation"
            // required={true}
            control={control}
            errors={errors}
            // errorMsg={errorMsg}
            // setErrorMsg={setErrorMsg}
            defaultValue={item ? item?.nameLang?.en_US : ""}
          />
          {/* {errorMsg === "show" && (
        <FormHelperText
          className={classes.errorMsg}
          id="validation-schema-first-name"
        >
          {t(Key("Field Translation is required"))}
        </FormHelperText>
      )} */}
        </Card>
        <Card className={classes.formContent_cardContent}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Avatar
              alt="us-flag"
              sx={{ width: 38, height: 38, p: 2 }}
              src="/icons/ar.svg"
            />
            <Typography variant="body1" style={{ fontSize: "15px" }}>
              Arabic
            </Typography>
          </Stack>
          <CommonInput
            name="nameLang.ar_SA"
            id="nameLang.ar_SA"
            label="Translation"
            // required={true}
            control={control}
            errors={errors}
            defaultValue={item ? item.nameLang?.ar_SA : ""}
          />
        </Card>
        <Card className={classes.formContent_cardContent}>
          <Stack direction="row" alignItems="center">
            <Avatar
              alt="us-flag"
              sx={{ width: 38, height: 38, p: 2 }}
              src="/icons/fr.svg"
            />
            <Typography variant="body1" style={{ fontSize: "15px" }}>
              French
            </Typography>
          </Stack>
          <CommonInput
            name="nameLang.fr_FR"
            id="nameLang.fr_FR"
            label="Translation"
            // required={true}
            control={control}
            errors={errors}
            defaultValue={item ? item.nameLang?.fr_FR : ""}
          />
        </Card>
      </Card>
    </div>
  );
};

export default CustomFieldsTranslationTable;
