// ** React Imports
import { Fragment, SyntheticEvent, useState } from "react";
// import Slide, { SlideProps } from "@mui/material/Slide";

// ** MUI Imports
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";

const SnackbarConsecutive = (props: any) => {
  // ** States
  const [open, setOpen] = useState<boolean>(true);
  const { t } = useTranslation();
  const { message, anchorOrigin, severity, icon } = props;

  const handleClose = (event: Event | SyntheticEvent, reason?: string) => {
    if (reason === "click away") {
      return;
    }
    setOpen(false);
  };

  // function SlideTransition(props: SlideProps) {
  //   return <Slide {...props} direction="left" />;
  // }

  return (
    <Fragment>
      <Snackbar
        anchorOrigin={anchorOrigin}
        open={open}
        // TransitionComponent={SlideTransition}
        autoHideDuration={3000}
        onClose={handleClose}
        // variant="warning"
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        action={[<IconButton key="close" onClick={handleClose}></IconButton>]}
        message={t(Key(message))}
      >
        {/* <Alert
          elevation={3}
          variant="filled"
          onClose={handleClose}
          severity={"error"}
          icon={icon || false}
          sx={{ width: "100%" }}
        >
          {t(Key(message))}
        </Alert> */}
      </Snackbar>
    </Fragment>
  );
};

export default SnackbarConsecutive;
