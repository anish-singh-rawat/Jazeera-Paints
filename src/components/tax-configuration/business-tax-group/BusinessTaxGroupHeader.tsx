import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "src/components/common/Header";

const BusinessTaxGroupHeader = (props: any) => {
  const { searchData, handleEditPage } = props;
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const searchButtonHandleClick = () => {
    searchData(searchValue);
  };

  useEffect(() => {
    if (searchValue === "") {
      searchData("");
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
      />
    </>
  );
};

export default BusinessTaxGroupHeader;
