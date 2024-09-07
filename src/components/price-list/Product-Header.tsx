import {
  Box,
  Button,
  Grid,
  TextField,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Icon from "src/@core/components/icon";
import { useState, useRef } from "react";
import Fuse from "fuse.js";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useDispatch } from "react-redux";
import { setFilteredResult } from "src/store/apps/product-list";
import {
  clearCheckedItems,
  clearEverything,
  cloneData,
  closeAddProduct,
} from "src/store/apps/product-items";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import { getPriceListByID, priceUpdate } from "src/store/apps/price-list";
import { redirect, useRouter } from "next/navigation";
import moment from "moment";
import { Product } from "src/components/price-list/makeData";
import { ROOT_BASE_API } from "src/store/apps";
import { decryptPriceId, encryptPriceId } from "src/utils/utils";
import { axiosInstance } from "src/configs/axios";

const fetchJobStatus = async (jobId: any) => {
  try {
    const res = await axiosInstance.get(
      `pricelist/checkpriceliststatus/${jobId}`
    );
  } catch (err) {
    console.log(err, "error while fetching job status");
  }
};

const fuseOptions = {
  keys: ["altShortName", "code", "shortName"],
  includeScore: true,
  threshold: 0.4,
};
const ProductHeader = ({
  setQuery,
  query,
  isAllEverSelected,
  isEdit,
  deletedPreItem,
  newSelectedItem,
  isEditAllSelected,
  needToDelete,
  setNeedToDelete
}: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleGoBack = (clear = false) => {
    if (clear) {
      dispatch(clearCheckedItems());
    } else dispatch(cloneData());
    dispatch(closeAddProduct());
    router.back();
  };
  const getProducts = useSelector(
    (root: RootState) => root.getProductSlice.data
  );
  const allProductSelected = useSelector(
    (root: RootState) => root.checkedItemsSlice.isAllSelected
  );

  const checkedItems = useSelector(
    (root: RootState) => root.checkedItemsSlice.productData
  );

  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const fuse = new Fuse(getProducts, fuseOptions);
  const theme = useTheme();

  const handleClick = () => {
    if (!input) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      setQuery((p) => ({ ...p, searchItem: null }));
      return;
    }
    try {
      setQuery((p) => ({ ...p, searchItem: input }));
    } catch (e) { }
  };

  const searchBox = {
    mr: 2,
    borderRadius: "7px",
  };

  const prepairPayload = (selectedItems: any, isAllEverSelected: any) => {
    const tableData: Product[] = Object.values(
      isEdit ? newSelectedItem : selectedItems
    );

    let deSelectedProductIds = [];
    if (isEdit) {
      deSelectedProductIds = Object.keys(newSelectedItem).filter(
        (item) => !newSelectedItem[item]
      );
    } else {
      deSelectedProductIds = Object.keys(selectedItems).filter(
        (item) => !selectedItems[item]
      );
    }

    if (isAllEverSelected) {
      const deSelectedProductIdsPayload = deSelectedProductIds.map(
        (item: any) => {
          const id = {
            productId: item?.toString(),
          };
          return id;
        }
      );
      return deSelectedProductIdsPayload;
    }

    let productPrice = [];

    for (const data of tableData) {
      if (data) {
        productPrice.push({
          price: data.price,
          UOMId: data?.UOMId?.id,
          sku: data.sku,
          minimumPrice: data.minimumPrice,
          productId: data.productId,
          startDate: moment(data.startDate).format("YYYY-MM-DD"),
          endDate: moment(data.endDate).format("YYYY-MM-DD"),
          active: data.active,
          conversion: data.conversion,
          status: data.status,
          companyId: data.companyId,
          tenantId: data.tenantId,
        });
      }
    }
    return productPrice;
  };

  const deleteProducts = async (id: string, all?: boolean) => {
    let token = localStorage.getItem("accessToken");
    token = token ? `Bearer ${token}` : null;
    await fetch(ROOT_BASE_API + "ProductPriceList", {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify({
        priceListId: id,
        productIds: deletedPreItem,
        ...(all && { all }),
      }),
    }).catch(console.log);
  };

  const handleSubmit = async () => {
    let params = new URL(document.location as any).searchParams;
    const id = params.get("id") || "";
    const firstEdit = params.get("isFirstEdit") || "";
    const priceListId = decryptPriceId(id);

    if (!priceListId) return;

    try {
      setIsDisable(true);
      let data = {
        id: priceListId,
        all: true,
        ...query,
      };

      if ("limit" in data)
        delete data.limit

      if ("skip" in data)
        delete data.skip

      if (!allProductSelected && !isEditAllSelected) {
        data["all"] = isAllEverSelected;
        data["productPrice"] = prepairPayload(checkedItems, isAllEverSelected);
      }

      if (!firstEdit && !allProductSelected && !isAllEverSelected && needToDelete && data?.all === false) {
        await deleteProducts(priceListId, true);
        setNeedToDelete(false);
      } else if (isEdit && deletedPreItem?.length) {
        await deleteProducts(priceListId);
      }

      // return;
      let jobId = null;
      if (data?.all) {
        const resp = await dispatch(priceUpdate(data));
        if (resp.payload?.jobId) {
          jobId = resp.payload?.jobId;
        }
      }
      if (!isAllEverSelected && data?.productPrice?.length) {
        delete data.all;
        const resp = await dispatch(priceUpdate(data));
        if (resp.payload?.jobId) {
          jobId = resp.payload?.jobId;
        }
      }
      dispatch(clearEverything());
      let redirectUrl = `create-price/?id=${encodeURIComponent(
        id
      )}&isEdit=${true}`;

      if (data?.all) {
        redirectUrl += "&reload=true";
      }

      if (jobId) {
        fetchJobStatus(jobId);
      }

      router.push(redirectUrl);
      setIsDisable(false);
    } catch (e) {
      console.log(e, "error");
    }
    // } finally {
    //   setIsDisable(false);
    // }
  };

  return (
    <>
      <Box sx={{ flexWrap: "wrap" }}>
        <Grid container spacing={2} py={4} px={2}>
          <Grid item xs={12} sm={12} md={4}>
            <Box
              sx={{
                "@media (max-width: 420px)": {
                  width: "100%",
                },
              }}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={3}
            >
              <TextField
                value={input}
                size="small"
                fullWidth
                sx={
                  theme.palette.mode === "dark"
                    ? { ...searchBox, background: "rgba(255, 255, 255, .05)" }
                    : { ...searchBox, background: "white" }
                }
                error={error}
                onChange={(e) => {
                  if (!e.target.value)
                    setQuery((p) => ({
                      ...p,
                      skip: 0,
                      limit: 10,
                      searchItem: null,
                    }));
                  setInput(e.target.value);
                }}
                placeholder={t("SEARCH_BY_PRODUCT") as string}
                onKeyPress={(event: any) => {
                  if (event.key === "Enter") {
                    handleClick();
                  }
                }}
                defaultValue={""}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{ height: "30px" }}
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setInput("");
                        setQuery((p) => ({
                          ...p,
                          skip: 0,
                          limit: 10,
                          searchItem: null,
                        }));
                      }}
                    >
                      <Icon
                        fontSize="1.45rem"
                        icon="iconamoon:close"
                        opacity={Number(input.length > 0)}
                      />
                    </IconButton>
                  ),
                }}
              />

              <Button
                variant="outlined"
                sx={
                  theme.palette.mode === "dark"
                    ? { ...searchBox, background: "rgba(255, 255, 255, .05)" }
                    : { ...searchBox, background: "white" }
                }
                size="medium"
                onClick={() => handleClick()}
              >
                <Icon fontSize="1.8rem" icon="tabler:search" />
              </Button>
            </Box>
          </Grid>
          <Grid
            sx={{
              "@media (max-width: 420px)": {
                visibility: "hidden",
              },
            }}
            item
            xs={4}
          ></Grid>
          <Grid
            sx={{
              "@media (max-width: 420px)": {
                visibility: "hidden",
              },
            }}
            item
            xs={2}
          ></Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            alignSelf={"flex-end"}
            display={"flex"}
            justifyContent={"space-between"}
            gap={3}
          >
            <Button
              onClick={() => handleGoBack(true)}
              variant="contained"
              color="secondary"
              size="medium"
              fullWidth
            >
              {t("BACK")}
            </Button>
            <LoadingButton
              onClick={handleSubmit}
              variant="contained"
              size="medium"
              fullWidth
              disabled={isDisable}
              sx={{ textTransform: "none" }}
              loading={isDisable}
              loadingPosition="start"
            >
              {t("DONE")}
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProductHeader;
