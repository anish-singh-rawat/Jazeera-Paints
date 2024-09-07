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

const CountryDataTable = (props: CountryTableProps) => {
  const { data, isLoading } = props;  
  const { t } = useTranslation();
  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");
  
    const columns: any = [
    {
      field: "alpha_one",
      minWidth: 100,
      headerName: t("ALPHA_ONE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography>{`${row?.alpha_one === undefined ? '-' : row?.alpha_one}`}</Typography>
        );
      },
    },
    {
      field: "alpha_two",
      minWidth: 120,
      headerName: t("ALPHA_TWO"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.alpha_two === undefined ? '-' : row?.alpha_two}`}</Typography>;
      },
    },
    {
      field: "code",
      minWidth: 120,
      headerName: t("NUMERIC_CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.code}`}</Typography>;
      },
      },
    ...(changeLanguage == "en-US"
      ? [
          {
            field: "name",
            minWidth: 120,
            headerName: t("COUNTRY_NAME"),
            flex: 1,
            valueGetter: (params: any) => {
            return params?.row?.name;
      },
          },
        ]
      : []),
    {
      field: "altName",
      headerName: t("COUNTRY_ALTERNATE_NAME"),
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

export default CountryDataTable;
