import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import Icon from "src/@core/components/icon";
import CommonClientSidePagination from "src/components/common/CommonClientSidePagination";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import {
  customFieldsDelete,
  customFieldsGetById,
} from "src/store/apps/custom-fields/custom_fields";
import GridCustomExport from "src/components/export/GridCustomExport";

const CustomFieldsDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    searchEnabled,
    isLoading,
    changeLanguage,
    setSelectedOption,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  //   const statusUpdateCall = (id: any, active: boolean) => {
  //     dispatch(customerDivisionUpdate({ id: id, active: active }));
  //   };

  const toTitleCase = (inputString: string) => {
    return inputString
      .split("_")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const columns: any = [
    // for future use
    // {
    //   field: "code",
    //   minWidth: 120,
    //   headerName: t("CODE"),
    //   flex: 1,
    //   renderCell: ({ row }: any) => {
    //     return <div>{`${row.code}`}</div>;
    //   },
    // },

    {
      field: "name",
      minWidth: 120,
      headerName: t("NAME"),
      flex: 0.8,
    },
    {
      field: "fieldType",
      headerName: t("FORMAT"),
      flex: 0.8,
      renderCell: ({ row }: any) => {
        return (
          <div>{`${toTitleCase(row?.fieldType ? row?.fieldType : "")}`}</div>
        );
      },
    },
    {
      field: "required",
      headerName: t("REQUIRED"),
      flex: 0.8,
      renderCell: ({ row }: any) => {
        return (
          <div>
            {row.required ? (
              <Icon icon="tabler:check" fontSize={20} />
            ) : (
              <Icon icon="tabler:x" fontSize={20} />
            )}
          </div>
        );
      },
    },
    {
      field: "visible",
      headerName: t("VISIBLE"),
      flex: 0.8,
      renderCell: ({ row }: any) => {
        return (
          <div>
            {row.visible ? (
              <Icon icon="tabler:check" fontSize={20} />
            ) : (
              <Icon icon="tabler:x" fontSize={20} />
            )}
          </div>
        );
      },
    },
    {
      field: "searchable",
      headerName: t("SEARCHABLE"),
      flex: 0.8,
      renderCell: ({ row }: any) => {
        return (
          <div>
            {row.searchable ? (
              <Icon icon="tabler:check" fontSize={20} />
            ) : (
              <Icon icon="tabler:x" fontSize={20} />
            )}
          </div>
        );
      },
    },

    // for future use
    // {
    //   field: "active",
    //   headerName: t("STATUS"),
    //   flex: 0.8,
    //   renderCell: ({ row }: any) => {
    //     return (
    //       <Chip
    //         rounded
    //         skin="light"
    //         size="small"
    //         label={row.active ? t("ACTIVE") : t("INACTIVE")}
    //         color={userStatusObj[row.active ? "Active" : "Inactive"]}
    //         sx={{ fontSize: "1rem" }}
    //       />
    //     );
    //   },
    // },
    {
      headerName: t("ACTIONS"),
      sortable: false,
      disableColumnMenu: true,
      flex: 0.55,
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CommonRowoptions
              id={row?.id}
              entityType={row?.entityType}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={item}
              setItem={setItem}
              deleteCall={customFieldsDelete}
              entityCall={customFieldsGetById}
              deleteIcon={true}
              viewIcon={false}
              setSelectedOption={setSelectedOption}
            />
          </div>
        );
      },
    },
  ];

  return (
    <GridCustomExport
      rows={data || []}
      columns={columns || []}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
      customFieldsList={true}
    />
  );
};

export default CustomFieldsDataTable;
