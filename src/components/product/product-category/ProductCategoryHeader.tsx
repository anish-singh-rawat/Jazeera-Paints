import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "src/components/common/Header";

interface ProductCategoryHeaderProps {
  searchData: (value: string) => void;
  handleEditPage: () => void;
}

const ProductCategoryHeader: React.FC<ProductCategoryHeaderProps> = (props) => {
  const { searchData, handleEditPage } = props;
  const [searchValue, setSearchValue] = useState("");

  const { t } = useTranslation();

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

export default ProductCategoryHeader;
