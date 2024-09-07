import React, { ReactNode } from 'react';
import BlankLayout from "../../../@core/layouts/BlankLayout";
import CommonAuthenticationCode from "../../../components/common/CommonAuthenticationCode";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import TwoFactorAuthForm from 'src/components/formComponent/TwoFactorAuth';
import { useAuth } from 'src/hooks/useAuth';


const TwoFactorAuth = () => {
    const { t } = useTranslation();
    const auth = useAuth()

    const hideMobileNumber = (number:string)=>{
        if(number?.length > 5){
            return `******${number.slice(6, number.length)}`
        }
        return ""
    }
    
    return (
        <Box
            className="content-right"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CommonAuthenticationCode
                title={t("TWO_FACTOR_VERIFICATION")}
                heading={`${t("TWO_FACTOR_HEADING")} ${hideMobileNumber(auth?.user?.mobileNumber as string)}`}
                height={"600px"}
                fontsize={"16px"}
            >
                <TwoFactorAuthForm />
            </CommonAuthenticationCode>
        </Box>
    )
}

TwoFactorAuth.getLayout = (page: ReactNode) => (
    <BlankLayout>{page}</BlankLayout>
);

TwoFactorAuth.guestGuard = true;

export default TwoFactorAuth
