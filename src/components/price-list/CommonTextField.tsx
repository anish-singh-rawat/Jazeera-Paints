import { Autocomplete, FormControl, TextField } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import AppStorage from "src/app/AppStorage";

type types = "TEXT" | "SELECT";

export interface CommonTextFieldProps {
  required?: boolean;
  label: string;
  customErrorMessage: string;
  errorState: Record<string, boolean>;
  type: types;
  valueState: Record<string, boolean>;
  defaultValue: string;
  handler: (value: string, id: string) => void;
  base: string;
  options?: Record<string, any>[];
  disabled?: boolean;
  errorRule?: {
    length?: { size: number; errorMessage: string };
    minLength?: { size: number; errorMessage: string };
    maxLength?: { size: number; errorMessage: string };
    checkIfAlreadyExists?: {
      record: any[];
      key: string;
      errorMessage: string;
      toSkip?: string;
    };
  };
  placeholder?: string;
}
export default function CommonTextField(props: CommonTextFieldProps) {
  const { t } = useTranslation();

  const changeLanguage: any = AppStorage.getData("lang");

  const label = (
    <label htmlFor={props.label}>
      {t(props.label)}
      {props.required && "*"}
    </label>
  );

  const getError = useMemo<[boolean, string]>(() => {
    if (props.errorState[props.base] && !props.disabled)
      return [true, props.customErrorMessage];

    const currentValue = props.valueState[props.base] as any;

    if (typeof currentValue === "undefined") return [false, ""];

    if (props.required && !currentValue)
      return [true, props.customErrorMessage];

    if (
      props?.errorRule?.length &&
      currentValue.length !== props.errorRule.length.size
    )
      return [true, props.errorRule.length.errorMessage];

    if (
      props?.errorRule?.maxLength?.size &&
      currentValue.length > props.errorRule.maxLength.size
    )
      return [true, props.errorRule.maxLength.errorMessage];

    if (
      props?.errorRule?.minLength?.size &&
      currentValue.length < props.errorRule.minLength.size
    )
      return [true, props.errorRule.minLength.errorMessage];

    if (props?.errorRule?.checkIfAlreadyExists) {
      const find = props.errorRule.checkIfAlreadyExists.record.find(
        (d) =>
          d[props.errorRule?.checkIfAlreadyExists?.key as unknown as any] ==
          currentValue
      );

      if (
        find &&
        find[props.errorRule?.checkIfAlreadyExists?.key] !=
          props.errorRule?.checkIfAlreadyExists?.toSkip
      ) {
        return [true, props.errorRule.checkIfAlreadyExists.errorMessage];
      }
    }
    return [false, ""];
  }, [props.valueState[props.base], props.errorState[props.base]]);

  const getAutoSelectValue = useMemo(() => {
    if (props.type === "TEXT") return;
    const value = props.valueState[props.base];
    if (typeof value === "string" && Array.isArray(props.options)) {
      const updated = props.options?.filter((d) => d["code"] == value)[0];
      props.handler(updated as any, props.base);
      return updated;
    }
    return value;
  }, [props.valueState[props.base]]);

  const value = props.valueState[props.base];

  if (props.type == "TEXT")
    return (
      <div style={{ width: "100%" }}>
        {label}
        <TextField
          fullWidth
          id={props.label}
          size="small"
          value={value}
          error={getError[0]}
          helperText={t(getError[1]) as string}
          defaultValue={props.defaultValue}
          onChange={(e) => props.handler(e.target.value, props.base)}
          disabled={props.disabled}
          placeholder={t(props?.placeholder ?? props.label) as string}
        />
      </div>
    );

  if (props.type == "SELECT")
    return (
      <div style={{ width: "100%" }}>
        {label}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            size="small"
            disabled={props.disabled ?? false}
            options={props.options || []}
            defaultValue={props.defaultValue}
            getOptionLabel={(option: any) => {
              return changeLanguage === "en-US"
                ? option?.name ||
                    option?.altName ||
                    option?.shortName ||
                    option ||
                    ""
                : option?.altName && option?.altName?.length > 0
                ? option?.altName
                : option?.name ||
                  option?.altShortName ||
                  option?.shortName ||
                  option ||
                  "";
            }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {changeLanguage === "en-US" ? option?.name : option?.altName}
                </li>
              );
            }}
            value={getAutoSelectValue}
            onChange={(event: any, newValue: string | null) => {
              props.handler(newValue as string, props.base);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder={t(props.label) as string}
                error={getError[0]}
                helperText={t(getError[1])}
              />
            )}
          />
        </FormControl>
      </div>
    );

  return <></>;
}
