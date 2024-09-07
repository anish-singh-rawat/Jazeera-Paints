export const defaultValues: StoreItemTypes = {
  id: "",
  code: "Auto Generated",
  createdOn: "",
  createdBy: "",
  updatedOn: "",
  updatedBy: "",
  storeTypes: null as any,
  customerProfile: null as any,
  customerProfileSettings: null as any,
  offlinePos: null as any,
  offlinePOS: {
    terminalNum: [],
  },
  dateFormate: "",
  businessUnit: null as any,
  businessUnits: null as any,
  customerData: null as any,
  legalEntity: null as any,
  defaultCustomer: null as any,
  customer: null as any,
  priceList: null as any,
  company: "",
  currency: "",
  country: "",
  entityType: "",
  region: {
    name: [],
  },
  district: {
    name: [],
  },
  city: {
    name: [],
  },
  externalReference: "",
  externalCostCenter: "",
  tenantId: "",
  companyId: "",
  businessUnitId: 0,
  customerId: 0,
  name: "",
  altName: "",
  mobileNumber: "",
  email: "",
  street: "",
  countryId: 0,
  regionId: 0,
  districtId: 0,
  cityId: 0,
  postalCode: "",
  externalStoreCode: "",
  externalCustomerCode: "",
  externalCostCenterCode: "",
  active: true,
  isDeleted: false,
  deletedOn: undefined,
  deletedBy: 0,
  basicTaxId: 0,
  offlinePosId: 0,
  dateFormat: undefined,
  timeZone: "",
  legalEntityId: 0,
  currencyId: 0,
  fax: "",
  address: "",
  customerProfileSettingId: 0,
  vatNumber: "",
  priceListId: 0,
};

export type StoreItemTypes = {
  id?: number | string;
  code: string;
  storeTypes: {};
  offlinePOS: {};
  offlinePos: {};
  customerProfile: {};
  customerProfileSettings: {};
  externalReference: string;
  createdOn?: string | any;
  createdBy?: string;
  updatedOn?: string | any;
  updatedBy?: string;
  tenantId?: string;
  companyId?: string;
  dateFormate?: string;
  businessUnit: {};
  businessUnits: {};
  customerData: {};
  defaultCustomer: {};
  customer: {};
  legalEntity: { company?: string };
  company?: string;
  currency?: string;
  country?: string;
  entityType?: string;
  region?: {};
  district?: {};
  city?: {};
  externalCostCenter?: string;
  businessUnitId: number;
  name: string;
  altName: string;
  mobileNumber?: string;
  email: string;
  street?: string;
  countryId?: number;
  regionId?: number;
  districtId?: number;
  cityId?: number;
  postalCode?: string;
  externalStoreCode?: string;
  externalCustomerCode?: string;
  externalCostCenterCode?: string;
  active: boolean;
  isDeleted?: boolean;
  deletedOn?: Date;
  deletedBy: number;
  basicTaxId?: number;
  customerId?: number;
  offlinePosId?: number;
  dateFormat?: Date;
  timeZone?: string;
  legalEntityId?: number;
  currencyId?: number;
  fax?: string;
  address?: string;
  customerProfileSettingId?: number;
  latitude?: string;
  longitude?: string;
  vatNumber?: string;
  priceList?: {};
  priceListId?: number;
};
