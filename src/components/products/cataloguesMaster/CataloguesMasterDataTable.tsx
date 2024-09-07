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
// import { ProductsDivisionDataTableType } from "src/types/forms/productDivisionTypes";
import GridCustomExport from "src/components/export/GridCustomExport";
import { Key } from "src/@core/layouts/utils";

const CataloguesMasterDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    // groupItem,
    // setGroupItem,
    selectedRecord,
    // isLoading,
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
      flex: 0.35,
      // valueGetter: (params: any) => {
      //   return params?.row?.product?.code;
      // },
      // renderCell: ({ row }: any) => {
      //   return (
      //     <Typography>
      //       {row.product?.code ? `${row.product?.code}` : "-"}
      //     </Typography>
      //   );
      // },
    },
    {
      field: "Name",
      minWidth: 80,
      headerName: t("NAME"),
      flex: 0.6,
      // valueGetter: (params: any) => {
      //   return params?.row?.product?.shortName;
      // },
      // renderCell: ({ row }: any) => {
      //   return (
      //       <Typography>
      //         {row?.product?.shortName ? `${row?.product?.shortName}` : "-"}
      //       </Typography>
      //   );
      // },
    },
    {
      field: "Service Type",
      minWidth: 75,
      headerName: t("SERVICE_TYPE"),
      flex: 0.5,
      // valueGetter: (params: any) => {
      //   return params?.row?.baseUom?.name;
      // },
      // renderCell: ({ row }: any) => {
      //   return (
      //     <Typography>
      //       {row?.baseUom?.name ? `${row?.baseUom?.name}` : "-"}
      //     </Typography>
      //   );
      // },
    },
    {
      field: " Number Of Assign Service ",
      minWidth: 100,
      headerName: t(Key("NUMBER OF ASSIGN SERVICES")),
      flex: 0.5,
      // valueGetter: (params: any) => {
      //   return params?.row?.store?.name;
      // },
      // renderCell: ({ row }: any) => {
      //   return (
      //     <Typography>
      //       {row?.store?.name ? `${row?.store?.name}` : "-"}
      //     </Typography>
      //   );
      // },
    },
    {
      field: "External Reference",
      minWidth: 70,
      headerName: t("EXTERNAL_REFERENCE"),
      flex: 0.45,
      // valueGetter: (params: any) => {
      //   return params?.row?.productBatch?.code;
      // },
      // renderCell: ({ row }: any) => {
      //   return (
      //     <Typography>
      //       {row?.productBatch?.code ? `${row?.productBatch?.code}` : "-"}
      //     </Typography>
      //   );
      // },
    },
    {
      field: "active",
      headerName: t("STATUS"),
      flex: 0.45,
      // renderCell: ({ row }: any) => {
      //   return (
      //     <Chip
      //       rounded
      //       skin="light"
      //       size="small"
      //       label={row.active ? t("ACTIVE") : t("INACTIVE")}
      //       color={userStatusObj[row.active ? "Active" : "Inactive"]}
      //       sx={{ fontSize: "1rem" }}
      //     />
      //   );
      // },
      // valueGetter: ({ row }: any) => (row.active ? "Active" : "Inactive"),
    },
    {
      headerName: t("ACTION"),
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
              //item={groupItem}
              //setItem={setGroupItem}
              //deleteCall={productDivisionDelete}
              //entityCall={productsDivisionGetById}
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
      //isLoading={isLoading}
      handleEditPage={handleEditPage}
    />
  );
};

export default CataloguesMasterDataTable;
