import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "src/components/common/Header";

const TranslationsHeader = (props: any) => {
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
        placeholder={t("SEARCH_TRANSLATIONS")}
        createNew={handleEditPage}
      />
    </>
  );
};

export default TranslationsHeader;
