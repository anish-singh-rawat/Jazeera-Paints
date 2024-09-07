import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameFormValidator,
  taxGroupAltNameValidator,
  taxGroupNameValidator,
  taxGroupTypeCodeValidator,
  taxGroupTypeValidator,
} from "src/@core/form-validator";
import * as yup from "yup";

export const taxValidateSchema = (data: any, item: any) =>
  yup.object().shape({
    altName: RevestAltNameFormValidator(data, item),
    name: RevestNameFormValidator(data, item),
    code: RevestCodeFormValidator(data, item),
  });

export const taxGroupValidateSchema = (data: any, item: any) =>
  yup.object().shape({
    altName: taxGroupAltNameValidator(data, item),
    name: taxGroupNameValidator(data, item),
    code: taxGroupTypeCodeValidator(data, item),
    taxGroupType: taxGroupTypeValidator(data, item),
  });
