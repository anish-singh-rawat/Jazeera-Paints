import React from "react";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import {
  taxConfigurationDelete,
  taxConfigurationGetById,
} from "src/store/apps/tax-configuration/tax_matrics";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";

const TaxMatricsDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    isLoading,
    changeLanguage,
    setSelectedUser
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
      minWidth: 180,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },
    {
      field: "taxType",
      minWidth: 130,
      headerName: t("TYPE"),
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
      field: "taxRate",
      minWidth: 120,
      headerName: t("TAX") + "%",
      flex: 1,
    },
    {
      field: "businessTaxGroups",
      minWidth: 146,
      headerName: t("BUSINESS_TAX_GROUP"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.businessTaxGroups?.name}
          </div>
        );
      },
      valueGetter: ({ row }: any) => `${row?.businessTaxGroups?.name}`,
    },
    {
      field: "productTaxGroups",
      minWidth: 138,
      headerName: t("PRODUCT_TAX_GROUP"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.productTaxGroups?.name}
          </div>
        );
      },
      valueGetter: ({ row }: any) => `${row?.productTaxGroups?.name}`,
    },
    {
      field: "startDate",
      minWidth: 146,
      headerName: t("START_DATE"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {getDate(data?.row?.startDate)}
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
            {getDate(data?.row?.endDate)}
          </div>
        );
      },
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
              deleteCall={taxConfigurationDelete}
              entityCall={taxConfigurationGetById}
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
      rows={data}
      columns={columns}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
    />
  );
};

export default TaxMatricsDataTable;
