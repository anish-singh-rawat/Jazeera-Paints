import React from "react";

interface InfoBlockProps {
  info: {
    code: string;
    value: string | number;
  };
}

import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  viewContent_label: {
    color: "#a7a5aa",
    fontWeight: 400,
    fontSize: "15px",
  },
  viewContent_value: {
    color: "#6f6b7d",
    fontWeight: 600,
    fontSize: "15px",
  },
});

function CommonInfoBlock({ info }: InfoBlockProps) {
  const classes = useStyles();
  return (
    <div className="">
      <div className={classes.viewContent_label}>{info.code}</div>
      <div className={classes.viewContent_value}>{info.value}</div>
    </div>
  );
}

export default CommonInfoBlock;
