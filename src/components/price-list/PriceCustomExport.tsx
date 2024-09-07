import { Box, Button, Grid, IconButton, Stack, TextField } from "@mui/material";
import {
  DataGrid,
  gridVisibleColumnFieldsSelector,
  gridVisibleRowCountSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
// ** Icon Imports
import Icon from "src/@core/components/icon";
import Translations from "src/layouts/components/Translations";
import MarkDownModal from "./mark-down-modal";
import { useStyles } from "./price-list-style";
import { FaPlus } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/useAuth";
import { getCurrentModulePermission, mapPermission } from "../roles-list/utils";
import { AppDispatch, RootState } from "src/store";
import { useDispatch } from "react-redux";
import { getPriceListData } from "src/store/apps/pricelist/price-list";
import { useSelector } from "react-redux";

interface GridCustomHeaderProps {
  handleEditPage: () => void;
  handleSearch: (value: string) => void;
  value: string;
  direction: string;
  searchText: string;
  name?: string;
  selectedRowIds: number | Array<>;
}

const GridCustomHeader: React.JSXElementConstructor<GridCustomHeaderProps> = (
  props: GridCustomHeaderProps
) => {
  let {
    handleEditPage,
    handleSearch,
    value,
    direction,
    searchText,
    name,
    selectedRowIds,
  } = props;
  const apiRef = useGridApiContext();
  const { t } = useTranslation();
  let ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState(false);
  const classes = useStyles({ direction });
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const handleClick = () => {
    let inputVal = ref?.current?.value;
    if (inputVal === "") {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
    handleSearch(inputVal);
  };

  const getFileName = () => {
    const path = pathname?.replace(/.$/, "");
    const index = path?.lastIndexOf("/") ?? 0;
    return path?.substring(index + 1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExport = () => {
    const hasRowsToExport = gridVisibleRowCountSelector(apiRef.current.state);
    const getVisisbleColumns = gridVisibleColumnFieldsSelector(
      apiRef.current.state
    )
      .filter((item) => item && item !== "__check__")
      .filter((item) => item !== "id");
    if (hasRowsToExport !== 0) {
      apiRef.current.exportDataAsCsv({
        utf8WithBom: true,
        fields: ["id", ...getVisisbleColumns],
        fileName: getFileName(),
      });
    }
  };

  const currentModuleName = router.route.substring(1).split("/")[0];

  const gettingPermission = auth?.user?.role.rolePermissions;
  const permission = mapPermission(gettingPermission);
  const currentModulePermission = getCurrentModulePermission(
    permission,
    currentModuleName
  );

  const isCreatePermissionEnabled =
    currentModulePermission && currentModulePermission.permissionType.Create;
  const isEditPermissionEnabled =
    currentModulePermission && currentModulePermission.permissionType.Edit;

  const isEditEnabledForButton = (condition: () => boolean) => {
    if (isEditPermissionEnabled) {
      return condition();
    }
    return false;
  };

  return (
    <>
      <Grid
        container
        className={classes.commonHeaderRoot}
        sx={{
          flexWrap: "wrap",
          flexDirection: { sm: "column", md: "row ", xs: "column" },
        }}
      >
        <Grid item container className={classes.search} sm={12} md={4}>
          <Grid
            item
            xs={8}
            sm={10}
            md={8}
            sx={{ marginRight: "5px", display: "flex" }}
          >
            <TextField
              inputRef={ref}
              size="small"
              fullWidth
              error={error}
              onChange={(e) => {
                setInput(e.target.value);
                if (!e.target.value.length) handleSearch("");
              }}
              placeholder={searchText}
              onKeyPress={(event: any) => {
                if (event.key === "Enter") {
                  handleClick();
                }
              }}
              defaultValue={name ? name : value}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleSearch("")}
                  >
                    {value?.length > 0 && <Icon icon="iconamoon:close" />}
                  </IconButton>
                ),
              }}
              sx={{
                mr: 2,
                "& .MuiInputBase-input": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Grid>

          <Button
            variant="outlined"
            size="medium"
            className={classes.search_button}
            onClick={() => handleClick()}
            sx={{ height: "35px" }}
          >
            <Icon fontSize="1.45rem" icon="tabler:search" />
          </Button>
        </Grid>
        <Grid
          item
          sm={12}
          md={7.5}
          sx={{ flexWrap: "wrap" }}
          className={classes.actionBtns}
        >
          <Button
            color="secondary"
            variant="outlined"
            sx={{
              px: 4,
              py: 2,
              textTransform: "unset",
              color: "#3586C7",
              backgroundColor:
                !isEditPermissionEnabled || selectedRowIds.length == 0
                  ? "inherit"
                  : "#DEEBF6",
              "@media (max-width: 550px)": {
                width: "100%",
              },
            }}
            startIcon={
              <LuArrowDownUp
                color={
                  selectedRowIds.length == 0 || !isEditPermissionEnabled
                    ? "inherit"
                    : "#3586C7"
                }
              />
            }
            onClick={() => setOpen(true)}
            disabled={
              !isEditEnabledForButton(() =>
                selectedRowIds.length == 0 ? false : true
              )
            }
          >
            {t("MARK_UP_AND_DOWN")}
          </Button>
          <Box
            sx={{
              "@media (max-width: 550px)": {
                width: "100%",
              },
            }}
          >
            <Button
              color="secondary"
              variant="outlined"
              sx={{
                px: 5,
                py: 2,
                marginRight: "10px",
                textTransform: "unset",
                "@media (max-width: 650px)": {
                  width: "45%",
                },
              }}
              startIcon={<Icon icon="tabler:download" />}
              disabled={!isCreatePermissionEnabled}
            >
              {t("IMPORT")}
            </Button>

            <Button
              color="secondary"
              variant="outlined"
              sx={{
                px: 5,
                py: 2,
                textTransform: "unset",
                "@media (max-width: 650px)": {
                  width: "45%",
                },
              }}
              startIcon={<Icon icon="tabler:upload" />}
              onClick={() => handleExport()}
            >
              {t("EXPORT")}
            </Button>
          </Box>
          <Button
            onClick={handleEditPage}
            disabled={!isCreatePermissionEnabled}
            variant="contained"
            className={classes.createRecordBtn}
            startIcon={<FaPlus size={"12px"} />}
            sx={{
              px: 5,
              py: 2,
              textTransform: "unset",
              "@media (max-width: 650px)": {
                width: "100%",
              },
            }}
          >
            <Translations text={"ADD_NEW"} />
          </Button>
        </Grid>
      </Grid>

      <MarkDownModal
        open={open}
        handleClose={handleClose}
        selectedRowIds={selectedRowIds}
        setOpen={setOpen}
      />
    </>
  );
};

interface PriceCustomExportProps {
  rows: any[];
  columns: any[];
  checkboxSelection: boolean;
  isLoading: boolean;
  handleEditPage: () => void;
  isTranslationPage?: boolean;
  name?: string;
  customerProfile?: boolean;
  customFieldsList?: boolean;
  userCreation?: boolean;
  searchStateHandler?: (value: string) => void;
}

const PriceCustomExport = (props: PriceCustomExportProps) => {
  const { t } = useTranslation();
  const settings: any = window.localStorage.getItem("settings");
  const mode = JSON.parse(settings)?.mode;
  const direction = JSON.parse(settings)?.direction;
  const {
    rows,
    columns,
    checkboxSelection,
    handleEditPage,
    isTranslationPage = false,
    name,
    customerProfile,
    customFieldsList,
    userCreation = false,
  } = props;

  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(name ?? "");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newPage, setNewPage] = useState(1);
  const [selectedRowIds, setSelectedRowIds] = useState<
    { priceListId: string }[]
  >([]);

  const [pageLoading, setPageLoading] = useState(false);

  const rowCount = useSelector(
    (state: RootState) => state.priceListData.totalCount
  );

  let searchText: string = t("SEARCH_CUSTOMER_GROUPS");
  if (isTranslationPage) searchText = t("TRANSLATION_SEARCH");
  if (customerProfile) searchText = t("SEARCH_WITH_NAME");
  if (customFieldsList) searchText = t("SEARCH_WITH_NAME_AND_FORMAT");
  if (userCreation) searchText = t("SEARCH_WITH_USER_ID");

  const dispatch = useDispatch<AppDispatch>();

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

  const handleSearch = (value: string) => {
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
      getPriceListData({ skip: page, limit: pageSize, search })
    );

    fetch.then(() => setPageLoading(false)).catch(console.error);

    return () => fetch.abort();
  }, [pageSize, newPage, page, search]);

  return (
    <Box className={classes.grid}>
      <div style={{ position: "relative" }}>
        <DataGrid
          autoHeight
          rowHeight={56}
          rows={rows}
          rowCount={rowCount}
          columns={columns || []}
          loading={pageLoading}
          rowsPerPageOptions={[10, 30, 50, 70, 100]}
          disableSelectionOnClick
          getRowId={(row: any) => row?.id}
          page={page}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
          checkboxSelection={checkboxSelection || true}
          onSelectionModelChange={(selectionModel: any) =>
            setSelectedRowIds(selectionModel.map((id) => ({ priceListId: id })))
          }
          paginationMode="server"
          components={{
            Toolbar(props) {
              return (
                <GridCustomHeader
                  direction={direction}
                  value={search}
                  handleEditPage={handleEditPage}
                  handleSearch={handleSearch}
                  searchText={searchText}
                  selectedRowIds={selectedRowIds}
                  // name={name}
                />
              );
            },
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
              pattern="[0-9]+"
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
  );
};

export default PriceCustomExport;
