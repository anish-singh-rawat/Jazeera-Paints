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
import GridCustomExport from "src/components/export/GridCustomExport";
import {
  numberSequenceDelete,
  numberSequenceetById,
} from "src/store/apps/general-setup/numberSequence";
import { NumerSequenceDataTableType } from "src/types/forms/legalentity/numberSequences/numberSequenceTypes";

const NumberSequencesDataTable = (props: NumerSequenceDataTableType) => {
  const {
    data,
    handleEditPage,
    groupItem,
    setGroupItem,
    selectedRecord,
    isLoading,
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
      field: "code",
      minWidth: 120,
      headerName: t("CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.code}`}</Typography>;
      },
    },
    {
      field: "name",
      minWidth: 120,
      headerName: t("NAME"),
      flex: 1,
    },
    {
      field: "type",
      headerName: t("TYPE"),
      flex: 1,
    },
    {
      field: "smallestNum",
      headerName: t("SMALLEST_NUMBER"),
      flex: 1,
      minWidth: 120,
      maxWidth: 145,
    },
    {
      field: "largestNum",
      headerName: t("LARGEST_NUMBER"),
      flex: 1,
      // renderCell: ({ row }: any) => {
      //   return <Typography>{`${row?.largestNum}`}</Typography>;
      // },
      minWidth: 120,
      maxWidth: 145,
    },
    {
      field: "nextSequence",
      headerName: t("NEXT_SEQUENCE"),
      flex: 1,
      minWidth: 120,
      maxWidth: 145,
    },
    {
      field: "codeformat",
      headerName: t("CODE_FORMAT"),
      flex: 1,
      minWidth: 120,
      maxWidth: 145,
    },
    {
      field: "active",
      headerName: t("STATUS"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.active ? t("ACTIVE") : t("INACTIVE")}
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
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={groupItem}
              viewIcon={false}
              setItem={setGroupItem}
              deleteCall={numberSequenceDelete}
              entityCall={numberSequenceetById}
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
      isLoading={isLoading}
      handleEditPage={handleEditPage}
    />
  );
};

export default NumberSequencesDataTable;
