import React from "react";
import { CustomFieldsFormTypes } from "src/types/forms/customFields/customFieldsFormTypes";
import TextForm from "./customFormElements/TextForm";
import ListForm from "./customFormElements/ListForm";
import ToggleForm from "./customFormElements/ToggleForm";

const CustomFieldsFormElement = (props: CustomFieldsFormTypes) => {
  const {
    selectedFieldType,
    control,
    errors,
    item,
    setValue,
    setRequired,
    required,
    ...other
  } = props;
  switch (selectedFieldType) {
    case "TEXT":
      return <TextForm />;
    case "LIST":
      return (
        <ListForm
          control={control}
          errors={errors}
          item={item}
          setValue={setValue}
        />
      );
    case "TOGGLE":
      return (
        <ToggleForm
          control={control}
          errors={errors}
          item={item}
          setValue={setValue}
        />
      );
    case "FLOAT":
      return <TextForm />;
    case "DATE":
      return <TextForm />;
    case "EMAIL":
      return <TextForm />;
    case "LONG_TEXT":
      return <TextForm />;
    case "ADDRESS":
      return <TextForm />;
    case "PHONE_NUMBER":
      return <TextForm />;
    case "NUMBER_INPUT":
      return <TextForm />;
    default:
      return null;
  }
};

export default CustomFieldsFormElement;
