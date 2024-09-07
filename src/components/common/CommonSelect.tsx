import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";
import AppStorage from "src/app/AppStorage";

const useStyles = makeStyles({
  option: {
    padding: "0 5px",
    "&:hover": {
      backgroundColor: "rgba(115, 103, 240, 0.08) !important",
      color: "#3586C7",
      borderRadius: "5px",
    },
    '&[aria-selected="true"]': {
      backgroundColor: "#3586C7 !important",
      borderRadius: "5px",
      padding: "0 5px",
      "&:hover": {
        color: "#ffffff",
      },
    },
    height: "40px",
  },
  popper: {
    padding: "0 5px",
  },
  errorMsg: {
    color: "#EA5455",
    margin: 0,
    marginTop: "4px",
  },
  commonSelect: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    "& .MuiOutlinedInput-root": {
      paddingTop: "3px",
      paddingBottom: "2px",
    },
  },
  modal: {
    padding: "0px 0px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    justifyContent: "center",
  },
  modalText: {
    textAlign: "center",
    width: "i",
  },
});

const CommonSelect = (props: any) => {
  const [dataProp, setDataProp] = useState("");
  const {
    name,
    control,
    errors,
    setValue,
    options,
    defaultValue,
    label,
    handleModel,
    noOptionsText = true,
    required,
    placeholder,
    clearErrors,
    optionDirect,
    addNew,
    setSelectedFieldType,
    disabled,
    convertToKey = true,
    setSelectedOption,
    width = "100%",
    freeSolo = false,
    customText = false,
    errorMsg,
    getItemId,
    setSelectedLegalEntityId,
  } = props;
  const changeLanguage: any = AppStorage.getData("lang");
  const { t } = useTranslation();
  let labelKey = convertToKey
    ? t(label?.toUpperCase()?.replace(/ /g, "_") || "")
    : label;

  const classes = useStyles();

  const handleOnSelect = useMemo(
    () => (e: any, item: any) => {
      setValue(name, item);
      setSelectedOption && setSelectedOption(item);
      setSelectedFieldType && setSelectedFieldType(item?.code);
      setSelectedLegalEntityId && setSelectedLegalEntityId(item?.id);
      getItemId && getItemId(item?.id);
      clearErrors(name);
      if (errors.length) {
        console.log(errors);
      }
    },
    [name, setSelectedFieldType, clearErrors, errors]
  );

  return (
    <div className={classes.commonSelect}>
      <label>{required ? labelKey + "*" : labelKey}</label>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Controller
          name={name}
          control={control}
          render={({ field: { value = defaultValue, onChange } }) => {
            return (
              <Autocomplete
                freeSolo={freeSolo}
                size="medium"
                classes={{
                  option: classes.option,
                  popper: classes.popper,
                }}
                disabled={disabled || false}
                options={options || []}
                getOptionLabel={(option: any) => {
                  return changeLanguage === "en-US"
                    ? option?.name ||
                        option?.altName ||
                        option?.shortName ||
                        option?.terminalNum ||
                        option?.profileName ||
                        (option?.firstName &&
                          option?.lastName &&
                          `${option.firstName} ${option.lastName}`) ||
                        option ||
                        [] ||
                        ""
                    : option?.altName && option?.altName?.length > 0
                    ? option?.altName
                    : option?.name ||
                      option?.altShortName ||
                      option?.shortName ||
                      option?.terminalNum ||
                      option?.profileName ||
                      (option?.firstName &&
                        option?.lastName &&
                        `${option.firstName} ${option.lastName}`) ||
                      option ||
                      [] ||
                      "";
                }}
                onChange={handleOnSelect}
                value={value}
                defaultValue={value}
                noOptionsText={
                  noOptionsText ? (
                    <div className={classes.modal}>
                      <div className={classes.modalText}>
                        {customText
                          ? `No "${dataProp ? dataProp : "Data"}" found`
                          : t(`NO_RESULTS_FOUND`)}
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {!addNew && (
                          <Button
                            onClick={() => {
                              props?.func(dataProp);
                              handleModel();
                            }}
                            variant="contained"
                            fullWidth={false}
                            sx={{
                              textTransform: "unset",
                              minWidth: "100px",
                              maxWidth: "100%",
                            }}
                          >
                            {customText ? `${t("Add")} ${dataProp} ` : t("NEW")}
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder={t(Key(placeholder)) || labelKey}
                    error={errors[name] || errorMsg === "show"}
                    onChange={(e: any) => {
                      setDataProp(e.target.value);
                      if (typeof props?.func === "function")
                        props.func(e.target.value);
                    }}
                    disabled={disabled || false}
                    style={{ width: width }}
                  />
                )}
              />
            );
          }}
        />
        {/* implement key through show error message */}
        {(errors[name] || errorMsg === "show") && (
          <FormHelperText
            className={classes.errorMsg}
            id="validation-schema-first-name"
          >
            {t(Key(errors[name]?.message || "REQUIRED"))}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
};

export default React.memo(CommonSelect);
