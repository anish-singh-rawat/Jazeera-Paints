import React from "react";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import {
  ProductSubcategoryGetById,
  ProductSubcategoryDelete,
} from "src/store/apps/product/product-sub-category";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";

const ProductSubCategoryTable = (props: any) => {
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    isLoading,
    name,
    searchStateHandler
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
      hide:true,
      hideable: false,
      filterable: false
    },
    {
      field: "code",
      minWidth: 110,
      headerName: t("CODE"),
      flex: 1,
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
      minWidth: 138,
      headerName: t("REFERENCE"),
      flex: 1,
    },
    {
      field: "productCategory",
      minWidth: 138,
      headerName: t("PRODUCT_CATEGORY"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
         <>{row?.productCategory?.name}</>
        );
      },
      valueGetter: ({ row }: any) =>row?.productCategory?.name 
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
              deleteCall={ProductSubcategoryDelete}
              entityCall={ProductSubcategoryGetById}
              view={true}
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
      name={name}
      searchStateHandler={searchStateHandler}
          />
  );
};

export default ProductSubCategoryTable;
