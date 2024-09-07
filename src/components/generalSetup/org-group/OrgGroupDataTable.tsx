import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { Typography } from "@mui/material";
import {
  customerGroupDelete,
  customerGroupGetById,
  customerGroupUpdate,
} from "src/store/apps/customers/group/customer_group";
import { ThemeColor } from "src/@core/layouts/types";
import Chip from "src/@core/components/mui/chip";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import { deleteSingleGroup, tenantGroupGetById } from "src/store/apps/general-setup/enterpriseGroup";

const OrgGroupDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    groupTenant,
    setGroupTenant,
    selectedRecord,
    isLoading,
    changeLanguage,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const statusUpdateCall = (id: any, active: boolean) => {
    dispatch(customerGroupUpdate({ id: id, active: active }));
  };

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
    ,
    {
      field: "altName",
      minWidth: 120,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },
    {
      field: "reportingCurrency",
      headerName: t("REPORTING_CURRENCY"),
      flex: 1,
      valueGetter: ({ row }: any) => (row.reportingCurrency?.name ? row.reportingCurrency?.name : "-"),
    },
    {
      field: "deploymentMode",
      headerName: t("DEPLOYMENT_MODE"),
      flex: 1,
      minWidth: 120,
      maxWidth: 145,
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
          <div style={{ display: "flex", alignItems: "center" }}>
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
              item={groupTenant}
              setItem={setGroupTenant}
              deleteCall={deleteSingleGroup}
              entityCall={tenantGroupGetById}
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
      handleEditPage={handleEditPage}
    />
  );
};

export default OrgGroupDataTable;
