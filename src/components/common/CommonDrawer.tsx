import { Drawer } from "@mui/material";
import React from "react";

const CommonDrawer = (props: any) => {
  const { open, toggle, styles, widthXS, widthSM } = props;

  return (
    <div>
      <Drawer
        open={open}
        onClose={() => {
          toggle();
        }}
        anchor="right"
        sx={
          styles || {
            "& .MuiDrawer-paper": {
              width: { xs: widthXS || 300, sm: widthSM || 310 },
            },
          }
        }
      >
        {props.children}
      </Drawer>
    </div>
  );
};

export default CommonDrawer;
