import React, { ReactNode } from 'react';
import BlankLayout from "../../../@core/layouts/BlankLayout";
import CommonAuthenticationCode from "../../../components/common/CommonAuthenticationCode";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import CreatePasswordForm from '../../../components/formComponent/CreatePassword'


const CreatePassword = () => {
    const { t } = useTranslation();
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
                title={`${t("CREATE")} ${t("PASSWORD")}` as string}
                heading={""}
                height={"600px"}
            >
                <CreatePasswordForm />
            </CommonAuthenticationCode>
        </Box>
    )
}

CreatePassword.getLayout = (page: ReactNode) => (
    <BlankLayout>{page}</BlankLayout>
);

CreatePassword.guestGuard = true;

export default CreatePassword
