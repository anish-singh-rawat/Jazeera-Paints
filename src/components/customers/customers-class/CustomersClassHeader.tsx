import React, { useEffect, useState } from "react";
import Header from "src/components/common/Header";
import { useTranslation } from "react-i18next";

const CustomersClassHeader = (props: any) => {
  const { data, searchCustomerClassData, handleEditPage } = props;
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("");

  const searchButtonHandleClick = () => {
    searchCustomerClassData(searchValue);
  };

  useEffect(() => {
    if (searchValue === "") {
      searchCustomerClassData("");
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

export default CustomersClassHeader;
