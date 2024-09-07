import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { Icon } from "@iconify/react";
import CommonInput from "src/components/common/CommonInput";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";

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
  box: {
    border: "1px solid #DBDADE",
    width: "100%",
    height: "212px",
    overflowY: "scroll",
  },
  optionsHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 60px",
    width: "100%",
    height: "60px",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #DBDADE",
  },
  optionsColumnName: {
    display: "flex",
    justifyContent: "center",
    width: "75%",
  },
  optionsRowContainer: {
    height: "50px",
    borderBottom: "1px solid #DBDADE",
    display: "flex",
    width: "100%",
    gap: "14px",
    padding: "0 0px 0 55px",
    alignItems: "center",
  },
  optionsName: {
    marginTop: "3px",
    display: "flex",
    justifyContent: "center",
    // width: "65%",
    "& .MuiInputBase-input": {
      padding: "6px",
    },
  },
  optionCheckBox: {
    padding: "0 0px 0 65px",
  },
});

const CustomList = (props: any) => {
  const { control, errors, item, setValue, numberOfRows, setNumberOfRows, ...other } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const [checkedIndex, setCheckedIndex] = useState(-1);
  const [multiple, setMultiple] = useState(false);

  // const [numberOfRows, setNumberOfRows] = useState<number>(
  //   item?.listOfValues1 ? item?.listOfValues1.length : 1
  // );

  // useEffect(() => {
  //   setValue("multiSelect", item?.multiSelect);
  //   setValue("defaultValue", item?.defaultValue);
  //   setValue("required", item?.required);
  //   setValue("visible", item?.visible);
  //   setValue("searchable", item?.searchable);
  // }, [item, setValue]);

  const handleAddRows = () => {
    setNumberOfRows(numberOfRows + 1);
  };

  const handleRemoveRows = () => {
    setNumberOfRows(numberOfRows - 1);
    setValue(`optionValue${numberOfRows - 1}`, null);
    setValue(`optionAltValue${numberOfRows - 1}`, null);
    setValue(`defaultValueOption${numberOfRows - 1}`, null);
  };
  const handleChange = (e: any, index: any) => {
    if (checkedIndex !== -1) {
      setCheckedIndex(-1);
      setValue(`defaultValueOption${checkedIndex}`, null);
    }

    setCheckedIndex(index);
    setValue(`defaultValueOption${index}`, true);
  };

  const handleMultiple = () => {
    setMultiple(!multiple);
  };

  return (
    <>
      <Box className={classes.container}>
        <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={`multiSelect`}
            defaultValue={item?.multiSelect}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t(Key("Allow multi select"))}
                control={
                  <Checkbox
                    checked={value}
                    onChange={() => {
                      onChange(), handleMultiple();
                    }}
                  />
                }
              />
            )}
          />
        </div>
      </Box>
      <Box className={classes.container}>
        <Typography variant="body1" fontWeight={800}>
          {t(Key("Possible values"))}
        </Typography>
      </Box>
      <Box className={classes.container}>
        <div className={classes.box}>
          <div className={classes.optionsHeader}>
            <Typography
              variant="body1"
              className={classes.optionsColumnName}
              fontWeight={600}
            >
              {t(Key("Name"))}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={600}
              className={classes.optionsColumnName}
            >
              {t(Key("Alternate name"))}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={600}
              className={classes.optionsColumnName}
            >
              {t(Key("Default"))}
            </Typography>
            <Typography
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "0 5px",
              }}
            >
              <IconButton onClick={handleAddRows}>
                <Icon icon="tabler:plus" color="#3586C7"></Icon>
              </IconButton>
            </Typography>
          </div>
          {Array.from(Array(numberOfRows)).map((c, index) => {
            return (
              <div className={classes.optionsRowContainer} key={c}>
                <Grid className={classes.optionsName}>
                  <CommonInput
                    name={`optionValue${index}`}
                    id={`optionValue${index}`}
                    control={control}
                    errors={errors}
                    defaultValue={
                      item?.listOfValues1 ? item?.listOfValues1[index] : ""
                    }
                  />
                </Grid>
                <Grid className={classes.optionsName}>
                  <CommonInput
                    name={`optionAltValue${index}`}
                    id={`optionAltValue${index}`}
                    control={control}
                    errors={errors}
                    defaultValue={
                      item?.listOfValues2 ? item?.listOfValues2[index] : ""
                    }
                  />
                </Grid>
                <Grid className={classes.optionCheckBox}>
                  <Controller
                    control={control}
                    name={`defaultValueOption${index}`}
                    defaultValue={item?.required}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        label=""
                        control={
                          <Checkbox
                            checked={multiple ? value : index === checkedIndex}
                            onChange={
                              multiple
                                ? onChange
                                : (e) => handleChange(e, index)
                            }
                          />
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid
                  style={{
                    width: "22%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: "0 5px",
                    }}
                  >
                    <IconButton onClick={handleRemoveRows}>
                      <Icon icon="tabler:trash" color="secondary"></Icon>
                    </IconButton>
                  </Typography>
                </Grid>
              </div>
            );
          })}
        </div>
      </Box>
      <Box className={classes.container}>
        <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={`required`}
            defaultValue={item?.required}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t(Key("Required"))}
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
                label={t(Key("visible"))}
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div>
        {/* <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={`searchable`}
            defaultValue={item?.searchable}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t(Key("Searchable"))}
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div> */}
      </Box>
    </>
  );
};

export default CustomList;
