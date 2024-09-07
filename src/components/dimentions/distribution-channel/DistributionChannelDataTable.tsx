import React, { useState, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import CommonSwitch from "src/components/common/CommonSwitch";
import { AppDispatch } from "src/store";
import { Typography } from "@mui/material";
import Icon from "src/@core/components/icon";
import { makeStyles } from "@mui/styles";
import {
  distributionChannelDelete,
  distributionChannelGetById,
  distributionChannelUpdate,
} from "src/store/apps/dimensions/distribution-channel/distribution_channel";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";

const DistributionChannelDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    distributionChannelItem,
    setDistributionChannelItem,
    selectedRecord,
    isLoading,
    changeLanguage,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const statusUpdateCall = (id: any, active: boolean) => {
    dispatch(distributionChannelUpdate({ id: id, active: active }));
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
      disableExport: true,
      sortable: false,
      disableColumnMenu: true,
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
              item={distributionChannelItem}
              setItem={setDistributionChannelItem}
              deleteCall={distributionChannelDelete}
              entityCall={distributionChannelGetById}
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

export default DistributionChannelDataTable;
