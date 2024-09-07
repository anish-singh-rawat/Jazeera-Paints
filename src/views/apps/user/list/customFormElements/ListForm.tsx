import { t } from "i18next";
import React from "react";
import AppStorage from "src/app/AppStorage";
import CommonSelect from "src/components/common/CommonSelect";

const ListForm = (props: any) => {
  const {
    control,
    errors,
    setValue,
    clearErrors,
    selectedUser,
    customDefaultValue,
    selectedLanguage,
    ...i
  } = props;

  return (
    <CommonSelect
      name={props?.name}
      options={
        selectedLanguage === "en_US"
          ? props?.listOfValues1
          : props?.listOfValues2
      }
      control={control}
      label={
        props?.nameLang ? props?.nameLang?.[selectedLanguage] : props?.name
      }
      convertToKey={props?.nameLang ? false : true}
      placeholder={"SELECT"}
      validateForm={{}}
      required={props?.required}
      errors={errors}
      setValue={setValue}
      defaultValue={selectedUser?.id ? customDefaultValue : props?.defaultValue}
      noOptionsText={false}
      clearErrors={clearErrors}
      errorMsg={i?.errorMsg}
    />
  );
};

export default ListForm;
