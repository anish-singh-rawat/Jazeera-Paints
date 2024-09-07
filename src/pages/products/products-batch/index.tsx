import React from "react";

// **Tabs import
import ProductsBatch from "./ProductBatch";
import ProductByBatch from "./ProductByBatch";
import CommonHorizontalTabs from "src/components/common/CommonHorizontalTabs";
import { AppDispatch, RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";

import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import { Grid } from "@mui/material";
import { t } from "i18next";

export default function App() {
  // Tabs Import
  // const tabLabels = ["Batch", "Product"];
  // const tabContents = [<ProductsBatch />, <ProductByBatch />];

  const productsBatch = useSelector((state: RootState) => state.productsBatch);

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
                icon="tabler:list-numbers"
                showDifference={false}
                stats={productsBatch?.tilesData?.totalCount}
                trendDiff={0}
                title={t("TOTAL")}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:check"
                title={t("ACTIVE")}
                stats={productsBatch?.tilesData?.totalActiveCount}
                trendDiff={0}
                avatarColor="success"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:alert-triangle"
                title={t("NEAR_EXPIRY")}
                stats={productsBatch?.tilesData?.totalNearExpiry}
                trendDiff={0}
                avatarColor="warning"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:x"
                title={t("EXPIRED")}
                stats={productsBatch?.tilesData?.totalExpired}
                trendDiff={0}
                avatarColor="error"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      {/* enable this to achieve Tabs view  */}
      {/* <CommonHorizontalTabs tabLabels={tabLabels} tabContents={tabContents} /> */}
      <ProductsBatch />
    </>
  );
}
