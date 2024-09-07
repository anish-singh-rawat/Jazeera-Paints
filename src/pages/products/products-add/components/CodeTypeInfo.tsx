import React, { ChangeEvent, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CodeTypeForm from "./CodeTypeForm";
import { codeDesription } from "./CodeTypeForm";

interface Props {
  selectedServiceType: string;
  setSelectedServiceType: Function;
  setValue: Function;
}

function CodeTypeInfo({
  selectedServiceType,
  setSelectedServiceType,
  setValue,
}: Props) {
  const [codeInfo, setCodeInfo] = useState<codeDesription[]>([
    { codeType: "", code: "" },
  ]);

  const addCodeInfo = () => {
    setCodeInfo([...codeInfo, { codeType: "", code: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof codeDesription,
    value: string
  ) => {
    const updatedCodeInfo = [...codeInfo];
    updatedCodeInfo[index][field] = value;
    setCodeInfo(updatedCodeInfo);
    setValue("productBarCodeMapping", updatedCodeInfo);
  };

  const removeCodeInfo = (index: number) => {
    const updatedCodeInfo = [...codeInfo];
    updatedCodeInfo.splice(index, 1);
    setCodeInfo(updatedCodeInfo);
    setValue("productBarCodeMapping", updatedCodeInfo);
  };

  const renderCodeInfo = () => {
    return codeInfo.map((data, index) => (
      <CodeTypeForm
        data={data}
        index={index}
        key={index}
        onInputChange={handleInputChange}
        onRemoveClick={removeCodeInfo}
      />
    ));
  };
  const { t } = useTranslation();
  return (
    <Card>
      <Box sx={{ padding: "10px" }}>
        <Typography sx={{ fontWeight: "600" }}>{t("SKU_CODES")}</Typography>
        <Typography
          sx={{
            marginTop: "20px",
            fontSize: "13px",
            fontWeight: "400",
          }}
        >
          {t("CODES_CONTENT")}
        </Typography>

        {renderCodeInfo()}
        <Button
          variant="text"
          sx={{ marginTop: "10px", textTransform: "none" }}
          onClick={addCodeInfo}
          color="primary"
        >
          + {t("ADD_ANOTHER_CODE")}
        </Button>
        <div style={{ border: "1px solid #C6C6C6", marginTop: "20px" }}></div>

        <Typography sx={{ marginTop: "20px" }}>
          {t("MAKE_THIS_PRODUCT_AVAILABLE_ON")}
        </Typography>

        <FormGroup
          sx={{ display: "flex", flexDirection: "row", width: "100%" }}
        >
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => setValue("sellOnPos", e?.target?.checked)}
                defaultChecked
              />
            }
            label={t("SELL_ON_POS")}
          />
          <FormControlLabel
            control={
              <Checkbox
                style={{ borderColor: "black" }}
                onChange={(e) => setValue("sellOnline", e?.target?.checked)}
              />
            }
            label={t("SELL_ON_ECOMMERCE")}
          />
        </FormGroup>

        <div style={{ border: "1px solid #C6C6C6", marginTop: "20px" }}></div>

        <Typography sx={{ marginTop: "20px" }}>{t("SERVICES")}*</Typography>

        <RadioGroup
          aria-label="service_type"
          name="serviceType"
          value={selectedServiceType}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSelectedServiceType(e.target.value)
          }
          sx={{ display: "flex", width: "100%", flexDirection: "row" }}
        >
          <FormControlLabel
            value="associate"
            control={<Radio />}
            label={t("ASSOCIATE_SERVICE")}
          />

          <FormControlLabel
            value="independent"
            control={<Radio />}
            label={t("INDEPENDENT_SERVICE")}
          />
        </RadioGroup>
      </Box>
    </Card>
  );
}

export default CodeTypeInfo;
