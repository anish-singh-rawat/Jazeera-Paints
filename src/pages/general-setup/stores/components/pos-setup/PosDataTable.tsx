import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {
  customerGroupDelete,
  customerGroupGetById,
  customerGroupUpdate,
} from "src/store/apps/customers/group/customer_group";
import {
  posterminalsGetById,
  posTerminalsDelete,
  storesGetById,
} from "src/store/apps/storeSettings/storeSettings";
import { ThemeColor } from "src/@core/layouts/types";
import Chip from "src/@core/components/mui/chip";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import { GridCellParams } from "@mui/x-data-grid";

const PosDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    terminalItem,
    setTerminalItem,
    // groupItem,
    // setGroupItem,
    selectedRecord,
    setSelectedRecord,
    isLoading,
    changeLanguage,
    // storeId
  } = props;
  const [tableData, setTableData] = useState(data);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  //   const statusUpdateCall = (id: any, active: boolean) => {
  //     dispatch(customerGroupUpdate({ id: id, active: active }));
  //   };

  interface UserStatusType {
    [key: string]: ThemeColor;
  }
  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const columns: any = [
    {
      field: "id",
      headerName: t("ID"),
      hide: true,
      hideable: false,
      filterable: false,
    },
    {
      field: "code",
      minWidth: 100,
      headerName: t("CODE"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.code || params?.row?.terminal?.code;
      },
      renderCell: (params: GridCellParams) => (
        <Typography>{params.row.terminal?.code}</Typography>
      ),
    },
    {
      field: "name",
      minWidth: 150,
      headerName: t("NAME"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.name || params?.row?.terminal?.name;
      },
      renderCell: (params: GridCellParams) => (
        <Typography>{params.row.terminal?.name}</Typography>
      ),
    },
    {
      field: "device",
      minWidth: 120,
      headerName: t("DEVICE"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.deviceType || params?.row?.terminal?.deviceType;
      },
      renderCell: (params: GridCellParams) => (
        <Typography>{params.row.terminal?.deviceType}</Typography>
      ),
    },
    {
      field: "os",
      headerName: t("OS"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.deviceOS || params?.row?.terminal?.deviceOS;
      },
      renderCell: (params: GridCellParams) => (
        <Typography>{params.row.terminal?.deviceOS}</Typography>
      ),
    },
    {
      field: "imei-no.",
      headerName: t("IMEI_NO."),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.imeiNumber || params?.row?.terminal?.imeiNumber;
      },
      renderCell: (params: GridCellParams) => (
        <Typography>{params.row.terminal?.imeiNumber}</Typography>
      ),
    },
    {
      field: "activation-code",
      headerName: t("ACTIVATION_CODE"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.terminalNum || params?.row?.terminal?.terminalNum;
      },
      renderCell: (params: GridCellParams) => (
        <Typography>{params.row.terminal?.terminalNum}</Typography>
      ),
    },
    {
      field: "status",
      width: 100,
      minWidth: 100,
      headerName: t("STATUS"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.status || params?.row?.terminal?.status;
      },
      renderCell: ({ row }: any) => {
        const terminalStatus =
          row.terminal?.status === "active" ? "Active" : "Pending";
        return (
          <Tooltip title={terminalStatus}>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Chip
                rounded
                skin="light"
                size="small"
                label={row.terminal?.status === "active" ? "Active" : "Pending"}
                color={
                  userStatusObj[
                    row.terminal?.status === "active" ? "Active" : "pending"
                  ]
                }
                sx={{ fontSize: "1rem" }}
              />
            </span>
          </Tooltip>
        );
      },
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
              id={row.terminalId}
              row={row}
              selectedRecord={selectedRecord}
              setSelectedRecord={setSelectedRecord}
              handleEditPage={handleEditPage}
              item={terminalItem}
              setItem={setTerminalItem}
              deleteCall={(id: string) =>
                posTerminalsDelete({ id, storeId: row.storeId })
              }
              entityCall={posterminalsGetById}
              viewIcon={false}
            />
          </div>
        );
      },
    },
  ];

  return (
    <GridCustomExport
      rows={tableData}
      columns={columns}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
      pointOfSale={true}
    />
  );
};

export default PosDataTable;
