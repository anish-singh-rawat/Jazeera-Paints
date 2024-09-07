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
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Icon from "src/@core/components/icon";
import AppEvent from "src/app/AppEvent";
import { RolePermission } from "src/context/types";
import { useAuth } from "src/hooks/useAuth";
import { AppDispatch } from "src/store";
import { clearCheckedItems, clearEverything } from "src/store/apps/product-items";
import {
  PermissionItem,
  getCurrentModulePermission,
  mapPermission,
} from "../roles-list/utils";
import MarkDownModal from "./mark-down-modal";
import { encryptPriceId } from "src/utils/utils";


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
    entityType,
    row,
    selectedRecord,
    handleEditPage,
    item,
    setItem,
    deleteCall,
    deleteIcon = true,
    entityCall,
    viewIcon = true,
    setSelectedUser = () => { },
    setSelectedOption,
  } = props;

  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);
  const [open, setOpen] = useState(false);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  // Delete  row
  const handleDelete = (id: any) => {
    setDeleteDialog(true);
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
  const isCreatePermissionEnabled = currentModulePermission && currentModulePermission?.permissionType?.Create

  let res: any = {};
  const handleCopy = () => {
    setOpen(false);
  };

  //   const handClicks = () =>{
  //     <Link href={`roles/create-role/?id=${item.id}&isEdit=true`}>
  //                   <Button variant="text" sx={{ padding: 1 }}>
  //                     {t("VIEW_PERMISSIONS")}
  //                   </Button>
  //                 </Link>
  // }

  const handleEdit = (id: number | string | undefined) => {
    dispatch(clearEverything())
    const encryptedId = encryptPriceId(id)
    const editUrl = `/pricelist/create-price/?id=${encryptedId}&isEdit=true`;

    router.push(editUrl);
  };



  return (
    <>
      <Dialog open={deleteDialog} className={classes.dialog}>
        <DialogTitle color="red">{t("DELETE")}</DialogTitle>
        <DialogContent>{t(`DELETE_CONFIRM`)}</DialogContent>
        <DialogActions className={classes.formAction}>
          <Button
            variant="contained"
            onClick={() => setDeleteDialog(false)}
            className={classes.formActionCancel}
          >
            {t("CANCEL")}
          </Button>
          <Button
            variant="contained"
            color="error"
            className={classes.formActionSave}
            onClick={async () => {
              res = await dispatch(
                entityCall
                  ? deleteCall({ id: id, entityType: entityType })
                  : deleteCall({ id: id })
              );
              setDeleteDialog(false);
            }}
          >
            {t("DELETE")}
          </Button>
        </DialogActions>
      </Dialog>

      <Tooltip title={t("COPY")}>
        <IconButton onClick={() => setOpen(true)} disabled={!isCreatePermissionEnabled}>
          <Icon icon="tabler:copy" fontSize={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("EDIT")}>
        <IconButton
          disabled={!isEditPermissionEnabled}
          onClick={() => handleEdit(id)}
        >
          <Icon icon="tabler:edit" fontSize={20} />
        </IconButton>
      </Tooltip>
      {deleteIcon && (
        <Tooltip title={t("DELETE")}>
          <IconButton
            disabled={!isDeletePermissionEnabled}
            size="small"
            onClick={() => {
              setAnchorEl(null);
              handleDelete(id);
              handleRowOptionsClick;
            }}
          >
            <Icon icon="tabler:trash" fontSize={20} />
          </IconButton>
        </Tooltip>
      )}

      <MarkDownModal open={open} handleClose={handleCopy} copyPrice={true} data={row} setOpen={setOpen} />
    </>
  );
};
export default Rowoptions;
