export const defaultValues: AddProducts | any = {
  id: null,
  code: "",
  name: "",
  active: true,
  altName: "",
  regularExpression: "",
  fieldTypes: {},
  maxLength: "",
  tenantId: "",
  companyId: "",
  defaultValue: "",
  required: null,
  visible: null,
  serialNumber: null,
  usedFilter: true,
};

interface AddProducts {
  id: string;
  code: string;
  name: string;
  createdOn: Date | null;
  updatedOn: Date | null;
  maxLength?: number | null;
}
