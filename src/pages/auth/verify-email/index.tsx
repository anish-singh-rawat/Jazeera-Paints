// ** React Imports
import { useState, ReactNode } from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonAuthenticationCode from "src/components/common/CommonAuthenticationCode";
import { useAuth } from "src/hooks/useAuth";
import BlankLayout from "src/@core/layouts/BlankLayout";

import { useRouter } from "next/router";

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
});

const defaultValues = {
  password: "admin",
  email: "admin@vuexy.com",
};

interface FormData {
  email: string;
  password: string;
}

const VerifyEmail = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const router = useRouter();

  const handleClick = () => {
    // Navigate to a different page
    router.push("/verify-otp");
  };

  const auth = useAuth();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    // const { userName, password } = data;
    // auth.login({ userName, password, rememberMe }, () => {
    //   setError("userName", {
    //     type: "manual",
    //     message: "Email or Password is invalid",
    //   });
    // });
  };

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
        title={"Verify your email ✉️"}
        heading={
          "Account activation link sent to your email address hello@example.com Please follow the link inside to continue"
        }
        height={"500px"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              mb: 1.75,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          ></Box>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mb: 4 }}
            onClick={handleClick}
          >
            Skip for now
          </Button>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": { mr: 1 },
            }}
          >
            Didn't get the mail
            <LinkStyled href="/login" sx={{ display: "flex" }}>
              ?<span> Resend</span>
            </LinkStyled>
          </Typography>
        </form>
      </CommonAuthenticationCode>
    </Box>
  );
};

VerifyEmail.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

VerifyEmail.guestGuard = true;

export default VerifyEmail;
