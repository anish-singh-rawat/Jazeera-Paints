import { Box } from "@mui/material";
import React from "react";
import CommonInput from "src/components/common/CommonInput";

const AdditionalSection = (props: any) => {
  const { control, errors, item, setValue, ...other } = props;
  return (
    <>
      <Box component={"div"} display={"flex"} gap={"16px"}>
        <CommonInput
          name="externalReference"
          id="externalReference"
          label="External Reference"
          control={control}
          errors={errors}
          defaultValue={""}
        />

        <CommonInput
          name="externalCustomerCode"
          id="externalCustomerCode"
          label="External Customer Code"
          control={control}
          errors={errors}
          defaultValue={""}
        />
        <CommonInput
          name="externalCostCenter"
          id="externalCostCenter"
          label="External Cost Center"
          control={control}
          errors={errors}
          defaultValue={""}
        />
      </Box>
    </>
  );
};

export default AdditionalSection;
