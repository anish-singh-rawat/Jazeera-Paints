import React, { useEffect } from "react";
import CommonHorizontalTabs from "src/components/common/CommonHorizontalTabs";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import { Grid } from "@mui/material";
import { t } from "i18next";
import { AppDispatch, RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import InvoiceHistoryDataTable from "src/components/invoice-history/invoiceHistoryDataTable";
import { invoiceHistoryTiles } from "src/store/apps/invoiceHistory/invoiceHistory";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [fetchLatestData, setFetchLatestData] = React.useState(false);

  const invoiceHistory = useSelector(
    (state: RootState) => state.invoiceHistory
  );

  // useEffect(() => {
  //   dispatch(invoiceHistoryTiles());
  // }, []);
  const handleChangeStore = (stores: any, startDate: any, endDate: any) => {
    let payload = {};

    if (stores && stores.length > 0 && stores[0].id) {
      payload = { ...payload, storeId: stores[0].id };
    }

    if (startDate) {
      payload = { ...payload, startDate: startDate };
    }

    if (endDate) {
      payload = { ...payload, endDate: endDate };
    }

    if (Object.keys(payload).length > 0) {
      dispatch(invoiceHistoryTiles(payload));
    }
  };
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={6}
            // justifyContent={"center"}
          >
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={invoiceHistory?.tilesData?.totalSales}
                trendDiff={0}
                title={t("TOTAL_SALES")}
                subtitle="Last 30 days"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:box"
                title={t("TOTAL_RETURNS")}
                stats={invoiceHistory?.tilesData?.totalReturns}
                trendDiff={0}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:box"
                title={t("NET_SALES")}
                stats={invoiceHistory?.tilesData?.totalNetSales}
                trendDiff={0}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <InvoiceHistoryDataTable
        setFetchLatestData={setFetchLatestData}
        handleChangeStore={handleChangeStore}
      />
    </>
  );
}
