import { Avatar, Box, Checkbox, Skeleton, Stack, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import Icon from "src/@core/components/icon";
import { Product } from "./makeData";
import { useStyles } from "./price-list-style";

// import CustomInput from "src/views/forms/pickers/PickersCustomInput";
import TableHeader from "./table-header";

type dataType = (data: any) => any;

import * as React from "react";

import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { isValid } from "date-fns";
import Fuse from "fuse.js";
import moment from "moment";
import CommonActionRow from "./commonActionRow";
import Image from "next/image";

const isValidDate = (d: any) => {
  if (isValid(d)) {
    return moment(d).format("DD/MM/YYYY");
  }
  return moment(d).format("DD/MM/YYYY");
};

const fuseOptions = {
  keys: [
    "active",
    "conversion",
    "startDate",
    "endDate",
    "productName",
    "status",
    "minimumPrice",
    "price",
    "id",
    "productId",
    "sku",
    "productBrand",
    "productFamily",
    "productDivision",
    "productGroup",
    "productType",
    "productCategory",
  ],
  includeScore: true,
  threshold: 0.4,
};

function FullFeaturedCrudGrid({
  data,
  setData,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalCount,
  setDeletedProducts,
  setEditedProducts,
  searchLoading,
  deleteSelectedPageItems,
  updateOneRow,
  deleteAllProducts,
}: {
  data: Product[];
  setData: (innerfunction: dataType) => void;
  page: number;
  setPage: Function;
  pageSize: number;
  setPageSize: Function;
  totalCount: number;
  setDeletedProducts: Function;
  setEditedProducts: Function;
  searchLoading: boolean;
  deleteSelectedPageItems: Function;
  updateOneRow: (data: Record<string, any>) => Promise<void>;
  deleteAllProducts: () => Promise<void>;
}) {
  const fuse = new Fuse(data, fuseOptions);
  const [tableData, setTableData] = useState<any[]>(data);
  const [totalPages, setTotalPages] = useState(1);
  const [newPage, setNewPage] = useState(1);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [searchText, setSearchText] = useState("");
  const settings: any = window.localStorage.getItem("settings");
  const mode = JSON.parse(settings)?.mode;
  const direction = JSON.parse(settings)?.direction;
  const { t } = useTranslation();
  const handleDelete = (id: string | number, deleteId: string | number) => {
    if (!deleteId) {
      return;
    }
    deleteSelectedPageItems([deleteId?.toString()]);
  };

  const requestSearch = (searchValue: string) => {
    pageNumberChange(1);
  };

  const cancelSearch = () => {
    pageNumberChange(1);
  };

  const columns: GridColumns<any> = React.useMemo(
    () => [
      {
        field: "image",
        headerName: t("IMAGE") as string,
        editable: false,
        width: 70,
        renderCell: ({ row }: any) =>
          !row?.product?.image ? (
            <Skeleton
              animation={false}
              variant="rectangular"
              width={40}
              height={40}
              sx={{ background: row?.product?.hexCode }}
            />
          ) : (
            <Image
              alt={row?.shortName}
              src={row?.product?.image}
              height={40}
              width={40}
              style={{ borderRadius: "4px" }}
            />
          ),
        filterable: false,
      },

      {
        field: "productName",
        headerName: t("PRODUCT_NAME") as string,
        width: 200,
      },
      { field: "sku", headerName: t("SKU") as string },
      {
        field: "UOMId.name",
        headerName: t("UOM") as string,
        valueGetter: ({ row }: any) => {
          return row?.UOMId?.name;
        },
      },
      { field: "price", headerName: t("PRICE") as string },
      {
        field: "minimumPrice",
        headerName: t("MINIMUM_PRICE") as string,
      },

      {
        field: "startDate",
        headerName: t("START_DATE") as string,
        width: 140,
        renderCell: ({ row }: any) => (
          <span>{isValidDate(row?.startDate) as any}</span>
        ),
        valueGetter: ({ row }: any) => {
          return isValidDate(row?.startDate);
        },
      },
      {
        field: "endDate",
        headerName: t("END_DATE") as string,
        width: 140,
        renderCell: ({ row }: any) => (
          <span>{isValidDate(row?.endDate) as any}</span>
        ),
        valueGetter: ({ row }: any) => {
          return isValidDate(row?.endDate);
        },
      },
      {
        field: "conversion",
        headerName: t("CONVERSION") as string,
        width: 140,
        renderCell: ({ row }: any) => (
          <Checkbox checked={(row.conversion ?? false) as any} />
        ),
        filterable: false,
      },
      {
        field: "status",
        headerName: t("STATUS") as string,
        width: 100,
        renderCell: ({ row }: any) => (
          <Switch checked={(row.active ?? false) as any} />
        ),
        filterable: false,
      },
      {
        field: "actions",
        headerName: "",
        width: 200,
        filterable: false,
        renderCell: ({ row }: any) => {
          return (
            <div style={{ display: "flex" }}>
              <CommonActionRow
                row={row}
                onDelete={handleDelete}
                setEditedProducts={setEditedProducts}
                setData={setData}
                data={data}
                updateOneRow={updateOneRow}
              />
            </div>
          );
        },
      },
    ],
    [data]
  );

  useEffect(() => {
    let d = data;
    if (searchText) d = tableData;
    let pages = totalCount || 0;
    setTotalPages(Math.ceil(pages / pageSize));
  }, [data, searchText]);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
    setNewPage(1);
  };

  useEffect(() => {
    let d = data;
    if (searchText) d = tableData;
    let pages = totalCount || 0;
    setTotalPages(Math.ceil(pages / pageSize));
  }, [pageSize, searchText]);

  useEffect(() => {
    if (newPage === 0) setPage(1);
    setPage(newPage - 1);
  }, [newPage]);

  const classes = useStyles({ direction, newPage });

  const firstPage = () => {
    if (page > 0) setPage(0);
    setNewPage(1);
  };

  const lastPage = () => {
    const d = totalCount || 0;
    if (page < totalPages) setPage(totalPages - 1);
    setNewPage(Math.ceil(d / pageSize));
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

  const delRows = (tableData: any) =>
    tableData.filter(
      (d: any) => !selectedRows.some((sr) => sr["id"] == d["id"])
    );

  const deleteSelectedData = async () => {
    if (!selectedRows.length) return;
    const selectedIds = selectedRows.map((item: any) =>
      item?.deleteId?.toString()
    );
    await deleteSelectedPageItems(selectedIds);

    setSearchText("");
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          overflow: "auto",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <Box className={classes.grid}>
          <div style={{ position: "relative" }}>
            <DataGrid
              autoHeight
              rowHeight={52}
              rows={data}
              paginationMode={"server"}
              rowCount={totalCount}
              columns={columns || []}
              loading={searchLoading}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    productDivision: false,
                    productBrand: false,
                    productCategory: false,
                    productFamily: false,
                    productGroup: false,
                    productSubCategory: false,
                    conversion: false,
                  },
                },
              }}
              onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRows = data.filter((row) =>
                  selectedIDs.has(row.id)
                );
                setSelectedRows(selectedRows as unknown as any);
              }}
              // loading={false}
              rowsPerPageOptions={[10, 30, 50, 70, 100]}
              disableSelectionOnClick
              getRowId={(row: any) => row?.id ?? row?.productId}
              page={page}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) =>
                handlePageSizeChange(newPageSize)
              }
              checkboxSelection={true}
              componentsProps={{
                toolbar: {
                  value: searchText,
                  onChange: (searchVal: string) => requestSearch(searchVal),
                  onCancelSearch: () => cancelSearch(),
                  selectedRows,
                  deleteSelectedData,
                  tableData,
                  deleteAllProducts,
                },
              }}
              components={{
                Toolbar: TableHeader,
              }}
              localeText={{ noRowsLabel: t("NO_ROWS") as string }}
            />

            <Stack
              sx={{
                position: "absolute",
                bottom: "18px",
                right: "24px",
                direction: "ltr !important",
              }}
            >
              <Box className={classes.buttons}>
                <button
                  disabled={page === 0}
                  onClick={firstPage}
                  className={classes.arrowBtn}
                >
                  <Icon icon="tabler:chevrons-left" />
                </button>
                <button
                  disabled={page === 0}
                  onClick={previousPage}
                  className={classes.arrowBtn}
                >
                  <Icon icon="tabler:chevron-left" />
                </button>
                <input
                  disabled={newPage === totalPages}
                  className={classes.input}
                  type="text"
                  value={newPage || ""}
                  onChange={(e) => pageNumberChange(e.target.value)}
                />
                <span
                  className={classes.text}
                  style={
                    mode === "dark"
                      ? { color: "rgba(228, 230, 244, 0.87)" }
                      : { color: "rgba(51, 48, 60, 0.87)" }
                  }
                >
                  of
                </span>
                <button className={classes.arrowBtn} onClick={lastPage}>
                  {totalPages}
                </button>
                <button
                  disabled={page + 1 === totalPages}
                  onClick={nextPage}
                  className={classes.arrowBtn}
                >
                  <Icon icon="tabler:chevron-right" />
                </button>
                <button
                  disabled={page + 1 === totalPages}
                  onClick={lastPage}
                  className={classes.arrowBtn}
                >
                  <Icon icon="tabler:chevrons-right" />
                </button>
              </Box>
            </Stack>
          </div>
        </Box>
      </Box>
    </>
  );
}
export default FullFeaturedCrudGrid;
