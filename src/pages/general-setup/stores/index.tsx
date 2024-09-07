import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Grid, Card } from "@mui/material";
import { useTranslation } from "react-i18next";

// Styles

// APIs
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import StoresDataTable from "src/components/generalSetup/stores/StoresDatatable";
import { useRouter } from "next/router";
import {
  storeTiles,
  storesListGet,
} from "src/store/apps/storeSettings/storeSettings";

const index = () => {
  const [storeItem, setStoreItem] = useState<any>([]);
  const [fetchLatestData, setFetchLatestData] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const storeSettingsStore: any = useSelector(
    (state: RootState) => state.storeSettingsStore
  );

  useEffect(() => {
    dispatch(storesListGet());
    dispatch(storeTiles());
  }, []);

  const handleEditPage = async (id: string) => {
    //route to new store page
    router.push(
      `stores/create-store/${typeof id === "number" ? `?id=${id}` : ""}`
    );
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
            <Grid item xs={12} md={2.4} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:building-warehouse"
                showDifference={false}
                stats={storeSettingsStore?.storeTilesData?.totalCount}
                trendDiff={0}
                title={t("TOTAL_STORES")}
              />
            </Grid>
            <Grid item xs={12} md={2.4} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:checkbox"
                title={t("ACTIVE_STORES")}
                stats={storeSettingsStore?.storeTilesData?.totalActive}
                trendDiff={0}
                avatarColor="success"
              />
            </Grid>
            <Grid item xs={12} md={2.4} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:x"
                title={t("INACTIVE_STORES")}
                stats={storeSettingsStore?.storeTilesData?.totalInactive}
                trendDiff={0}
                avatarColor="error"
              />
            </Grid>
            <Grid item xs={12} md={2.4} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:building-store"
                title={t("OWN_STORES")}
                stats={storeSettingsStore?.storeTilesData?.totalOwnStores}
                trendDiff={0}
              />
            </Grid>
            <Grid item xs={12} md={2.4} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:git-fork"
                title={t("FRANCHISE")}
                stats={storeSettingsStore?.storeTilesData?.totalFranchiseStores}
                trendDiff={0}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <Card>
        <StoresDataTable
          data={storeSettingsStore?.data || []}
          fetchLatestData={fetchLatestData}
          setFetchLatestData={setFetchLatestData}
          isLoading={storeSettingsStore?.isLoading}
          handleEditPage={handleEditPage}
          setStoreItem={setStoreItem}
          storeItem={storeItem}
          rowCount={storeSettingsStore?.totalCount}
        />
      </Card>
    </>
  );
};

export default index;
