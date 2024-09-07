export const defaultValues: SerialNumberItem = {
  id: "",
  code: "",
  serialNumber: "",
  createdOn: "",
  createdBy: "",
  updatedOn: "",
  updatedBy: "",
  products: {
  },
  externalReference: "",
  tenantId: "",
  companyId: "",
};

export type ProductsSerialNumberDataTableType = {
  data: [];
  handleEditPage: Function;
  batchItem: SerialNumberItem;
  setBatchItem: Function;
  selectedRecord: Function;
  isLoading: boolean;
};

export type SerialNumberItem = {
  id?: number | string;
  code: string;
  serialNumber: string;
  products: {
    id?: string;
    uuid?: string;
    code?: string;
    name?: string;
    shortName?: string;
  };
  externalReference: string;
  createdOn?: string | any;
  createdBy?: string;
  updatedOn?: string | any;
  updatedBy?: string;
  tenantId?: string;
  companyId?: string;
};
