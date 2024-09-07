import { Box, Button, Grid } from "@mui/material";
import { t } from "i18next";
import React from "react";
import { Key } from "src/@core/layouts/utils";
import CommonInput from "src/components/common/CommonInput";

const CustomFieldsSection = (props: any) => {
  const { control, errors, item, setValue, ...other } = props;
  return (
    <Grid container justifyContent={"center"} width={"100%"}>
      <Button variant="contained">{"+ " + t(Key("Add Custom Field"))}</Button>
    </Grid>
  );
};

export default CustomFieldsSection;
