import React, { useCallback, useEffect, useState } from "react";
import { Card, Grid, Tab, Tabs } from "@mui/material";
import { storeSettingsStore } from "src/store/apps/storeSettings/storeSettings";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import {
  getstockTransaction,
  stockTransactionsTiles,
} from "src/store/apps/stock-transaction";
import { dispatch } from "rxjs/internal/observable/pairs";
import { AppDispatch, RootState } from "src/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import StockTransactiondatatable from "src/components/reports/inventory-reports/stockTransaction/stockTransactionDatatable";

const index = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id, productId, batchId, storeId } = router.query; // Access query parameters

  const [classification, setClassification] = React.useState("byProduct");
  // const [storeId, setStoreId] = React.useState<number>(0);

  // Assuming getstockTransaction is imported correctly

  const getstockTransactionDetails = useCallback(
    async (
      classification: string,
      storeId: number,
      startDate: any,
      endDate: any
    ) => {
      try {
        // Construct the params object with the proper structure
        const params = {
          // productId,
          // batchId,
          storeId,
          // limit,
          // storeId,
          // ...(search && { searchItem: search }),
          ...(startDate && { startDate: startDate }),
          ...(endDate && { endDate: endDate }),
        };

        // Dispatch the thunk action with the constructed params object
        const response = await dispatch(getstockTransaction(params));

        // Process the response as needed
        console.log(response, "response");
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    },
    [dispatch] // Dependency array for useCallback
  );

  const getStockTransactionsTiles = useCallback(
    async (storeId: number) => {
      try {
        const params = {
          storeId,
        };
        // Dispatch the thunk action with the constructed object
        const response = await dispatch(stockTransactionsTiles(params));

        // Log or use the response as needed
        // console.log(response, 'response');
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    },
    [dispatch] // Dependency array for useCallback
  );

  useEffect(() => {
    // console.log('called................................')
    getStockTransactionsTiles();
    getstockTransactionDetails(classification, storeId);
  }, [classification, storeId]);

  const stocktransactionListData: any = useSelector(
    (state: RootState) => state?.stocktransactionSlice
  );

  useEffect(() => {
    // console.log('called................................')
    // getStockOnhandTiles();
    getstockTransactionDetails(classification, storeId);
  }, [classification, storeId]);

  const handleFilterDate = (startDate: any, endDate: any) => {
    dispatch(getstockTransaction({ storeId, startDate, endDate }));
  };

  return (
    <>
      {/* {console.log(stocktransactionListData, "abbbbbbbb")} */}
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={6}
            // justifyContent={"center"}
          >
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stocktransactionListData.tilesData.totalTransactions}
                trendDiff={0}
                title={t("TOTAL_TRANSACTION")}
              />
            </Grid>
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stocktransactionListData.tilesData.totalShipped}
                trendDiff={0}
                title={t("TOTAL_SHIPPED")}
              />
            </Grid>
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stocktransactionListData.tilesData.totalReceived}
                trendDiff={0}
                title={t("TOTAL_RECEIVED")}
              />
            </Grid>
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stocktransactionListData.tilesData.totalReturned}
                trendDiff={0}
                title={t("TOTAL_RETURN")}
              />
            </Grid>
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stocktransactionListData.tilesData.totalInvoiced}
                trendDiff={0}
                title={t("INVOICED")}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <Card>
        <StockTransactiondatatable
          data={stocktransactionListData?.data.data || []}
          isLoading={stocktransactionListData?.isLoading}
          rowCount={stocktransactionListData?.data?.length}
          storeId={storeId}
          handleFilterDate = {handleFilterDate}
          //classification={classification}
          // byStore= {byStore}
          // viewStoreDetails = {viewStoreDetails}
          // handleByStoreSelect = {handleByStoreSelect}
          // handleEditPage={handleEditPage}
          // setStoreItem={setStoreItem}
          // searchItem={setsearchItem}
        />
      </Card>
    </>
  );
};

export default index;
