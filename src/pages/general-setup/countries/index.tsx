import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Grid, Card } from "@mui/material";
import { useTranslation } from "react-i18next";

// APIs
import CountryDataTable from "src/components/generalSetup/country/CountryDataTable";
import { countryList } from "src/store/apps/general-setup/country_setup";

const index = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const countryStore: any = useSelector(
    (state: RootState) => state.globalCountry
  );

  useEffect(() => {
    dispatch(countryList({}));    
  }, []);

  return (
    <>
      <Card>
        <CountryDataTable
          data={countryStore?.data || []}
          isLoading={countryStore?.isLoading}
        />
      </Card>
    </>
  );
};

export default index;
