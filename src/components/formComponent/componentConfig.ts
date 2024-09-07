import { styled } from "@mui/material/styles";
import Link from "next/link";
import { Mode } from "src/@core/layouts/types";
import { textColorBasedOnTheme } from "src/@core/theme/themeConfig";
import * as yup from "yup";

export const customAuthInputStyle = (mode: Mode): React.CSSProperties => {
    return {
        outline: "none",
        border: "none",
        background: "none",
        width: "100%",
        color: textColorBasedOnTheme[mode],
    }
}

export const customAuthErrorStyle = (isError: boolean): React.CSSProperties => {
    const errorColor = !isError ? "#EA5455" : "#DADBDE"
    return {
        border: `1px solid ${errorColor}`,
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
    }
}

export const LinkStyled = styled(Link)(({ theme }) => ({
    fontSize: "0.875rem",
    textDecoration: "none",
    color: theme.palette.primary.main,
}));

export const forgetFormSchema = yup.object().shape({
    email: yup
        .string()
        .email("ENTER_VALID_EMAIL")
        .required("FORGET_EMAIL_REQUIRED"),
});

export const loginFormSchema = yup.object().shape({
    userName: yup.string().required("USERNAME_LOGIN_REQUIRED"),
    password: yup
        .string()
        .required("PASSWORD_LOGIN_REQUIRED")
        .min(5, "PASSWORD_POLICY_MISMATCH"),
});

export const resetFormSchema = yup.object().shape({
    newpassword: yup
        .string()
        .min(8, "PASSWORD_POLICY_MISMATCH")
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/,
            "NEW_PASSWORD_CREATION_POLICY_MISMATCH"
        )
        .required("PASSWORD_POLICY_MISMATCH"),
    confirmpassword: yup
        .string()
        .oneOf([yup.ref("newpassword"), null], "PASSWORD_MISMATCH")
        .required("PASSWORD_POLICY_MISMATCH"),
});