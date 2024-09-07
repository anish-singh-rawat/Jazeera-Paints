import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Grid, Card } from "@mui/material";
import { useTranslation } from "react-i18next";

// APIs
import CurrencyDataTable from "src/components/generalSetup/currency/CurrencyDataTable";
import { currencyList } from "src/store/apps/general-setup/currency";

const index = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const currencyStore: any = useSelector(
    (state: RootState) => state.currency
  );

  useEffect(() => {
    dispatch(currencyList({}));    
  }, []);

  return (
    <>
      <Card>
        <CurrencyDataTable
          data={currencyStore?.data || []}
          isLoading={currencyStore?.isLoading}
        />
      </Card>
    </>
  );
};

export default index;
