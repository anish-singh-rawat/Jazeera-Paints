import { Box, Checkbox, FormControlLabel } from "@mui/material";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import CommonInput from "src/components/common/CommonInput";
import { t } from "i18next";
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

const email = (props: any) => {
  const { control, errors, item, setValue, ...other } = props;
  const classes = useStyles();
  // useEffect(() => {
  //   setValue("minLenth", item?.minLenth);
  //   setValue("maxLength", item?.maxLength);
  //   setValue("defaultValue", item?.defaultValue);
  //   setValue("required", item?.required);
  //   setValue("visible", item?.visible);
  //   setValue("searchable", item?.searchable);
  // }, [item, setValue]);

  return (
    <>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 50px",
          paddingLeft: "30px",
          marginBottom: "12px",
        }}
      >
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

export default email;
