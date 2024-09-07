import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { Typography } from "@mui/material";
import { ThemeColor } from "src/@core/layouts/types";
import Chip from "src/@core/components/mui/chip";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import {
  legalEntitiesDelete,
  legalEntitiesGetById,
} from "src/store/apps/general-setup/legalEntities";
import { LegalEntitiesDataTableType } from "src/types/forms/legalEntitiesType";

const LegalEntitiesDataTable = (props: LegalEntitiesDataTableType) => {
  const {
    data,
    handleEditPage,
    groupItem,
    setGroupItem,
    selectedRecord,
    changeLanguage,
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
      hide: true,
      hideable: false,
      filterable: false,
    },
    {
      field: "Code",
      minWidth: 60,
      headerName: t("CODE"),
      flex: 0.6,
      valueGetter: (params: any) => {
        return params?.row?.code;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{row.code ? `${row.code}` : "-"}</Typography>;
      },
    },
    ...(changeLanguage == "en-US"
      ? [
          {
            field: "Name",
            minWidth: 80,
            headerName: t("NAME"),
            flex: 1,
            valueGetter: (params: any) => {
              return params?.row?.name;
            },
            renderCell: ({ row }: any) => {
              return (
                <Typography>{row?.name ? `${row?.name}` : "-"}</Typography>
              );
            },
          },
        ]
      : [
          {
            field: "altName",
            minWidth: 180,
            headerName: t("ALTERNATE_NAME"),
            flex: 1,
          },
        ]),

    // {
    //     field: "altName",
    //     minWidth: 180,
    //     headerName: t("ALTERNATE_NAME"),
    //     flex: 1,
    //   },

    {
      field: "entityType",
      minWidth: 75,
      headerName: t("ENTITY_TYPE"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.entityType;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>{row?.entityType ? `${row?.entityType}` : ""}</Typography>
        );
      },
    },
    {
      field: " Company ",
      minWidth: 100,
      headerName: t("COMPANY"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.company?.name;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.company?.altName ? `${row?.company?.altName}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: " Base Currency ",
      minWidth: 70,
      headerName: t("BASE_CURRENCY"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.baseCurrency?.name;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.baseCurrency?.name ? `${row?.baseCurrency?.name}` : "-"}
          </Typography>
        );
      },
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
              item={groupItem}
              setItem={setGroupItem}
              deleteCall={legalEntitiesDelete}
              entityCall={legalEntitiesGetById}
            />
          </div>
        );
      },
    },
  ];

  return (
    <GridCustomExport
      rows={data || []}
      columns={columns}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
    />
  );
};

export default LegalEntitiesDataTable;
