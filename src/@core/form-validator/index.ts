import * as yup from "yup";
import { isValueUnique } from "../utils/check-unique";
type ValidatorData = Record<string, any>[];

export function RevestAltNameFormValidator(data: ValidatorData, item: any) {
  return yup
    .string()
    .required("REQUIRED")
    .min(3, "Alternate Name must be at least 3 characters")
    .max(25, "Alternate Name can be at most 25 characters")
    .matches(/^[a-zA-Z0-9 ]+$/, "Alternate Name must be alphanumeric")
    .test("unique-altname", "Alternate Name already exists", function (value) {
      return isValueUnique(data, value, "altName", item);
    });
}

export function RevestNameFormValidator(data: ValidatorData, item: any) {
  return yup
    .string()
    .required("REQUIRED")
    .min(3, "Name must be at least 3 characters")
    .max(25, "Name can be at most 25 characters")
    .matches(/^[a-zA-Z0-9 ]+$/, "Name must be alphanumeric")
    .test("unique-name", " Name already exists", function (value) {
      return isValueUnique(data, value, "name", item ? item : undefined);
    });
}

export function RevestCodeFormValidator(data: ValidatorData, item: any) {
  return yup
    .string()
    .required("REQUIRED")
    .min(1, "Code must be at least 1 characters")
    .max(10, "Code can be at most 10 characters")
    .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric")
    .test("unique-name", "Code already exists", function (value) {
      return isValueUnique(data, value, "code", item);
    });
}

export const RevestDropDownValidator = (dropDownItem: any): boolean => {
  if (!dropDownItem) return false;
  return dropDownItem?.name !== "";
};

function validateKey(
  data: Record<string, any>,
  value: any,
  key: string,
  item: Record<string, any>,
  checkKey: any
) {
  if (checkKey) {
    const found = data.find(
      (d: Record<string, any>) =>
        d?.[key] === value && d?.["taxGroupType"] === checkKey
    );
    if (item?.id === found?.id) return true;
    return found == undefined;
  }
  return false;
}

export function taxGroupTypeCodeValidator(data: ValidatorData, item: any) {
  return yup
    .string()
    .required("REQUIRED")
    .min(2, "Code must be at least 2 characters")
    .max(6, "Code can be at most 6 characters")
    .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric")
    .test("unique-altname", "code already exists", function (value) {
      return validateKey(data, value, "code", item, this.parent?.taxGroupType);
    });
}

export function taxGroupNameValidator(data: ValidatorData, item: any) {
  return yup
    .string()
    .required("REQUIRED")
    .test("unique-name", " Name already exists", function (value) {
      return validateKey(data, value, "name", item, this.parent?.taxGroupType);
    });
}
export function taxGroupAltNameValidator(data: ValidatorData, item: any) {
  return yup
    .string()
    .required("REQUIRED")
    .test("unique-name", "Alternate Name already exists", function (value) {
      return validateKey(
        data,
        value,
        "altName",
        item,
        this.parent?.taxGroupType
      );
    });
}

export function taxGroupTypeValidator(data: ValidatorData, item: any) {
  return yup
    .string()
    .typeError("REQUIRED")
    .required("REQUIRED");
}

export function RevestNameValidator(data: ValidatorData, item: any) {
  return yup
    .string()
    .required("REQUIRED")
    .min(3, "Name must be at least 3 characters")
    .max(25, "Name can be at most 25 characters")
    .matches(/^[a-zA-Z0-9 ]+$/, "Name must be alphanumeric only")
}
