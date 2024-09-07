import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "src/components/common/Header";

const DistributionChannelHeader = (props: any) => {
  const { data, searchDistributionChannelData, handleEditPage } = props;
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const searchButtonHandleClick = () => {
    searchDistributionChannelData(searchValue);
  };

  useEffect(() => {
    if (searchValue === "") {
      searchDistributionChannelData("");
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

export default DistributionChannelHeader;
