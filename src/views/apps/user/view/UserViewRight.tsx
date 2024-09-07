// ** React Imports
import { SyntheticEvent, useState, useEffect } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MuiTab, { TabProps } from "@mui/material/Tab";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import CircularProgress from "@mui/material/CircularProgress";

// ** Demo Components Imports
import UserViewAccount from "src/views/apps/user/view/UserViewAccount";
import CustomerViewProfile from "src/views/apps/user/view/CustomerViewProfile";
import CustomerViewSalesHistory from "src/views/apps/user/view/CustomerViewSalesHistory";
import CustomerViewProducts from "src/views/apps/user/view/CustomerViewProducts";
import CustomerViewWallet from "src/views/apps/user/view/CustomerViewWallet";
import CustomerViewTimeline from "./CustomerViewTimeline";
import CustomerViewAttachment from "./CustomerViewAttachment";
import CustomerViewOffers from "./CustomerViewOffers";

interface Props {
  tab?: any;
  customerData?: any;
}

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  flexDirection: "row",
  "& svg": {
    marginBottom: "0 !important",
    marginRight: theme.spacing(1.5),
  },
}));

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: "0 !important",
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
  },
}));

const UserViewRight = ({ tab, customerData }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ** Hooks
  const router = useRouter();

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(false);
    setActiveTab(value);
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          activeTab: value,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    const activeTab = router.query?.activeTab || "overview";
    if (tab && tab !== activeTab) {
      setActiveTab("overview");
    }
    setActiveTab(activeTab as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <TabContext value={activeTab}>
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        aria-label="forced scroll tabs example"
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value="overview" label="Overview" />
        <Tab value="profile" label="Profile" />
        <Tab value="timeline" label="Timeline" />
        <Tab value="saleshistory" label="Sales History" />
        <Tab value="products" label="Products" />
        <Tab value="wallet" label="Wallet" />
        <Tab value="offers" label="Offers" />
        <Tab value="attachments" label="Attachments" />
      </TabList>
      <Box sx={{ mt: 6 }}>
        {isLoading ? (
          <Box
            sx={{
              mt: 6,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value={"overview"}>
              <UserViewAccount customerData={customerData} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="profile">
              <CustomerViewProfile customerData={customerData} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="timeline">
              <CustomerViewTimeline />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="saleshistory">
              <CustomerViewSalesHistory />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="products">
              <CustomerViewProducts />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="wallet">
              <CustomerViewWallet />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="offers">
              <CustomerViewOffers />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="attachments">
              <CustomerViewAttachment />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  );
};

export default UserViewRight;
