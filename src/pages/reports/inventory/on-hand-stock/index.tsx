import React, { useCallback, useEffect, useState } from "react";
import { Card, Grid, Tab, Tabs } from "@mui/material";
import { storeSettingsStore } from "src/store/apps/storeSettings/storeSettings";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import { useTranslation } from "react-i18next";
import OnHandStockDataTable from "src/components/reports/onHandInventoryDatatable";
import {
  getstockOnhand,
  stockOnhandAltUOM,
  stockOnhandTiles,
} from "src/store/apps/reports";
import { dispatch } from "rxjs/internal/observable/pairs";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useSelector } from "react-redux";
import StoreDetailsPopup from "src/components/reports/storeDetailsOnHandStock/storeDetails";
import OnHandStockWeightDetails from "src/components/reports/weightDetailsOnHandStock/weightDetails";
import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();

  const [classification, setClassification] = React.useState("byProduct");
  const [openStoreDetails, setOpenStoreDetails] = useState<boolean>(false);
  const [openWeightDetails, setOpenWeightDetails] = useState<boolean>(false);
  const [renderStorePage, setRenderStorePage] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<number>();

  const [byStore, setByStore] = React.useState<boolean>(false);
  const [storeData, setStoreData] = useState();
  //const [searchItem, setsearchItem] = React.useState(" ");
  const [fetchLatestData, setFetchLatestData] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setClassification(newValue);
  };

  const getStockOnhandDetails = useCallback(
    async (classification: string, byStore: boolean) => {
      try {
        // Construct the object to pass to getstockOnhand based on the expected structure
        const params = {
          classification,
          byStore,
        };

        // Dispatch the thunk action with the constructed object
        const response = await dispatch(getstockOnhand(params));

        // Log or use the response as needed
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    },
    [dispatch] // Dependency array for useCallback
  );

  const [formData, setFormData] = useState({
    countryCode: "+91", // Default country code
    phoneNumber: "", // Default phone number
  });

  const getStockOnhandTiles = useCallback(
    async () => {
      try {
        // Dispatch the thunk action with the constructed object
        const response = await dispatch(stockOnhandTiles());

        // Log or use the response as needed
        // console.log(response, 'response');
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    },
    [dispatch] // Dependency array for useCallback
  );

  const stockOnHandProductListData: any = useSelector(
    (state: RootState) => state?.stockOnhandSlice
  );

  useEffect(() => {
    getStockOnhandTiles();
    getStockOnhandDetails(classification, byStore);
  }, [classification, byStore]);

  const viewStoreDetails = (id: any, row: any) => {
    console.log(id, row, "id, row");
    setRenderStorePage(!renderStorePage);
    setOpenStoreDetails(!openStoreDetails);
    setStoreData(row);
  };

  const getStockOnhandweightDetails = (
    baseUomId: number,
    onhandQuantity: number,
    productId: number
  ) => {
    try {
      // Dispatch the thunk action with the constructed object
      console.log(baseUomId, onhandQuantity, productId, "baseUomId123");

      dispatch(stockOnhandAltUOM({ baseUomId, onhandQuantity, productId }));
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  };

  const viewWeightDetails = (id: number, row: any) => {
    const { baseUomId, onhandQuantity, productId } = row;
    getStockOnhandweightDetails(baseUomId, onhandQuantity, productId);
    setOpenWeightDetails(!openWeightDetails);
  };

  const handleByStoreSelect = () => {
    setByStore(!byStore);
  };

  const handleNavigation = (id: any, row: any) => {
    const stringifiedRow = JSON.stringify(row);
    const { productId, batchId, storeId } = row;
    router.push({
      pathname: "/reports/inventory/stock-transactions",
      query: { id, productId, batchId, storeId }, 
    });
  };

  const handleInput = (e) => {
    const { value, name } = e.target;

    setFormData((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleChangeStore = (stores: any) => {
    let payload = {};
    const stroreArr = stores.map((store: any) => {
      return store.id;
    });
    if (stores && stores.length > 0) {
      // payload = { ...payload, storeArr: stroreArr, byStore: byStore };
      payload = { ...payload, storeId: stores[0].id, byStore: byStore };
    }
    dispatch(getstockOnhand(payload));
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
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stockOnHandProductListData.tilesData.totalProduct}
                trendDiff={0}
                title={t("TOTAL_PRODUCTS")}
              />
            </Grid>
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stockOnHandProductListData.tilesData.totalShipped}
                trendDiff={0}
                title={t("TOTAL_SHIPPED")}
              />
            </Grid>
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stockOnHandProductListData.tilesData.totalSales}
                trendDiff={0}
                title={t("TOTAL_SALES")}
              />
            </Grid>
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={stockOnHandProductListData.tilesData.totalOnhandQuantity}
                trendDiff={0}
                title={t("ON_HAND")}
              />
            </Grid>
            <Grid item xs={2.4}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={
                  stockOnHandProductListData.tilesData.totalTransitQuantity
                }
                trendDiff={0}
                title={t("IN_TRANSIT")}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <Card>
        <Tabs
          value={classification}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          <Tab value="byProduct" label={`${t("BY_PRODUCTS")}`} />
          <Tab value="byBatch" label={`${t("BY_BATCH")}`} />
        </Tabs>
        <OnHandStockDataTable
          data={stockOnHandProductListData?.data.data || []}
          isLoading={stockOnHandProductListData?.isLoading}
          rowCount={stockOnHandProductListData?.data?.totalCount}
          classification={classification}
          handleChangeStore={handleChangeStore}
          byStore={byStore}
          viewStoreDetails={viewStoreDetails}
          viewWeightDetails={viewWeightDetails}
          handleByStoreSelect={handleByStoreSelect}
          handleNavigation={handleNavigation}
        />
      </Card>
      {storeData && (
        <StoreDetailsPopup
          openStoreDetails={openStoreDetails}
          setOpenStoreDetails={setOpenStoreDetails}
          storeData={storeData}
          renderStorePage={renderStorePage}
          classification={classification}
          formData={formData}
          setFormData={setFormData}
          handleInput={handleInput}
        />
      )}
      <OnHandStockWeightDetails
        openWeightDetails={openWeightDetails}
        setOpenWeightDetails={setOpenWeightDetails}
      />
    </>
  );
};

export default index;
