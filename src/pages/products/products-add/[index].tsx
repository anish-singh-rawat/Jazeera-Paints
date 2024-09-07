import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CompositeIcon from "src/assets/CompositeIcon";
import ServiceIcon from "src/assets/ServiceIcon";
import StandardIcon from "src/assets/StandardIcon";
import VariantIcon from "src/assets/VariantIcon";
import StandardTab from "./tabs/standard";
import ServicesTab from "./tabs/servicesTab";
import { AppDispatch, RootState } from "src/store";
import { getProductType } from "src/store/apps/product/product-type";
import {
  getSKUcodes,
  getUnitOfMeasure,
  productSources,
  productsGetById,
} from "src/store/apps/products/products-add/productsAdd";
import { productTaxGroupSearch } from "src/store/apps/tax-configuration/product_tax_group";
import { Theme, useTheme } from "@mui/material/styles";
// ** Styles for Description Editors
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { getMarketPlacevalues } from "src/store/apps/pricelist/marketPlace";
import {
  fetchProductgroupsdropdown,
  fetchproductdivisionsdropdown,
  fetchproductbrandsdropdown,
  fetchProductfamilydropdown,
  fetchProductcategorydropdown,
  fetchProductsubcategorydropdown,
  fetchProductAttributesdropdown,
  fetchUnitOfMeasuresdropdown,
  fetchProductTypedropdown,
  fetchProductAttribute01dropdown,
  fetchProductAttribute02dropdown,
  fetchProductAttribute03dropdown,
  fetchProductAttribute04dropdown,
  fetchProductAttribute05dropdown,
} from "src/store/apps/product_dropdown/product_dropdown";
import { useRouter } from "next/router";
import { decryptPriceId } from "src/utils/utils";

interface cardHeaderTypes {
  content: string;
  header: string;
  icon: JSX.Element;
}

const useStyle = makeStyles({
  card: {
    borderRadius: "5px",
    boxShadow: "none",
    width: "200px",
    height: "127px",
    padding: "17px 14px 10px 10px",
    textTransform: "capitalize",
  },
  content: {
    padding: "20px",
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === "light" ? "#ffff" : "rgb(37, 41, 60)",
  },
  tabContainer: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === "light" ? "#ffff" : "rgb(37, 41, 60)",
  },
  tabheading: {
    "& .MuiTypography-root": {
      color: "rgba(228, 230, 244, 0.87)",
    },
  },
  standardTabData: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === "light" ? "#F7F8FA" : "rgb(37, 41, 60)",
  },
  tabList: {
    "& .MuiTabs-indicator": {
      display: "none",
    },
    "& .MuiTab-root > div": {
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === "light"
          ? "var(--light-opacity-color-secondary-secondary-16, rgba(168, 170, 174, 0.16))"
          : "#2F3349 !important",
    },
    "& .Mui-selected > div": {
      border: "1px solid #3586C7",
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === "light"
          ? "#EEF7FF !important"
          : "#2F3349 !important",
      "& svg": {
        fill: "#3586C7",
      },
    },
  },

  dialog: {
    "& .MuiDialogTitle": {
      fontSize: "18px",
      color: "red",
    },

    "& .MuiDialogContent-root": {
      color: "#6f6b7d",
      fontSize: "16px",
    },

    "& .MuiPaper-elevation": {
      width: "500px",
      height: "226px",
      padding: "1rem",
    },

    "& .MuiDialogActions-root ": {
      padding: 0,
    },
  },
  formAction: {
    // padding: "0 3rem"
    gap: "1rem",
  },
  formActionCopy: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    textTransform: "unset",
  },
  formActionDiscard: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    textTransform: "unset",
    background: "#f1f1f2",
    color: "#6f6b7d",

    "&.MuiButton-root:hover": {
      background: "#f1f1f2",
      color: "#6f6b7d",
    },
    "&.MuiButton-root": {
      background: "#f1f1f2",
      color: "#6f6b7d",
    },
  },
});

const index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyle(theme);
  const router = useRouter();

  const singleProduct: any = useSelector(
    (state: RootState) => state?.productsAdd?.singleProduct
  );

  const [activeTab, setActiveTab] = React.useState("1");
  const [editData, setEditData] = useState({});
  const [copyDataDialog, setCopyDataDialog] = useState<boolean>(false);

  const [isStandardProductUpdated, setIsStandardProductUpdated] =
    useState<boolean>(false);
  const [
    standardProductCurrentUpdatedDetails,
    setStandardProductCurrentUpdatedDetails,
  ] = useState<any>({});
  const [
    standardProductUpdatedDefaultValues,
    setStandardProductUpdatedDefaultValues,
  ] = useState<any>({});

  const [isServiceProductUpdated, setIsServiceProductUpdated] =
    useState<boolean>(false);
  const [
    serviceProductCurrentUpdatedDetails,
    setServiceProductCurrentUpdatedDetails,
  ] = useState<any>({});
  const [
    serviceProductUpdatedDefaultValues,
    setServiceProductUpdatedDefaultValues,
  ] = useState<any>({});

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    switch (newValue) {
      case "1":
        if (isServiceProductUpdated) {
          setCopyDataDialog(true);
        } else {
          router.push(`/products/products-add/STANDARD_PRODUCT/`);
          setActiveTab(newValue);
        }
        break;
      case "2":
        if (isStandardProductUpdated) {
          setCopyDataDialog(true);
        } else {
          router.push(`/products/products-add/SERVICE_PRODUCT/`);
          setActiveTab(newValue);
        }
        break;
      default:
        setActiveTab("1");
        router.push(`/products/products-add/STANDARD_PRODUCT/`);
        break;
    }
  };

  useEffect(() => {
    if (router?.isReady && router.query.index) {
      const id = decodeURIComponent(typeof router.query?.id === 'string' ? router.query?.id : "")
      switch (router.query.index) {
        case "SERVICE_PRODUCT":
          setActiveTab("2");
          if(id)
          router.push(`/products/products-add/SERVICE_PRODUCT/?id=${encodeURIComponent(id)}`);
          else
          router.push(`/products/products-add/SERVICE_PRODUCT/`);
          break;
        default:
          setActiveTab("1");
          if(id)
          router.push(`/products/products-add/STANDARD_PRODUCT/?id=${encodeURIComponent(id)}`);
          else
          router.push(`/products/products-add/STANDARD_PRODUCT/`);
          break;
      }
    }
  }, [router?.isReady]);

  useEffect(() => {
    dispatch(fetchProductfamilydropdown());
    dispatch(fetchProductcategorydropdown());
    dispatch(fetchProductsubcategorydropdown());
    dispatch(fetchproductbrandsdropdown());
    dispatch(fetchProductgroupsdropdown());
    dispatch(fetchproductdivisionsdropdown());
    dispatch(fetchProductTypedropdown());
    dispatch(fetchProductAttributesdropdown());
    dispatch(fetchUnitOfMeasuresdropdown());
    dispatch(productSources());
    dispatch(getSKUcodes());
    dispatch(productTaxGroupSearch({}));
    dispatch(getMarketPlacevalues({}));
    dispatch(fetchProductAttribute01dropdown())
    dispatch(fetchProductAttribute02dropdown())
    dispatch(fetchProductAttribute03dropdown())
    dispatch(fetchProductAttribute04dropdown())
    dispatch(fetchProductAttribute05dropdown())
  }, []);

  useEffect(() => {
    const id = decodeURIComponent(typeof router.query?.id === 'string' ? router.query?.id : "")
    if (singleProduct?.id) {
      setEditData(singleProduct);
      switch (singleProduct?.productClassification) {
        case "SERVICE_PRODUCT":
          setActiveTab("2");
          router.push(`/products/products-add/SERVICE_PRODUCT/?id=${encodeURIComponent(id)}`);
          break;
        default:
          setActiveTab("1");
          router.push(`/products/products-add/STANDARD_PRODUCT/?id=${encodeURIComponent(id)}`);
          break;
      }
    }
  }, [singleProduct?.id]);

  useEffect(() => {
    if (router.query?.id && !singleProduct?.id) {
      const id = decodeURIComponent(typeof router.query?.id === 'string' ? router.query?.id : "")
      dispatch(productsGetById(decryptPriceId(id)))
    }
  }, [router.query?.id])

  const HeaderCard = ({ header, content, icon }: cardHeaderTypes) => {
    return (
      <Card className={classes.card}>
        {icon}
        <Typography className="cardHeader" variant="body1">
          {header}
        </Typography>
        <Typography variant="caption">{content}</Typography>
      </Card>
    );
  };

  const handleDiscardButton = async () => {
    switch (activeTab) {
      case "1":
        setIsStandardProductUpdated(false);
        const standardValues = {
          ...standardProductUpdatedDefaultValues,
          ...standardProductCurrentUpdatedDetails,
        };
        await setStandardProductUpdatedDefaultValues({ ...standardValues });
        setActiveTab("2");
        router.push(`/products/products-add/SERVICE_PRODUCT/`);
        break;
      case "2":
        setIsServiceProductUpdated(false);
        const serviceValues = {
          ...serviceProductUpdatedDefaultValues,
          ...serviceProductCurrentUpdatedDetails,
        };
        await setServiceProductUpdatedDefaultValues({ ...serviceValues });

        setActiveTab("1");
        router.push(`/products/products-add/STANDARD_PRODUCT/`);
        break;
      default:
        setActiveTab("1");
        router.push(`/products/products-add/STANDARD_PRODUCT/`);
        break;
    }
    setCopyDataDialog(false);
  };

  const handleCopyButton = async () => {
    switch (activeTab) {
      case "1":
        const serviceValues = {
          ...serviceProductUpdatedDefaultValues,
          ...standardProductCurrentUpdatedDetails,
        };
        await setServiceProductUpdatedDefaultValues({ ...serviceValues });
        await setStandardProductUpdatedDefaultValues({ ...standardProductUpdatedDefaultValues, ...standardProductCurrentUpdatedDetails });
        setIsStandardProductUpdated(false);
        setActiveTab("2");
        router.push(`/products/products-add/SERVICE_PRODUCT/`);
        break;
      case "2":
        const standardValues = {
          ...standardProductUpdatedDefaultValues,
          ...serviceProductCurrentUpdatedDetails,
        };
        await setStandardProductUpdatedDefaultValues({ ...standardValues });
        await setServiceProductUpdatedDefaultValues({ ...serviceProductUpdatedDefaultValues, ...serviceProductCurrentUpdatedDetails });
        setActiveTab("1");
        router.push(`/products/products-add/STANDARD_PRODUCT/`);
        setIsServiceProductUpdated(false);
        break;
      default:
        setActiveTab("1");
        router.push(`/products/products-add/STANDARD_PRODUCT/`);
        break;
    }
    setCopyDataDialog(false);
  };

  return (
    <Card sx={{ boxShadow: "none" }}>
      <div className={classes.content}>
        <Typography
          sx={{ fontWeight: 400, fontSize: 15 }}
          className={classes.tabheading}
        >
          {t("PRODUCTS_ADD_TITLE")}
        </Typography>
      </div>

      <div className={classes.tabContainer}>
        <Box sx={{ typography: "body1" }}>
          <TabContext value={activeTab}>
            <TabList
              className={classes.tabList}
              onChange={handleChange}
              aria-label="lab API tabs example"
              style={{ borderBottom: "None", padding: "0px 0px 20px 5px" }}
            >
              <Tab
                disabled={
                  singleProduct?.id &&
                  singleProduct?.productClassification !== "STANDARD_PRODUCT"
                }
                label={
                  <HeaderCard
                    header={t("STANDARD")}
                    content={t("PRODUCTS_ADD_CARD_TITLE")}
                    icon={<StandardIcon />}
                  />
                }
                value="1"
              />
              <Tab
                disabled={
                  singleProduct?.id &&
                  singleProduct?.productClassification !== "SERVICE_PRODUCT"
                }
                label={
                  <HeaderCard
                    header={t("SERVICES")}
                    content={t("PRODUCTS_ADD_CARD_TITLE")}
                    icon={<ServiceIcon />}
                  />
                }
                value="2"
              />
              <Tab
                disabled
                label={
                  <HeaderCard
                    header={t("VARIANT")}
                    content={t("PRODUCTS_ADD_CARD_TITLE")}
                    icon={<VariantIcon />}
                  />
                }
                value="3"
              />
              <Tab
                disabled
                label={
                  <HeaderCard
                    header={t("COMPOSITE")}
                    content={t("PRODUCTS_ADD_CARD_TITLE")}
                    icon={<CompositeIcon />}
                  />
                }
                value="4"
              />
            </TabList>
            <TabPanel value="1" className={classes.standardTabData}>
              <StandardTab
                editData={editData}
                setIsStandardProductUpdated={setIsStandardProductUpdated}
                setStandardProductCurrentUpdatedDetails={
                  setStandardProductCurrentUpdatedDetails
                }
                standardProductUpdatedDefaultValues={
                  standardProductUpdatedDefaultValues
                }
              />
            </TabPanel>
            <TabPanel value="2" className={classes.standardTabData}>
              <ServicesTab
                editData={editData}
                setIsServiceProductUpdated={setIsServiceProductUpdated}
                setServiceProductCurrentUpdatedDetails={
                  setServiceProductCurrentUpdatedDetails
                }
                serviceProductUpdatedDefaultValues={
                  serviceProductUpdatedDefaultValues
                }
              />
            </TabPanel>
            <TabPanel value="3">{t("VARIANT")}</TabPanel>
            <TabPanel value="4">{t("COMPOSITE")}</TabPanel>
          </TabContext>
        </Box>
      </div>

      {copyDataDialog && (
        <Dialog open={copyDataDialog} className={classes.dialog}>
          <DialogTitle color="#3586c7">{t("COPY_DATA")}</DialogTitle>
          <DialogContent>{t(`COPY_DATA_CONFIRM`)}</DialogContent>
          <DialogActions className={classes.formAction}>
            <Button
              variant="contained"
              onClick={() => handleDiscardButton()}
              className={classes.formActionDiscard}
            >
              {t("DISCARD_BUTTON")}
            </Button>
            <Button
              variant="contained"
              className={classes.formActionCopy}
              onClick={() => handleCopyButton()}
            >
              {t("COPY_BUTTON")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default index;
