import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import CommonTextField, { CommonTextFieldProps } from "./CommonTextField";
import { getBoxStyles } from "./price-list-style";

interface PriceListFormProps {
  inputSchema: CommonTextFieldProps[];
  selectSchema: CommonTextFieldProps[];
}

export default function PriceListForm({
  inputSchema,
  selectSchema,
}: PriceListFormProps) {
  const theme = useTheme();
  const getBoxStyle = getBoxStyles(theme);

  return (
    <>
      <Box>
        <Box sx={getBoxStyle}>
          {inputSchema.map((item) => (
            <CommonTextField key={item.base} {...item} />
          ))}
        </Box>
        <Box sx={getBoxStyle}>
          {selectSchema.map((item) => (
            <CommonTextField key={item.base} {...item} />
          ))}
          <div style={{ width: "100%" }}>{""}</div>
        </Box>
      </Box>
    </>
  );
}
