import React from "react";
import { Autocomplete, Box, FormHelperText, Grid } from "@mui/material";
import { TextField } from "@mui/material";
import Image from "next/image"; // Import the Select and MenuItem components
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Icon from "src/@core/components/icon";

const errorMsg = {
  color: "#EA5455",
  height: '10px',
  fontSize: "0.8rem"
}

export interface codeDesription {
  barcodeTypes: string;
  barcode: string;
  UOM: any;
}

function CodeTypeForm({
  data,
  index,
  onInputChange,
  onRemoveClick,
  options,
  getValues,
  errors,
  barCodeDuplicateError
}: {
  data: codeDesription;
  index: number;
  onInputChange: (
    index: number,
    field: keyof codeDesription | any,
    value: string
  ) => void;
  onRemoveClick: (index: number) => void;
  options: any
  getValues?: any,
  errors?: any,
  barCodeDuplicateError?: any,
}) {
  const { t } = useTranslation();
  const barcodeTypes = useSelector(
    (state: RootState) => state?.productsAdd.data?.skuCodes ?? []
  );

  return (
    <Grid
      container
      spacing={3}
      sx={{
        my: 0.5,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Grid item xs={3}>
        <Autocomplete
          options={options ?? []}
          size="small"
          fullWidth
          onChange={(e: any, value) =>
            onInputChange(index, "UOM", value as string)
          }
          value={data?.UOM}
          getOptionLabel={(option: any) => option?.name ?? ""}
          renderOption={(props, option: any) => (
            <Box sx={{ width: "auto" }} component="li" {...props}>
              {option?.name ?? ""}
            </Box>
          )}
          renderInput={(params) => (
            <>
              <TextField
                placeholder={t("UOM") as string}
                {...params}
                error={!data?.UOM && errors?.UOM}
              />
              <FormHelperText sx={errorMsg} id="validation-schema-fromUnit">
                {!data?.UOM && errors["UOM"] ? t("REQUIRED") : ""}
              </FormHelperText>
            </>
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <Autocomplete
          options={barcodeTypes ?? []}
          autoHighlight
          size="small"
          fullWidth
          onChange={(e: any, value) =>
            onInputChange(index, "barcodeTypes", value as string)
          }
          value={data.barcodeTypes ?? ""}
          getOptionLabel={(option: any) => option?.name ?? ""}
          renderOption={(props, option: any) => (
            <Box sx={{ width: "auto" }} component="li" {...props}>
              {option?.name ?? ""}
            </Box>
          )}
          renderInput={(params) => (
            <>
              <TextField
                placeholder={t("CODE_TYPE") as string}
                {...params}
                value={data.barcodeTypes ?? ""}
                error={!data?.barcodeTypes && errors?.barcodeTypes}
              />
              <FormHelperText sx={errorMsg} id="validation-schema-fromUnit">
                {!data?.barcodeTypes && errors["barcodeTypes"]
                  ? t("REQUIRED")
                  : ""}
              </FormHelperText>
            </>
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          type="text"
          value={data?.barcode}
          onChange={(e) => onInputChange(index, "barcode", e.target.value)}
          fullWidth
          size="small"
          placeholder={t("CODE") as string}
          error={!data?.barcode && errors?.barcode}
        />
        <FormHelperText sx={errorMsg} id="validation-schema-fromUnit">
          {!data?.barcode && errors["barcode"] && t("REQUIRED")}
          {barCodeDuplicateError?.visible &&
            barCodeDuplicateError?.index === index &&
            t("UNIQUE_CODE")}
        </FormHelperText>
      </Grid>
      <Grid
        item
        xs={2.5}
        sx={{ pt: "0rem !important",  alignSelf: "center", justifyContent: 'flex-start' }}
      >
        <Box sx={{ cursor: "pointer" }}>
          <Icon
            onClick={() => onRemoveClick(index)}
            icon="tabler:trash"
            fontSize={25}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default CodeTypeForm;