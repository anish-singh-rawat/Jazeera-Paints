// React
import React, { useState } from "react";

// Common Component
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";

// react-hook-form
import { Controller } from "react-hook-form";

// Translation
import { t } from "i18next";
import { Key } from "src/@core/layouts/utils";

// MUI
import { Box, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { dateFormatsJSON } from "src/types/forms/storesSettings/dateFormateJSON";

const useStyles = makeStyles({
  radioContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
    marginTop: "18px",
    width: "32%",

    "& .MuiFormControlLabel-root": {
      height: "20px",
      fontSize: "10px",
      "& .MuiFormControlLabel-label": {
        fontSize: "12px",
      },
    },
  },
});

const GeneralSection = (props: any) => {
  const {
    control,
    errors,
    item,
    setValue,
    clearErrors,
    storeSettingsStore,
    customerProfile,
    sequenceMapData,
    switchActive,
    setSwitchActive,
  } = props;
  const classes = useStyles();

  return (
    <>
      <Box component={"div"} display={"flex"} gap={"14px"}>
        <Box component={"div"} style={{ width: "50%" }} marginBottom={"6px"}>
          <CommonInput
            name="code"
            id="code"
            label="Code"
            control={control}
            errors={errors}
            defaultValue={"Auto Generated"}
            disabled={sequenceMapData?.autoGeneration}
            required={!sequenceMapData?.autoGeneration}
          />
        </Box>
        <CommonInput
          name="name"
          id="name"
          label="Store Name"
          required={true}
          control={control}
          errors={errors}
          defaultValue={""}
        />
      </Box>
      <Box component={"div"} display={"flex"} gap={"14px"} marginBottom={"6px"}>
        <CommonInput
          name="altName"
          id="altName"
          label="Alternate Store Name"
          control={control}
          errors={errors}
          defaultValue={""}
        />

        <Box component={"div"} style={{ width: "50%" }}>
          <CommonSelect
            name="storeTypes"
            options={storeSettingsStore?.storesTypes || []}
            control={control}
            label={"Store Type"}
            validateForm={{}}
            required={true}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
          />
        </Box>
      </Box>
      <Box component={"div"} display={"flex"} gap={"14px"} marginBottom={"6px"}>
        <Box component={"div"} style={{ width: "32%" }}>
          <CommonSelect
            name="customerProfile"
            options={customerProfile?.data || []}
            control={control}
            label={"Customer Profile"}
            validateForm={{}}
            required={true}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
          />
        </Box>
        <Box component={"div"} style={{ width: "32%" }}>
          <CommonSelect
            name="offlinePOS"
            // options={
            //   storeSettingsStore?.dataById?.storeTerminalsMapping
            //     ? storeSettingsStore?.dataById?.storeTerminalsMapping.map(
            //         (item: any) => item.terminal?.terminalNum
            //       )
            //     : []
            // }
            options={storeSettingsStore?.dataById?.storeTerminalsMapping?.map(
              (item: any) => item.terminal
            )}
            control={control}
            label={"Offline POS"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
          />
        </Box>
        {/* <Box component={"div"} style={{ width: "33%" }}>
          <CommonSelect
            name="dateFormate"
            options={dateFormatsJSON || []}
            control={control}
            label={"Date Formate"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
          />
        </Box> */}
        {/* <Box
          component={"div"}
          style={{ width: "33%" }}
          display={"flex"}
          flexDirection={"column"}
        >
          {t("STATUS")}
          <Box>
            <CommonSwitch
              active={switchActive}
              setActive={setSwitchActive}
              statusChange={() => ({})}
            />
            {switchActive ? t("ACTIVE") : t("INACTIVE")}
          </Box>
        </Box> */}
        <Box
          component={"div"}
          style={{ width: "33%" }}
          display={"flex"}
          flexDirection={"column"}
        >
          <CommonInput
            name="latitude"
            id="latitude"
            label="Latitude"
            control={control}
            errors={errors}
            defaultValue={""}
          />
        </Box>
      </Box>
      <Box
        component={"div"}
        display={"flex"}
        gap={"14px"}
        marginBottom={"6px"}
        alignItems={"center"}
      >
        {/* <Box className={classes.radioContainer}>
          <Controller
            control={control}
            name={`visible`}
            defaultValue={item?.visible}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t(Key(`System Default Time Zone`))}
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </Box> */}
        <Box
          component={"div"}
          style={{ width: "33%" }}
          display={"flex"}
          flexDirection={"column"}
        >
          <CommonInput
            name="longitude"
            id="longitude"
            label="Longitude"
            control={control}
            errors={errors}
            defaultValue={""}
          />
        </Box>
        <Box
          component={"div"}
          style={{ width: "33%" }}
          display={"flex"}
          flexDirection={"column"}
        >
          <CommonSelect
            name="defaultCustomer"
            options={storeSettingsStore?.customerData || []}
            // options={storeSettingsStore?.customerData?.map((customer: any) => {
            //   return `${customer.firstName} ${customer.lastName}`;
            // })}
            control={control}
            label={"Default Customer"}
            validateForm={{}}
            required={true}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
          />
        </Box>
        {/* <Box component={"div"} style={{ width: "32%" }}>
          <CommonSelect
            name="timeZone"
            options={[]}
            control={control}
            label={"Time Zone"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
          />
        </Box> */}
        {/* <Box
          component={"div"}
          style={{ width: "33%" }}
          display={"flex"}
          flexDirection={"column"}
        >
          <CommonInput
            name="taxid"
            id="taxid"
            label="Tax Id"
            required={true}
            control={control}
            errors={errors}
            defaultValue={""}
          />
        </Box> */}

        <Box
          component={"div"}
          style={{ width: "33%" }}
          display={"flex"}
          flexDirection={"column"}
        >
          {t("STATUS")}
          <Box>
            <CommonSwitch
              active={switchActive}
              setActive={setSwitchActive}
              statusChange={() => ({})}
            />
            {switchActive ? t("ACTIVE") : t("INACTIVE")}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default GeneralSection;
