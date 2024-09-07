import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import { useTranslation } from "react-i18next";

export interface ResponsiveDialogProps {
  dialogBoxTitle: string;
  dialogComponent: React.FC<ResponsiveDialogProps>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>> | any;
  handleSubmit?: () => void;
  loadingState?: boolean;
  clearPrevState?: () => void;
  maxWidth?: any;
  fullWidth?: boolean;
  showActionBtn?: boolean;
  sx?: any;
}

export default function ResponsiveDialog(props: ResponsiveDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    props.setOpen(false);
    if (typeof props.clearPrevState === "function") props.clearPrevState();
  };

  console.log(props.maxWidth, "99999");

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        fullWidth={props.fullWidth || false}
        maxWidth={props.maxWidth || undefined}
        sx={
          props.sx
            ? {
                "& .MuiDialog-paper": {
                  // Targeting the internal Paper component
                  width: "60%", // Setting the width to 60%
                  // maxWidth: 'none', // Override maxWidth to ensure it doesn't restrict the custom width
                },
              }
            : {}
        }
      >
        <DialogTitle id="responsive-dialog-title" sx={props.sx}>
          {props.dialogBoxTitle}
        </DialogTitle>
        <DialogContent>{props.dialogComponent(props)}</DialogContent>
        {props.showActionBtn !== false && (
          <DialogActions
            sx={{
              mb: 4,
              justifyContent: {
                sm: "space-between",
                xs: "space-between",
                md: "space-evenly",
              },
            }}
          >
            <Button
              autoFocus
              onClick={handleClose}
              variant={"contained"}
              color="secondary"
              size="medium"
            >
              {t("CANCEL")}
            </Button>
            <Button
              onClick={props.handleSubmit}
              autoFocus
              variant={"contained"}
              size="medium"
              disabled={props.loadingState}
            >
              {t("SAVE")}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
