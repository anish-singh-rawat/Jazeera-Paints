// ** React Imports
import Box from "@mui/material/Box";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import BlankLayout from "src/@core/layouts/BlankLayout";
import CommonAuthenticationCode from "src/components/common/CommonAuthenticationCode";
import LoginForm from "src/components/formComponent/LoginForm";
import { loginTranslations } from "src/constants/login";

//invalidMessage
import useTranslations from "src/hooks/useTranslations";
import { ROOT_BASE_API } from "src/store/apps";
//import {cross_icon} from "/images/invalid-icons/cross_icon.png"

const LoginPage = () => {
  const { t } = useTranslation();
  //invalidMessage
  let invalidlink = true;

  return (
    <>
      <Box
        className="content-right"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CommonAuthenticationCode
          title={t(loginTranslations.WELCOME_TO_REVEST)}
          heading={t(loginTranslations.SINGIN_TEXT)}
          height={"600px"}
        >
          <LoginForm />
        </CommonAuthenticationCode>
      </Box>
    </>
  );
};

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

LoginPage.guestGuard = true;

export default LoginPage;

