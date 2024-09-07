import { CustomFieldsFormTypes } from "src/types/forms/customFields/customFieldsFormTypes";
import ListForm from "./ListForm";
import TextForm from "./TextForm";
import LongTextForm from "./LongTextForm";
import CommonDatePicker from "src/components/common/CommonDatePicker";
import { useState } from "react";
import { getDate } from "src/utils/transformViewDates";
import CommonSwitch from "src/components/common/CommonSwitch";
import { t } from "i18next";

interface FormFieldProps extends CustomFieldsFormTypes {}

const FormField = (props: any) => {
  const {
    control,
    errors,
    setValue,
    clearErrors,
    selectedUser,
    customFieldsUser,
    ...i
  } = props;
  const changeLanguage: any = localStorage.getItem("i18nextLng");
  const selectedLanguage = changeLanguage.replace("-", "_");
  const [sDate, setSDate] = useState<Date | null>(null);
  const [switchActive, setSwitchActive] = useState(true);
  const { name } = i;
  let currentFieldObj;
  if (customFieldsUser?.length > 0) {
    currentFieldObj = customFieldsUser.filter(
      (item: any) => item?.customFields?.name === name
    );
  }
  let { defaultValue } = props;
  if (currentFieldObj?.length > 0 && currentFieldObj[0]?.customFields?.name) {
    defaultValue = currentFieldObj[0]?.customFields?.values;
  }
  switch (props.fieldType) {
    case "TEXT":
    case "ADDRESS":
    case "EMAIL":
    case "PHONE_NUMBER":
    case "NUMBER":
      return (
        <TextForm
          control={control}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
          selectedUser={selectedUser}
          customDefaultValue={defaultValue}
          currentFieldObj={currentFieldObj}
          selectedLanguage={selectedLanguage}
          {...i}
        />
      );
    case "LIST":
      return (
        <ListForm
          control={control}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
          selectedUser={selectedUser}
          customDefaultValue={defaultValue}
          currentFieldObj={currentFieldObj}
          selectedLanguage={selectedLanguage}
          {...i}
        />
      );
    case "LONG_TEXT":
      return (
        <LongTextForm
          control={control}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
          selectedUser={selectedUser}
          customDefaultValue={defaultValue}
          currentFieldObj={currentFieldObj}
          selectedLanguage={selectedLanguage}
          {...i}
        />
      );
    case "DATE":
      return (
        <CommonDatePicker
          name={props?.name}
          defaultValue={
            selectedUser?.id ? getDate(defaultValue) : props?.defaultValue
          }
          control={control}
          placeholderText={"Click to select a date"}
          label={
            props?.nameLang ? props?.nameLang?.[selectedLanguage] : props?.name
          }
          convertToKey={props?.nameLang ? false : true}
          setValue={setValue}
          minDate={new Date()}
          errors={errors}
          clearErrors={clearErrors}
          cb={(date: any) => {
            setSDate(date);
            clearErrors(props?.name);
          }}
          selectedDate={sDate}
          required={props?.required}
          errorMsg={i?.errorMsg}
        />
      );
    case "TOGGLE":
      return (
        <div>
          <div style={{ marginLeft: "-12px", marginTop: "-8px", width: "70%" }}>
            <CommonSwitch
              active={switchActive}
              setActive={setSwitchActive}
              statusChange={() => ({})}
            />{" "}
            {props?.nameLang
              ? props?.nameLang?.[selectedLanguage]
              : props?.name}
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

export default FormField;
