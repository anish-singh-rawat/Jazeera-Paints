import { DateType } from "src/types/forms/reactDatepickerTypes";

// Define the interface for your state
export interface CustomerData {
  DOB: Date;
  firstName: string;
  extraField: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  street: string;
  code: string;
  externalReference: string;
  taxNumber: string;
  creditLimit: string;
  customerBalance: string;
  notes: string;
  latitude: string;
  statusList: any[] | null; // Adjust the type accordingly
  customerTypeList: any[] | null; // Adjust the type accordingly
  parentCustomerDefault: any | null; // Adjust the type accordingly
  customerTypeError: string;
  customerGroupError: string;
  distributionChannelError: string;
  countryError: string;
  taxError: string;
  priceListError: string;
  paymentTermsError: string;
  currencyError: string;
  taxType: string;
  selectedBusinessTaxGroup: string;
  advancetaxGroup: string;
  priceList: string;
  ageGroup: any[] | null;
  companyName: string;
}

export const defaultValues:CustomerData = {
  DOB: new Date(),
  firstName: "",
  extraField: "",
  lastName: "",
  mobileNumber: "",
  email: "",
  street: "",
  code: "",
  externalReference: "",
  taxNumber: "",
  creditLimit: "",
  customerBalance: "",
  notes: "",
  latitude: "",
  statusList: null,
  customerTypeList: null,
  parentCustomerDefault: null,
  customerTypeError: "",
  customerGroupError: "",
  distributionChannelError: "",
  countryError: "",
  taxError: "",
  priceListError: "",
  paymentTermsError: "",
  currencyError: "",
  taxType:"",
  selectedBusinessTaxGroup:"",
  advancetaxGroup:"",
  ageGroup: null,
  companyName: "",
};

interface InputFields {
  DOB?: DateType;
  firstName: string;
  lastName: string;
  extraField?: string;
  mobileNumber: number;
  email?: string;
  street?: "";
  code?: "";
  externalReference?: "";
  taxNumber?: "";
  creditLimit?: "";
  customerBalance?: "";
  notes?: "";
  latitude?: "";
  companyName?: ""
}

export interface CustomerType {
  code: string;
  extraField?: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email?: string;
  notes?: string;
  externalReference?: string;
  taxNumber?: string;
  creditLimit?: string;
  customerBalance?: string;
  longitude?: number;
  latitude?: number;
  latLang?: string;
  status?: Generic;
  customerType: Generic;
  gender?: Generic;
  customerGroup: Generic;
  country: Generic;
  region?: Generic;
  city?: Generic;
  distributionChannel: Generic2;
  customerClass?: string;
  paymentTerms: Generic2;
  salesman?: Generic2;
  priceList:any;
  tax: Generic2;
  selectedBusinessTaxGroup: Generic | string;
  basicTax: Generic | string;
  district?: Generic2;
  street?: string;
  DOB?: DateType;
  currency: Generic;
  statusList?: string;
  customerTypeList?: string;
  name?: string;
  taxType?:Record<string, any>;
  companyName?: string
}

interface Generic2 {
  id: string | number;
  name: string;
  altName?: string;
  active: boolean;
}
interface Generic {
  id: string | number;
  code: string;
  name: string;
}
