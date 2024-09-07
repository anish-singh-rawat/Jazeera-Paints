import { Button } from "@mui/material";
import React from "react";

const CommonButton = (props: any) => {
  const { label, handleButton, variant, disabled } = props;
  return (
    <div>
      <Button variant={variant} onClick={handleButton} disabled={disabled}>
        {label}
      </Button>
    </div>
  );
};

export default CommonButton;
