
export const defaultValues: basicTaxSetup | any = {
    id: "",
    code: "Auto Generated",
    name: "",
    altName: "",
    taxInPrice: "EXCLUSIVE",
    startDate: null,
    endDate: new Date("2099-12-31"),
    taxTypes: {name: []},
    taxType: "" || {name: []},
    externalReference: "",
    active: true,
    createdOn: "",
    updatedOn: "",
    tax: "",
  };
  
  interface basicTaxSetup {
    id: string;
    code: string;
    name: string;
    taxRate: string;
    startDate: Date | null;
    endDate: Date | null;
  }
  