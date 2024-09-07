import { createSlice } from "@reduxjs/toolkit";
import { Product } from "src/components/price-list/makeData";
import { v4 } from "uuid";

type productData = Record<string, any>;
type state = {
  fullData: productData;
  productData: productData;
  openAddProduct: boolean;
  isAllSelected: boolean;
};
const initialState: state = {
  fullData: {},
  productData: {},
  openAddProduct: false,
  isAllSelected: false
};
type ProductType = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
};

type ProductCategory = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
};

type ProductSubCategory = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
};

type ProductDivision = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
};

type ProductFamily = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
};

type ProductClassifications = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
};

type ProductTags = {
  id: number;
  uuid: string;
  name: string;
};

type PriceList = {
  id: number;
  code: string;
  name: string;
  altName: string;
  priceType: string;
};

type Currency = {
  id: number;
  code: string;
  name: string;
};

type ProductPrices = {
  productId: number;
  isTaxesIncluded: boolean;
  minimumPrice: number;
  startDate: string;
  endDate: string;
  active: boolean;
  price: number;
  priceList?: PriceList;
  currency?: Currency;
};

type PriceListProduct = {
  id: number;
  uuid: string;
  shortName: string;
  altShortName: string;
  longName: string;
  altLongName: string;
  productClassification: string;
  hasVariant: boolean;
  isTaxesIncluded: boolean;
  productType: { name: string };
  productCategory: { name: string };
  productSubCategory: { name: string };
  productDivision: { name: string };
  externalReference: string;
  sellOnPos: boolean;
  sellOnline: boolean;
  active: boolean;
  hasSerialNumber: boolean;
  isDeleted: boolean;
  createdBy: number;
  createdOn: string;
  updatedBy: number;
  updatedOn: string;
  companyId: number;
  tenantId: number;
  productClassifications: ProductClassifications;
  salesUOM: { name: string };
  productTagsMapping: { id: number; productTags: ProductTags }[];
  image: string;
  code: string;
  isAssociate: boolean;
  isExclusive: boolean;
  productPrice: ProductPrices[];
  retailPrice: number;
  productBrand: { name: string };
  productFamily: { name: string };
  productGroup: { name: string };
};

const transformProduct = (product: PriceListProduct): Product => {
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

export const checkedItemsSlice = createSlice({
  name: "checkedItems",
  initialState,
  reducers: {
    toggleChecked: (state, action) => {
      if (state.productData[action.payload.id])
        state.productData[action.payload.id] = null;
      else
        state.productData[action.payload.id] = transformProduct(action.payload);
    },
    clearCheckedItems: (state) => {
      return {
        ...state,
        fullData: state.fullData,
        productData: {},
        openAddProduct: state.openAddProduct,
      };
    },
    cloneData: (state) => {
      return {
        ...state,
        fullData: state.productData,
        productData: {},
        openAddProduct: state.openAddProduct,
      };
    },
    selectAll(state, action) {
      for (const key of action.payload) {
        state.productData[key?.id] = transformProduct(key);
      }
    },
    deSelectAll(state) {
      for (const key of Object.keys(state.productData)) {
        state.productData[key] = null;
      }
    },
    clearPreSelectedData(state) {
      return {
        ...state,
        productData: {},
      };
    },
    addProducts(state, action) {
      const editData = action.payload;
      for (const item of editData || []) {
        state.productData[item.productId] = {
          ...item,
          // image: item?.product?.image,
          // productName: item?.product?.shortName,
          id: item?.productId,
        };
      }
    },
    clearEverything(state) {
      return {
        ...state,
        fullData: {},
        productData: {},
        openAddProduct: state.openAddProduct,
        isAllSelected: false
      };
    },
    openAddProduct(state) {
      state.openAddProduct = true;
    },
    closeAddProduct(state) {
      state.openAddProduct = false;
    },
    updateData(state, action) {
      state.fullData = {};
      for (let key of action.payload) {
        state.fullData[key.id] = key;
      }
    },
    toggleAllSelected(state) {
      state.isAllSelected = !state.isAllSelected
    },
    setIsAllSelected(state, action) {
      state.isAllSelected = action.payload
    }
  },
});

export const {
  updateData,
  toggleChecked,
  openAddProduct,
  closeAddProduct,
  deSelectAll,
  clearPreSelectedData,
  clearCheckedItems,
  selectAll,
  addProducts,
  cloneData,
  clearEverything,
  toggleAllSelected,
  setIsAllSelected
} = checkedItemsSlice.actions;

export default checkedItemsSlice.reducer;
