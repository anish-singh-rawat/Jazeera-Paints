import {
  Button,
  Chip,
  CircularProgress,
  Container,
  FormHelperText,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Stack,
  styled,
  Tooltip,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import * as React from "react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "src/@core/components/spinner";
import { AppDispatch, RootState } from "src/store";
import {
  deSelectAll,
  setIsAllSelected,
  toggleAllSelected,
  toggleChecked,
  selectAll,
} from "src/store/apps/product-items";
import { fetchMoreProduct } from "src/store/apps/product-list";
import {
  fetchProductbrandspricelist,
  fetchproductcategorypricelist,
  fetchProductdivisionspricelist,
  fetchProductfamilypricelist,
  fetchproductgroupspricelist,
  fetchproductsubcategorypricelist,
  fetchProducttypesspricelist,
} from "src/store/apps/product/product-add";
import { v4 } from "uuid";
import ResponsiveDialog from "../common/CommonDialog";
import FilterTreeView from "./filter-tree-view";
import { useStyles } from "./price-list-style";
import ProductList from "./product-list";

export enum productFilter {
  productClassification = "productClassification",
  productCategoryId = "productCategoryId",
  productBrandId = "productBrandId",
  productSubCategoryId = "productSubCategoryId",
  productDivisionId = "productDivisionId",
  productFamilyId = "productFamilyId",
  productGroupId = "productGroupId",
  productTypeId = "productTypeId",
}

interface FilteredItemProps {
  readonly handleChange: (
    checked: boolean,
    item: Record<string, any>,
    type: productFilter
  ) => void;
  readonly checkedItem: [];
  readonly selectedItems: [];
  readonly handleClearAll: () => void;
  readonly getProducts: [];
  readonly getProductsList: [];
  readonly expanded: string | false;
  readonly setExpanded: React.Dispatch<React.SetStateAction<string | false>>;
  readonly handleChangeAccordion: (
    panel: string
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
  readonly searchQuery: string;
  readonly whatItemsAreChecked: any;
  readonly setIsAllEverSelected: any;
  readonly preSelectedItem: any;
  readonly setPreSelectedItem: any;
  readonly setDeletedPreItem: any;
  readonly isEdit: boolean;
  readonly newSelectedItem: any;
  readonly setNewSelectedItem: any;
  readonly isEditAllSelected: boolean;
  readonly setIsEditAllSelected: Function;
  readonly preAllSelected: boolean;
  readonly setPreAllSelected: Function;
  readonly needToShowLoading:boolean;
}

const GridStyle = styled(Grid)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "#FFF",
  top: 0,
  width: "100%",
  height: "100%",
  overflowY: "auto",
  boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
  // marginRight:'20px'
}));

const BoxStyle = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "#f3f3f3",
  width: "100%",
  // padding: "13px",
  marginTop: "10px",
}));

const BoxView = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "none" : "#FFF",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const GridView = styled(Grid)(({ theme }) => ({
  // backgroundColor:
  //   theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "#fff",
  // overflowY: "auto",
}));

type paging = {
  limit: number;
  skip: number;
};

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

export default function FilteredItem({
  handleChange,
  checkedItem,
  selectedItems,
  handleClearAll,
  getProducts,
  getProductsList,
  expanded,
  setExpanded,
  handleChangeAccordion,
  searchQuery,
  whatItemsAreChecked,
  setIsAllEverSelected,
  preSelectedItem,
  setPreSelectedItem,
  setDeletedPreItem,
  isEdit,
  newSelectedItem,
  setNewSelectedItem,
  isEditAllSelected,
  setIsEditAllSelected,
  preAllSelected,
  setPreAllSelected,
  needToShowLoading
}: FilteredItemProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(
    (state: RootState) => state.getProductSlice.isMoreProductLoading
  );

  const [limit, setLimit] = useState<paging>({ limit: 10, skip: 0 });

  const isAllSelected = useSelector(
    (state: RootState) => state.checkedItemsSlice.isAllSelected
  );

  const [allProductStore, setAllProductStore] = useState<any>(null);
  const [checked, setChecked] = useState({ first: false, last: false });
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(true);
  const checkedElements = useSelector(
    (state: RootState) => state.checkedItemsSlice.productData
  );

  const isProductLoading = useSelector(
    (state: RootState) => state.getProductSlice.isLoading
  );

  const filterdProduct = useSelector(
    (state: RootState) => state.getProductSlice.filterdData
  );

  const totalCount =
    useSelector((state: RootState) => state.getProductSlice.ProductCount) || 1;

  const [chipCount, setChipCount] = useState<boolean>(false);

  const transformProduct = (product: any) => {
    return {
      active: product?.active,
      companyId: product?.companyId,
      conversion: false,
      startDate: new Date(),
      endDate: new Date(),
      image: product.image,
      productName: product?.shortName,
      status: product?.active,
      tenantId: product?.tenantId,
      minimumPrice: product?.retailPrice,
      price: product?.retailPrice,
      id: product?.id,
      isTaxesIncluded: product?.isTaxesIncluded,
      productId: product?.id,
      sku: product?.code,
      UOMId: product?.salesUOM,
      productBrand: product?.productBrand?.name,
      productFamily: product?.productFamily?.name,
      productDivision: product?.productDivision?.name,
      productGroup: product?.productGroup?.name,
      productSubCategory: product?.productSubCategory?.name,
      productType: product?.productType?.name,
      productCategory: product?.productCategory?.name,
    };
  };

  const handleCheckedProducts = (item: any) => {
    let newPreSelectedItem = { ...preSelectedItem };
    let newItem = { ...newSelectedItem };
    if (isSelected) return;

    if (isAllSelected || (isEditAllSelected && Array.isArray(getProducts))) {
      if (isEdit) {
        getProducts.map((product: any) => {
          if (!newPreSelectedItem[product?.id]) {
            newItem[product?.id] = transformProduct(product);
          }
        });
        setNewSelectedItem(newItem);
      } else dispatch(selectAll(getProducts));
      if (!preAllSelected) {
        setIsAllEverSelected(true);
      }
      setPreAllSelected(false);
    }

    if (preSelectedItem[item?.id]) {
      setDeletedPreItem((prev: any) => [...prev, item?.id?.toString()]);
      let newPreSelectedItem = { ...preSelectedItem };
      delete newPreSelectedItem[item?.id];
      setPreSelectedItem(newPreSelectedItem);
    } else {
      let newItems = { ...newItem };
      if (newItems[item?.id]) {
        newItems[item?.id] = null;
      } else {
        newItems[item?.id] = transformProduct(item);
      }
      setNewSelectedItem(newItems);
    }
    dispatch(toggleChecked(item));
    dispatch(setIsAllSelected(false));
    setIsEditAllSelected(false);
  };

  const deSelectAllEdit = () => {
    let newPreSelectedItem = { ...preSelectedItem };
    let deSelectedPreItems = getProducts.map((product: any) => {
      if (newPreSelectedItem[product?.id]) {
        delete newPreSelectedItem[product?.id];
        return product?.id?.toString();
      }
    });
    setPreSelectedItem(newPreSelectedItem);
    // deSelectedPreItems = deSelectedPreItems.filter((d) => !!d);
    // setDeletedPreItem((prev: any) => [...prev, ...deSelectedPreItems]);
    setNewSelectedItem({});
  };

  const handleSelectAll = async (_: any, checked: boolean) => {
    if (!checked) {
      if (isEdit) {
        setPreAllSelected(false);
        deSelectAllEdit();
      } else dispatch(deSelectAll());
    }
    if (isEdit) {
      setIsEditAllSelected((prev: boolean) => !prev);
    } else dispatch(toggleAllSelected());
  };

  useEffect(() => {
    Promise.allSettled([
      dispatch(fetchProductdivisionspricelist()),
      dispatch(fetchProductbrandspricelist()),
      dispatch(fetchproductcategorypricelist()),
      dispatch(fetchproductsubcategorypricelist()),
      dispatch(fetchproductgroupspricelist()),
      dispatch(fetchProducttypesspricelist()),
      dispatch(fetchProductfamilypricelist()),
    ])
      .then(() => setLoading(false))
      .catch(console.error);
  }, []);

  const fetchData = useCallback(async () => {
    if (isSelected) return;
    const q: any = {};
    for (const key of Object.keys(searchQuery)) {
      if (Array.isArray(searchQuery[key as any]))
        q[key] = searchQuery[key as any]!.join();
      else q[key] = searchQuery[key as any];
    }
    const newItems = await dispatch(fetchMoreProduct({ ...limit, ...q }));
    if (!newItems.payload?.data) {
      return;
    }
    // setLimit((p) => ({ skip: p.skip + 10, limit: 10 }));
  }, [limit, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [limit.skip, limit.limit]);

  const theme = useTheme();

  const boxStyle = {
    position: "relative",
    height: "100%",
    // background: "#FFF",
    borderRadius: "14px",
    // marginRight:"300px",
    // backgroundColor: "#F8F7FA",
  };

  const showPagination = () => {
    if (isProductLoading) return false;
    if (filterdProduct && filterdProduct.length) return false;
    if (!getProducts.length) {
      return false;
    }
    if (totalCount < 10) return false;

    return true;
  };
  const chipNeedToMap = Object.values(whatItemsAreChecked || {});

  function len() {
    if (chipCount) return chipNeedToMap.length;
    if (chipNeedToMap?.length > 6) return 6;
    return chipNeedToMap.length;
  }

  const allproduct = {
    height: "inherit",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "100%",
    "&.MuiGrid-root": {
      maxWidth: "22%",
      minHeight: "100%",
    },
  };

  return (
    <BoxStyle id="scrollableDiv">
      <Grid
        container
        // spacing={21}
        sx={
          theme.palette.mode == "dark"
            ? { ...boxStyle, background: "rgb(48,52,70)" }
            : { ...boxStyle, background: "#FFF", backgroundColor: "#F8F7FA" }
        }
        justifyContent={"space-between"}
      >
        <GridStyle
          item
          xs={3}
          sx={
            theme.palette.mode == "dark"
              ? { ...allproduct, background: "rgb(48,52,70)" }
              : { ...allproduct, background: "#fff" }
          }
        >
          <BoxView
            sx={{
              display: "flex",
              marginRight: (theme) => (theme.palette.mode === "dark" ? 4 : 0),
            }}
          >
            <FilterTreeView
              handleChange={handleChange}
              checkedItem={checkedItem}
              selectedItems={selectedItems}
              handleChangeAccordion={handleChangeAccordion}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          </BoxView>
          <Box alignSelf={"center"} justifySelf={"flex-end"}>
            <Button
              onClick={() => {
                handleClearAll();
                setLimit({ limit: 10, skip: 0 });
              }}
              sx={{ my: 8 }}
              variant="outlined"
            >
              {t("CLEAR_ALL")}
            </Button>
          </Box>
        </GridStyle>
        <GridView item xs={9}>
          <Stack>
            <Box
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "rgb(48,52,70)" : "#fff",
                marginBottom: "20px",
                py: "10px",
                px: "10px",
                display: !chipNeedToMap.length ? "none" : "block",
              }}
            >
              {chipNeedToMap.slice(0, len()).map((p) => (
                <Chip
                  label={p?.item?.name}
                  key={p?.item?.id}
                  onDelete={() => handleChange(false, p?.item, p?.type)}
                  sx={{ mx: 1, my: 1 }}
                  size="small"
                />
              ))}
              {chipNeedToMap?.length > 6 && (
                <Chip
                  label={!chipCount ? t("SHOW_ALL") : t("HIDE")}
                  onClick={(e) => setChipCount((p) => !p)}
                  sx={{ mx: 1, my: 1 }}
                  size="small"
                  color={!chipCount ? "primary" : "error"}
                />
              )}
              {chipNeedToMap?.length && (
                <Chip
                  label={t("CLEAR_ALL")}
                  key={v4()}
                  onClick={handleClearAll}
                  sx={{ mx: 1, my: 1 }}
                  size="small"
                  color={"success"}
                />
              )}
            </Box>
            <Stack
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark" ? "rgb(48,52,70)" : "#fff",
              }}
            >
              {isProductLoading || isLoading || needToShowLoading ? (
                <Loader />
              ) : (
                <Container>
                  <List>
                    <ListItem>
                      {(filterdProduct && !filterdProduct.length) ||
                        !getProducts.length ? (
                        !loading && <p>No Results Found...</p>
                      ) : (
                        <>
                          <ListItemIcon>
                            <Checkbox
                              checked={isAllSelected || isEditAllSelected}
                              edge="start"
                              inputProps={{ "aria-labelledby": "Select ALL" }}
                              tabIndex={-1}
                              onChange={handleSelectAll}
                            />
                          </ListItemIcon>
                          <ListItemText primary={t("ALL")} />{" "}
                          {isSelected && <CircularProgress size="1rem" />}
                        </>
                      )}
                    </ListItem>

                    <Box>
                      {!filterdProduct
                        ? Array.isArray(getProducts) &&
                        getProducts.map((item: any) => {
                          return (
                            <ProductList
                              key={v4()}
                              isChecked={
                                isEdit
                                  ? isEditAllSelected ||
                                  preSelectedItem[item?.id] ||
                                  newSelectedItem[item?.id]
                                  : isAllSelected || checkedElements[item?.id]
                              }
                              item={item}
                              handleCheckedProducts={handleCheckedProducts}
                            />
                          );
                        })
                        : filterdProduct.map(({ item }) => {
                          return (
                            <ProductList
                              key={v4()}
                              isChecked={
                                isAllSelected ||
                                checkedElements[item?.id as any]
                              }
                              item={item}
                              handleCheckedProducts={handleCheckedProducts}
                            />
                          );
                        })}
                      {loading && (
                        <LinearProgress
                          sx={{
                            width: "100%",
                            height: 4,
                            "& > * + *": (theme) => ({
                              marginTop: theme.spacing(2),
                            }),
                          }}
                        />
                      )}
                    </Box>
                  </List>
                </Container>
              )}
              {showPagination() && (
                <ProductPagination pagination={limit} setLimit={setLimit} />
              )}
            </Stack>
          </Stack>
        </GridView>
      </Grid>
    </BoxStyle>
  );
}

interface ProductPaginationProps {
  pagination: paging;
  setLimit: Dispatch<SetStateAction<paging>>;
}

export const ProductPagination = ({
  setLimit,
  pagination: { limit, skip },
}: ProductPaginationProps) => {
  const { t } = useTranslation();
  const settings: any = window.localStorage.getItem("settings");
  const direction = JSON.parse(settings)?.direction;
  const totalCount =
    useSelector((state: RootState) => state.getProductSlice.ProductCount) || 1;

  const classes = useStyles({ direction });

  const paginationCount = Math.ceil(totalCount / limit);

  return (
    <Box className={classes.grid}>
      <div style={{ position: "relative" }}>
        <TablePagination
          count={totalCount}
          page={skip}
          onPageChange={(event, newPage) => {
            console.log("not implemented");
          }}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) =>
            setLimit((p) => ({ ...p, limit: +e.target.value }))
          }
          sx={{
            borderBottom: "none",
          }}
        />
        <Stack
          sx={{
            position: "absolute",
            bottom: "22px",
            right: "24px",
            direction: "1tr !important",
          }}
        >
          <Box className={classes.buttons}>
            <Pagination
              count={paginationCount}
              variant="outlined"
              shape="rounded"
              onChange={(e, skip) =>
                setLimit((p) => ({ ...p, skip: skip - 1 }))
              }
            />
          </Box>
        </Stack>
      </div>
    </Box>
  );
};

export const SelectOptions = (props: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  checked: { first: boolean; last: boolean };
  setChecked: React.Dispatch<SetStateAction<{ first: boolean; last: boolean }>>;
  dynamicToolTip: { start: number; end: number; total: number };
  loadingState: boolean;
  submitFunction: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <ResponsiveDialog
      dialogBoxTitle={t("SELECT_ALL_ITEMS")}
      dialogComponent={() => (
        <Box display={"flex"} flexDirection={"column"}>
          <div>
            <BpCheckbox
              id="select_all"
              defaultChecked
              checked={props.checked.first}
              onChange={(e, checked) =>
                props.setChecked({ first: checked, last: false })
              }
            />
            <Tooltip title={`${t("SELECT_PAGE_ITEMS")}`} arrow>
              <label htmlFor="select_all">
                {t("SELECT_ALL_FROM_THIS_PAGE")}
              </label>
            </Tooltip>
          </div>
          <div>
            <BpCheckbox
              id="select_entire"
              checked={props.checked.last}
              onChange={(e, checked) =>
                props.setChecked({ last: checked, first: false })
              }
            />

            <label htmlFor="select_entire">{t("SELECT_ENTIRE_PRODUCTS")}</label>
            <FormHelperText
              error={true}
              sx={{ opacity: Number(props.checked.last) }}
            >{`${t("SELECT_ALL")} ${props.dynamicToolTip.total} ${t(
              "ITEMS"
            )} - ${t("DATA_FETCHING_MAY_TAKE_SOME_TIME")}`}</FormHelperText>
          </div>
        </Box>
      )}
      handleSubmit={props.submitFunction}
      loadingState={props.loadingState}
      open={props.open}
      setOpen={props.setOpen}
      clearPrevState={() => { }}
    />
  );
};

function BpCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      sx={{
        "&:hover": { bgcolor: "transparent" },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      {...props}
    />
  );
}
