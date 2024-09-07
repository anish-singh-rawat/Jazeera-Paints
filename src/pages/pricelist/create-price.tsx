import { Box, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import FallbackSpinner from "src/@core/components/spinner";
import DesideTableOrSetupGrid from "src/components/price-list/deside-table-or-setup-screen";
import EditPricelistModal from "src/components/price-list/editPricelist-modal";
import usePriceListForm from "src/components/price-list/generate-pl-formschema";
import {
  bgColor,
  containerStyle,
} from "src/components/price-list/price-list-style";
import PriceListForm from "src/components/price-list/pricelist-form";
import PricelistProductLoader from "src/components/price-list/pricelist-product-loader";
import usePriceListTable from "src/components/price-list/pricelist-tablehook";
import SaveOrBackButton from "src/components/price-list/save-or-back";
import { AppDispatch, RootState } from "src/store";
import { fetchCurrency } from "src/store/apps/customers";
import { updateField } from "src/store/apps/price-form/price-formSlice";
import {
  getPriceCodeMapping,
  getPriceStatus,
} from "src/store/apps/pricelist/price-status";
import { getPricetype } from "src/store/apps/pricelist/price-type";
export interface ProductPrice {
  price: number;
  UOMId: number;
  sku: number;
  minimumPrice: number;
  productId: number;
  isTaxesIncluded: boolean;
  startDate: string;
  endDate: string;
  active: boolean;
  conversion: boolean;
  status: boolean;
  companyId: number;
  tenantId: number;
}

export interface ProductPayload {
  id: number;
  code: string;
  name: string;
  altName: string;
  externalReference: string;
  priceType: string;
  status: string;
  active: boolean;
  incrementalPrice: number;
  currencyId: number;
  companyId: number;
  tenantId: number;
  productPrice: ProductPrice[];
}

export type priceType = {
  code: string;
  name: string;
  altName: string;
  externalReference: string;
  currencyType: string;
  priceList: string;
  status: string;
};
const defaultValueStatus = {
  id: 46,
  uuid: "d0ab7e87-c3e7-4b8b-845f-0a6804949271",
  code: "DRAFT",
  name: "Draft",
  altName: "مسودة",
  lookupTypesCode: "PRICE_STATUS",
};

const CreatePrice = () => {
  //utils
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const router = useRouter();
  const boxColor = bgColor(theme);
  const containerColor = containerStyle(theme);

  //redux-selectors
  const checkedElements =
    useSelector((state: RootState) => state.checkedItemsSlice.fullData) || {};
  const rows = Object.values(checkedElements).filter((d) => !!d);

  // custom hooks
  const { inputSchema, isEdit, isOpen, setIsOpen, selectSchema } =
    usePriceListForm(rows);

  const {
    errorState,
    deleteAllProducts,
    fetchData,
    deleteSelectedPageItems,
    isFirstTimeEdit,
    isdisable,
    isId,
    loading,
    page,
    pageSize,
    searchedEver,
    setData,
    setDeletedProducts,
    setEditedProducts,
    setPage,
    setPageSize,
    tableLoading,
    totalCount,
    onSubmit,
    updateOneRow
  } = usePriceListTable(rows);

  //effects
  useEffect(() => {
    Promise.allSettled([
      dispatch(getPriceStatus()),
      dispatch(getPricetype()),
      dispatch(fetchCurrency()),
      dispatch(getPriceCodeMapping()),
      dispatch(updateField({ value: defaultValueStatus, key: "status" })),
    ]).catch(console.error);
  }, [router.isReady]);

  useEffect(() => {
    let timeInterval: string | number | NodeJS.Timeout | undefined = undefined;
    if (router.query?.reload) {
      timeInterval = setInterval(() => {
        fetchData();
      }, 15000);
    } else {
      fetchData();
    }
    return () => {
      clearInterval(timeInterval);
      if (timeInterval) {
        window.location.reload()
      }
    };
  }, [
    router.isReady,
    page,
    pageSize,
    router.query?.searchItem,
    router.query?.jobId,
    router.query?.reload,
  ]);

  //jsx returns --
  if (loading && isEdit && !router.query?.reload) {
    return <FallbackSpinner />;
  }

  return (
    <Box sx={containerColor}>
      <PricelistProductLoader />
      <Box sx={{ ...boxColor, padding: "10px" }}>
        <Typography>{t("PRICE_LIST_DETAILS")}</Typography>
        <SaveOrBackButton
          setIsOpen={setIsOpen}
          rows={rows}
          isdisable={isdisable}
          onSubmit={onSubmit}
        />
      </Box>
      <PriceListForm inputSchema={inputSchema} selectSchema={selectSchema} />
      <Typography sx={boxColor}>{t("PRODUCTS_PRICE_SETUP")}</Typography>
      <DesideTableOrSetupGrid
        rows={rows}
        totalCount={totalCount}
        tableLoading={tableLoading}
        setPageSize={setPageSize}
        setPage={setPage}
        setEditedProducts={setEditedProducts}
        setDeletedProducts={setDeletedProducts}
        setData={setData}
        searchedEver={searchedEver}
        pageSize={pageSize}
        page={page}
        isId={isId as string}
        isFirstTimeEdit={isFirstTimeEdit}
        checkedElements={checkedElements}
        deleteSelectedPageItems={deleteSelectedPageItems}
        updateOneRow={updateOneRow}
        deleteAllProducts={deleteAllProducts}
      />
      {isOpen && <EditPricelistModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </Box>
  );
};

export default CreatePrice;
