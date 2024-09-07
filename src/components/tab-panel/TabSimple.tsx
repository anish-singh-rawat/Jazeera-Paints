// ** React Imports
import { SyntheticEvent, useState } from "react";

// ** MUI Imports
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import BusinessTaxGroup from "../bussinesTaxGroup/TaxGroups";
import ProductTaxGroup from "../productTaxGroup/ProductTaxGroup";
import { useTranslation } from "react-i18next";

enum taxGroupTabs {
  BUSINESS_TAX_GROUP = "BUSINESS_TAX_GROUP",
  PRODUCT_TAX_GROUP = "PRODUCT_TAX_GROUP",
}

const TaxGroupTabs = () => {
  // ** State
  const [value, setValue] = useState<taxGroupTabs>(
    taxGroupTabs.BUSINESS_TAX_GROUP
  );
  const { t } = useTranslation();

  const handleChange = (event: SyntheticEvent, newValue: taxGroupTabs) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label="simple tabs example">
        <Tab
          value={taxGroupTabs.BUSINESS_TAX_GROUP}
          label={t(taxGroupTabs.BUSINESS_TAX_GROUP)}
        />
        <Tab
          value={taxGroupTabs.PRODUCT_TAX_GROUP}
          label={t(taxGroupTabs.PRODUCT_TAX_GROUP)}
        />
      </TabList>
      <TabPanel value={taxGroupTabs.BUSINESS_TAX_GROUP}>
        <BusinessTaxGroup />
      </TabPanel>
      <TabPanel value={taxGroupTabs.PRODUCT_TAX_GROUP}>
        <ProductTaxGroup />
      </TabPanel>
    </TabContext>
  );
};

export default TaxGroupTabs;
