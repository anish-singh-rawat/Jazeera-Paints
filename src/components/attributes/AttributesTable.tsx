import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CustomerAttributesPaging from "./AttributesPaging";
import Rowoptions from "./RowOptions";

const CustomerAttributesTable = (props: any) => {
  const {
    data,
    handleEditPage,
    isLoading,
    attributeType,
    selectedRecord,
    handleDeleteAttribute,
    handleOpenNewAttribute,
    page,
    setPage,
    newPage,
    setNewPage,
    searchValue,
    setSearchValue,
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
      width: 100,
      headerName: t("CODE"),
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.code}`}</Typography>;
      },
      valueGetter: ({ row }: any) => {
        return t(row?.code);
      }
    },
    {
      field: "name",
      width: 20,
      headerName: t("NAME"),
      flex: 1,
    },
    {
      field: "altName",
      width: 20,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },
    {
      field: "externalReference",
      headerName: t("REFERENCE"),
      width: 20,
      flex: 1,
    },

    {
      field: `${attributeType === 'Product' ? "totalProducts" : "totalCustomers"}`,
      headerName: t(`TOTAL_${attributeType === 'Product' ? 'PRODUCTS' : "CUSTOMERS"}`),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <>{(attributeType === 'Product' ? row?.totalProducts : row?.totalCustomers) || 0}</>;
      },
      valueGetter: ({ row }: any) => {
        return t((attributeType === 'Product' ? row?.totalProducts : row?.totalCustomers) || 0);
      }
    },
    {
      field: "active",
      headerName: t("STATUS"),
      flex: 1,
      width: 50,
      valueGetter: ({ row }: any) => {
        return t(row?.active ? "ACTIVE" : "INACTIVE");
      },
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={t(row.active ? "ACTIVE" : "INACTIVE")}
            color={userStatusObj[row?.active ? "ACTIVE" : "INACTIVE"]}
            sx={{ fontSize: "1rem" }}
          />
        );
      },
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
            <Rowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              handleDeleteAttribute={handleDeleteAttribute}
            />
          </div>
        );
      },
    },
  ];

  return (
    <CustomerAttributesPaging
      data={data}
      columns={columns}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
      selectedRecord={selectedRecord}
      handleOpenNewAttribute={handleOpenNewAttribute}
      page={page}
      setPage={setPage}
      newPage={newPage}
      setNewPage={setNewPage}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
    />
  );
};

export default CustomerAttributesTable;
