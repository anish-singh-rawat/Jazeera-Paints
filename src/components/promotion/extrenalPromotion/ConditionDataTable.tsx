import React from "react";
import { Typography } from "@mui/material";
import GridCustomExport from "src/components/export/GridCustomExport";
import { useTranslation } from "react-i18next";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import {
  externalPromotionHeaderDelete,
  externalPromotionHeaderGetById,
} from "src/store/apps/promotion/externalPromotion/externalPromotion";

const ConditionDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    isLoading,
    changeLanguage,
  } = props;

  const { t } = useTranslation();

  interface UserStatusType {
    [key: string]: ThemeColor;
  }
  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

  const columnsName: any = [
    {
      field: "id",
      headerName: t("ID"),
      hide: true,
      hideable: false,
      filterable: false,
    },
    {
      field: "externalConditionNumber",
      minWidth: 120,
      headerName: t("SAP_CONDITION_NO"),
      flex: 1,
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
            headerName: t("PROMOTION_NAME"),
            flex: 1,
          },
        ]
      : [
          {
            field: "altName",
            minWidth: 120,
            headerName: t("ALTERNATE_NAME"),
            flex: 1,
          },
        ]),
    // {
    //   field: "externalReference",
    //   headerName: t("REFERENCE"),
    //   flex: 1,
    // },
    {
      field: "promotionType",
      headerName: t("CONDITION_TYPE"),
      flex: 1,
      minWidth: 120,
      maxWidth: 145,
    },
    {
      field: "priority",
      headerName: t("PRIORITY"),
      flex: 1,
      minWidth: 100,
      maxWidth: 145,
    },
    {
      field: "active",
      headerName: t("STATUS"),
      flex: 0.75,
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
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={item}
              setItem={setItem}
              deleteCall={externalPromotionHeaderDelete}
              entityCall={externalPromotionHeaderGetById}
              viewIcon={false}
            />
          </div>
        );
      },
    },
  ];
  const columns = columnsName;

  return (
    <GridCustomExport
      rows={data || []}
      columns={columns}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
    />
  );
};

export default ConditionDataTable;
