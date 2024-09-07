import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import Header from "src/components/common/Header";
import { useTranslation } from "react-i18next";

const CustomerGroupHeader = (props: any) => {
  const { data, searchCustomerGroupData, handleEditPage } = props;
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("");

  const searchButtonHandleClick = () => {
    searchCustomerGroupData(searchValue);
  };

  useEffect(() => {
    if (searchValue === "") {
      searchCustomerGroupData("");
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

export default CustomerGroupHeader;
