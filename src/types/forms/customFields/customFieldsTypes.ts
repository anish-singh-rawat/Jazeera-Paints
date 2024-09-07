
export const defaultValues: customFields | any = {
  id: null,
  name: "",
  active: true,
  regularExpression: "",
  fieldTypes: {},
  maxLength: "",
  minLenth: "",
  tenantId: "",
  companyId: "",
  defaultValue: "",
  required: null,
  visible: null,
  searchable: null,
  usedFilter: true,
  // code: "",
  // altName: "",
};

interface customFields {
  id: string;
  code: string;
  name: string;
  createdOn: Date | null;
  updatedOn: Date | null;
  minLenth?: number | null;
  maxLength?: number | null;
}
