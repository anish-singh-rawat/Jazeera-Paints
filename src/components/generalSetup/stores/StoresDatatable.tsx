// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import {
  DataGrid,
  GridColumnVisibilityModel,
  gridVisibleColumnFieldsSelector,
  gridVisibleRowCountSelector,
  useGridApiContext,
  useGridApiRef,
} from "@mui/x-data-grid";

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import { debouncedSearchData } from "src/store/apps/customers";
import {
  storesDelete,
  storesGetById,
  storesListGet,
} from "src/store/apps/storeSettings/storeSettings";

// ** Types Imports
import { AppDispatch, RootState } from "src/store";

// ** Custom Table Components Imports
import TableHeader from "src/views/apps/user/list/TableHeader";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useSettings } from "src/@core/hooks/useSettings";
import CustomerPagination from "src/components/customers/CustomerPagination";
import { axiosInstance as axios, axiosInstance } from "src/configs/axios";
import { formatColumns } from "src/utils/checkItemAvailable";
import AppEvent from "src/app/AppEvent";
import { Permission, PermissionType, RolePermission } from "src/context/types";
import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";
import {
  getCurrentModulePermission,
  mapPermission,
} from "src/components/roles-list/utils";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import {
  fetchProductBatchSearchData,
  productBatchDelete,
  productsBatchGetById,
} from "src/store/apps/productBatch/productBatch";
import differenceInDays from "date-fns/differenceInDays";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import moment from "moment";
import { fetchStoresBySearchData } from "src/store/apps/storeSettings/storeSettings";
import CommonServerSidePaging from "src/components/common/CommonServerSidePaging/CommonServerSidePaging";

interface PermissionItem {
  permissionType: PermissionType;
  permissions: Permission;
}
interface ExportBodyType {
  searchItem?: string;
  selectedColumns?: { key: string; header: string }[];
  filters?: any;
  selectedRows?: string[];
}

const useStyles = makeStyles({
  grid: {
    "& .MuiDataGrid-footerContainer": {
      display: "flex",
      justifyContent: "flex-end",
      flexDirection: ({ direction }: { direction: string }) =>
        direction === "rtl" ? "none !important" : "row-reverse !important",
      "& .MuiDataGrid-selectedRowCount": {
        position: "relative",
        width: "50%",
        display: "flex",
        justifyContent: "center",
      },
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "1px",
    },
    "& .MuiTablePagination-select.MuiSelect-standard": {
      border: "1px solid #DBDADE",
      padding: "4px 26px 4px 4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      width: "80px",
      height: "34px",
      boxSizing: "border-box",
    },

    "& .MuiSvgIcon-root": {
      right: "12px",
    },

    "& .MuiTablePagination-actions": {
      display: "none",
    },

    "& .MuiTablePagination-displayedRows": {
      position: "relative",
      color: "#A5A3AE",

      "&::before": {
        content: `"Showing"`,
        padding: "0 4px",
      },

      "&::after": {
        content: `"entries"`,
        padding: "0 4px",
      },
    },

    "& .MuiTablePagination-selectLabel": {
      display: "none",
    },
  },
  gridRTL: {
    "& .MuiDataGrid-footerContainer": {
      display: "flex",
      flexDirection: ({ direction }: { direction: string }) =>
        direction === "rtl" ? "row-reverse !important" : "none !important",
      "& .MuiDataGrid-selectedRowCount": {
        position: "relative",
        width: "50%",
        left: "25%",
        display: "flex",
        justifyContent: "center",
      },
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "1px",
    },
    "& .MuiTablePagination-select.MuiSelect-standard": {
      border: "1px solid #DBDADE",
      padding: "4px 26px 4px 4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      width: "80px",
      height: "34px",
      boxSizing: "border-box",
    },

    "& .MuiSvgIcon-root": {
      right: "12px",
    },

    "& .MuiTablePagination-actions": {
      display: "none",
    },

    "& .MuiTablePagination-displayedRows": {
      position: "relative",
      color: "#A5A3AE",

      "&::before": {
        content: `"Showing"`,
        padding: "0 4px",
      },

      "&::after": {
        content: `"entries"`,
        padding: "0 4px",
      },
    },

    "& .MuiTablePagination-selectLabel": {
      display: "none",
    },
  },
  customPagination: {
    "& .MuiPaginationItem-ellipsis": {
      display: "none",
    },
  },
});

interface ProductStatusType {
  [key: string]: ThemeColor;
}

const userStatusObj: ProductStatusType = {
  Active: "success",
  pending: "warning",
  Inactive: "secondary",
};

const StoresDataTable = (props: any) => {
  const {
    data,
    handleEditPage,
    classification,
    fetchLatestData,
    setFetchLatestData,
    storeItem,
    setStoreItem,
    selectedRecord,
    isLoading,
    rowCount,
  } = props;

  // ** Hook & Var
  const { settings } = useSettings();
  const { direction } = settings;

  // ** State

  const dispatch = useDispatch<AppDispatch>();
  const storeSettingsStore: any = useSelector(
    (state: RootState) => state?.storeSettingsStore
  );

  const classes = useStyles({ direction });
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useAuth();

  const handleDelete = async (id: string | any) => {
    await dispatch(storesDelete(id));
  };

  const currentModuleName = router.route.substring(1).split("/")[0];

  const gettingPermission: RolePermission[] = auth.user
    ? auth?.user.role.rolePermissions
    : [];

  const permission: PermissionItem[] = mapPermission(gettingPermission);

  const currentModulePermission = getCurrentModulePermission(
    permission,
    currentModuleName
  );

  let isCreatePermissionEnabled =
    currentModulePermission && currentModulePermission?.permissionType?.Create;

  const columns: any = [
    // {
    //   field: "id",
    //   headerName: t("ID"),
    //   hide: true,
    //   hideable: false,
    //   filterable: false,
    // },
    {
      field: "code",
      minWidth: 100,
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
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.name}`}</Typography>;
      },
    },
    {
      field: "altName",
      minWidth: 120,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.altName}`}</Typography>;
      },
    },
    {
      field: "type",
      headerName: t("TYPE"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.storeTypes?.name;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.storeTypes?.name}`}</Typography>;
      },
    },
    {
      field: "email",
      headerName: t("EMAIL_ID"),
      flex: 1,
      renderCell: ({ row }: any) => (
        <Tooltip placement="bottom" title={row?.email} arrow>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "1rem",
            }}
            className="table-cell-trucate"
          >
            {row?.email}
          </span>
        </Tooltip>
      ),
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
              item={storeItem}
              setItem={setStoreItem}
              deleteCall={(id: string) => handleDelete(id)}
              entityCall={storesGetById}
              reduxAction={false}
              viewIcon={false}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CommonServerSidePaging
              rows={storeSettingsStore.data || []}
              columns={columns}
              isLoading={isLoading}
              handleEditPage={handleEditPage}
              fetchDataWithSearch={storesListGet}
              rowCount={rowCount}
              // handleSearch={(val:any)=>setSearch(val)}
              searchPlaceholder={"SEARCH_STORES"}
              //   dropdownOptions = {storeSettingsStore?.data}
            ></CommonServerSidePaging>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};

export default StoresDataTable;
