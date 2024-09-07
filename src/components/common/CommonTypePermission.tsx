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
import { useRouter } from "next/router";

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

const CommonTypePermission = (props: any) => {
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
    changeLanguage,
    optionDirect,
    addNew,
    setSelectedFieldType,
    disabled,
    convertToKey = true,
    setSelectedOption,
    width = "100%",
    setPermissionValue,
    id,
    defaultRoleName,
    roleById,
    edit,
  } = props;

  const { t } = useTranslation();

  let labelKey = convertToKey
    ? t(label?.toUpperCase()?.replace(/ /g, "_") || "")
    : label;

  if (typeof props.func === "function") {
    props.func(dataProp);
  }

  const classes = useStyles();
  const router = useRouter();

  let disabledRoute = roleById?.id;
  const handleOnSelect = useMemo(
    () => (e: any, item: any) => {
      setValue(name, item);
      let permissionId;
      let pName;
      if (name === "typePermission") {
        permissionId = item?.id;
        pName = defaultValue?.id;
      }
      if (setSelectedOption) setSelectedOption(item);
      if (setSelectedFieldType) setSelectedFieldType(item?.code);
      clearErrors(name);
      if (errors.length) {
        console.log(errors);
        return;
      }
      if (!item) return;
      if (edit) {
        if (permissionId === disabledRoute) return;
        router.push(
          `/users-roles/roles/create-role/?isEdit=true&id=${id}&name=${defaultRoleName}&pId=${permissionId}&pName=${pName}`
        );
      }
    },
    [name, setSelectedFieldType, clearErrors, errors, setPermissionValue]
  );

  return (
    <div className={classes.commonSelect}>
      <label>{required ? labelKey + "*" : labelKey}</label>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Autocomplete
                size="medium"
                classes={{
                  option: classes.option,
                  popper: classes.popper,
                }}
                disabled={disabled || false}
                options={options ?? []}
                getOptionLabel={(option: any) => {
                  const label = optionDirect
                    ? option
                    : changeLanguage
                    ? changeLanguage === "en-US"
                      ? option.name
                      : option.altName
                    : option.label || option.name || option;

                  return label;
                }}
                onChange={handleOnSelect}
                defaultValue={defaultValue}
                noOptionsText={
                  noOptionsText ? (
                    <div className={classes.modal}>
                      <div className={classes.modalText}>
                        {t(`NO_RESULTS_FOUND`)}
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {!addNew && (
                          <Button
                            onClick={handleModel}
                            variant="contained"
                            fullWidth={false}
                            sx={{ textTransform: "unset", width: "99px" }}
                          >
                            {t("NEW")}
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
                    placeholder={placeholder || label}
                    error={errors[name]}
                    onChange={(e: any) => setDataProp(e.target.value)}
                    disabled={disabled || false}
                    style={{ width: width }}
                  />
                )}
                clearIcon={false}
              />
            );
          }}
        />

        {/* implement key through show error message */}
        {errors[name] && (
          <FormHelperText
            className={classes.errorMsg}
            id="validation-schema-first-name"
          >
            {t(Key(errors[name]?.message))}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
};

export default React.memo(CommonTypePermission);
