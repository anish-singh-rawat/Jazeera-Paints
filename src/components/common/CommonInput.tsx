import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import {
  Control,
  Controller,
  FieldErrors,
  FieldErrorsImpl,
  FieldValues,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";
import {
  customNumber,
  float,
  number,
  regularExpressionValidator,
} from "src/@core/utils/format";

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
});

interface CommonInputProps {
  name: string;
  id?: string;
  label?: string;
  type?: string;
  control: Control<any, any>;
  errors: Record<any, any>;
  placeholder?: string | any;
  required?: boolean;
  defaultValue?: any;
  disabled?: boolean;
  inputProps?: any;
  convertToKey?: boolean;
  errorMsg?: string;
  setErrorMsg?: (errorMsg: string) => void;
  regValue?: any;
  clearErrors?:any;
}

const CommonInput = (props: CommonInputProps) => {
  const {
    name,
    label,
    type = "text",
    convertToKey = true,
    control,
    errors,
    placeholder,
    required,
    defaultValue,
    disabled,
    inputProps,
    errorMsg,
    setErrorMsg,
    regValue,
    clearErrors
  } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  let labelKey = convertToKey
    ? t(label?.toUpperCase()?.replace(/ /g, "_") || "")
    : label;

  return (
    <div className={classes.inputField}>
      <label>{required ? labelKey + "*" : labelKey}</label>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Controller
          name={name}
          control={control}
          render={({ field: { value = props?.defaultValue, onChange } }) => {
            return (
              <>
                <TextField
                  id="outlined-basic"
                  name={name}
                  value={value}
                  onChange={(e: any) => {
                    if(type === "customNumber"){
                      onChange(customNumber(e));
                    } else if (type === "number") {
                      onChange(number(e));
                    } else if (type === "float") {
                      onChange(float(e));
                    } else if (regValue) {
                      onChange(regularExpressionValidator(e, regValue));
                    } else {
                      onChange(e);
                    }
                    if (errorMsg === "show") setErrorMsg && setErrorMsg("hide");

                    if(clearErrors){
                      clearErrors()
                    }
                  }}
                  placeholder={placeholder || labelKey}
                  disabled={false || disabled}
                  error={errors[name] ? errors[name] : errorMsg === "show"}
                  inputProps={inputProps}
                  type={type}
                />
              </>
            );
          }}
          //defaultValue={defaultValue}
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

export default CommonInput;
