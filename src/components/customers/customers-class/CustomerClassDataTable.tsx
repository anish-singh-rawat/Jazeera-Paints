import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { Box, Typography } from "@mui/material";
import {
  customerClassDelete,
  customerClassGetById,
  customerClassUpdate,
} from "src/store/apps/customers/customers-class/customer_class";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";

const CustomerClassDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    customerClassItem,
    setCustomerClassItem,
    selectedRecord,
    isLoading,
    changeLanguage,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const statusUpdateCall = (id: any, active: boolean) => {
    dispatch(customerClassUpdate({ id: id, active: active }));
  };

  interface UserStatusType {
    [key: string]: ThemeColor;
  }

  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

  const { t } = useTranslation();

  const columns: any = [
    {
      field: "id",
      headerName: t("ID"),
      hide:true,
      hideable: false,
      filterable: false
    },
    {
      field: "code",
      minWidth: 120,
      headerName: t("CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.code}`}</Typography>;
      },
    },
    ...(changeLanguage == "en-US"
      ? [
          {
            field: "name",
            minWidth: 120,
            headerName: t("NAME"),
            flex: 1,
          },
        ]
      : []),

    {
      field: "altName",
      minWidth: 120,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },
    {
      field: "externalReference",
      headerName: t("REFERENCE"),
      flex: 1,
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
      sortable: false,
      disableColumnMenu: true,
      disableExport: true,
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Box style={{ display: "flex", alignItems: "center" }}>
            {/* <span
              style={{
                cursor: "pointer",
                color: "#3586C7",
                fontSize: "15px",
                fontWeight: 400,
              }}
              onClick={() => selectedRecord(row)}
            >
              More
            </span> */}
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={customerClassItem}
              setItem={setCustomerClassItem}
              deleteCall={customerClassDelete}
              entityCall={customerClassGetById}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <GridCustomExport
      rows={data}
      columns={columns}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
    />
  );
};

export default CustomerClassDataTable;
