import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import {
  userDelete,
  userGetById,
} from "src/store/apps/userCreation/userCreation";
import { ProductsGroupDataTableType } from "src/types/forms/productGroupTypes";
import GridCustomExport from "src/components/export/GridCustomExport";

const UserMasterDataTable = (props: any) => {
  const { data, handleEditPage, item, setUserItem, selectedRecord, isLoading } =
    props;

  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [show, setShow] = useState<boolean>(false);
  const [stores, setStores] = useState<any>([]);
  const theme = useTheme();
  interface UserStatusType {
    [key: string]: ThemeColor;
  }

  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

  const getStoresTag = (row: any) => {
    let text = "";
    row?.forEach((item: any) => {
      if (item?.terminals && item?.store) return (text = "Stores & Terminals");
      if (item?.store) return (text = "Stores");
      if (item?.terminals) return (text = "Terminals");
    });

    return text;
  };

  const handleStoreTerminals = (data: any) => {
    setShow(true);
    setStores(data);
  };

  const columns: any = [
    {
      field: "id",
      headerName: t("ID"),
    },
    {
      field: "mobileNumber",
      minWidth: 120,
      headerName: t("MOBILE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.mobileNumber}`}</Typography>;
      },
      valueGetter: ({ row }: any) => `${row?.mobileNumber}`,
    },
    {
      field: "email",
      minWidth: 120,
      headerName: t("EMAIL"),
      flex: 1,
      renderCell: ({ row }: any) => (
        <Tooltip placement="bottom" title={row.email} arrow>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="table-cell-trucate"
          >
            {row?.email}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "store&Terminal",
      minWidth: 120,
      headerName: t("STORE_TERMINALS"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Button
            variant="text"
            onClick={() => handleStoreTerminals(row?.usersStoreTerminalMapping)}
          >
            {getStoresTag(row?.usersStoreTerminalMapping)}
          </Button>
        );
      },
      valueGetter: ({ row }: any) =>
        getStoresTag(row?.usersStoreTerminalMapping),
    },
    {
      field: "role",
      minWidth: 120,
      headerName: t("ROLE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <p>{row?.role?.name}</p>;
      },
      valueGetter: ({ row }: any) => `${row?.role?.name ?? ""}`,
    },
    {
      field: "active",
      headerName: t("STATUS"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.active ? t("ACTIVE") : t("INACTIVE")}
            color={userStatusObj[row.active ? "Active" : "Inactive"]}
            sx={{ fontSize: "1rem" }}
          />
        );
      },
      valueGetter: ({ row }: any) => (row.active ? "Active" : "Inactive"),
    },
    {
      headerName: t("ACTIONS"),
      disableExport: true,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={item}
              setItem={setUserItem}
              deleteCall={userDelete}
              entityCall={userGetById}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <GridCustomExport
        rows={data || []}
        columns={columns}
        isLoading={isLoading}
        handleEditPage={handleEditPage}
        userCreation={true}
      />

      <Dialog
        sx={{ ".MuiDialog-paper": { background: "#f4f4f4", width: 350 } }}
        onClose={() => setShow(false)}
        open={show}
      >
        <DialogTitle
          sx={{ color: theme.palette.mode === "dark" ? "#4c4a54" : "#4c4a54" }}
        >
          {t("STORE_TERMINALS")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {stores?.map((singleStore: any) => {
              return (
                <Paper sx={{ mb: 4, p: 2 }} elevation={10}>
                  <Typography variant="h6">
                    {singleStore?.store?.name}
                  </Typography>
                  {singleStore?.terminals?.map((terminal: any) => {
                    return (
                      <Chip
                        sx={{
                          borderRadius: "6px !important",
                          mx: 2,
                          mb: 2,
                          background:
                            theme.palette.mode === "dark" ? "" : "#EEF1F3",
                        }}
                        label={terminal?.terminalNum}
                      />
                    );
                  })}
                </Paper>
              );
            })}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMasterDataTable;
