export const defaultValues: BatchItem = {
  id: "",
  code: "",
  name: "",
  description: "",
  altName: "",
  products: {},
  dateOfManufacture: null,
  supplierId: [],
  shelfLifeExpiryDate: null,
  externalReference: "",
  supplierBatchNumber: "",
  active: true,
  startDate: null,
  endDate: null,
};

export type ProductsBatchDataTableType = {
  data: [];
  handleEditPage: Function;
  batchItem: BatchItem;
  setBatchItem: Function;
  selectedRecord: Function;
  isLoading: boolean;
};

export type BatchItem = {
  id?: number | string;
  code: string;
  name: string;
  altName: string;
  description: string;
  products: {
    id?: string;
    uuid?: string;
    code?: string;
    name?: string;
    shortName?: string;
  };
  // supplierId?: string,
  supplierId: [];
   
  dateOfManufacture: Date | any;
  shelfLifeExpiryDate: Date | any;
  externalReference: string;
  supplierBatchNumber: string;
  active: boolean;
  startDate: Date | any;
  endDate: Date | any;
};
