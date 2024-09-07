import React, { useState } from "react";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import {
  getProductTypeGetById,
  ProductTypeCreateDelete,
} from "src/store/apps/product/product-type";

import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";

const ProductTypeTable = (props: any) => {
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    isLoading,
    setSearchValue,
    setSearchClick,
    searchValue,
    searchClick,
  } = props;

  const { t } = useTranslation();

  interface ProductStatusType {
    [key: string]: ThemeColor;
  }

  const userStatusObj: ProductStatusType = {
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
    },
    {
      field: "name",
      minWidth: 130,
      headerName: t("NAME"),
      flex: 1,
    },
    {
      field: "altName",
      minWidth: 130,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },

    {
      field: "externalReference",
      minWidth: 148,
      headerName: t("REFERENCE"),
      flex: 1,
    },

    {
      field: "active",
      headerName: t("STATUS"),
      flex: 1,
      minWidth: 100,
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
      disableExport: true,
      sortable: false,
      disableColumnMenu: true,
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
              deleteCall={ProductTypeCreateDelete}
              entityCall={getProductTypeGetById}
              view={true}
            />
          </div>
        );
      },
    },
  ];
  return (
    <>
      <GridCustomExport
        rows={data}
        columns={columns}
        isLoading={isLoading}
        handleEditPage={handleEditPage}
      />
    </>
  );
};

export default ProductTypeTable;
