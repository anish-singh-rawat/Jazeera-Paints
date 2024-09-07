export interface ProductCategory {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  active: boolean;
  createdOn: string;
  updatedOn: string;
  externalReference: string;
  productSubCategory: ProductSubCategory[] | undefined;
}

export interface ProductSubCategory {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  active: boolean;
  createdOn: string;
  updatedOn: string;
  tenantId: number;
  companyId: number;
}
