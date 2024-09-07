// ** React Imports
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ReactNode, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Icon from "src/@core/components/icon";
import { useSettings } from "src/@core/hooks/useSettings";
import BlankLayout from "src/@core/layouts/BlankLayout";
import { useAuth } from "src/hooks/useAuth";
import { AppDispatch, RootState } from "src/store";
import { setEmail } from "src/store/apps/form/formdataSlice";
import {
  LinkStyled,
  customAuthErrorStyle,
  customAuthInputStyle,
  forgetFormSchema,
} from "./componentConfig";

interface FormData {
  email: string;
}

const ForgotForm = () => {
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();
  const userDivRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const savepassword = useSelector(
    (state: RootState) => state.formdataSlice.email
  );

  const auth = useAuth();
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: savepassword,
    },
    resolver: yupResolver(forgetFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    auth.forgetPassword(data, (d: boolean) => {  
      setError("email", {
        type: "manual",
        message: "",
      });
      setLoading(d);
    }); 
  };

  const handleUserClick = () => {
    if (userDivRef.current) {
      userDivRef.current.style.border = "2px solid  #3586C7";
    }
  };
  const clearState = () => {
    dispatch(setEmail(""));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <Box>
          <label>{t("EMAIL")}*</label>
          <div ref={userDivRef} style={customAuthErrorStyle(!errors.email)}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type={"text"}
                  placeholder={t("EMAIL") ?? ""}
                  style={customAuthInputStyle(settings.mode)}
                  onClick={handleUserClick}
                  onChange={(e) => {
                    field.onChange(e);
                    dispatch(setEmail(e.target.value));
                  }}
                />
              )}
            />
          </div>
          {errors && (
            <Typography
              sx={{ marginTop: "4px", fontSize: "10px", color: "#EA5455" }}
            >
              {t(errors.email?.message?.toString() as any)}
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
        />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ mb: 4 }}
          disabled={loading}
        >
          {t("SEND_RESET_LINK")}
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
            href="/auth/login"
            sx={{ display: "flex" }}
            onClick={clearState}
          >
            <Icon fontSize="1.25rem" icon="tabler:chevron-left" />
            <span>{t("BACK_TO_LOGIN")}</span>
          </LinkStyled>
        </Typography>
      </form>
    </>
  );
};

ForgotForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

ForgotForm.guestGuard = true;

export default ForgotForm;
