// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import calendar from "src/store/apps/calendar";
import chat from "src/store/apps/chat";
import customers from "src/store/apps/customers";
import customerClass from "src/store/apps/customers/customers-class/customer_class";
import customerGroup from "src/store/apps/customers/group/customer_group";
import customerDivision from "src/store/apps/dimensions/customer-division/customer_division";
import distributionChannel from "src/store/apps/dimensions/distribution-channel/distribution_channel";
import email from "src/store/apps/email";
import invoiceTemplate from "src/store/apps/invoiceTemplate/invoiceTemplate";
import markUpConfiguration from "src/store/apps/mark-value/mark_value";
import permissions from "src/store/apps/permissions";
import productGroup from "src/store/apps/products/group/products_group";
import basicTaxSetup from "src/store/apps/tax-configuration/basic-tax-setup";
import businessTaxGroup from "src/store/apps/tax-configuration/business_tax_group";
import productTaxGroup from "src/store/apps/tax-configuration/product_tax_group";
import taxGroupSlice from "src/store/apps/tax-configuration/tax-groups";
import taxConfiguration from "src/store/apps/tax-configuration/tax_matrics";
import translationsList from "src/store/apps/translations/translations";
import user from "src/store/apps/user";
import assignedUsersReducer from "./apps/add-user";
import customFields from "./apps/custom-fields/custom_fields";
import customerProfile from "./apps/customer-profile/customer_profile";
import customerdropdown from "./apps/customer_dropdown/customer_dropdown";
import formdataSlice from "./apps/form/formdataSlice";
import getRoles from "./apps/get-roles";
import paymentConfiguration from "./apps/payment-terms/payment_terms";
import PriceSlice from "./apps/price-form/price-formSlice";
import PriceCreation from "./apps/price-list";
import MarketPlace from "./apps/pricelist/marketPlace";
import priceListData from "./apps/pricelist/price-list";
import priceListStatus from "./apps/pricelist/price-status";
import priceTypeList from "./apps/pricelist/price-type";
import checkedItemsSlice from "./apps/product-items";
import getProductSlice from "./apps/product-list";
import AddProductPricelist from "./apps/product/product-add";
import productCategory from "./apps/product/product-category";
import productPriceList from "./apps/product/product-price-list";
import productSlice from "./apps/product/product-search";
import productSubCategory from "./apps/product/product-sub-category";
import ProductTypes from "./apps/product/product-type";
import productsBatch from "./apps/productBatch/productBatch";
import productSerialNumbersStore from "./apps/productSerialNumber/productSerialNumber";
import productdropdown from "./apps/product_dropdown/product_dropdown";
import productBrands from "./apps/products/brand/products_brand";
import productDivision from "./apps/products/division/products_division";
import legalEntity from "./apps/general-setup/legalEntities";
import numberSequence from "./apps/general-setup/numberSequence";
import productFamily from "./apps/products/family/products_family";
import productsAdd from "./apps/products/products-add/productsAdd";
import role from "./apps/role";
import userTypes from "./apps/role_permission";
import roles from "./apps/roles";
import assign_users from "./apps/roles_ids/assign_users";
import rolesIds from "./apps/roles_ids/roles_ids";
import sequenceMappingCode from "./apps/sequenceMapping/sequenceMapping";
import storeAndTerminals from "./apps/storeAndTerminals/index";
import userCreation from "./apps/userCreation/userCreation";
import UserRolePermission from "./apps/user_assign/user-assign";
import UserAssigned from "./apps/user_assign/user-assign-list";
import userTypePermission from "./apps/user_assign/user-type-permission";
import UserUnAssigned from "./apps/user_assign/user-unassign-list";
import storeSettingsStore from "./apps/storeSettings/storeSettings";
import invoiceHistory from "./apps/invoiceHistory/invoiceHistory";
import orderHistory from "./apps/orderHistory/orderHistory";
import stockOnhandSlice from "./apps/reports";
import stocktransactionSlice from "./apps/stock-transaction";
import externalPromotion from "src/store/apps/promotion/externalPromotion/externalPromotion";
import externalPromotionColumn from "src/store/apps/promotion/externalPromotion/externalPromotionColumn";
import globalCountry from "./apps/general-setup/country_setup";
import regions from "./apps/regions";
import globalCity from "./apps/general-setup/city_store";
import globalDistrict from "./apps/general-setup/district_store";
import company from "./apps/general-setup/company";
import currency from "./apps/general-setup/currency";
import groupTenant from "./apps/general-setup/enterpriseGroup";
import businessUnit from "./apps/general-setup/businessUnit";
import productDelete from "./apps/products/products-add/productsAdd";

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    customers,
    calendar,
    permissions,
    customerDivision,
    customerClass,
    distributionChannel,
    customerGroup,
    businessTaxGroup,
    productTaxGroup,
    taxConfiguration,
    translationsList,
    productGroup,
    productDivision,
    numberSequence,
    productBrands,
    productFamily,
    productCategory,
    productSubCategory,
    productPriceList,
    paymentConfiguration,
    customFields,
    formdataSlice,
    ProductTypes,
    customerProfile,
    productSlice,
    taxGroupSlice,
    productsAdd,
    productsBatch,
    productSerialNumbersStore,
    userCreation,
    storeAndTerminals,
    roles,
    userTypes,
    rolesIds,
    UserRolePermission,
    UserUnAssigned,
    UserAssigned,
    userTypePermission,
    assign_users,
    basicTaxSetup,
    role,
    priceListStatus,
    priceTypeList,
    stockOnhandSlice,
    stocktransactionSlice,
    priceListData,
    sequenceMappingCode,
    assignedUsersReducer,
    getRoles,
    getProductSlice,
    checkedItemsSlice,
    PriceCreation,
    PriceSlice,
    legalEntity,
    invoiceTemplate,
    markUpConfiguration,
    MarketPlace,
    customerdropdown,
    productdropdown,
    AddProductPricelist,
    storeSettingsStore,
    invoiceHistory,
    orderHistory,
    externalPromotion,
    externalPromotionColumn,
    globalCountry,
    regions,
    globalCity,
    globalDistrict,
    company,
    currency,
    groupTenant,
    businessUnit,
    productDelete
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
