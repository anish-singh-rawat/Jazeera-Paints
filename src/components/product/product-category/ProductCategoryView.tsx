import React from "react";
import CommonClientSidePagination from "src/components/common/CommonClientSidePagination";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";

const ProductCategoryView = (props: any) => {
  const { data, handleEditPage, item, setItem, selectedRecord, searchEnabled } =
    props;

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
      headerName: t("ExternalReference "),
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
    },
  ];
  return (
    <CommonClientSidePagination
      rows={data}
      columns={columns}
      searchEnabled={searchEnabled}
    />
  );
};

export default ProductCategoryView;
