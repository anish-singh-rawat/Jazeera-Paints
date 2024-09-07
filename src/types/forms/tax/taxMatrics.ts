
export const defaultValues: taxMatrix | any = {
  id: "",
  code: "Auto Generated",
  name: "",
  altName: "",
  taxRate: "",
  businessTaxGroups:undefined,
  productTaxGroups:undefined,
  startDate: null,
  endDate: null,
  taxTypes: {},
  taxType: "" || {},
  externalReference: "",
  active: true,
  createdOn: "",
  updatedOn: "",
  tax: "Exclusive",
  paymentMethod: "",
  paymentmethod:""
};

interface taxMatrix {
  id: string;
  code: string;
  name: string;
  taxRate: string;
  startDate: Date | null;
  endDate: Date | null;
}
