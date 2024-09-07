import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "src/@core/components/icon";
import AppEvent from "src/app/AppEvent";
import { RolePermission } from "src/context/types";
import { useAuth } from "src/hooks/useAuth";
import {
    PermissionItem,
    getCurrentModulePermission,
    mapPermission,
} from "src/components/roles-list/utils";

const useStyles = makeStyles({
    dialog: {
        "& .MuiDialogTitle": {
            fontSize: "18px",
            color: "red",
        },

        "& .MuiDialogContent-root": {
            color: "#6f6b7d",
            fontSize: "16px",
        },

        "& .MuiPaper-elevation": {
            width: "500px",
            height: "226px",
            padding: "1rem",
        },

        "& .MuiDialogActions-root ": {
            padding: 0,
        },
    },
    formAction: {
        // padding: "0 3rem"
        gap: "1rem",
    },
    formActionSave: {
        width: "100px",
        height: "38px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        textTransform: "unset",
    },
    formActionCancel: {
        width: "100px",
        height: "38px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        textTransform: "unset",
        background: "#f1f1f2",
        color: "#6f6b7d",

        "&.MuiButton-root:hover": {
            background: "#f1f1f2",
            color: "#6f6b7d",
        },
        "&.MuiButton-root": {
            background: "#f1f1f2",
            color: "#6f6b7d",
        },
    },
});
const Rowoptions = (props: any) => {
    const {
        id,
        row,
        handleEditPage,
        deleteIcon = true,
        editIcon = true,
        handleDeleteAttribute
    } = props;

    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState("")
    const classes = useStyles();
    const { t } = useTranslation();

    // Delete  row
    const handleDelete = (id: any) => {
        setDeleteDialog(true);
        setDeleteId(id)
    };

    const router = useRouter();
    const auth = useAuth();
    const currentModuleName = router.route.substring(1).split("/")[0];

    const gettingPermission: RolePermission[] = auth.user
        ? auth?.user.role.rolePermissions
        : [];

    const permission: PermissionItem[] = mapPermission(gettingPermission);
    const currentModulePermission = getCurrentModulePermission(
        permission,
        currentModuleName
    );

    const isEditPermissionEnabled =
        currentModulePermission && currentModulePermission?.permissionType?.Edit;
    const isDeletePermissionEnabled =
        currentModulePermission && currentModulePermission?.permissionType?.Delete;

    let res: any = {};

    return (
        <>
            <Dialog open={deleteDialog} className={classes.dialog}>
                <DialogTitle color="red">{t("DELETE")}</DialogTitle>
                <DialogContent>{t(`DELETE_CONFIRM`)}</DialogContent>
                <DialogActions className={classes.formAction}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setDeleteId('')
                            setDeleteDialog(false)
                        }}
                        className={classes.formActionCancel}
                    >
                        {t("CANCEL")}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        className={classes.formActionSave}
                        onClick={async () => {
                            await handleDeleteAttribute(deleteId)
                            setDeleteId('')
                            setDeleteDialog(false)
                        }}
                    >
                        {t("DELETE")}
                    </Button>
                </DialogActions>
            </Dialog>
            {editIcon && (
                <Tooltip title={t("EDIT")}>
                    <IconButton
                        disabled={!isEditPermissionEnabled}
                        onClick={() => {
                            handleEditPage(row);
                        }}
                    >
                        <Icon icon="tabler:edit" fontSize={20} />
                    </IconButton>
                </Tooltip>
            )}
            {deleteIcon && (
                <Tooltip title={t("DELETE")}>
                    <IconButton
                        disabled={!isDeletePermissionEnabled}
                        size="small"
                        onClick={() => {
                            handleDelete(id);
                        }}
                    >
                        <Icon icon="tabler:trash" fontSize={20} />
                    </IconButton>
                </Tooltip>
            )}
        </>
    );
};
export default Rowoptions;
