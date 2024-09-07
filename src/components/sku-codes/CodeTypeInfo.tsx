import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CodeTypeForm from "./CodeTypeForm";
import { codeDesription } from "./CodeTypeForm";

function CodeTypeInfo() {
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
  };

  const removeCodeInfo = (index: number) => {
    const updatedCodeInfo = [...codeInfo];
    updatedCodeInfo.splice(index, 1);
    setCodeInfo(updatedCodeInfo);
  };

  const renderCodeInfo = () => {
    return codeInfo.map((data, index) => (
      <CodeTypeForm
        key={index}
        data={data}
        index={index}
        onInputChange={handleInputChange}
        onRemoveClick={removeCodeInfo}
      />
    ));
  };
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        background: "white",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <Box sx={{ background: "#F7F7F7", padding: "20px", borderRadius: "5px" }}>
        <Typography sx={{ fontWeight: "600" }}>{t("SKU_CODES")}</Typography>
        <Typography
          sx={{
            marginTop: "20px",
            fontSize: "13px",
            fontWeight: "400",
            color: "#A8AAAE",
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
            control={<Checkbox defaultChecked />}
            label={t("SELL_ON_POS")}
          />
          <FormControlLabel
            required
            control={<Checkbox />}
            label={t("SELL_ON_ECOMMERCE")}
          />
        </FormGroup>

        <div style={{ border: "1px solid #C6C6C6", marginTop: "20px" }}></div>

        <Typography sx={{ marginTop: "20px" }}>{t("SERVICES")}*</Typography>

        <RadioGroup
          aria-label="gender"
          name="gender"
          // value={selectedValue}
          // onChange={handleChange}
          sx={{ display: "flex", width: "100%", flexDirection: "row" }}
        >
          <FormControlLabel
            value="male"
            control={<Radio />}
            label={t("ASSOCIATE_SERVICE")}
          />

          <FormControlLabel
            value="female"
            control={<Radio />}
            label={t("INDEPENDENT_SERVICE")}
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}

export default CodeTypeInfo;
