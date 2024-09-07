import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Typography
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
import MailIcon from '@mui/icons-material/Mail';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DownloadIcon from '@mui/icons-material/Download';
import {
  PermissionItem,
  getCurrentModulePermission,
  mapPermission,
} from "../roles-list/utils";
// import MarkDownModal from "./mark-down-modal";
import { encryptSalesInvoiceId } from "src/utils/utils";
import { getInvoiceHistoryById } from "src/store/apps/invoiceHistory/invoiceHistory";


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
    handleEmailClick,
    handleDownloadClick,
    handlePrint,
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

  const handleView = (id: number | string | undefined) => {
    const encryptedId = encryptSalesInvoiceId(id)
    const editUrl = `/reports/sales/invoice-history/invoice-details/?id=${encryptedId}`;

    router.push(editUrl);
  };
  
  const handleOptionsClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={t("VIEW")}>
          <IconButton
            // disabled={!isViewPermissionEnabled}
             onClick={() => handleView(id)}
          >
            <Icon icon="tabler:eye" fontSize={20} />
          </IconButton>
        </Tooltip>
      <Tooltip title={t("PRINT")}>
        <IconButton
          disabled={!isEditPermissionEnabled}
          onClick={() => handlePrint(id)}
        >
          <Icon icon="tabler:printer" fontSize={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("OPTIONS")}>
          <IconButton
            onClick={handleOptionsClick}
          >
          <Icon icon="tabler:dots-vertical" fontSize={20} />
          </IconButton>
      </Tooltip>
        <Menu
            id="action-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={() => { handleEmailClick(); handleClose(); }}>
              <ListItemIcon>
                  <MailIcon fontSize="small" />
              </ListItemIcon>
                  <Typography variant="inherit">{t("E-MAIL")}</Typography>
            </MenuItem>
            <MenuItem onClick={handleClose}>
            <ListItemIcon>
                <WhatsAppIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{t("WHATSAPP")}</Typography>
            </MenuItem>
            <MenuItem onClick={() => {handleDownloadClick();handleClose();}}>
            <ListItemIcon>
                <DownloadIcon fontSize="small" />
            </ListItemIcon>
              <Typography variant="inherit">{t("DOWNLOAD")}</Typography>
            </MenuItem>
        </Menu>

      {/* <MarkDownModal open={open} handleClose={handleCopy} copyPrice={true} data={row} setOpen={setOpen} /> */}
    </>
  );
};
export default Rowoptions;
