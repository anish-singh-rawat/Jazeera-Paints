import React from "react";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import {
  districtDelete,
  districtGetById,
} from "src/store/apps/general-setup/district_store";

const DistrictDataTable = (props: any) => {
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
      minWidth: 110,
      headerName: t("CODE"),
      flex: 1,
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
      minWidth: 180,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },

    {
      field: "country",
      minWidth: 120,
      headerName: t("COUNTRY"),
      flex: 1,
      renderCell: (data: any) => {
        return data?.row?.country?.name;
      },
      valueGetter: (params: any) => {
        return params?.row?.country?.name;
      },
    },
    {
      field: "city",
      minWidth: 120,
      headerName: t("CITY"),
      flex: 1,
      renderCell: (data: any) => {
        return data?.row?.city?.name;
      },
      valueGetter: (params: any) => {
        return params?.row?.city?.name;
      },
    },
    {
      field: "region",
      minWidth: 120,
      headerName: t("REGION"),
      flex: 1,
      renderCell: (data: any) => {
        return data?.row?.region?.name;
      },
      valueGetter: (params: any) => {
        return params?.row?.region?.name;
      },
    },

    {
      field: "externalReference",
      minWidth: 140,
      headerName: t("EXTERNAL_REFERENCE"),
      flex: 1,
    },
    {
      field: "active",
      headerName: t("STATUS"),
      flex: 1,
      minWidth: 130,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.active ? "Active" : "Inactive"}
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
      flex: 1.5,
      minWidth: 130,
      // align: "center",
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
              deleteCall={districtDelete}
              entityCall={districtGetById}
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

export default DistrictDataTable;
