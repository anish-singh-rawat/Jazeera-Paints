import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "src/components/common/Header";

const ProductPriceListHeader = (props: any) => {
  const { searchData, handleEditPage } = props;
  const [searchValue, setSearchValue] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const { t } = useTranslation();

  const searchButtonHandleClick = () => {
    setIsSearchClicked(true);
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
        isSearchClicked={isSearchClicked}
      />
    </>
  );
};

export default ProductPriceListHeader;
