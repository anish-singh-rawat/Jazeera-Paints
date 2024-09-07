import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "src/components/common/Header";
import { ProductGroupHeaderType } from "src/types/forms/productTypes";

const ProductGroupHeader = (props: ProductGroupHeaderType) => {
  const { searchProductsData, handleEditPage } = props;
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const searchButtonHandleClick = () => {
    searchProductsData(searchValue);
  };

  useEffect(() => {
    if (searchValue === "") {
      searchProductsData("");
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

export default ProductGroupHeader;
