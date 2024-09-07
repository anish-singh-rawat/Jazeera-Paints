import { Box, FormHelperText, TextField } from "@mui/material";
import { forwardRef, ForwardedRef } from "react";
import { Controller } from "react-hook-form";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
// import CustomInput from "src/views/forms/pickers/PickersCustomInput";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";

const useStyles = makeStyles({
  errorMsg: {
    color: "#EA5455",
    margin: 0,
    marginTop: "4px",
  },
  datePicker: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    "& .MuiInputBase-input": {
      padding: "11px",
    },
  },
});

interface PickerProps {
  label?: string;
  readOnly?: boolean;
  callBack?: any;
  error?: any;
}

const CustomInput = forwardRef(
  ({ ...props }: PickerProps, ref: ForwardedRef<HTMLElement>) => {
    const { error, callBack } = props;
    return <TextField fullWidth error={error} inputRef={ref} {...props} />;
  }
);

const CommonDatePicker = (props: any) => {
  const {
    name,
    item,
    control,
    required,
    placeholderText,
    label,
    minDate,
    defaultValue,
    errors,
    disabled = false,
    clearErrors,
    cb,
    selectedDate,
    format,
    convertToKey = true,
    showpreferedDate = true,
    errorMsg,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  let labelKey = convertToKey
    ? t(label?.toUpperCase()?.replace(/ /g, "_") || "")
    : label;

  return (
    <DatePickerWrapper className={classes.datePicker}>
      <div>
        <label>{required ? labelKey + "*" : labelKey}</label>
      </div>
      <Controller
        name={name}
        control={control}
        rules={{ required: required }}
        defaultValue={defaultValue}
        render={({ field: { value, onChange } }) => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
            }}
            className="demo-space-x"
          >
            <DatePicker
              selected={
                name === "endDate" && !selectedDate && showpreferedDate
                  ? new Date("2099-12-31")
                  : selectedDate
              }
              id="basic-input"
              showYearDropdown
              showMonthDropdown
              // popperPlacement={popperPlacement}
              onChange={(date: any) => {
                onChange(date);
                cb(date);
              }}
              value={value}
              placeholderText={placeholderText ? placeholderText : labelKey}
              scrollableYearDropdown={true}
              yearDropdownItemNumber={123}
              customInput={
                <CustomInput
                  error={errors[name] || errorMsg === "show"}
                  callBack={(event: object) => 0}
                />
              }
              nextYearAriaLabel="ddd"
              dateFormat={format ? format : "dd/MM/yyyy"}
              minDate={minDate}
              disabled={disabled}
            />
          </Box>
        )}
      />
      <div className={classes.errorMsg}>
        {(errors[name] || errorMsg === "show") && (
          <FormHelperText
            className={classes.errorMsg}
            id="validation-schema-first-name"
          >
            {t("REQUIRED")}
            {/* {t(Key(errors[name]?.message || "REQUIRED"))} */}
          </FormHelperText>
        )}
      </div>
    </DatePickerWrapper>
  );
};

export default CommonDatePicker;
