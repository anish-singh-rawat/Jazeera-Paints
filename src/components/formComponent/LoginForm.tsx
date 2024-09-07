import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSettings } from "src/@core/hooks/useSettings";
import BlankLayout from "src/@core/layouts/BlankLayout";
import { textColorBasedOnTheme } from "src/@core/theme/themeConfig";
import { useAuth } from "src/hooks/useAuth";
import { AppDispatch, RootState } from "src/store";
import { setPassword, setUserName } from "src/store/apps/form/formdataSlice";
import {
  LinkStyled,
  customAuthErrorStyle,
  customAuthInputStyle,
  loginFormSchema,
} from "./componentConfig";
import AppEvent from "src/app/AppEvent";

interface FormData {
  userName: string;
  password: string;
}

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const parentDivRef = useRef<HTMLDivElement | null>(null);
  const userDivRef = useRef<HTMLDivElement | null>(null);
  const userName = useSelector((state: any) => state.formdataSlice.userName);
  const { settings } = useSettings();

  const savepassword = useSelector(
    (state: RootState) => state?.formdataSlice?.password
  );

  const [visible, setVisible] = useState(true);
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: userName,
      password: savepassword,
    },
    mode: "onBlur",
    resolver: yupResolver(loginFormSchema),
  });

  useEffect(() => {
    clearState();
  }, [])

  const handleVisibilty = () => {
    setVisible(!visible);
  };
  const onSubmit = (data: FormData) => {
    setLoading(true);
    const { userName, password } = data;
    auth.login({ userName, password, rememberMe }, (e) => {
      setError("userName", {
        type: "manual",
        message: "",
      });
      setError("password", {
        type: "manual",
        message: "",
      });
      setLoading(false);
    });
  };

  const handleInputClick = () => {
    if (parentDivRef.current) {
      parentDivRef.current.style.border = "2px solid  #3586C7";
    }
  };

  const handleUserClick = () => {
    if (userDivRef.current) {
      userDivRef.current.style.border = "2px solid  #3586C7";
    }
  };

  const clearState = () => {
    dispatch(setUserName(""));
    dispatch(setPassword(""));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <>
        <Box>
          <label htmlFor="userName">{t("USERNAME")}*</label>
          <div ref={userDivRef} style={customAuthErrorStyle(!errors.userName)}>
            <Controller
              name="userName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type={"text"}
                  autoComplete="off"
                  placeholder={t("USERNAME") ?? ""}
                  style={{
                    outline: "none",
                    border: "none",
                    background: "none",
                    width: "100%",
                    color: textColorBasedOnTheme[settings.mode],
                  }}
                  onClick={handleUserClick}
                  onChange={(e) => {
                    field.onChange(e);
                    dispatch(setUserName(e.target.value));
                  }}
                />
              )}
            />
          </div>
          {errors && (
            <Typography
              sx={{ marginTop: "4px", fontSize: "10px", color: "#EA5455" }}
            >
              {t(errors.userName?.message?.toString() as any)}
            </Typography>
          )}
        </Box>

        <Box sx={{ marginTop: "10px" }}>
          <label htmlFor="password">{t("PASSWORD")}*</label>
          <div
            ref={parentDivRef}
            style={customAuthErrorStyle(!errors.password)}
          >
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type={visible ? "password" : "text"}
                  placeholder={t("PASSWORD") ?? ""}
                  autoComplete="off"
                  style={customAuthInputStyle(settings.mode)}
                  onPaste={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onCopy={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onClick={handleInputClick}
                  onChange={(e) => {
                    field.onChange(e);
                    dispatch(setPassword(e.target.value));
                  }}
                />
              )}
            />

            <Icon
              icon={!visible ? "ph:eye-bold" : "basil:eye-closed-solid"}
              width={18}
              height={18}
              color="#A5A3AE"
              onClick={handleVisibilty}
              style={{ cursor: "pointer" }}
            />
          </div>
          {errors && (
            <Typography
              sx={{ marginTop: "4px", fontSize: "10px", color: "#EA5455" }}
            >
              {t(errors.password?.message?.toString() as any)}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            mb: 1.75,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FormControlLabel
            label={t("REMEMBER_ME")}
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
          />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <LinkStyled href="/auth/forgot-password" onClick={clearState}>
              {t("FORGET_PASSWORD")}
            </LinkStyled>
          </div>
        </Box>
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ mb: 4 }}
          disabled={loading}
        >
          Sign in
        </Button>
      </>
    </form>
  );
};

LoginForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

LoginForm.guestGuard = true;

export default LoginForm;
