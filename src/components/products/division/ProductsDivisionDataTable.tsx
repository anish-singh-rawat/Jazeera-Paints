import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { Typography } from "@mui/material";
import CommonClientSidePagination from "src/components/common/CommonClientSidePagination";
import { ThemeColor } from "src/@core/layouts/types";
import Chip from "src/@core/components/mui/chip";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import {
  productDivisionDelete,
  productsDivisionGetById,
} from "src/store/apps/products/division/products_division";
import { ProductsDivisionDataTableType } from "src/types/forms/productDivisionTypes";
import GridCustomExport from "src/components/export/GridCustomExport";

const ProductsDivisionDataTable = (props: ProductsDivisionDataTableType) => {
  const {
    data,
    handleEditPage,
    groupItem,
    setGroupItem,
    selectedRecord,
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
      field: "code",
      minWidth: 120,
      headerName: t("CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.code}`}</Typography>;
      },
    },
    {
      field: "name",
      minWidth: 120,
      headerName: t("NAME"),
      flex: 1,
    },
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
      field: "totalProducts",
      headerName: t("TOTAL_PRODUCTS"),
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
              deleteCall={productDivisionDelete}
              entityCall={productsDivisionGetById}
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

export default ProductsDivisionDataTable;
