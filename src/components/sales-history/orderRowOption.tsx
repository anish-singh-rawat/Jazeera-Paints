import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Icon from "src/@core/components/icon";
import { RolePermission } from "src/context/types";
import { useAuth } from "src/hooks/useAuth";
import { AppDispatch } from "src/store";
import MailIcon from "@mui/icons-material/Mail";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DownloadIcon from "@mui/icons-material/Download";
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
const RowOptions = (props: any) => {
  const { id, handleEmailClick, handleDownloadClick, handlePrint } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const auth = useAuth();
  // const currentModuleName = router.route.substring(1).split("/")[0];

  // const gettingPermission: RolePermission[] = auth.user
  //   ? auth?.user.role.rolePermissions
  //   : [];

  // let res: any = {};

  const handleView = (id: number | string | undefined) => {
    const encryptedId = encryptSalesInvoiceId(id);
    const editUrl = `/reports/sales/order-history/order-details/?id=${encryptedId}`;

    router.push(editUrl);
  };

  const handleOptionsClick = (event: any) => {
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
        // onClick={() => handlePrint(id)}
        >
          <Icon icon="tabler:printer" fontSize={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("OPTIONS")}>
        <IconButton onClick={handleOptionsClick}>
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
        <MenuItem
        // onClick={() => { handleEmailClick(); handleClose(); }}
        >
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
        <MenuItem
        // onClick={() => {
        //   handleDownloadClick();
        //   handleClose();
        // }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">{t("DOWNLOAD")}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
export default RowOptions;
