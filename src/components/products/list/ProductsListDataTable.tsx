import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Icon from "src/@core/components/icon";
import Image from "next/image";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import {
  fetchProductsListData,
  productDelete,
} from "src/store/apps/products/products-add/productsAdd";
import CommonServerSidePaging from "src/components/common/CommonServerSidePaging/CommonServerSidePaging";
import Chip from "src/@core/components/mui/chip";

const ProductsListDataTable = (props: any) => {
  const { handleEditPage, isLoading, data, classification, rowCount } = props;
  const dispatch = useDispatch<AppDispatch>();
  const additionalParams = {
    classification: classification,
  };

  interface ProductStatusType {
    [key: string]: ThemeColor;
  }

  const productStatusObj: ProductStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

  const { t } = useTranslation();

  const columns: any = [
    {
      field: "code",
      width: 110,
      minWidth: 110,
      maxWidth: 110,
      headerName: t("CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.code}`}</Typography>;
      },
    },
    {
      field: "image",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      headerName: t("IMAGE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return row?.image ? (
          <Image
            priority
            src={`${row?.image}`}
            alt="Uploaded"
            width={30}
            height={35}
          />
        ) : (
          <Icon
            icon="tabler:circle-filled"
            fontSize={24}
            style={{ color: row?.hexCode }}
          />
        );
      },
    },
    {
      field: "name",
      minWidth: 220,
      headerName: t("NAME"),
      flex: 1,
      width: 220,
      valueGetter: ({ row }: any) => {
        return `${row.shortName || ""}`;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography
            style={{ whiteSpace: "pre-wrap" }}
          >{`${row.shortName}`}</Typography>
        );
      },
    },
    {
      field: "productClassification",
      minWidth: 110,
      headerName: t("CLASSIFICATION"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.productClassifications?.name}`}</Typography>;
      },
    },
    {
      field: "productType",
      minWidth: 100,
      headerName: t("TYPE"),
      flex: 1,
      valueGetter: ({ row }: any) => {
        return `${row.productType?.name || ""}`;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{row?.productType?.name}</Typography>;
      },
    },
    {
      field: "active",
      minWidth: 100,
      maxWidth: 100,
      headerName: t("STATUS"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.active ? t("ACTIVE") : t("INACTIVE")}
            color={productStatusObj[row.active ? "Active" : "Inactive"]}
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
      minWidth: 150,
      maxWidth: 200,
      renderCell: ({ row }: any) => {
        return (
          <Box style={{ display: "flex", alignItems: "center" }}>
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={null}
              handleEditPage={handleEditPage}
              item={null}
              setItem={null}
              deleteCall={productDelete}
              entityCall={null}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <CommonServerSidePaging
      rows={data || []}
      rowCount={rowCount}
      columns={columns || []}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
      fetchDataWithSearch={fetchProductsListData}
      additionalParams={additionalParams}
      searchPlaceholder={"SEARCH_PRODUCTS"}
    />
  );
};

export default ProductsListDataTable;
