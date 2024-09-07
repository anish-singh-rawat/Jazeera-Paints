import { Box, Checkbox, FormControlLabel } from "@mui/material";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import CommonInput from "src/components/common/CommonInput";

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

const float = (props: any) => {
  const { control, errors, item, setValue, ...other } = props;
  const classes = useStyles();

  // useEffect(() => {
  //   setValue("minLenth", item?.minLenth);
  //   setValue("maxLength", item?.maxLength);
  //   setValue("defaultValue", item?.defaultValue);
  //   setValue("regularExpression", item?.regularExpression);
  //   setValue("required", item?.required);
  //   setValue("visible", item?.visible);
  // }, [item, setValue]);

  return (
    <>
      <Box className={classes.container}>
        <CommonInput
          name="minLenth"
          id="minLenth"
          label="Min Length"
          required={true}
          type={"number"}
          control={control}
          errors={errors}
          defaultValue={item?.minLenth}
        />
        <CommonInput
          name="maxLength"
          id="maxLength"
          label="Max Length"
          type={"number"}
          required={true}
          control={control}
          errors={errors}
          defaultValue={item?.maxLength}
        />
      </Box>
      <Box className={classes.container}>
        <CommonInput
          name="regularExpression"
          id="regularExpression"
          label="Regular Expression"
          required={true}
          control={control}
          errors={errors}
          defaultValue={item?.regularExpression}
        />
        <CommonInput
          name="defaultValue"
          id="defaultValue"
          label="Default Value"
          required={true}
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
                label="Required"
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
                label="Visible"
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div>
      </Box>
    </>
  );
};

export default float;
