import { useTranslation } from "react-i18next";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import GridCustomExport from "src/components/export/GridCustomExport";
import { fetchTaxGroupById, taxGroupDelete } from "src/store/apps/tax-configuration/tax-groups";

const BusinessTaxGroupDatatable = (props: any) => {
  const { t } = useTranslation();
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    isLoading,
    changeLanguage,
  } = props;

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
      hide:true,
      hideable: false,
      filterable: false,
    },
    {
      field: "code",
      headerName: `${t("CODE")}`,
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
      minWidth: 120,
      headerName: `${t("ALTERNATE_NAME")}`,
      flex: 1,
    },
    {
      field: "taxGroupType",
      minWidth: 120,
      headerName: `${t("TAX_GROUP_TYPE")}`,
      flex: 1,
    },
    {
      field: "active",
      headerName: `${t("STATUS")}`,
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
      headerName: `${t("ACTIONS")}`,
      flex: 1,
      disableExport: true,
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
              deleteCall={taxGroupDelete}
              entityCall={fetchTaxGroupById}
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

export default BusinessTaxGroupDatatable;
