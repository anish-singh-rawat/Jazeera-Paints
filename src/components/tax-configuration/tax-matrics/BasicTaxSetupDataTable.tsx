import React from "react";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import {
  basicTaxDelete,
  basicTaxGetById,
} from "src/store/apps/tax-configuration/basic-tax-setup";
import { getDateFormate } from "src/@core/utils/format";

const BasicTaxSetupDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    isLoading,
    changeLanguage,
    setSelectedUser,
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
      minWidth: 120,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },
    {
      field: "taxType",
      minWidth: 110,
      headerName: t("TAX_TYPE"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.taxType?.toLowerCase()}
          </div>
        );
      },
      valueGetter: ({ row }: any) => `${row?.taxType?.toLowerCase()}`,
    },
    {
      field: "tax",
      minWidth: 80,
      headerName: t("TAX") + "%",
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row.tax ? ("" + data?.row.tax).slice(0, 9) : "-"}
          </div>
        );
      },
    },
    {
      field: "startDate",
      minWidth: 146,
      headerName: t("START_DATE"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.startDate ? getDateFormate(data?.row?.startDate) : "-"}
          </div>
        );
      },
    },
    {
      field: "endDate",
      minWidth: 146,
      headerName: t("END_DATE"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.endDate ? getDateFormate(data?.row?.endDate) : "-"}
          </div>
        );
      },
    },
    {
      field: "taxInPrice",
      minWidth: 140,
      headerName: t("TAX_IN_PRICE"),
      flex: 1,
    },
    {
      field: "externalReference",
      minWidth: 140,
      headerName: t("REFERENCE"),
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
              deleteCall={basicTaxDelete}
              entityCall={basicTaxGetById}
              view={true}
              setSelectedUser={setSelectedUser}
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

export default BasicTaxSetupDataTable;
