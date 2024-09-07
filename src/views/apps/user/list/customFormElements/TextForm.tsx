import React from "react";
import CommonInput from "src/components/common/CommonInput";

const TextForm = (props: any) => {
  const {
    control,
    errors,
    selectedUser,
    customDefaultValue,
    customName,
    selectedLanguage,
    ...i
  } = props;

  return (
    <CommonInput
      name={props?.name}
      id={props.id}
      label={
        props?.nameLang?.[selectedLanguage]
          ? props?.nameLang?.[selectedLanguage]
          : props?.name
      }
      convertToKey={props?.nameLang ? false : true}
      required={props?.required}
      type={
        props?.fieldType === "PHONE_NUMBER"
          ? "number"
          : props?.fieldType === "NUMBER"
          ? "float"
          : "text"
      }
      control={control}
      errors={errors}
      inputProps={{
        maxLength: props?.maxLength === 0 ? null : props?.maxLength,
        minLength: props?.minLenth === 0 ? null : props?.minLenth,
        step: "any",
      }}
      defaultValue={selectedUser?.id ? customDefaultValue : props?.defaultValue}
      regValue={props?.regularExpression}
      errorMsg={i?.errorMsg}
    />
  );
};

export default TextForm;
