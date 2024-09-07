import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { Children } from "react";

const useStyles = makeStyles({
  dialog: {
    "& .MuiDialog-paper": {
      padding: ".8rem 2rem",
    },
  },
  content: {
    // height: "400px",
    overflow: "auto",
  },
  dialogAction: {
    justifyContent: "flex-start",
    gap: "8px",
  },
  btn: {
    width: "91px",
    height: "38px",
  },
});

const CommonAddNewModel = (props: any) => {
  const { title, handleDialogClose, children, maxWidth } = props;

  const classes = useStyles();
  return (
    <Dialog
      className={classes.dialog}
      open
      onClose={handleDialogClose}
      fullWidth
      maxWidth={maxWidth || "sm"}
    >
      <DialogTitle>{`${title}`}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default CommonAddNewModel;
