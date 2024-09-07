import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ProductsListDataTable from "src/components/products/list/ProductsListDataTable";
import { AppDispatch, RootState } from "src/store";
import {
  productsGetById,
  productsTiles,
} from "src/store/apps/products/products-add/productsAdd";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { encryptPriceId } from "src/utils/utils";

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

const ProductsList = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [classification, setClassification] = React.useState("ALL_PRODUCTS");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setClassification(newValue);
  };

  type ProductsTiles = {
    totalCount: number;
    totalSellOnPos: number;
    totalSellOnOnline: number;
    totalInactive: number;
  };

  const [productsTilesDetails, setProductsTilesDetails] =
    useState<ProductsTiles>({
      totalCount: 0,
      totalSellOnPos: 0,
      totalSellOnOnline: 0,
      totalInactive: 0,
    });

  const handleEditPage = async (id: string, currentItem: any) => {
    const encryptedId = encryptPriceId(id)
    if (typeof id === "number" || typeof id === "string") {
      await dispatch(productsGetById(id));
    }
    if (currentItem?.productClassification) {
      setClassification(currentItem.productClassification);
      router.push(`products-add/${currentItem.productClassification}?id=${encryptedId}`);
    } else {
      if (classification === "ALL_PRODUCTS") {
        router.push(`products-add/STANDARD_PRODUCT`);
      } else {
        router.push(`products-add/${classification}`);
      }
    }
  };

  const productListData: any = useSelector(
    (state: RootState) => state?.productsAdd
  );

  const dispatch = useDispatch<AppDispatch>();

  const getProductsTilesDetails = useCallback(
    async (type: string) => {
      try {
        const response = await dispatch(productsTiles(type));
        setProductsTilesDetails(response?.payload);
      } catch (error) {
        // Handle error
      }
    },
    [dispatch, setProductsTilesDetails]
  );

  useEffect(() => {
    getProductsTilesDetails(classification);
  }, [classification, productListData?.data?.totalCount]);

  return (
    <>
      <Card sx={tabBoxStyle}>
        <Tabs
          value={classification}
          onChange={handleTabChange}
          aria-label="wrapped label tabs example"
        >
          <Tab value="ALL_PRODUCTS" label={`${t("ALL_PRODUCTS")}`} />
          <Tab value="STANDARD_PRODUCT" label={`${t("STANDARD")}`} />
          <Tab value="SERVICE_PRODUCT" label={`${t("SERVICES")}`} />
          <Tab value="VARIANT_PRODUCT" disabled label={`${t("VARIANT")}`} />
          <Tab value="COMPOSITE_PRODUCT" disabled label={`${t("COMPOSITE")}`} />
        </Tabs>
      </Card>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={productsTilesDetails?.totalCount}
                trendDiff={0}
                title={t("TOTAL")}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:device-tablet"
                title={t("SELL_ON_POS")}
                stats={productsTilesDetails?.totalSellOnPos}
                trendDiff={0}
                // avatarColor="success"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:device-desktop"
                title={t("SELL_ONLINE")}
                stats={productsTilesDetails?.totalSellOnOnline}
                trendDiff={0}
                avatarColor="error"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:box"
                title={t("INACTIVE")}
                stats={productsTilesDetails?.totalInactive}
                trendDiff={0}
                avatarColor="error"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Card sx={{ mt: 5 }}>
        <ProductsListDataTable
          data={productListData ? productListData?.data?.listData : []}
          isLoading={productListData?.isLoading}
          handleEditPage={handleEditPage}
          rowCount={productListData?.data?.totalCount}
          classification={classification}
        />
      </Card>
    </>
  );
};

export default ProductsList;
