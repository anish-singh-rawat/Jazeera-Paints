// ** React Imports
import { useEffect, useState } from "react";

// ** Next Import
import Image from "next/image";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  DataGrid,
  GridColumnVisibilityModel,
  gridVisibleColumnFieldsSelector,
  gridVisibleRowCountSelector,
  useGridApiContext,
  useGridApiRef,
} from "@mui/x-data-grid";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports

// ** Store & Actions Imports
import { useDispatch, useSelector } from "react-redux";
import { debouncedSearchData } from "src/store/apps/customers";

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
import CommonRowoptions from "./CommonRowoptions";
import {
  fetchProductSearchData,
  productDelete,
} from "src/store/apps/products/products-add/productsAdd";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";

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

const productStatusObj: ProductStatusType = {
  Active: "success",
  pending: "warning",
  Inactive: "secondary",
};

const CommonServerSidePaginationWithExport = (props: any) => {
  const { handleEditPage, classification } = props;
  // ** Hook & Var
  const { settings } = useSettings();
  const { direction } = settings;
  // ** State
  const [value, setValue] = useState<string>("");
  const [page, setPage] = useState(0);
  const [searchPage, setSearchPage] = useState(0);
  // const [loading, setLoading] = useState(true);
  const [pageLoader, setPageLoader] = useState(true);
  const [searchClick, setSearchClick] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      retailPrice: false,
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
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [exportStatus, setExportStatus] = useState<boolean>(true);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const productGroup: any = useSelector(
    (state: RootState) => state?.productsAdd
  );
  const body = {
    limit: pageState?.pageSize,
    skip:
      pageState?.page === 1
        ? 0
        : pageState?.page === 0
        ? pageState?.page
        : pageState?.page - 1,
  };
  const SearchBody = {
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
    handleSearch();
  }, [classification]);

  useEffect(() => {
    if (!value) {
      fetchData();
      setPageState((old) => ({
        ...old,
        isLoading: false,
        total: totalCount,
      }));
      setValue("");
      setSearchClick(false);
      setPageLoader(true);
      localStorage.removeItem(productGroup?.data?.searchData);
    }
  }, [dispatch, !value, pageState?.page, pageState.pageSize, classification]);

  const handleSearch: any = () => {
    if (value) {
      dispatch(
        debouncedSearchData(
          { ...SearchBody, searchItem: value, classification: classification },
          fetchProductSearchData
        )
      ); // second param is function name
      setSearchClick(true);
      setPageLoader(true);
      setTimeout(() => {
        setPageLoader(false);
      }, 3000);
    }
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
    if (productGroup?.data?.searchData?.length) {
      setPageLoader(false);
    }
  }, [handleSearch]);

  // Pagination SearchEffect
  useEffect(() => {
    if (value && searchClick) {
      setPageState((old) => ({
        ...old,
        isLoading: productGroup?.data?.totalCount ? false : true,
        total: productGroup?.data && productGroup?.data?.totalCount,
      }));
    }
  }, [value, searchClick, productGroup?.data?.searchData]);

  const fetchData = async () => {
    let url = `Products?skip=${body.skip}&limit=${body.limit}&appType=admin`;

    url =
      classification === "ALL_PRODUCTS"
        ? url
        : url + `&productClassification=${classification}`;

    axios
      .get(url)
      .then((response) => {
        setPageState((old) => ({ ...old, isLoading: true }));
        const json = response?.data;
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: json?.data ? json?.data : [],
          total: json && json?.data && json?.totalCount,
        }));
        setPageLoader(false);
        setTotalCount(json.totalCount);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    let check: any = pageState.page;

    if (check !== "") {
      if (pageState.page <= paginationCount + 1 && !value) {
        fetchData();
        setPageLoader(true);
      }
    }
  }, [pageState.page, pageState.pageSize]);

  useEffect(() => {
    if (value) {
      handleSearch();
    }
  }, [pageState.page, pageState.pageSize]);

  const handleFilter = (val: string) => {
    setValue(val);
    setPage(0);
    setSearchPage(0);
  };

  const handleDelete = async (id: string | any) => {
    await dispatch(productDelete(id));
    fetchData();
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

  const columns: any = [
    {
      field: "code",
      width: 110,
      minWidth: 110,
      maxWidth: 110,
      headerName: t("CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.code}`}</Typography>;
      },
    },
    {
      field: "image",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      headerName: t("IMAGE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return row?.image ? (
          <Image
            priority
            src={`${row?.image}`}
            alt="Uploaded"
            width={30}
            height={35}
          />
        ) : (
          <Icon
            icon="tabler:circle-filled"
            fontSize={24}
            style={{ color: row?.hexCode }}
          />
        );
      },
    },
    {
      field: "name",
      minWidth: 220,
      headerName: t("NAME"),
      flex: 1,
      width: 220,
      valueGetter: ({ row }: any) => {
        return `${row.shortName || ""}`;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography
            style={{ whiteSpace: "pre-wrap" }}
          >{`${row.shortName}`}</Typography>
        );
      },
    },
    {
      field: "productClassification",
      minWidth: 110,
      headerName: t("CLASSIFICATION"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.productClassifications?.name}`}</Typography>;
      },
    },
    {
      field: "productType",
      minWidth: 100,
      headerName: t("TYPE"),
      flex: 1,
      valueGetter: ({ row }: any) => {
        return `${row.productType?.name || ""}`;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{row?.productType?.name}</Typography>;
      },
    },
    {
      field: "active",
      minWidth: 100,
      maxWidth: 100,
      headerName: t("Status"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.active ? t("ACTIVE") : t("INACTIVE")}
            color={productStatusObj[row.active ? "Active" : "Inactive"]}
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
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
      renderCell: ({ row }: any) => {
        return (
          <Box style={{ display: "flex", alignItems: "center" }}>
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={null}
              handleEditPage={handleEditPage}
              item={null}
              setItem={null}
              deleteCall={(id: string) => handleDelete(id)}
              entityCall={null}
              reduxAction={false}
            />
          </Box>
        );
      },
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
            return `${item?.shortName}`;
          case "productType":
            return `${item?.productType?.name}`;
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
        let res = await axiosInstance.post("Products/export", body);
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

  const ref = useGridApiRef();

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              handleFilter={handleFilter}
              toggle={handleEditPage}
              handleSearch={handleSearch}
              handleExport={() => setExporting(true)}
              exportStatus={exportStatus}
              isCreatePermissionEnabled={isCreatePermissionEnabled ?? false}
              moduleType={"products"}
            />
            {
              <div style={{ position: "relative" }}>
                <DataGrid
                  className={
                    direction === "ltr" ? classes.grid : classes.gridRTL
                  }
                  autoHeight
                  rowHeight={56}
                  rows={
                    value && searchClick
                      ? productGroup?.data?.searchData
                      : pageState?.data
                  }
                  components={{
                    Toolbar(props) {
                      return <ExportCompoenent handleExport={handleExport} />;
                    },
                  }}
                  rowCount={pageState?.total || 100}
                  loading={pageLoader}
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
      </Grid>
    </DatePickerWrapper>
  );
};

export default CommonServerSidePaginationWithExport;
