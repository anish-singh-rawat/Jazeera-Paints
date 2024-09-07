// ** new react-hot-toast code start */

// import { useEffect } from "react";
// import { toast } from "react-hot-toast";
// import { useTranslation } from "react-i18next";
// import AppEvent from "src/app/AppEvent";

// interface Message {
//   type: keyof typeof toast;
//   message: string;
// }

// const Message = () => {
//   const { t } = useTranslation();

//   useEffect(() => {
//     AppEvent.messageEvent.subscribe((data: Message) => {
//       if (data) {
//         if (typeof toast[data?.type] === "function" && data?.message) {
//           const msg: any = t(data?.message);
//           toast[data?.type](msg, {
//             id: data?.message?.replace(/\s/g, "_"),
//           } as any);
//         }
//       }
//     });
//   }, []);

//   return null;
// };
// export default Message;

// ** new react-hot-toast code end */

//** old Alert code start */

import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AppStorage from "src/app/AppStorage";
import { useTranslation } from "react-i18next";
import AppEvent from "src/app/AppEvent";
import { Key } from "src/@core/layouts/utils";
interface ITostMessage {
  open: boolean;
  message: string;
  type: string;
  severity: any;
  translationId: string;
  horizontalLocation: "right" | "left";
  autoHideDuration: number;
}

const Message = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<ITostMessage>({
    open: false,
    message: "",
    type: "",
    severity: "success",
    translationId: "",
    horizontalLocation: "right",
    autoHideDuration: 3000,
  });

  useEffect(() => {
    AppEvent.messageEvent.subscribe((data: any) => {
      if (data) {
        let dir = AppStorage.getData("dir");
        let horizontalLocation: "left" | "right" =
          dir === "rtl" ? "left" : "right";
        setState({
          open: true,
          message: t(Key(data.message)),
          type: data.type ? data.type : "right",
          severity: data.type,
          translationId: "",
          horizontalLocation: horizontalLocation,
          autoHideDuration: data.type === "success" ? 5000 : 3000,
        });
      }
    });
  }, []);

  const handleClose = () => {
    setState({ ...state, open: false, message: "" });
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: state.horizontalLocation,
      }}
      data-testid="snackbar"
      open={state.open}
      autoHideDuration={state.autoHideDuration}
      onClose={() => handleClose()}
    >
      <Alert
        severity={state.severity}
        onClose={() => handleClose()}
        variant="filled"
        style={{ gap: "5px" }}
      >
        {state.message}
      </Alert>
    </Snackbar>
  );
};
export default Message;

//** old Alert code end */
