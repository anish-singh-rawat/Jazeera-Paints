import { Box, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "src/store";
import { useDispatch } from "react-redux";
import {
  useGridStyles,
  useStyles,
} from "src/components/price-list/price-list-style";
import GridCustomHeader from "./components/GridCustomHeader";
import Pagination from "./components/Pagination";
import { Key } from "src/@core/layouts/utils";
import { useSelector } from "react-redux";
interface CommonServerSidePagingProps {
  rows: any[];
  handleSearch?: any;
  children?: any;
  hideImport?: boolean;
  hideAddNew?: boolean;
  isSwitchBox?: boolean;
  columns: any[];
  checkboxSelection?: boolean;
  isLoading: boolean;
  handleEditPage?: any;
  name?: string;
  statusChange?: any;
  customerProfile?: boolean;
  fetchDataWithSearch: any;
  additionalParams?: Record<string, any>;
  rowCount: number;
  moduleType?: string | any;
  byStore?: boolean;
  showAssignBtn?: boolean | any;
  disabledAssign?: boolean;
  handleAssign?: any;
  setSelectedBatchId?: any;
  rowsPerPageOptions?: any;
  // selectedItem?: [] | any;
  setAssignedItem?: [] | any;
  assignedItem?: [] | any;
  searchPlaceholder?: any;
}

interface RowData {
  id: string;
  // Add any other properties of your row data here
}

const CommonServerSidePaging = (props: CommonServerSidePagingProps) => {
  const { t } = useTranslation();
  const settings: any = window.localStorage.getItem("settings");
  const mode = JSON.parse(settings)?.mode;
  const direction = JSON.parse(settings)?.direction;
  const {
    rows,
    columns,
    checkboxSelection,
    isLoading,
    handleEditPage,
    name,
    byStore,
    fetchDataWithSearch,
    additionalParams,
    statusChange,
    rowCount,
    moduleType,
    showAssignBtn,
    handleAssign,
    setSelectedBatchId,
    rowsPerPageOptions,
    setAssignedItem,
    assignedItem,
    searchPlaceholder,
    hideImport,
    hideAddNew,
    isSwitchBox,
    children,
  } = props;

  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState(name ?? "");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newPage, setNewPage] = useState(1);
  const [selectedRowIds, setSelectedRowIds] = useState<
    { priceListId: string }[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [pageLoading, setPageLoading] = useState(false);
  const [clickedRows, setClickedRows] = useState<RowData[]>([]);

  let searchText: string = t(`${searchPlaceholder}`);

  const dispatch = useDispatch<AppDispatch>();
  const gridClasses = useGridStyles();
  const deleteCell=useSelector((state:any)=>state?.productDelete?.data?.totalCount)

  useEffect(() => {
    let pages = rowCount ?? 1;
    setTotalPages(Math.ceil(pages / pageSize));
  }, [rowCount]);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setNewPage(1);
  };

  useEffect(() => {
    let pages = rowCount ?? 1;
    setTotalPages(Math.ceil(pages / pageSize));
  }, [pageSize]);

  useEffect(() => {
    if (newPage === 0) setPage(1);
    setPage(newPage - 1);
  }, [newPage]);

  const classes = useStyles({ direction, newPage });

  const handleSearch = (value: string | any) => {
    if (props.handleSearch) props.handleSearch(value);
    setSearch(value);
    setPage(0);
    setNewPage(1);
  };

  const firstPage = () => {
    if (page > 0) setPage(0);
    setNewPage(1);
  };

  const lastPage = () => {
    if (page < totalPages) setPage(totalPages - 1);
    setNewPage(Math.ceil(rowCount / pageSize));
  };

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
      setNewPage(newPage + 1);
    }
  };

  const previousPage = () => {
    if (page > 0) {
      setPage(page - 1);
      setNewPage(newPage - 1);
    }
  };

  const pageNumberChange = (value: any) => {
    if (value > totalPages) return;
    setNewPage(Number(value));
  };

  useEffect(() => {
    if (page < 0) return;
    setPageLoading(true);
    const fetch = dispatch(
      fetchDataWithSearch(
        additionalParams?.classification === "ALL_PRODUCTS"
          ? {
              skip: page,
              limit: pageSize,
              search,
            }
          : {
              skip: page,
              limit: pageSize,
              search,
              ...additionalParams,
            }
      )
    );

    fetch.then(() => setPageLoading(false)).catch(console.error);

    return () => fetch.abort();
  }, [
    pageSize,
    newPage,
    page,
    search,
    additionalParams?.classification,
    additionalParams?.byStore,
    additionalParams?.storeId,
    additionalParams?.startDate,
    additionalParams?.endDate,
    additionalParams?.orderStatus,
    deleteCell
  ]);

  const handleRowClick = (params: { row: RowData }) => {
    const clickedRowData = params.row; // Extract the clicked row data
    // Add the clicked row data object to the array of clicked rows
    setClickedRows((prevRows) => [...prevRows, clickedRowData]);
    setAssignedItem((prevRows: any) => [...prevRows, clickedRowData]);
  };

  return (
    <Box className={classes.grid}>
      {isLoading ? (
        <div>
          {/* Skeleton for header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px",
              padding: "6px 16px",
            }}
          >
            <Skeleton
              variant="text"
              width="30%"
              height={52}
              style={{ marginRight: "8px" }}
            />
            <Skeleton
              variant="text"
              width="5%"
              height={52}
              style={{ marginRight: "8px" }}
            />
            <Skeleton
              variant="text"
              width="41%"
              height={52}
              style={{ marginRight: "8px" }}
            />
            <Skeleton
              variant="text"
              width="8%"
              height={52}
              style={{ marginRight: "8px" }}
            />
            <Skeleton
              variant="text"
              width="8%"
              height={52}
              style={{ marginRight: "8px" }}
            />
            <Skeleton variant="text" width="8%" height={52} />
          </div>
          {/* Skeleton for data rows */}
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px",
                borderRadius: "5px",
                padding: "8px 16px",
              }}
            >
              <Skeleton
                variant="text"
                width="20%"
                height={40}
                style={{ marginRight: "8px" }}
              />
              <Skeleton
                variant="text"
                width="35%"
                height={40}
                style={{ marginRight: "8px" }}
              />
              <Skeleton
                variant="text"
                width="25%"
                height={40}
                style={{ marginRight: "8px" }}
              />
              <Skeleton
                variant="text"
                width="20%"
                height={40}
                style={{ marginRight: "8px" }}
              />
              <Skeleton variant="text" width="15%" height={40} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <DataGrid
            autoHeight
            rowHeight={56}
            rows={rows || []}
            rowCount={rowCount}
            columns={columns || []}
            loading={isLoading || pageLoading}
            rowsPerPageOptions={rowsPerPageOptions || [10, 30, 50, 70, 100]}
            disableSelectionOnClick
            getRowId={(row: any) => row?.id}
            page={page}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) =>
              handlePageSizeChange(newPageSize)
            }
            checkboxSelection={checkboxSelection ?? true}
            onSelectionModelChange={(selectionModel: any) => {
              setSelectedRowIds(
                selectionModel.map((id: string) => ({ priceListId: id }))
              );
              setSelectedRows(selectionModel);
              setSelectedBatchId && setSelectedBatchId(selectionModel);
            }}
            onRowClick={
              moduleType === "productsAssignModal" ? handleRowClick : undefined
            }
            getRowClassName={(params) =>
              assignedItem?.some((item: any) => item.id === params.row.id)
                ? gridClasses.disabledRow
                : ""
            }
            hideFooterSelectedRowCount={true}
            paginationMode="server"
            components={{
              Toolbar(props) {
                return (
                  <GridCustomHeader
                    hideImport={hideImport}
                    hideAddNew={hideAddNew}
                    isSwitchBox={isSwitchBox}
                    direction={direction}
                    value={search}
                    handleEditPage={handleEditPage}
                    handleSearch={handleSearch}
                    searchText={t(Key(searchPlaceholder)) || "SEARCH"}
                    selectedRowIds={selectedRowIds}
                    statusChange={statusChange}
                    name={name}
                    byStore={byStore}
                    moduleType={moduleType}
                    showAssignBtn={showAssignBtn}
                    disabledAssign={!selectedRows.length}
                    handleAssign={handleAssign}
                  >
                    {" "}
                    {children}{" "}
                  </GridCustomHeader>
                );
              },
            }}
            localeText={{ noRowsLabel: t("NO_ROWS") as string }}
          />
          <Pagination
            classes={classes}
            page={page}
            firstPage={firstPage}
            previousPage={previousPage}
            newPage={newPage}
            totalPages={totalPages}
            pageNumberChange={pageNumberChange}
            mode={mode}
            lastPage={lastPage}
            nextPage={nextPage}
          />
        </div>
      )}
    </Box>
  );
};

export default CommonServerSidePaging;
