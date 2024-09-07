import { IconButton, Typography } from "@mui/material";
import React from "react";
import Icon from "src/@core/components/icon";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  drawerHeader: {
    height: "80px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // borderBottom: "1px solid #D7D8DE",
    padding: "0 24px",
  },
  title: {
    fontSize: "18px",
    lineHeight: "26px",
    width: "80%",
    overflowWrap: "break-word",
  },
  closeButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(75, 70, 92, 0.16)",
    borderRadius: "6px",
  },
});

const CommonDrawerHeader = (props: any) => {
  const { title, handleClose, noBorder = false } = props;

  const classes = useStyles();

  return (
    <div
      className={classes.drawerHeader}
      style={
        noBorder
          ? { borderBottom: "none" }
          : { borderBottom: "1px solid #D7D8DE" }
      }
    >
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <IconButton
        className={classes.closeButton}
        size="small"
        onClick={handleClose}
      >
        <Icon icon="tabler:x" fontSize="1.125rem" />
      </IconButton>
    </div>
  );
};

export default CommonDrawerHeader;
