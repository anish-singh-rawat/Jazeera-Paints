import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "src/components/common/Header";

const CustomFieldsHeader = (props: any) => {
  const { searchCustomFieldsData, handleEditPage, disabled } = props;
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const searchButtonHandleClick = () => {
    searchCustomFieldsData(searchValue);
  };

  useEffect(() => {
    if (searchValue === "") {
      searchCustomFieldsData("");
    }
  }, [searchValue]);

  return (
    <>
      <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchButtonHandleClick={searchButtonHandleClick}
        placeholder={t("SEARCH_CUSTOMER_GROUPS")}
        createNew={handleEditPage}
        disabled={disabled}
      />
    </>
  );
};

export default CustomFieldsHeader;
