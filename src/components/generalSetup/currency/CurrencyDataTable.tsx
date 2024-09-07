import React, { useEffect, useState } from "react";
import { Card, FormHelperText, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AppStorage from "src/app/AppStorage";

// Styles
import GridCustomExport from "src/components/export/GridCustomExport";


interface CountryTableProps  {
  data: [];
  isLoading: Boolean;
}

const CurrencyDataTable = (props: CountryTableProps) => {
  const { data, isLoading } = props;  
  const { t } = useTranslation();
  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");
  
    const columns: any = [
    {
      field: "code",
      minWidth: 100,
      headerName: t("CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography>{row?.code}</Typography>
        );
      },
    },
    {
      field: "numericCode",
      minWidth: 120,
      headerName: t("NUMERIC_CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.numericCode ? row?.numericCode : '-'}`}</Typography>;
      },
      },
    ...(changeLanguage == "en-US"
      ? [
          {
            field: "name",
            minWidth: 120,
            headerName: t("CURRENCY_NAME"),
            flex: 1,
            valueGetter: (params: any) => {
            return params?.row?.name;
      },
          },
        ]
      : []),
    {
      field: "altName",
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.altName}`}</Typography>;
      }
    },
    ];

  return (
    <GridCustomExport
      rows={data}
      columns={columns}
      showNewBtn={true}
      country={true}
      isLoading={isLoading}
    />
  );
};

export default CurrencyDataTable;
