import React from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Fade } from "@mui/material";

interface roleToggleProps {
  checked: any;
  defaultChecked: any;
  label: any;
  onChange: Function;
}

const RoleToggle: React.FC<roleToggleProps> = ({
  defaultChecked,
  checked,
  label,
  onChange,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          defaultChecked={defaultChecked}
          TransitionComponent={Fade}
          sx={{
            ".MuiSwitch-thumb": {
              width: 14,
              height: 14,
            },
            "&.Mui-checked .MuiSwitch-thumb": {
              transform: "translateX(15px)",
            },
          }}
          checked={checked}
          onChange={onChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={label}
    />
  );
};

export default RoleToggle;
