import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { TextField, Select, MenuItem } from "@mui/material";
import Image from "next/image"; // Import the Select and MenuItem components
import { useTranslation } from "react-i18next";

export interface codeDesription {
  codeType: string;
  code: string;
}

function CodeTypeForm({
  data,
  index,
  onInputChange,
  onRemoveClick,
}: {
  data: codeDesription;
  index: number;
  onInputChange: (
    index: number,
    field: keyof codeDesription,
    value: string
  ) => void;
  onRemoveClick: (index: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <Box key={index} sx={{ marginTop: "20px", gap: "15px", display: "flex", flexWrap: "wrap" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {index == 0 && <label>{t("CODE_TYPE")} *</label>}
        <Select
          value={data.codeType}
          onChange={(e) =>
            onInputChange(index, "codeType", e.target.value as string)
          } // Cast the value to a string
          sx={{ width: "260px", background: "white" }}
          size="small"
        >
          <MenuItem value="Class A">Class A</MenuItem>
          <MenuItem value="Class B">Class B</MenuItem>
          <MenuItem value="Class C">Class C</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {index == 0 && <label>{t("CODE")} *</label>}
        <TextField
          type="text"
          value={data.code}
          onChange={(e) => onInputChange(index, "code", e.target.value)}
          style={
            index > 0
              ? { width: "220px", background: "white" }
              : { width: "260px", background: "white" }
          }
          size="small"
        />
      </Box>

      {index > 0 && ( // Render remove button conditionally
        <Image
          alt="Uploaded"
          width={12}
          height={15}
          onClick={() => onRemoveClick(index)}
          style={{ marginTop: "10px", cursor: "pointer" }}
          src={"/icons/deleteIcon.png"}
        />
      )}
    </Box>
  );
}

export default CodeTypeForm