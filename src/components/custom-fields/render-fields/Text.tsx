import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import CommonInput from "src/components/common/CommonInput";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  container: {
    display: "flex",
    gap: "20px",
    padding: "0 30px",
    marginBottom: "12px",
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
});

const text = (props: any) => {
  const {
    control,
    errors,
    item,
    setValue,
    setVisible,
    visible,
    setRequired,
    required,
    setSearchable,
    searchable,
    ...other
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <Box className={classes.container}>
        <CommonInput
          name="minLenth"
          id="minLenth"
          label="Min Length"
          required={true}
          control={control}
          errors={errors}
          placeholder={"NUMBER_ONLY"}
          type={"number"}
          defaultValue={item && item?.minLenth}
        />
        <CommonInput
          name="maxLength"
          id="maxLength"
          label="Max Length"
          required={true}
          type={"number"}
          placeholder={"NUMBER_ONLY"}
          control={control}
          errors={errors}
          defaultValue={item && item?.maxLength}
        />
      </Box>
      <Box className={classes.container}>
        <CommonInput
          name="regularExpression"
          id="regularExpression"
          label="Regular Expression"
          // required={true}
          control={control}
          errors={errors}
          defaultValue={item && item?.regularExpression}
        />
        <CommonInput
          name="defaultValue"
          id="defaultValue"
          label="Default Value"
          // required={true}
          control={control}
          errors={errors}
          defaultValue={item?.defaultValue}
        />
      </Box>
      <Box className={classes.container}>
        <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={`required`}
            defaultValue={item?.required}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t(`REQUIRED`)}
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div>
        <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={`visible`}
            defaultValue={item?.visible}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t(`VISIBLE`)}
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div>
        {/* future use */}
        {/* <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={`searchable`}
            defaultValue={item?.searchable}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t(`SEARCHABLE`)}
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div> */}
      </Box>
    </>
  );
};

export default text;
