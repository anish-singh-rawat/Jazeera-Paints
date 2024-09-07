import React from "react";
import CommonTextArea from "src/components/common/CommonTextArea";

const LongTextForm = (props: any) => {
  const {
    control,
    errors,
    selectedUser,
    customName,
    customDefaultValue,
    selectedLanguage,
    ...i
  } = props;
  return (
    <CommonTextArea
      name={props?.name}
      id={props.id}
      label={
        props?.nameLang ? props?.nameLang?.[selectedLanguage] : props?.name
      }
      convertToKey={props?.nameLang ? false : true}
      required={props?.required}
      control={control}
      errors={errors}
      defaultValue={selectedUser?.id ? customDefaultValue : props?.defaultValue}
      type={"string"}
      // placeholder={t("LONG_TEXT")}
      rows={4}
      inputProps={{ maxLength: props?.maxLength, minLength: props?.minLenth }}
      errorMsg={i?.errorMsg}
    />
  );
};

export default LongTextForm;
