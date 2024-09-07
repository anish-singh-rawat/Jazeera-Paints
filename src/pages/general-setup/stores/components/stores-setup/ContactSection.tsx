import { Box } from "@mui/material";
import React from "react";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonTextArea from "src/components/common/CommonTextArea";

const ContactSection = (props: any) => {
  const {
    control,
    errors,
    item,
    setValue,
    clearErrors,
    store,
    setRegionId,
    setCityId,
    ...other
  } = props;

  return (
    <>
      <Box component={"div"} display={"flex"} gap={"16px"}>
        <CommonInput
          name="email"
          id="email"
          label="Email"
          required={true}
          control={control}
          errors={errors}
          defaultValue={""}
        />

        <CommonInput
          name="mobileNumber"
          id="mobileNumber"
          label="Mobile"
          required={true}
          control={control}
          errors={errors}
          defaultValue={""}
          type="number"
        />
        <CommonInput
          name="fax"
          id="fax"
          label="Fax"
          control={control}
          errors={errors}
          defaultValue={""}
        />
      </Box>
      <Box component={"div"} display={"flex"} gap={"14px"} marginBottom={"6px"}>
        <Box component={"div"} style={{ width: "33%" }}>
          <CommonSelect
            name="region"
            options={store?.region || []}
            control={control}
            label={"Region"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
            getItemId={setRegionId}
          />
        </Box>
        <Box component={"div"} style={{ width: "33%" }}>
          <CommonSelect
            name="city"
            options={store?.cities || []}
            control={control}
            label={"City"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
            getItemId={setCityId}
          />
        </Box>
        <Box component={"div"} style={{ width: "33%" }}>
          <CommonSelect
            name="district"
            options={store?.districts || []}
            control={control}
            label={"District"}
            validateForm={{}}
            errors={errors}
            setValue={setValue}
            defaultValue={[]}
            noOptionsText={false}
            clearErrors={clearErrors}
          />
        </Box>
      </Box>
      <CommonTextArea
        name="address"
        id="address"
        label="Address"
        control={control}
        errors={errors}
        defaultValue={""}
        rows={3}
      />
    </>
  );
};

export default ContactSection;
