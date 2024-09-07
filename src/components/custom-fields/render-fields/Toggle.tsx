import { Box, Checkbox, FormControlLabel } from "@mui/material";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { t } from "i18next";

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

const toggle = (props: any) => {
  const { control, errors, item, setValue, ...other } = props;
  const classes = useStyles();

  return (
    <>
      <Box>
        <Box className={classes.container}>
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
        </Box>
      </Box>
    </>
  );
};

export default toggle;
