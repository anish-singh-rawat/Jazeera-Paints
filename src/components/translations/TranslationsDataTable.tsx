import React from "react";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import { Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import {
  translationDelete,
  translationGetById,
} from "src/store/apps/translations/translations";
import GridCustomExport from "../export/GridCustomExport";

const TranslationsDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    isLoading,
  } = props;

  const { t } = useTranslation();

  const columns: any = [
    // {
    //   field: "code",
    //   minWidth: 110,
    //   maxWidth: 140,
    //   headerName: t("CODE"),
    //   flex: 1,
    // },
    {
      field: "id",
      headerName: t("ID"),
      hide:true,
      hideable: false,
      filterable: false
    },
    {
      field: "name",
      minWidth: 110,
      // maxWidth: 200,
      headerName: t("LABEL_NAME"),
      flex: 1.1,
      renderCell: (data: any) => {
        return (
          <Tooltip placement="top" title={data?.row?.name}>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {data?.row?.name}
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: "english",
      minWidth: 110,
      renderHeader: () => (
        <>
          <Avatar
            alt="us-flag"
            sx={{ width: 35, height: 35, p: 2 }}
            src="/icons/us.svg"
          />
          {t("ENGLISH")}
        </>
      ),
      flex: 1.1,
      renderCell: (data: any) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.row?.nameLang?.en_US}
          </div>
        );
      },
      valueGetter: ({ row }: any) => `${row?.nameLang?.en_US}`,
    },
    {
      field: "arabic",
      minWidth: 110,
      renderHeader: () => (
        <>
          <Avatar
            alt="us-flag"
            sx={{ width: 35, height: 35, p: 2 }}
            src="/icons/ar.svg"
          />
          {t("ARABIC")}
        </>
      ),
      flex: 1.1,
      renderCell: (data: any) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.row?.nameLang?.ar_SA}
          </div>
        );
      },
      valueGetter: ({ row }: any) => `${row?.nameLang?.ar_SA ?? "" }`,
    },
    {
      field: "French",
      minWidth: 110,
      renderHeader: () => (
        <>
          <Avatar
            alt="us-flag"
            sx={{ width: 35, height: 35, p: 2 }}
            src="/icons/fr.svg"
          />
          {t("FRENCH")}
        </>
      ),
      flex: 1.1,
      renderCell: (data: any) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.row?.nameLang?.fr_FR}
          </div>
        );
      },
      valueGetter: ({ row }: any) => `${row?.nameLang?.fr_FR ?? ""}`,
    },
    {
      headerName: t("ACTIONS"),
      sortable: false,
      disableColumnMenu: true,
      flex: 0.9,
      minWidth: 100,
      disableExport:true,
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
              deleteCall={translationDelete}
              entityCall={translationGetById}
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
      isTranslationPage={true}
    />
  );
};

export default TranslationsDataTable;
