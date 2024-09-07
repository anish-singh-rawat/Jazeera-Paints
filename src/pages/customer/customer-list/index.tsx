// ** React Imports
import { MouseEvent, useEffect, useState } from "react";

// ** MUI Imports
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  DataGrid,
  GridColumnVisibilityModel,
  gridVisibleColumnFieldsSelector,
  gridVisibleRowCountSelector,
  useGridApiContext,
} from "@mui/x-data-grid";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchData, userGetById } from "src/store/apps/customers";

// ** Types Imports
import { AppDispatch, RootState } from "src/store";
import { CustomerData, defaultValues } from "src/types/forms/customerTypes";

// import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from "src/types/apps/invoiceTypes";

// ** Custom Table Components Imports
import AddUserDrawer from "src/views/apps/user/list/AddUserDrawer";
import TableHeader from "src/views/apps/user/list/TableHeader";

// ** Styled Components
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
// import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSettings } from "src/@core/hooks/useSettings";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";
import CustomerPagination from "src/components/customers/CustomerPagination";
import {
  getCurrentModulePermission,
  mapPermission,
} from "src/components/roles-list/utils";
import { axiosInstance } from "src/configs/axios";
import { Permission, PermissionType, RolePermission } from "src/context/types";
import { useAuth } from "src/hooks/useAuth";
import { formatColumns } from "src/utils/checkItemAvailable";
import {
  checkEmptyKeys,
  encryptPriceId as encryptId,
  populateCustomField,
} from "src/utils/utils";
import Link from "next/link";

interface CellType {
  row: InvoiceType;
}

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
  dialog: {
    "& .MuiDialogTitle": {
      fontSize: "18px",
      color: "red",
    },

    "& .MuiDialogContent-root": {
      color: "#6f6b7d",
      fontSize: "16px",
    },

    "& .MuiPaper-elevation": {
      width: "500px",
      height: "226px",
      padding: "1rem",
    },

    "& .MuiDialogActions-root ": {
      padding: 0,
    },
  },
  formAction: {
    // padding: "0 3rem"
    gap: "1rem",
  },
  formActionSave: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    textTransform: "unset",
  },
  formActionCancel: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    textTransform: "unset",
    background: "#f1f1f2",
    color: "#6f6b7d",

    "&.MuiButton-root:hover": {
      background: "#f1f1f2",
      color: "#6f6b7d",
    },
    "&.MuiButton-root": {
      background: "#f1f1f2",
      color: "#6f6b7d",
    },
  },
});

const RowOptions = ({
  id,
  setAddUserOpen,
  setSelectedUser,
  setCustomFieldsUser,
  customerData,
  setIsEdit,
  isEditPermissionEnabled,
  isDeletePermissionEnabled,
}: {
  id: number | string;
  setAddUserOpen: any;
  setSelectedUser: any;
  setCustomFieldsUser: any;
  customerData: any;
  setIsEdit: any;
  isEditPermissionEnabled: boolean | undefined;
  isDeletePermissionEnabled: boolean | undefined;
}) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  // ** State
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const rowOptionsOpen = Boolean(anchorEl);
  const router = useRouter();
  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const auth = useAuth();
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleRowOptionsCloseEdit = async () => {
    const item: any = await dispatch(userGetById({ id }));
    setCustomFieldsUser(item?.payload?.customerCustomFieldsMapping);
    const data = item?.payload;
    checkEmptyKeys(data);
    populateCustomField(data);
    setSelectedUser(data);
    setAnchorEl(null);
    setAddUserOpen(true);
    setIsEdit(false);
  };

  const handleDelete = (id: any) => {
    setDeleteDialog(true);
  };

  const handleDeleteCustomer = async () => {
    let res: any = {};
    res = await dispatch(deleteUser({ id }));
    setDeleteDialog(false);
  };

  const singleCustomerRoute = `/customer/customer-view/?id=${encryptId(
    customerData?.id
  )}`;

  return (
    <>
      <Dialog open={deleteDialog} className={classes.dialog}>
        <DialogTitle color="red">{t("DELETE")}</DialogTitle>
        <DialogContent>{t(`DELETE_CONFIRM`)}</DialogContent>
        <DialogActions className={classes.formAction}>
          <Button
            variant="contained"
            onClick={() => setDeleteDialog(false)}
            className={classes.formActionCancel}
          >
            {t("CANCEL")}
          </Button>
          <Button
            variant="contained"
            color="error"
            className={classes.formActionSave}
            onClick={handleDeleteCustomer}
          >
            {t("DELETE")}
          </Button>
        </DialogActions>
      </Dialog>
      <Tooltip title={t("VIEW")}>
        <Link href={singleCustomerRoute}>
          <IconButton component="address">
            <Icon icon="tabler:eye" fontSize={20} />
          </IconButton>
        </Link>
      </Tooltip>

      <Tooltip title={t("EDIT")}>
        <IconButton
          onClick={handleRowOptionsCloseEdit}
          disabled={!isEditPermissionEnabled}
        >
          <Icon icon="tabler:edit" fontSize={20} />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("DELETE")}>
        <IconButton
          onClick={() => {
            setAnchorEl(null);
            handleDelete(id);
            handleRowOptionsClick;
          }}
          disabled={!isDeletePermissionEnabled}
        >
          <Icon icon="tabler:trash" fontSize={20} />
        </IconButton>
      </Tooltip>
    </>
  );
};

const InvoiceList = () => {
  // ** Hook & Var
  const { settings } = useSettings();
  const { direction } = settings;
  const dir = AppStorage.getData("dir");
  const ChangeLanguage = AppStorage.getData("lang");
  // ** State
  const [value, setValue] = useState<string>("");
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [searchPage, setSearchPage] = useState(0);
  // const [loading, setLoading] = useState(true);
  const [pageLoader, setPageLoader] = useState(true);
  const [searchClick, setSearchClick] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      id: false,
      tax: false,
      priceList: false,
      customerGroup: false,
      customerType: true,
      customerDivision: false,
      distributionChannel: false,
      externalReference: false,
      notes: false,
      paymentTerms: false,
      salesman: false,
      taxNumber: false,
      customerClass: false,
      email: false,
      status: false,
      street: false,
      creditLimit: false,
      customerBalance: false,
      dob: false,
      district: false,
      latLong: false,
      companyName: false,
      gender: false,
      ageGroup: false,
    });
  const [paginationCount, setPaginationCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [defaultPage, setDefaultPage] = useState<number>(1);
  const [pageState, setPageState] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [analyticsData, setAnalyticsData] = useState<any>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [exportStatus, setExportStatus] = useState<boolean>(true);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const store: any = useSelector((state: RootState) => state.customers);
  const body = {
    limit: pageState?.pageSize,
    skip:
      pageState?.page === 1
        ? 0
        : pageState?.page === 0
        ? pageState?.page
        : pageState?.page - 1,
  };

  const classes = useStyles({ direction });
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!value) {
      dispatch(fetchData({ skip: body.skip, limit: body.limit }));
      setPageState((old) => ({
        ...old,
        total: totalCount,
      }));
      setValue("");
      setSearchClick(false);
      localStorage.removeItem(store.searchCustomers);
    }
  }, [dispatch, !value, pageState?.page, pageState.pageSize]);

  useEffect(() => {
    if (value) {
      dispatch(fetchData({ skip: body.skip, limit: body.limit, value }));
      setSearchClick(false);
    }
  }, [pageState?.page, pageState.pageSize, searchClick]);

  useEffect(() => {
    setPageState((old) => ({
      ...old,
      data: store?.data ? store?.data : [],
      total: store?.data && store?.data[0]?.totalCount,
    }));
    setTotalCount(store?.data && store?.data[0]?.totalCount);
  }, [store?.data]);

  const handleSearch: any = () => {
    if (value) {
      setSearchClick(true);
    }
    setPageState((old) => ({
      ...old,
      page: 1,
    }));
    if (paginationCount + 1 === pageState.page && !searchClick) {
      setPageState((old) => ({ ...old, page: 1 }));
    }
  };

  useEffect(() => {
    if (pageState?.total >= 10) {
      setPaginationCount(Math.floor(pageState.total / pageState?.pageSize));
    } else setPaginationCount(0);
  }, [totalCount, handleSearch]);

  useEffect(() => {
    if (store.searchCustomers.length) {
      setPageLoader(false);
    }
  }, [handleSearch]);

  useEffect(() => {
    setAnalyticsData(store?.tilesData);
  }, [store?.tilesData]);

  const handleFilter = (val: string) => {
    setValue(val);
    setPage(0);
    setSearchPage(0);
  };

  const toggleAddUserDrawer = () => {
    setAddUserOpen(!addUserOpen);
    setIsEdit(true);
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

  const isEditPermissionEnabled =
    currentModulePermission && currentModulePermission?.permissionType?.Edit;
  const isDeletePermissionEnabled =
    currentModulePermission && currentModulePermission?.permissionType?.Delete;
  let isCreatePermissionEnabled =
    currentModulePermission && currentModulePermission?.permissionType?.Create;

  const [customFieldsUser, setCustomFieldsUser] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<CustomerData>(defaultValues);
  const defaultColumns = [
    {
      flex: 0.1,
      field: "id",
      minWidth: 120,
      headerName: t("ID"),
    },
    {
      flex: 0.1,
      field: "code",
      minWidth: 120,
      headerName: t("CODE"),
      renderCell: ({ row }: any) => (
        <Typography sx={{ color: "text.secondary" }}>
          {`${row.code}`}
        </Typography>
      ),
    },
    {
      flex: 0.25,
      field: "name",
      minWidth: 200,
      headerName: t("FULL_NAME"),
      valueGetter: ({ row }: CellType) => {
        return `${row.firstName || ""} ${row.lastName || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        const { firstName, lastName } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* <Avatar alt='John Doe' sx={{ width: 32, height: 32 }} src='/images/avatars/1.png' /> */}
              <Typography
                noWrap
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {`${firstName !== undefined ? firstName : "-"} ${
                  lastName !== undefined ? lastName : ""
                }`}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: "parentCustomer",
      headerName: t("PARENT_CUSTOMER"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.parentCustomer?.firstName || ""} ${
          row?.parentCustomer?.lastName || ""
        }`;
      },
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: "text.secondary" }}>
          {row?.parentCustomer?.firstName} {row?.parentCustomer?.lastName}
        </Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: "customerType",
      headerName: t("TYPE"),
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: "text.secondary" }}>
          {ChangeLanguage === "en-US"
            ? row?.customerTypes?.name
            : row?.customerTypes?.altName}
        </Typography>
      ),
    },

    {
      flex: 0.15,
      minWidth: 100,
      field: "customerDivision",
      headerName: t("CUSTOMER_DIVISION"),
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: "text.secondary" }}>
          {row?.customerDivision?.name}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      field: "mobileNumber",
      minWidth: 140,
      headerName: t("MOBILE"),
      renderCell: ({ row }: CellType) => {
        const { mobileNumber } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Typography
                noWrap
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {mobileNumber}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: "country",
      headerName: t("COUNTRY"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.country?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.country?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "region",
      headerName: t("REGION"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.region?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.region?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: "district",
      headerName: t("DISTRICT"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.district?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.district?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "customerClass",
      headerName: t("CLASS"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.customerClass?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.customerClass?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "customerGroup",
      headerName: t("GROUP"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.customerGroup?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.customerGroup?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "distributionChannel",
      headerName: t("DISTRIBUTION_CHANNEL"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.distributionChannel?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.distributionChannel?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "email",
      headerName: t("EMAIL"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{row?.email}</Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "externalReference",
      headerName: t("REFERENCE"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.externalReference}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "notes",
      headerName: t("NOTES"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{row?.notes}</Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "paymentTerms",
      headerName: t("PAYMENT_TERMS"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.paymentTerms?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.paymentTerms?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "priceList",
      headerName: t("PRICE_LIST"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.priceList || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{row?.notes}</Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "salesman",
      headerName: t("SALESMAN"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.salesman?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.salesman?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "status",
      headerName: t("STATUS"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.status}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "street",
      headerName: t("STREET"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.street}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "tax",
      headerName: t("TAX"),
      valueGetter: ({ row }: CellType) => {
        return `${row?.tax?.name || ""}`;
      },
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.tax?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "taxNumber",
      headerName: t("TAX_NUMBER"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.taxNumber}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "creditLimit",
      headerName: t("CREDIT_LIMIT"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.creditLimit}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "customerBalance",
      headerName: t("BALANCE"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.customerBalance}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "latLong",
      headerName: t("LAT_LONG"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.latitude}
            <br /> {row.longitude}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 118,
      field: "dob",
      headerName: t("DOB"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>{row?.DOB}</Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "ageGroup",
      headerName: t("AGE_GROUP"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.ageGroup}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: "gender",
      headerName: t("GENDER"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.gender}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: "companyName",
      headerName: t("COMPANY_NAME"),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography sx={{ color: "text.secondary" }}>
            {row?.companyName}
          </Typography>
        );
      },
    },
  ];

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 200,
      sortable: false,
      field: "actions",
      disableExport: true,
      headerName: t("ACTIONS"),
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => (
        <RowOptions
          id={row.id}
          setAddUserOpen={setAddUserOpen}
          setSelectedUser={setSelectedUser}
          setCustomFieldsUser={setCustomFieldsUser}
          customerData={row}
          setIsEdit={setIsEdit}
          isEditPermissionEnabled={isEditPermissionEnabled}
          isDeletePermissionEnabled={isDeletePermissionEnabled}
        />
      ),
    },
  ];

  const downloadBlob = (
    content: string[] | any,
    filename: string,
    contentType: string
  ) => {
    // Create a blob
    const blob = new Blob([content], {
      type: contentType + "; charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    // Create a link to download it
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", filename);
    a.click();
  };

  const objectToCsv = (data: any, headers: string[]) => {
    const csvRows = [];
    csvRows.push(headers?.join(","));

    for (const item of data) {
      const values = headers?.map((header: any) => {
        switch (header) {
          case "name":
            return `${item?.firstName}  ${item?.lastName}`;
          case "parentCustomer":
            return `${item?.parentCustomer?.firstName} ${item?.parentCustomer?.lastName}`;
          case "customerDivision":
            return `${item?.customerDivision?.name}`;
          case "country":
            return `${item?.country?.name}`;
          case "region":
            return `${item?.region?.name}`;
          case "district":
            return `${item?.district?.name}`;
          case "customerClass":
            return `${item?.customerClass?.name}`;
          case "customerGroup":
            return `${item?.customerGroup?.name}`;
          case "distributionChannel":
            return `${item?.distributionChannel?.name}`;
          case "paymentTerms":
            return `${item?.paymentTerms?.name}`;
          case "priceList":
            return `${item?.priceList?.name}`;
          case "salesman":
            return `${item?.salesman?.name}`;
          case "tax":
            return `${item?.tax?.name}`;
          default:
            return `${item[header]}`;
        }
      });
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  };

  const handleExport = async (columns: string[], visisbleRows: number) => {
    const body: ExportBodyType = {};

    if (visisbleRows) {
      AppEvent.messageEmit({
        type: "success",
        message: "Export in Progress...",
      });
      setExportStatus(false);
      if (value) body["searchItem"] = value;
      if (columns?.length > 0) body["selectedColumns"] = formatColumns(columns);
      if (Object.values(selectedFilters).length) {
        body["filters"] = Object.values(selectedFilters);
      }
      if (selectedRows.length) body["selectedRows"] = selectedRows;

      try {
        let res = await axiosInstance.post("customer/export", body);
        if (res?.data?.data[0]?.message) {
          AppEvent.messageEmit({
            type: "success",
            message: "Excel sent to your email",
          });
        } else {
          let columns = body?.selectedColumns?.map((item) => item?.key) ?? [];
          const csvData = objectToCsv(res?.data?.data, columns);

          downloadBlob(csvData, "classListData.csv", "application/json");
        }

        setExportStatus(true);
      } catch (e) {
        console.log(e);
        AppEvent.messageEmit({
          type: "error",
          message: "Something went wrong while exporting",
        });
        setExportStatus(true);
      }
    }
  };

  const [exporting, setExporting] = useState(false);

  const ExportCompoenent = (props: any) => {
    const apiRef = useGridApiContext();
    const columns = gridVisibleColumnFieldsSelector(apiRef.current.state);
    const visisbleRows = gridVisibleRowCountSelector(apiRef.current.state);

    useEffect(() => {
      if (exporting) {
        props.handleExport(columns, visisbleRows);
        setExporting(false);
      }
    }, [exporting]);
    return null;
  };

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:user"
                title={t("TOTAL_CUSTOMERS")}
                stats={analyticsData?.totalCount}
                subtitle={
                  analyticsData?.prevYear + " - " + analyticsData?.currYear
                }
                trendDiff={analyticsData?.totalCountPer}
                trend={
                  String(analyticsData?.totalCountPer).startsWith("-")
                    ? "negative"
                    : "positive"
                }
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:user-check"
                title={t("ACTIVE_CUSTOMERS")}
                //To show data in nearest thousand
                // stats={
                //   String(analyticsData?.totalActiveCount).slice(0, 2) + "K"
                // }
                stats={analyticsData?.totalActiveCount}
                subtitle={
                  analyticsData?.prevYear + " - " + analyticsData?.currYear
                }
                trendDiff={analyticsData?.totalActiveCountPer}
                trend={
                  String(analyticsData?.totalActiveCountPer).startsWith("-")
                    ? "negative"
                    : "positive"
                }
                avatarColor="success"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:user-x"
                title={t("INACTIVE_CUSTOMERS")}
                stats={analyticsData?.totalInActiveCount}
                subtitle={
                  analyticsData?.prevYear + " - " + analyticsData?.currYear
                }
                trendDiff={analyticsData?.totalInActiveCountPer}
                trend={
                  String(analyticsData?.totalInActiveCountPer).startsWith("-")
                    ? "negative"
                    : "positive"
                }
                avatarColor="error"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:credit-card-off"
                title={t("CREDIT_BLOCKED")}
                stats={analyticsData?.totalCreditBlockedCount}
                subtitle="2022 - 2023"
                trend={
                  String(analyticsData?.totalCreditBlockedCountPer).startsWith(
                    "-"
                  )
                    ? "negative"
                    : "positive"
                }
                trendDiff={analyticsData?.totalCreditBlockedCountPer}
                avatarColor="error"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              handleFilter={handleFilter}
              toggle={toggleAddUserDrawer}
              handleSearch={handleSearch}
              handleExport={() => setExporting(true)}
              exportStatus={exportStatus}
              isCreatePermissionEnabled={isCreatePermissionEnabled ?? false}
            />
            {
              <div style={{ position: "relative" }}>
                <DataGrid
                  className={
                    direction === "ltr" ? classes.grid : classes.gridRTL
                  }
                  autoHeight
                  rowHeight={56}
                  rows={pageState?.data}
                  components={{
                    Toolbar(props) {
                      return <ExportCompoenent handleExport={handleExport} />;
                    },
                  }}
                  rowCount={pageState?.total || 100}
                  loading={store.isLoading}
                  rowsPerPageOptions={[10, 30, 50, 70, 100]}
                  pagination
                  disableSelectionOnClick
                  getRowId={(row) => row?.id}
                  page={pageState.page - 1}
                  pageSize={pageState.pageSize}
                  paginationMode="server"
                  onPageSizeChange={(newPageSize) => {
                    return setPageState((old) => {
                      setPaginationCount(Math.floor(totalCount / newPageSize));
                      setDefaultPage(1);
                      return { ...old, pageSize: newPageSize, page: 1 };
                    });
                  }}
                  columns={columns || []}
                  checkboxSelection
                  columnVisibilityModel={columnVisibilityModel}
                  onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                  }
                  onSelectionModelChange={(ids: any) => setSelectedRows(ids)}
                  onFilterModelChange={({ items }: any) => {
                    setSelectedFilters({
                      ...selectedFilters,
                      [items[0]?.columnField]: items[0],
                    });
                  }}
                />

                <Stack
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: direction === "ltr" ? "24px" : "unset",
                    left: direction === "rtl" ? "24px" : "unset",
                    direction: "ltr",
                  }}
                >
                  {
                    <CustomerPagination
                      count={paginationCount + 1}
                      setPageState={setPageState}
                      pageState={pageState}
                    />
                  }
                </Stack>
              </div>
            }
          </Card>
        </Grid>
        {addUserOpen && (
          <AddUserDrawer
            open={addUserOpen}
            toggle={toggleAddUserDrawer}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            customFieldsUser={customFieldsUser}
            setSearchValue={setValue}
            searchValue={value}
            isEdit={isEdit}
          />
        )}
      </Grid>
    </DatePickerWrapper>
  );
};

export default InvoiceList;
