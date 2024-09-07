import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { Typography } from "@mui/material";
import {
  customerProfileDelet
} from "src/store/apps/customer-profile/customer_profile";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import CommonRowOptionswithOutApiCall from "../common/CommonRowOptionswithOutApiCall";

const CustomerProfileDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    selectedRecord,
    setSelectedRecord,
    isLoading,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  interface UserStatusType {
    [key: string]: ThemeColor;
  }
  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

  const columns: any = [
    {
      field: "id",
      headerName: t("ID"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.id}`}</Typography>;
      },
    },
    {
      field: "profileName",
      minWidth: 120,
      headerName: t("NAME"),
      flex: 1,
    },
    {
      headerName: t("ACTIONS"),
      sortable: false,
      disableColumnMenu: true,
      disableExport: true,
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CommonRowOptionswithOutApiCall
              row={row}
              selectedRecord={selectedRecord}
              setSelectedRecord={setSelectedRecord}
              handleEditPage={handleEditPage}
              deleteCell={customerProfileDelet}
            />
          </div>
        );
      },
    },
  ];

  return (
    <GridCustomExport
      rows={data}
      columns={columns}
      isLoading={isLoading}
      handleEditPage={() => handleEditPage("add")}
      customerProfile={true}
    />
  );
};

export default CustomerProfileDataTable;
