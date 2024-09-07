import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import FormHelperText from '@mui/material/FormHelperText';
import { useRouter } from 'next/router';
import { axiosInstance as axios } from "src/configs/axios";
import { useAuth } from "src/hooks/useAuth";
import AppEvent from 'src/app/AppEvent';

const useStyles = makeStyles({
    label: {
        margin: "15px 0px 5px 2px"
    },
    heading: {
        marginBottom: "15px",
    },
    heading_test: {
        color: "#605D62"
    }

});

interface PasswordTypes {
    password: string | boolean,
    confirmPassword: string | boolean
}

const CreatePasswordForm = () => {
    const router = useRouter();
    const auth = useAuth()
    const { t } = useTranslation();
    const classes = useStyles();

    const [showPassword, setShowPassword] = useState<PasswordTypes>({
        password: false,
        confirmPassword: false
    })

    const schema = yup.object().shape({
        password: yup.string().min(8).max(12).required("New Password Required")
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Password must contain at least 8 and max 12 characters, one uppercase, one number and one special case character"
            ),
        confirmPassword: yup.string().required("Please re-type your password")
            .oneOf([yup.ref("password")], "Passwords does not match"),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        },
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any, event: any) => {

        const payload: any = {
            "id": auth?.user?.id,
            "mobileNumber": auth?.user?.mobileNumber,
            "password": data?.confirmPassword,
        };

        auth.createPassword(payload, console.log);
    };

    const onErrors = (data: any) => {
        console.log(data, "errors");
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                <div className={classes.label}>
                    <div>{t("NEW_PASSWORD")}*</div>
                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        <Controller
                            name='password'
                            control={control}
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        size="medium"
                                        name="password"
                                        fullWidth
                                        value={value}
                                        onChange={(e: any) => onChange(e)}
                                        onCopy={(e) => e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                        error={errors?.password as any}
                                        placeholder={t("NEW_PASSWORD") as string}
                                        type={showPassword?.password ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => {
                                                        setShowPassword({
                                                            ...showPassword,
                                                            password: !showPassword.password
                                                        })
                                                    }}
                                                    edge="end"
                                                >
                                                    {showPassword?.password ? <Icon icon="tabler:eye" fontSize={20} /> : <Icon icon="tabler:eye-off" fontSize={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                )
                            }}
                        />
                        {(errors["password"]) && (
                            <FormHelperText
                                sx={{ color: "red", mx: 0, fontSize: "0.75rem" }}
                                id="validation-schema-first-name"
                            >
                                {t(errors["password"]?.message || "REQUIRED")}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <div>{t("CONFIRM_PASSWORD")}*</div>
                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        <Controller
                            name='confirmPassword'
                            control={control}
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        size="medium"
                                        name="confirmPassword"
                                        fullWidth
                                        value={value}
                                        onChange={(e: any) => onChange(e)}
                                        onCopy={(e) => e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                        error={errors?.confirmPassword as any}
                                        placeholder={t("CONFIRM_PASSWORD") as string}
                                        type={showPassword?.confirmPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => {
                                                        setShowPassword({
                                                            ...showPassword,
                                                            confirmPassword: !showPassword.confirmPassword
                                                        })
                                                    }}
                                                    edge="end"
                                                >
                                                    {showPassword?.confirmPassword ? <Icon icon="tabler:eye" fontSize={20} /> : <Icon icon="tabler:eye-off" fontSize={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                )
                            }}
                        />
                        {(errors["confirmPassword"]) && (
                            <FormHelperText
                                sx={{ color: "red", mx: 0, fontSize: "0.75rem" }}
                                id="validation-schema-first-name"
                            >
                                {t(errors["confirmPassword"]?.message || "REQUIRED")}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <Button sx={{ mt: 5, textTransform: "capitalize" }} fullWidth size='large' variant="contained" type='submit'>
                        {t("SUBMIT")}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default CreatePasswordForm