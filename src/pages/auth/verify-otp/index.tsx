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
//import { MuiOtpInput } from "mui-one-time-password-input";
import OtpInput from "react-otp-input";
import { TextField } from "@mui/material";

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

const VerifyOtp = () => {
  const [otp, setOtp] = useState<string>("");
  const otpInputStyle = {
    display: "flex",
    justifyContent: "space-between",
  };

  const inputStyle = {
    width: "40px",
    height: "40px",
    fontSize: "20px",
    textAlign: "center",
    border: "2px solid #ccc",
    borderRadius: "4px",
    marginRight: "5px",
  };

  const separatorStyle = {
    fontSize: "20px",
    margin: "0 5px",
    display: "none",
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

  const onSubmit = (data: FormData) => {
    const { email, password } = data;
    // auth.login({ email, password }, () => {
    //   setError("email", {
    //     type: "manual",
    //     message: "Email or Password is invalid",
    //   });
    // });
  };
  const handleChange = (newValue: string) => {
    setOtp(newValue);
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
        title={"Two-Step Verification 💬"}
        heading={
          "Enter your email, and we'll send you instructions to reset your password"
        }
        height={"550px"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography
              sx={{ fontWeight: "600", fontSize: "15px", marginBottom: "5px" }}
            >
              Type your 6 digit security code
            </Typography>
            {/* <MuiOtpInput value={otp} onChange={handleChange} length={6} />
             */}
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span style={separatorStyle}>-</span>}
              renderInput={(props, index) => (
                <input {...props} style={inputStyle as any} key={index} />
              )}
              containerStyle={otpInputStyle} // Apply the style to the container
            />
          </Box>

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
          >
            Verify my account
          </Button>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": { mr: 1 },
            }}
          >
            Didn't get the code?
            <LinkStyled href="/login" sx={{ display: "flex" }}>
              <span>Resend</span>
            </LinkStyled>
          </Typography>
        </form>
      </CommonAuthenticationCode>
    </Box>
  );
};

VerifyOtp.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

VerifyOtp.guestGuard = true;

export default VerifyOtp;
