import React from "react";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import {
  ProductPriceListGetById,
  ProductPriceListDelete,
} from "src/store/apps/product/product-price-list";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";

const ProductPriceListTable = (props: any) => {
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    isLoading,
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

  const getDate = (date: any) => {
    const startDate = new Date(date);
    const [month, day, year] = [
      startDate.getMonth(),
      startDate.getDate(),
      startDate.getFullYear(),
    ];

    return `${day >= 10 ? day : "0" + day}/${
      month >= 10 ? month + 1 : "0" + (month + 1)
    }/${year}`;
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
            {/* <span
                  style={{
                    cursor: "pointer",
                    color: "#3586C7",
                    fontSize: "15px",
                    fontWeight: 400,
                  }}
                  onClick={() => selectedRecord(row)}
                >
                  More
                </span> */}
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={item}
              setItem={setItem}
              deleteCall={ProductPriceListDelete}
              entityCall={ProductPriceListGetById}
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
    />
  );
};

export default ProductPriceListTable;
