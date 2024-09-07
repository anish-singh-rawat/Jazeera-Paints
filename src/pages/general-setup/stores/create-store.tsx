// cSpell:ignore tabler

import React, { useEffect, useState } from "react";
import CommonVerticalTabs from "src/components/common/CommonVerticalTabs";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Components Imports
import StoresSetup from "./components/storesSetup";
import PosSetup from "./components/posSetup";
import Payment from "./components/payments";
import Inventory from "./components/inventory";
import PaymentMethods from "./components/paymentMethods";
import InvoiceConfiguration from "./components/invoiceConfiguration";
import HardwareSetup from "./components/hardwareSetup";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { storesGetById } from "src/store/apps/storeSettings/storeSettings";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import AppStorage from "src/app/AppStorage";

const CreateStore = () => {
  const [modTabVal, setModTabVal] = useState<number>(0);
  const [isStoreSetupSaved, setIsStoreSetupSaved] = useState(false);
  const [createdStoreName, setCreatedStoreName] = useState("");
  const [createdStoreAltName, setCreatedStoreAltName] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const changeLanguage: any = AppStorage.getData("lang");

  const storeSettingsStore: any = useSelector(
    (state: RootState) => state.storeSettingsStore
  );

  const storeId = storeSettingsStore.dataById?.id;
  const storeName = storeSettingsStore.dataById?.name;
  const storeAltName = storeSettingsStore.dataById?.altName;
  const storeCode = storeSettingsStore.dataById?.code;

  useEffect(() => {
    const editData = router.query;
    if (editData.id) {
      dispatch(storesGetById({ id: editData.id }));
    }
  }, []);
  useEffect(() => {
    setIsStoreSetupSaved(!!storeId);
  }, [storeId]);

  useEffect(() => {
    // If in edit mode, ensure the "Store Setup" tab is active
    if (storeId) {
      setModTabVal(1);
    }
  }, [storeId]);

  // useEffect(() => {
  //   console.log("Current modTabVal:", modTabVal);
  // }, [modTabVal]);

  const handleStoreSetupSuccess = (storeName: any, storeAltName: any) => {
    setIsStoreSetupSaved(true);
    setCreatedStoreName(storeName); // Set the store name from the response
    setCreatedStoreAltName(storeAltName);
    const posSetupTabIndex = storeId || storeName ? 2 : 1;
    setModTabVal(posSetupTabIndex); // Switch to the "Store Setup" tab
  };

  // const handleBackButtonClick = () => {
  //   console.log('back changes....')
  // };

  const isTabEnabled = isStoreSetupSaved;

  const tabs = [
    {
      icon: <Icon icon="tabler:printer" fontSize={24} />,
      label: "Store Setup",
      subLabel: "Name/Address/Contact",
      content: (
        <StoresSetup
          setModTabVal={setModTabVal}
          onStoreSetupSuccess={handleStoreSetupSuccess}
        />
      ),
    },
    {
      icon: <Icon icon="tabler:device-desktop" fontSize={24} />,
      label: "POS Setup",
      subLabel: "Terminals/Sections",
      disabled: !isTabEnabled,
      content: <PosSetup />,
    },
    {
      icon: <Icon icon="tabler:cards" fontSize={24} />,
      label: "Payment Methods",
      subLabel: "Cash/Cards/Gift Cards",
      disabled: !isTabEnabled,
      content: <PaymentMethods />,
    },
    // {
    //   icon: <Icon icon="tabler:box" fontSize={24} />,
    //   label: "Inventory",
    //   subLabel: "Stock/Sales/Purchase",
    //   content: <Inventory />,
    // },
    // {
    //   icon: <Icon icon="tabler:cash" fontSize={24} />,
    //   label: "Payments",
    //   subLabel: "Advance/Partial/Returns",
    //   content: <Payment />,
    // },
    // {
    //   icon: <Icon icon="tabler:receipt-tax" fontSize={24} />,
    //   label: "Invoice Configuration",
    //   subLabel: "Layout/Tax/Discounts",
    //   content: <InvoiceConfiguration />,
    // },
    // {
    //   icon: <Icon icon="tabler:printer" fontSize={24} />,
    //   label: "Hardware Settings",
    //   subLabel: "Prints/Scanner/CashDrawer",
    //   content: <HardwareSetup />,
    // },
  ];
  if (storeId || createdStoreName) {
    tabs.unshift({
      // Inserts at the beginning of the tabs array
      icon: <Icon icon="tabler:arrow-left" fontSize={24} />,
      // label: storeId ? storeName : createdStoreName,
      label:
        changeLanguage === "en-US"
          ? storeId
            ? storeName
            : createdStoreName
          : storeId
          ? storeAltName
          : createdStoreAltName,
      content: <div />,
      subLabel: `Retail-${storeCode}`,
      disabled: false,
      id: "back-button",
    });
  }

  return (
    <CommonVerticalTabs
      tabs={tabs}
      modTabVal={modTabVal}
      setModTabVal={setModTabVal}
      //style={{ backgroundColor: 'transparent' }}
    />
  );
};

export default CreateStore;
