// ** React Imports
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FallbackSpinner from "src/@core/components/spinner";
import BlankLayout from "src/@core/layouts/BlankLayout";
import AppEvent from "src/app/AppEvent";
import CommonAuthenticationCode from "src/components/common/CommonAuthenticationCode";
import ResetForm from "src/components/formComponent/ResetForm";
import { useAuth } from "src/hooks/useAuth";
import { Typography } from "@mui/material";
import Image from "next/image";
import CommonButton from "src/components/common/CommonButton";
import {
  containerBox,
  messageArticleCss,
  resetPasswordInnerBox,
  resetPasswordOuterBox,
  textMessageCss,
} from "src/styles";

const ResetPasswordInvalidLinks = ({
  LinkExpired,
}: {
  LinkExpired: boolean;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const textMessage = LinkExpired
    ? "LINK_EXPIRED_HEADING"
    : "INVALID_LINK_HEADING";

  const messageArticle = LinkExpired
    ? "LINK_EXPIRED_ARTICLE"
    : "INVALID_LINK_ARTICLE";

  const resetLink = LinkExpired ? "/auth/forgot-password" : "/";

  const img = LinkExpired
    ? "/images/invalid-icons/cross_icon.png"
    : "/images/invalid-icons/invalid_icon.png";

  return (
    <>
      {" "}
      <Box sx={resetPasswordOuterBox}>
        <Box sx={resetPasswordInnerBox}>
          <Image
            src={img}
            alt={"invalid link img"}
            width={70}
            height={70}
            role="button"
          />
          <Typography sx={textMessageCss}>{t(textMessage)}</Typography>
          <Typography sx={messageArticleCss}>{t(messageArticle)}</Typography>
          <Box sx={{ marginTop: "20px" }}>
            <CommonButton
              variant="contained"
              label={t("Go Back")}
              handleButton={() => router.push(resetLink)}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

const ResetPassword = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setloading] = useState<boolean>(true);
  const [linkExpired, setLinkExpired] = useState<boolean | null | string>(null);
  const { email } = router.query;
  const { t } = useTranslation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const token = urlParams.get("token");
    if (email && token)
      auth.handleResetPasswordRedirectAuth(
        { token, email },
        setloading as any,
        setLinkExpired as any
      );
    else {
      AppEvent.messageEmit({
        type: "error",
        message: t("INVALID_LINK_MSG"),
      });
    }
  }, []);

  if (loading) return <FallbackSpinner />;

  if (linkExpired)
    return (
      <ResetPasswordInvalidLinks
        LinkExpired={linkExpired === "TOKEN_EXPIRED"}
      />
    );

  return (
    <Box className="content-right" sx={containerBox}>
      <CommonAuthenticationCode
        title={t("RESET_PASSWORD") + " 🔒"}
        heading={`for ${email ?? ""}`}
        height={"600px"}
      >
        <ResetForm />
      </CommonAuthenticationCode>
    </Box>
  );
};

ResetPassword.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
);

ResetPassword.guestGuard = true;

export default ResetPassword;
