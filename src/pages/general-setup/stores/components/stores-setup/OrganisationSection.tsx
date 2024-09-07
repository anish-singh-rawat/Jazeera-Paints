import { Box, Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import CommonSelect from "src/components/common/CommonSelect";
import { Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";

// Translation
import { t } from "i18next";
import { Key } from "src/@core/layouts/utils";
import CommonInput from "src/components/common/CommonInput";

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

const OrganisationSection = (props: any) => {
  const {
    control,
    errors,
    item,
    setValue,
    clearErrors,
    storeSettingsStore,
    setLegalEntityOption,
    isPriceListManual,
    setIsPriceListManual,
    ...other
  } = props;
  const classes = useStyles();

  return (
    <>
      <Box component={"div"} display={"flex"} gap={"14px"} marginBottom={"6px"}>
        <Box component={"div"} style={{ width: "32%" }}>
          <CommonSelect
            name="businessUnit"
            options={storeSettingsStore?.businessUnit || []}
            control={control}
            label={"Business Unit"}
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
            name="legalEntity"
            options={storeSettingsStore?.legalEntity || []}
            control={control}
            label={"Legal Entity"}
            validateForm={{}}
            required={true}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
            getItemId={setLegalEntityOption}
          />
        </Box>
        <Box component={"div"} style={{ width: "33%" }}>
          <CommonSelect
            name="entityType"
            options={storeSettingsStore?.entityType || []}
            control={control}
            label={"Entity Type"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            disabled={true}
            clearErrors={clearErrors}
          />
        </Box>
      </Box>
      <Box component={"div"} display={"flex"} gap={"14px"} marginBottom={"6px"}>
        <Box component={"div"} style={{ width: "33%" }}>
          <CommonSelect
            name="company"
            options={[storeSettingsStore?.company] || []}
            control={control}
            label={"Company"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            disabled={true}
            clearErrors={clearErrors}
          />
        </Box>
        <Box component={"div"} style={{ width: "32%" }}>
          <CommonSelect
            name="currency"
            options={storeSettingsStore?.company?.currency || []}
            control={control}
            label={"Currency"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            disabled={true}
            clearErrors={clearErrors}
          />
        </Box>
        <Box component={"div"} style={{ width: "32%" }}>
          <CommonSelect
            name="country"
            options={storeSettingsStore?.company?.country || []}
            control={control}
            label={"Country"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
            disabled={true}
          />
        </Box>
      </Box>
      <Box component={"div"} display={"flex"} gap={"14px"} marginBottom={"6px"}>
        <Box component={"div"} style={{ width: "33%" }}>
          <CommonInput
            name="vatNumber"
            id="vatNumber"
            label="VAT No."
            control={control}
            errors={errors}
            defaultValue={""}
          />
        </Box>
        <Box
          component={"div"}
          style={{ width: "32%" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            <Controller
              control={control}
              name={`visible`}
              defaultValue={item?.visible}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  label={t(Key(`Default Price List`))}
                  control={
                    <Checkbox
                      checked={!isPriceListManual}
                      onChange={(e) => setIsPriceListManual(!e.target.checked)}
                    />
                  }
                />
              )}
            />
          </Box>
        </Box>
        <Box component={"div"} style={{ width: "32%" }}>
          <CommonSelect
            name="priceList"
            options={storeSettingsStore?.priceList || []}
            control={control}
            label={"Price List"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
            disabled={!isPriceListManual}
          />
        </Box>
      </Box>
    </>
  );
};

export default OrganisationSection;
