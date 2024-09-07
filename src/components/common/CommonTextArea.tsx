import React from "react";
import FormControl from "@mui/material/FormControl";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { makeStyles } from "@mui/styles";
import { number } from "src/@core/utils/format";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";

const useStyles = makeStyles((theme) => ({
  errorMsg: {
    color: "#EA5455",
    margin: 0,
    marginTop: "4px",
  },
  inputField: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "6px",

    "& .MuiInputBase-input": {
      padding: "4px",
    },

    "& .MuiOutlinedInput-root": {
      padding: "6px",
      minHeight: "50px",
    },
  },
  // Add overlapping style
  overlappingTextField: {
    position: "relative",
    zIndex: 1,
  },
}));

const CommonTextArea = (props: any) => {
  const {
    name,
    id,
    label,
    type = "text",
    control,
    errors,
    placeholder,
    required,
    defaultValue,
    disabled,
    inputProps,
    errorMsg,
    setErrorMsg,
    rows,
    convertToKey = true,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  let labelKey = convertToKey
    ? t(label?.toUpperCase()?.replace(/ /g, "_") || "")
    : label;

  return (
    <div className={classes.inputField}>
      <label>{required ? labelKey + "*" : labelKey}</label>
      <FormControl fullWidth>
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <TextField
                id="outlined-basic"
                name={name}
                value={value}
                multiline
                rows={rows}
                onChange={(e: any) => {
                  if (type === "number") {
                    onChange(number(e));
                  } else {
                    onChange(e);
                  }
                  errorMsg === "show" &&
                    typeof setErrorMsg === "function" &&
                    setErrorMsg("hide");
                }}
                placeholder={placeholder ? placeholder : labelKey}
                disabled={false || disabled}
                error={errors[name] ? errors[name] : errorMsg === "show"}
                inputProps={inputProps}
                className={classes.overlappingTextField}
              />
            );
          }}
          defaultValue={defaultValue}
        />
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

export default CommonTextArea;
