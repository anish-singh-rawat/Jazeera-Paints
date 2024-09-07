import React from "react";
import { Card, Tabs, Tab, Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import OrderHistoryDataTable from "src/components/sales-history/orderHistoryDataTable";
import { AppDispatch, RootState } from "src/store";
import { orderHistoryTiles } from "src/store/apps/orderHistory/orderHistory";

const tabBoxStyle = {
  width: "100%",
  padding: "12px 5px",
  marginBottom: "15px",
  borderRadius: "6px",
  "& .MuiTabs-root": {
    borderBottom: "0px white !important",
    "& .MuiButtonBase-root": {
      textTransform: "capitalize !important",
      fontSize: "15px",
      // color: "#4B465C !important",
    },
    "& .Mui-selected": {
      color: "#3586C7 !important",
    },
  },
};

const index = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [orderStatus, setOrderStatus] = React.useState("ALL");

  const orderListData: any = useSelector(
    (state: RootState) => state?.orderHistory
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setOrderStatus(newValue);
  };

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
      dispatch(orderHistoryTiles(payload));
    }
  };

  return (
    <>
      <Card sx={tabBoxStyle}>
        <Tabs
          value={orderStatus}
          onChange={handleTabChange}
          aria-label="wrapped label tabs example"
        >
          <Tab value="ALL" label={`${t("ALL")}`} />
          <Tab value="PENDING" label={`${t("PENDING")}`} />
          <Tab value="COMPLETED" label={`${t("COMPLETED")}`} />
          <Tab value="CANCELLED" label={`${t("CANCELLED")}`} />
          {/* <Tab value="COMPOSITE_PRODUCT" disabled label={`${t("COMPOSITE")}`} /> */}
        </Tabs>
      </Card>
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
                stats={orderListData?.tilesData?.totalOnline}
                trendDiff={0}
                title={t("ONLINE")}
                subtitle="Last 30 days"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:box"
                title={t("LOCAL")}
                stats={orderListData?.tilesData?.totalLocal}
                trendDiff={0}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:box"
                title={t("OUTLET")}
                stats={orderListData?.tilesData?.totalOutlet}
                trendDiff={0}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Card sx={{ mt: 5 }}>
        {/* <ProductsListDataTable
          data={productListData ? productListData?.data?.listData : []}
          isLoading={productListData?.isLoading}
          handleEditPage={handleEditPage}
          rowCount={productListData?.data?.totalCount}
          classification={classification}
        /> */}
        <OrderHistoryDataTable
          data={orderListData ? orderListData?.data : []}
          isLoading={orderListData?.isLoading}
          rowCount={orderListData?.totalCount}
          orderStatus={orderStatus}
          handleChangeStore={handleChangeStore}
        />
      </Card>
    </>
  );
};

export default index;
