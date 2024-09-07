import { Box, Button } from "@mui/material";
import React from "react";
import CommonInput from "src/components/common/CommonInput";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { PathString } from "react-hook-form";

const CustomDiscunt = ({
  control,
  errors,
  btn,
  discountInfo,
  addDiscountInfo,
  handleInputChange,
}: any) => {
  const renderDiscountInfo = () => {
    return discountInfo?.map((student: any, index: any) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "flex-end",
          minHeight: "80px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <label>{t("S_NO")}</label>
          <TextField
            value={student.sno}
            onChange={(e) => handleInputChange(index, "sno", e)}
            variant="outlined"
            InputLabelProps={{ shrink: false }}
            sx={{ width: "50px" }}
            size="small"
          />
        </Box>

        <Box>
          <label>{t("NO_OF_DAYS")}</label>
          <TextField
            value={student.noOfDays}
            onChange={(e) => handleInputChange(index, "noOfDays", e)}
            variant="outlined"
            InputLabelProps={{ shrink: false }}
            sx={{ width: "75px", background: "white" }}
            size="small"
          />
        </Box>
        <Box>
          <label>{t("DISCOUNT")} %</label>

          <TextField
            value={student.discount}
            onChange={(e) => handleInputChange(index, "discount", e)}
            variant="outlined"
            InputLabelProps={{ shrink: false }}
            sx={{ width: "75px", background: "white" }}
            size="small"
          />
        </Box>
      </Box>
    ));
  };
  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          background: "#F7F7F7",
          gap: "10px",
          padding: "10px",
          flexDirection: "column",
          paddingBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            marginLeft: "10px",
            flexDirection: "column",
          }}
        >
          {renderDiscountInfo()}
        </Box>

        {btn && (
          <button
            style={{
              width: "40%",
              textAlign: "inherit",
              marginLeft: "5px",
              background: "none",
              border: "none",
              color: "#3586C7",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "20px",
              marginBottom: "10px",
            }}
            onClick={addDiscountInfo}
          >
            {t("ADD_MORE")}
          </button>
        )}
      </Box>
    </>
  );
};

export default CustomDiscunt;
