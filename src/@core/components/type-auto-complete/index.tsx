import React from "react";
import Autocomplete from "@mui/material/Autocomplete";

// import { ErrorMessage } from "@hookform/error-message";
import { Typography, TextField } from "@mui/material";

// import ValidationError from "./ValidatationError";
// import { useTranslation } from 'react-i18next'
import { Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";

interface ITextFiledProps {
  list?: any;
  control?: any;
  errors?: any;
  name?: any;
  keyId?: any;
  label?: any;
  id?: any;
  noObject?: any;
  returnValue?: any;
  setValue?: any;
  disableOptionKey?: any;
  disabled?: any;
  handleOnChange?: any;
  [rest: string]: any;
  required?: boolean;
  defaultValue?: any;
}

function TypeAutoComplete({
  list,
  control,
  errors,
  name,
  keyId,
  label,
  id,
  noObject,
  returnValue,
  setValue,
  disableOptionKey,
  handleOnChange,
  disabled,
  variant,
  required,
  defaultValue,
  ...rest
}: ITextFiledProps) {
  const returnKey = returnValue ? returnValue : "id";
  const getOpObj = (option: any) => {
    if (option && !option.id) option = list.find((op: any) => op.id == option);

    return option;
  };

  const handleChange = (data: any) => {
    if (handleOnChange) handleOnChange(data);
    if (data && data.id) {
      setValue(name, data[returnKey]);
    } else if (data === null) {
      setValue(name, null);
    }
  };

  const useStyles = makeStyles({
    option: {
      "&:hover": {
        backgroundColor: "rgba(115, 103, 240, 0.08) !important",
        color: "#3586C7",
      },
      '&[aria-selected="true"]': {
        backgroundColor: "#3586C7 !important",
      },
    },
  });

  const classes = useStyles();

  return (
    <div style={{ position: "relative" }}>
      <Controller
        control={control}
        name={name}
        defaultValue={[defaultValue] || ""}
        render={({ field: { ref, onChange, ...field } }) => (
          <Autocomplete
            key={`${id}${keyId}`}
            id={id}
            options={list ?? []}
            getOptionLabel={(option: any) =>
              getOpObj(option) ? getOpObj(option)[keyId] : option
            }
            onChange={(_, data: any | null) => onChange(data.id)}
            defaultValue={[defaultValue] || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                {...field}
                inputRef={ref}
                label={
                  <div>
                    {label}
                    {required ? "*" : ""}
                  </div>
                }
                variant={variant || "outlined"}
                size="medium"
                defaultValue={defaultValue}
              />
            )}
          />
        )}
      />

      <Typography
        style={{ position: "absolute" }}
        variant="caption"
        display="block"
        color="error"
      >
        {/* <ErrorMessage name={name} errors={errors} as={ValidationError}>
          {""}
        </ErrorMessage> */}
      </Typography>
    </div>
  );
}

export default TypeAutoComplete;
