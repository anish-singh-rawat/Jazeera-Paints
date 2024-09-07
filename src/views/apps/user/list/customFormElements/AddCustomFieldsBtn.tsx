import { Button, Typography } from "@mui/material";
import React from "react";

const AddCustomFieldsBtn = (props: any) => {
  const { handleClick, titleBtn, infoText } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography sx={{ textAlign: "start" }}>{infoText}</Typography>
      <Button
        onClick={handleClick}
        variant="contained"
        sx={{
          textTransform: "unset",
          width: "20%",
          padding: "5px 10px",
          color: "#3586C7",
          background: "#d7e7f4",
          "&:hover": {
            background: "#d7e7f4",
          },
        }}
      >
        {titleBtn}
      </Button>
    </div>
  );
};

export default AddCustomFieldsBtn;
