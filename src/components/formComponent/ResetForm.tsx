// ** React Imports
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { ReactNode, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Icon from "src/@core/components/icon";
import { useSettings } from "src/@core/hooks/useSettings";
import BlankLayout from "src/@core/layouts/BlankLayout";
import { textColorBasedOnTheme } from "src/@core/theme/themeConfig";
import { useAuth } from "src/hooks/useAuth";
import { AppDispatch } from "src/store";
import {
  setConfirPassword,
  setEmail,
  setNewpassword,
  setPassword,
  setUserName,
} from "src/store/apps/form/formdataSlice";
import {
  LinkStyled,
  customAuthErrorStyle,
  customAuthInputStyle,
  resetFormSchema,
} from "./componentConfig";

const ResetForm = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { email, token } = router.query;
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const parentDivRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const userDivRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useSettings();
  const savenewpassword = useSelector(
    (state: any) => state.formdataSlice.newpassword
  );
  const saveconfirmpassword = useSelector(
    (state: any) => state.formdataSlice.confirmpassword
  );

  const [visible, setVisible] = useState(true);
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      newpassword: savenewpassword,
      confirmpassword: saveconfirmpassword,
    },
    resolver: yupResolver(resetFormSchema),
  });

  const handleVisibilty = () => {
    setVisible(!visible);
  };

  const handleUserClick = () => {
    if (userDivRef.current) {
      userDivRef.current.style.border = errors.confirmpassword
        ? "2px solid  #EA5455"
        : "2px solid  blue";
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (!email || !token) {
        toast.error("Something Went Wrong, Please check you email again");
        setLoading(false);
        setErrorMsg("Resend Forget Password Email");
        return;
      }

      let checkEmail = String(email);
      let checkToken = String(token);
      auth.resetpassword(
        {
          email: checkEmail,
          password: data?.newpassword,
          token: checkToken,
        },
        setLoading as any,
        setErrorMsg
      );
      clearState();
    } catch (error) {
      toast.error("Something Went Wrong, Please check you email again");
      setLoading(false);
    }
  };

  const handleInputClick = () => {
    if (parentDivRef.current) {
      parentDivRef.current.style.border = errors.newpassword
        ? "2px solid #EA5455"
        : "2px solid blue";
    }
  };

  const clearState = () => {
    dispatch(setUserName(""));
    dispatch(setPassword(""));
    dispatch(setEmail(""));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>{t("NEW_PASSWORD")}*</label>
      <div
        onClick={handleInputClick}
        ref={parentDivRef}
        style={customAuthErrorStyle(!errors.newpassword)}
      >
        <Controller
          name="newpassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type={visible ? "password" : "text"}
              placeholder={t("NEW_PASSWORD") ?? ""}
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
                dispatch(setNewpassword(e.target.value));
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
        />
      </div>
      {errors?.newpassword && (
        // @ts-ignore
        <Typography
          sx={{ marginTop: "4px", fontSize: "10px", color: "#EA5455" }}
        >
          {errors ? (errors?.newpassword?.message as any) : ""}
        </Typography>
      )}

      <Box sx={{ marginTop: "15px" }}>
        <label>{t("CONFIRM_PASSWORD")}*</label>
        <div
          ref={userDivRef}
          style={customAuthErrorStyle(!errors.confirmpassword)}
        >
          <Controller
            name="confirmpassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type={"password"}
                placeholder={t("CONFIRM_PASSWORD") ?? ""}
                style={{
                  outline: "none",
                  border: "none",
                  background: "none",
                  width: "100%",
                  color: textColorBasedOnTheme[settings.mode],
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  return false;
                }}
                onCopy={(e) => {
                  e.preventDefault();
                  return false;
                }}
                onClick={handleUserClick}
                onChange={(e) => {
                  e.stopPropagation();
                  field.onChange(e);
                  dispatch(setConfirPassword(e.target.value)); // Dispatch the action for password change
                }}
              />
            )}
          />
        </div>
        {errors && (
          <Typography
            sx={{ marginTop: "4px", fontSize: "10px", color: "#EA5455" }}
          >
            {t(errors.confirmpassword?.message?.toString() as any)}
          </Typography>
        )}
      </Box>

      {errorMsg && (
        <Box
          sx={{
            mb: 1.75,
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": { mr: 1 },
            }}
          >
            {" "}
            <LinkStyled href="/auth/forgot-password/" sx={{ display: "flex" }}>
              {errorMsg}
            </LinkStyled>
          </Typography>
        </Box>
      )}

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
        // onClick={handleClick}
        disabled={loading}
      >
        {t("SET_NEW_PASSWORD")}
      </Button>
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& svg": { mr: 1 },
        }}
      >
        <LinkStyled
          href="/auth/login/"
          sx={{ display: "flex" }}
          onClick={clearState}
        >
          <Icon fontSize="1.25rem" icon="tabler:chevron-left" />
          <span> {t("BACK_TO_LOGIN")}</span>
        </LinkStyled>
      </Typography>
    </form>
  );
};

ResetForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

ResetForm.guestGuard = true;

export default ResetForm;
