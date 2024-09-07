import { Grid, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProductHeader from "src/components/price-list/Product-Header";
import FilteredItem from "src/components/price-list/filtered-Item";
import { AppDispatch } from "src/store";
import { getProductData } from "src/store/apps/product-list";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { getPriceListByID } from "src/store/apps/price-list";
import { useRouter } from "next/router";
import { axiosInstance } from "src/configs/axios";
import { decryptPriceId } from "src/utils/utils";

enum productFilter {
  productClassification = "productClassification",
  productCategoryId = "productCategoryId",
  productBrandId = "productBrandId",
  productSubCategoryId = "productSubCategoryId",
  productDivisionId = "productDivisionId",
  productFamilyId = "productFamilyId",
  productGroupId = "productGroupId",
  productTypeId = "productTypeId",
}

interface CheckedItem {
  [key: string | number]: { [key: string]: boolean };
}

interface Query {
  [key: string | number]: string[] | undefined | any;
}

interface ProductItem {
  id: number;
}

const GridComponent = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "rgb(48, 52, 70)" : "#FFF",
  marginBottom: "5px",
}));

export default function AddProduct() {
  const [checkedItem, setCheckedItem] = useState<CheckedItem>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [query, setQuery] = useState<Query>({});
  const dispatch = useDispatch<AppDispatch>();
  const [hasMore, setHasMore] = useState(true);
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [whatItemsAreChecked, setItemsChecked] = useState<any>({});
  const [priceListId, setPriceListId] = useState<string | null>(null);
  const [isAllEverSelected, setIsAllEverSelected] = useState<boolean>(false);
  const [preSelectedItem, setPreSelectedItem] = useState<any>({});
  const [deletedPreItem, setDeletedPreItem] = useState<any>([]);
  const [newSelectedItem, setNewSelectedItem] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditAllSelected, setIsEditAllSelected] = useState<boolean>(false);
  const [preAllSelected, setPreAllSelected] = useState<boolean>(false);
  const [totalSelectedProducts, setTotalSelectedProducts] = useState<number>(0);
  const [needToDelete, setNeedToDelete] = useState(false);
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const getProducts =
    useSelector((state: RootState) => state.getProductSlice.data) || [];

  const totalCount =
    useSelector((state: RootState) => state.getProductSlice.ProductCount) || 1;

  const getPreSelectedItems = async (id: string | string[]) => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(
        `pricelist/productpricelistids/${id}`
      );
      const mappedData: any = {};
      const data = res.data?.data;
      if (Array.isArray(data)) {
        if (data.length) setTotalSelectedProducts(data.length);
        for (let i = 0; i < data.length; i++) {
          const id = data[i]?.productId;
          mappedData[id] = id;
        }
      }
      setPreSelectedItem(mappedData);
    } catch (e) {
      console.log(e, "error");
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    const q: Query = {};
    for (const key of Object.keys(query)) {
      if (Array.isArray(query[key])) q[key] = query[key]!.join();
      else q[key] = query[key];
    }

    const fetch = dispatch(getProductData(q));

    return () => fetch.abort();
  }, [query]);

    useEffect(() => {
    if (router.isReady) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryId = urlParams.get("id");
      const id = decryptPriceId(queryId || "");
      const isEdit = urlParams.get("isEdit");
      const isFirstEdit = urlParams.get("isFirstEdit");
      if (isEdit && id && !isFirstEdit) {
        getPreSelectedItems(id);
        setIsEdit(true);
      }
    }
    return () => {
      setIsEdit(false);
      setPreSelectedItem({});
      setIsAllEverSelected(false);
      setIsEditAllSelected(false);
    };
  }, [router.isReady]);

  useEffect(() => {
    if (totalSelectedProducts === totalCount) {
      setIsEditAllSelected(true);
      setPreAllSelected(true);
      setNeedToDelete(true); 
    } else {
      setIsEditAllSelected(false);
      setPreAllSelected(false);
    }
  }, [router.isReady, totalCount, totalSelectedProducts]);

  const handleChange = (
    checked: boolean,
    item: ProductItem,
    type: productFilter
  ) => {
    const oldTypes = checkedItem[type] || {};
    setHasMore(true);
    setCheckedItem((p) => ({
      ...p,
      [type]: { ...oldTypes, [item.id]: checked },
    }));
    if (whatItemsAreChecked?.[item.id]) {
      delete whatItemsAreChecked?.[item.id];
      setItemsChecked(whatItemsAreChecked);
    } else setItemsChecked((p) => ({ ...p, [item.id]: { item, type } }));
    if (checked && query[type]) {
      const queryString = [...query[type]!, item.id];
      setQuery((p) => ({ ...p, [type]: queryString }));
      return;
    }

    if (!checked && query[type]) {
      const queryString = query[type]!.filter((d: any) => d !== item.id);
      setQuery((p) => ({ ...p, [type]: queryString }));
      return;
    }

    const queryString = [item.id];
    setQuery((p) => ({ ...p, [type]: queryString }));
  };

  const handleClearAll = () => {
    setQuery({});
    setCheckedItem({});
    setItemsChecked({});
    setHasMore(true);
  };

  return (
    <Grid container>
      <GridComponent item xs={12} boxShadow={1}>
        <ProductHeader
          query={query}
          priceListId={priceListId}
          isAllEverSelected={isAllEverSelected}
          isEdit={isEdit}
          deletedPreItem={deletedPreItem}
          newSelectedItem={newSelectedItem}
          isEditAllSelected={isEditAllSelected}
          setQuery={setQuery}
          needToDelete={needToDelete}
          setNeedToDelete={setNeedToDelete}
        />
      </GridComponent>
      <Grid item xs={12} overflow={"hidden"}>
        <FilteredItem
          handleChange={handleChange}
          checkedItem={checkedItem}
          selectedItems={selectedItems}
          handleClearAll={handleClearAll}
          getProducts={getProducts}
          handleChangeAccordion={handleChangeAccordion}
          expanded={expanded}
          setExpanded={setExpanded}
          searchQuery={query}
          hasMore={hasMore}
          setHasMore={setHasMore}
          whatItemsAreChecked={whatItemsAreChecked}
          setIsAllEverSelected={setIsAllEverSelected}
          preSelectedItem={preSelectedItem}
          setPreSelectedItem={setPreSelectedItem}
          setDeletedPreItem={setDeletedPreItem}
          newSelectedItem={newSelectedItem}
          setNewSelectedItem={setNewSelectedItem}
          isEdit={isEdit}
          isEditAllSelected={isEditAllSelected}
          setIsEditAllSelected={setIsEditAllSelected}
          preAllSelected={preAllSelected}
          setPreAllSelected={setPreAllSelected}
          needToShowLoading={loading}
        />
      </Grid>
    </Grid>
  );
}
