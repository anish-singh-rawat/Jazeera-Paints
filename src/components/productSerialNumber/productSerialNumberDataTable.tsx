import React from "react";
import { Typography } from "@mui/material";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import {
  productSerialNumbersDelete,
  productSerialNumbersGetById,
} from "src/store/apps/productSerialNumber/productSerialNumber";
import CommonRowOptionswithOutApiCall from "../common/CommonRowOptionswithOutApiCall";

const ProductsSerialNumberDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    serialNumberItem,
    setSerialNumberItem,
    selectedRecord,
    isLoading,
    changeLanguage,
  } = props;

  const { t } = useTranslation();

  const setItems = (data: any) => {
    setSerialNumberItem({
      ...data,
    });
  };

  const columns: any = [
    {
      field: "id",
      headerName: t("ID"),
      hide: true,
      hideable: false,
      filterable: false,
    },
    // {
    //   field: "code",
    //   minWidth: 100,
    //   headerName: t("CODE"),
    //   flex: 1,
    //   valueGetter: (params: any) => {
    //     return params?.row?.code || params?.row?.products?.code;
    //   },
    //   renderCell: ({ row }: any) => {
    //     return (
    //       <Typography>{`${
    //         row?.code ? row?.code : row?.products?.code
    //       }`}</Typography>
    //     );
    //   },
    // },
    {
      field: "name",
      minWidth: 120,
      headerName: t("PRODUCT_NAME"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.products?.shortName;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.products?.shortName}`}</Typography>;
      },
    },
    {
      field: "serialNumber",
      minWidth: 120,
      headerName: t("SERIAL_NUMBER"),
      flex: 1,
    },
    {
      field: "externalReference",
      headerName: t("REFERENCE"),
      flex: 1,
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
            <CommonRowOptionswithOutApiCall
              row={row}
              selectedRecord={selectedRecord}
              setSelectedRecord={(row: any) => setItems(row)}
              handleEditPage={handleEditPage}
              deleteCell={productSerialNumbersDelete}
            />
          </div>
        );
      },
    },
  ];

  return (
    <GridCustomExport
      rows={data || []}
      columns={columns || []}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
      searchPlaceholder={t("SEARCH_BY_SERIAL_NUMBER_PRODUCT_NAME")}
    />
  );
};

export default ProductsSerialNumberDataTable;
