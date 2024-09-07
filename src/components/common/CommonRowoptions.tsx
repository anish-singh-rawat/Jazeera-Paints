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
import {
  PermissionItem,
  getCurrentModulePermission,
  mapPermission,
} from "../roles-list/utils";

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
const CommonRowoptions = (props: any) => {
  const {
    id,
    entityType,
    row,
    selectedRecord,
    handleEditPage,
    item,
    setItem,
    handleNavigation,
    deleteCall,
    deleteIcon = true,
    entityCall,
    viewStoreDetails,
    viewWeightDetails,
    viewIcon = true,
    editIcon = true,
    setSelectedUser = () => {},
    setSelectedOption,
    reduxAction = true,
    storeicon = false,
    switchicon = false,
    WeightIcon = false,
  } = props;

  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

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

  let res: any = {};

 

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
              reduxAction
                ? (res = await dispatch(
                    entityCall
                      ? deleteCall({ id: id, entityType: entityType })
                      : deleteCall({ id: id })
                  ))
                : deleteCall({ id: id });

              setDeleteDialog(false);
            }}
          >
            {t("DELETE")}
          </Button>
        </DialogActions>
      </Dialog>
      {switchicon && (
        <Tooltip title={t("Transaction Histroy")}>
          <IconButton
            // disabled={!isEditPermissionEnabled || switchicon}
            onClick={async () => {
              handleNavigation(id, row);
            }}
          >
            <Icon icon="tabler:switch-horizontal" fontSize={20} />
          </IconButton>
        </Tooltip>
      )}

      {storeicon && (
        <Tooltip title={t("STORE")}>
          <IconButton
            // disabled={!isEditPermissionEnabled || storeicon}
            onClick={async () => {
              // console.log(id, row, "--------------------------------");

              viewStoreDetails(id, row);
              if (entityCall) {
                const data = await dispatch(
                  entityCall(
                    entityCall ? { id: id, entityType: entityType } : { id: id }
                  )
                );

                setItem({ ...item, ...data.payload });
                setSelectedUser({ ...item, ...data.payload });
                setAnchorEl(null);
                setSelectedOption && setSelectedOption(data?.fieldTypes);
              }
            }}
          >
            <Icon icon="tabler:building-store" fontSize={20} />
          </IconButton>
        </Tooltip>
      )}
      {WeightIcon && (
        <Tooltip title={t("WEIGHT")}>
          <IconButton
            // disabled={!isEditPermissionEnabled || WeightIcon }
            onClick={async () => {
              viewWeightDetails(id, row);
              if (entityCall) {
                const data = await dispatch(
                  entityCall(
                    entityCall ? { id: id, entityType: entityType } : { id: id }
                  )
                );

                setItem({ ...item, ...data.payload });
                setSelectedUser({ ...item, ...data.payload });
                setAnchorEl(null);
                setSelectedOption && setSelectedOption(data?.fieldTypes);
              }
            }}
          >
            <Icon icon="tabler:weight" fontSize={20} />
          </IconButton>
        </Tooltip>
      )}
      {viewIcon && (
        <Tooltip title={t("VIEW")}>
          <IconButton
            // onClick={() => {
            //   setAnchorEl(null);
            //   return selectedRecord(row);
            // }}

            onClick={async () => {
              if (entityCall) {
                const data = await dispatch(
                  entityCall(
                    entityCall ? { id: id, entityType: entityType } : { id: id }
                  )
                );
                selectedRecord({ ...item, ...data.payload });
                setAnchorEl(null);
                setSelectedOption && setSelectedOption(data?.fieldTypes);
              }
            }}
          >
            <Icon icon="tabler:eye" fontSize={20} />
          </IconButton>
        </Tooltip>
      )}
      {editIcon && (
        <Tooltip title={t("EDIT")}>
          <IconButton
            disabled={!isEditPermissionEnabled}
            onClick={async () => {
              handleEditPage(id, row);
              if (entityCall) {
                const data = await dispatch(
                  entityCall(
                    entityCall ? { id: id, entityType: entityType } : { id: id }
                  )
                );

                setItem({ ...item, ...data.payload });
                setSelectedUser({ ...item, ...data.payload });
                setAnchorEl(null);
                setSelectedOption && setSelectedOption(data?.fieldTypes);
              }
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
              setAnchorEl(null);
              handleDelete(id);
              handleRowOptionsClick;
            }}
          >
            <Icon icon="tabler:trash" fontSize={20} />
          </IconButton>
        </Tooltip>
      )}
      {/* <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      > */}
      {/* {view && (
          <MenuItem
            sx={{ "& svg": { mr: 2 } }}
            onClick={() => {
              setAnchorEl(null);
              return selectedRecord(row);
            }}
          >
            <Icon icon="tabler:eye" fontSize={20} />
            {t("VIEW")}
          </MenuItem>
        )}
        <MenuItem
          onClick={async () => {
            const item = await dispatch(entityCall({ id: id }));
            setItem({ ...item, ...item.payload });
            setAnchorEl(null);
            handleEditPage();
          }}
          sx={{ "& svg": { mr: 2 } }}
        >
          <Icon icon="tabler:edit" fontSize={20} />
          {t("EDIT")}
        </MenuItem> */}
      {/* <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleDelete(id);
          }}
          sx={{ "& svg": { mr: 2 } }}
        >
          <Icon icon="tabler:trash" fontSize={20} />
          {t("DELETE")}
        </MenuItem>
      </Menu> */}
    </>
  );
};
export default CommonRowoptions;
