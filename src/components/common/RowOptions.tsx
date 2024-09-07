import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState, MouseEvent } from "react";
import Icon from "src/@core/components/icon";
import { useTranslation } from "react-i18next";

const RowOptions = (props: any) => {
  const { id, addServicesOpen, modalName } = props;
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
    addServicesOpen(modalName);
  };

  const handleRowOptionsCloseEdit = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {};

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <Icon icon="tabler:dots-vertical" />
      </IconButton>
      <Menu
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
        PaperProps={{ style: { minWidth: "12rem" } }}
      >
        <MenuItem sx={{ "& svg": { mr: 2 } }} onClick={handleRowOptionsClose}>
          <Icon icon="tabler:square-plus" fontSize={20} />
          {t("ADD")}
        </MenuItem>
        <MenuItem
          onClick={handleRowOptionsCloseEdit}
          sx={{ "& svg": { mr: 2 } }}
        >
          <Icon icon="tabler:download" fontSize={20} />
          {t("IMPORT")}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:upload" fontSize={20} />
          {t("EXPORT")}
        </MenuItem>
      </Menu>
    </>
  );
};

export default RowOptions;
