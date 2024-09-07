import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import {
  getPriceListData,
  getPriceListDelete,
} from "src/store/apps/pricelist/price-list";
import { productsDivisionGetById } from "src/store/apps/products/division/products_division";
import { ProductsDivisionDataTableType } from "src/types/forms/productDivisionTypes";
import PriceCustomExport from "./PriceCustomExport";
import Rowoptions from "./row-option";
import CommonServerSidePaging from "../common/CommonServerSidePaging/CommonServerSidePaging";

const PriceListTable = (props: any) => {
  const {
    data,
    handleEditPage,
    groupItem,
    setGroupItem,
    selectedRecord,
    isLoading,
    rowCount,
  } = props;
  const { t } = useTranslation();

  interface UserStatusType {
    [key: string]: ThemeColor;
  }
  const userStatusObj: UserStatusType = {
    ACTIVE: "success",
    INACTIVE: "error",
    DRAFT: "secondary",
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
      // minWidth: 10,
      width: 100,
      headerName: t("CODE"),
      // flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.code}`}</Typography>;
      },
    },
    {
      field: "name",
      // minWidth: 120,
      width: 20,
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
      field: "priceType",
      headerName: t("PRICE_TYPE"),
      valueGetter: (params) => {
        return t(params.value) || params.value;
      },
      flex: 1,
      renderCell: ({ row }: any) => {
        return <>{t(row?.priceType)}</>;
      },
    },

    {
      field: "currency.name",
      headerName: t("CURRENCY"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <>{row?.currency?.name}</>;
      },
      valueGetter: (params) => {
        return t(params?.row?.currency?.name) || params?.row?.currency?.name;
      },
    },
    {
      field: "status",
      headerName: t("STATUS"),
      flex: 1,
      width: 50,
      valueGetter: (params) => {
        return t(params.value) || params.value;
      },
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={t((row.status ?? "").toUpperCase())}
            color={userStatusObj[row.status ? row.status : "DRAFT"]}
            sx={{ fontSize: "1rem", opacity: +Boolean(row.status) }}
          />
        );
      },
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
            <Rowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={groupItem}
              setItem={setGroupItem}
              deleteCall={getPriceListDelete}
              entityCall={productsDivisionGetById}
            />
          </div>
        );
      },
    },
  ];

  return (
    <CommonServerSidePaging
      rows={data || []}
      rowCount={rowCount}
      columns={columns}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
      fetchDataWithSearch={getPriceListData}
      moduleType={"priceList"}
    />
  );
};

export default PriceListTable;
