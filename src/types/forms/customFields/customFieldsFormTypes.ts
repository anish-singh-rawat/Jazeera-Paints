import { fieldType } from "./fieldTypes";
export interface CustomFieldsFormTypes {
  id: string;
  label: string;
  selectedFieldType: fieldType;
  minLength?: number;
  maxLength?: number;
  defaultValue: string;
  required: boolean;
  listOfValues?: string[];
  control?: string | any;
  errors?: string | any;
  item?: string | any;
  setValue?: string | any;
  setRequired?: string | any;
}
