import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { makeStyles } from "@mui/styles";
import { number } from "src/@core/utils/format";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";

const useStyles = makeStyles({
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

    "& .MuiInputBase-input": {
      padding: "10px",
    },
  },
  inputContainer: {
    position: "relative",
  },
  underscore: {
    position: "absolute",
    top: "calc(100% + 5px)", // Adjust the top position
    left: "10px",
    width: "calc(100% - 20px)",
    height: "2px",
    backgroundColor: "#000",
  },
});

const CommonInputUnderScore = (props: any) => {
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
  } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  let labelKey = t(label?.toUpperCase()?.replace(/ /g, "_"));
 

  return (
    <div className={classes.inputField}>
      <label>{required ? labelKey + "*" : labelKey}</label>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => {
            const handleChange = (e: any) => {
              const inputValue = e.target.value;
              const newValue = inputValue.replace(/ /g, "_");
              onChange(newValue);
              if (type === "number") {
                onChange(number(e));
              }
              errorMsg === "show" && setErrorMsg("hide");
            };

            return (
              <div className={classes.inputContainer}>
                <TextField
                  id="outlined-basic"
                  name={name}
                  value={value}
                  onChange={handleChange}
                  placeholder={placeholder ? placeholder : labelKey}
                  disabled={disabled}
                  error={errors[name] ? errors[name] : errorMsg === "show"}
                  inputProps={inputProps}
                  type={type}
                />
                {disabled && <span className={classes.underscore}></span>}
              </div>
            );
          }}
          defaultValue={defaultValue}
        />
        {errors[name] && (
          <FormHelperText
            className={classes.errorMsg}
            id="validation-schema-first-name"
          >
            {t(Key(errors[name].message))}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
};

export default CommonInputUnderScore;
