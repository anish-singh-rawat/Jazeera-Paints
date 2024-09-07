import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useTheme } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";

export default function CustomFormDialog(props: any) {
  const { title, handleClose } = props;
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const theme = useTheme();

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open onClose={handleClose} fullWidth>
        <DialogTitle>{`Add ${title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              height: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              fontSize: "18px",
            }}
          >
            <img
              alt="forgot-password-illustration"
              src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
              width={"260px"}
              height={"400px"}
            ></img>
            This page is in Under Construction
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
