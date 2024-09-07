import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from 'src/hooks/useAuth';
import { useRouter } from 'next/router';
import OtpInput from 'react-otp-input';

const useStyles = makeStyles({
    form: {
        display: "flex !important",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    OTP_Box: {
        width: "50px !important",
        height: "48px !important",
        margin: "2px",
        padding: "7px 10px 10px 10px",
        textAlign: "center",
        fontSize: "20px",
        borderRadius:"7px",
        border:"1px solid #DBDADE",
        outline:"none",
        "&:focus":{
            border:"1px solid #2196f3 !important",
            outline:"none"
        },
        "&:focus-visible":{
            border:"2px solid #2196f3 !important",
            outline:"none"
        },
        "&::placeholder":{
            color:"#DBDADE !important"
        }
    },
    error:{
        textAlign:"center",
        marginBottom:"10px",
        color:"red"
    },
    button:{
        textTransform:"capitalize"
    },
    otp_text:{
        marginBottom:"10px",
        fontSize:"15px",
        fontWeight:"600"
    },
    optbox:{
        border:"2px solid #DBDADE",
        height:"50px !important",
        width:"50px !important",
        borderRadius:"6px",
        fontSize:"18px",
        margin:"5px",
        "&::selection": {
            background: "#ffffff !important", /* WebKit/Blink Browsers */
          }

    }
});

const TwoFactorAuthForm = () => {
    const { t } = useTranslation();
    const auth = useAuth();
    const router = useRouter();
    const classes = useStyles();

    const [otp,setOtp] = useState<string>("");

    const [error,setError] = useState({
        show:false,
        message:""
    })

    const handleOTPenter = (value:string) =>{
        setOtp(value);
        if(error?.show){
            setError({
                show:false,
                message:''
            })
        };
    };
    
    const handleSubmit = async (e:any) => {
        e.preventDefault()
        if (otp?.length !== 6) {
            setError({
                show: true,
                message: "Please enter 6 digits OTP"
            });

            return null
        }

        const payload:any = {
            "mobileNumber": auth?.user?.mobileNumber,
            "token": otp
        };

        auth.twoFactorAuth(payload,(message:any="")=>{
            setError({
                show: true,
                message: t(`${message}`)
            });
        })
    };

    const handleResendOTP = async () => {
        const payload: any = {
            "mobileNumber": auth?.user?.mobileNumber,
        };

        auth.resendOTP(payload);
    };

    console.log(error)

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                {error?.show && (<Typography variant='subtitle1' className={classes.error}>
                    {error?.message}
                </Typography>)}
                <Typography className={classes.otp_text} variant='subtitle1'>{t("TYPE_SIX_DIGIT_CODE")}</Typography>
                <div className={classes.form}>
                    <OtpInput
                        value={otp}
                        onChange={handleOTPenter}
                        numInputs={6}
                        placeholder='0'
                        renderInput={(props) => <input {...props} />}
                        inputType='number'
                        inputStyle={classes.optbox}
                    />
                </div>
                <Button
                type="submit"
                    className={classes.button}
                    
                    sx={{ mt: 5 }}
                    size='large'
                    fullWidth
                    variant='contained'>
                    {t("VERIFY_MY_ACOUNT")}
                </Button>
                <Typography sx={{ mt: 2, textAlign: "center" }}>
                    {t("RESEND_OTP_CONTENT")}
                    <Button onClick={()=>handleResendOTP()} className={classes.button} sx={{ px: 1 }} variant="text">
                        {t("RESEND")}
                    </Button>
                </Typography>
            </form>
        </>
    )
}

export default TwoFactorAuthForm