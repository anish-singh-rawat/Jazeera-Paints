import React from "react";
import { Box, Typography } from "@mui/material";

const CommonNote = ({ getmonth }: any) => {
  return (
    <Box sx={{ background: "#F2F2F2", display: "flex", padding: "10px" }}>
      <label style={{ width: "80%", color: "#DB4437", fontStyle: "italic" }}>
        Payment Note -{" "}
      </label>
      <Typography
        sx={{ color: "#4B465C", fontSize: "13px", fontStyle: "italic" }}
      >
        {` If January 1st is the Baseline date, the due date of invoice is ${getmonth?.[1]}th of ${getmonth?.[0]}`}
      </Typography>
    </Box>
  );
};

export default CommonNote;
