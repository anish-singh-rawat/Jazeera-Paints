// ** React Imports
import Box from "@mui/material/Box";
import { ReactNode } from "react";
import BlankLayout from "src/@core/layouts/BlankLayout";
import CommonAuthenticationCode from "src/components/common/CommonAuthenticationCode";
import ForgotForm from "src/components/formComponent/ForgotForm";
import { forgotTranslations } from "src/constants/login";


const ForgotPassword = () => {
  return (
    <Box
      className="content-right"
      sx={{
        backgroundColor: "background.paper",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CommonAuthenticationCode
        title={forgotTranslations.FORGOT_PASSWORD}
        heading={forgotTranslations.FORGET_PASSWORD_TEXT}
        height={"500px"}
      >
        <ForgotForm />
      </CommonAuthenticationCode>
    </Box>
  );
};

ForgotPassword.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
);

ForgotPassword.guestGuard = true;

export default ForgotPassword;
