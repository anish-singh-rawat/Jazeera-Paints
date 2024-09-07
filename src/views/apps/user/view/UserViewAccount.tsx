// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import MuiTimeline, { TimelineProps } from "@mui/lab/Timeline";
import { Button, SxProps, Theme } from "@mui/material";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Demo Component Imports
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Custom Components Imports
import OptionsMenu from "src/@core/components/option-menu";
import ReactApexcharts from "src/@core/components/react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { ApexOptions } from "apexcharts";
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  "& .MuiTimelineItem-root": {
    "&:before": {
      display: "none",
    },
    "&:last-child": {
      minHeight: 60,
    },
  },
}));

const series = [{ data: [37, 50, 50, 41, 50, 50, 50, 50, 41, 50, 50, 40] }];
interface PaymentDataType {
  icon: string;
  title: string;
  amount: string;
  avatarColor: ThemeColor;
  trend?: "positive" | "negative";
}

const paymentData: PaymentDataType[] = [
  {
    title: "Cash",
    amount: "12,346",
    icon: "tabler:cash",
    avatarColor: "primary",
  },
  {
    title: "Card",
    amount: "8,734",
    avatarColor: "secondary",
    icon: "tabler:credit-card",
  },
  {
    amount: "967",
    title: "Tabby",
    trend: "negative",
    icon: "tabler:question-mark",
    avatarColor: "success",
  },
  {
    amount: "345",
    title: "Tamara",
    icon: "tabler:question-mark",
    avatarColor: "success",
  },
  {
    amount: "10",
    trend: "negative",
    title: "Wallet",
    avatarColor: "primary",
    icon: "tabler:wallet",
  },
  {
    amount: "86",
    icon: "tabler:gift",
    title: "Gift Card",
    avatarColor: "info",
  },
  {
    amount: "86",
    icon: "tabler:building-store",
    title: "Store Credit",
    avatarColor: "error",
  },
];
interface ProductDataType {
  icon: string;
  title: string;
  amount: string;
  avatarColor: ThemeColor;
  subtitle:string;
  trend?: "positive" | "negative";
}

const productData: ProductDataType[] = [
  {
    title: "NOVEL CHARM",
    subtitle:"20 Qty",
    amount: "12,346",
    icon: "tabler:cash",
    avatarColor: "primary",
  },
  {
    title: "GREEN SILK",
    subtitle:"20 Qty",
    amount: "8,734",
    avatarColor: "secondary",
    icon: "tabler:credit-card",
  },
  {
    amount: "967",
    title: "TOURMALINE",
    subtitle:"20 Qty",
    trend: "negative",
    icon: "tabler:question-mark",
    avatarColor: "success",
  },
  {
    amount: "345",
    title: "GREEN MATT",
    subtitle:"20 Qty",
    icon: "tabler:question-mark",
    avatarColor: "success",
  },
  {
    amount: "10",
    trend: "negative",
    title: "MATT DECO PRIMER GREEN MATT",
    subtitle:"20 Qty",
    avatarColor: "primary",
    icon: "tabler:wallet",
  },
  {
    amount: "86",
    icon: "tabler:gift",
    title: "TOURMALINE",
    subtitle:"20 Qty",
    avatarColor: "info",
  },
];

const UserViewAccount = (props: any) => {
  const { customerData } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: "42%",
        endingShape: "rounded",
        startingShape: "rounded",
        dataLabels: {
          position: "top",
        },
      },
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: true, offsetY: -15}, 
    colors: [
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.16),
    ],
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    grid: {
      show: false,
      padding: {
        top: -15,
        left: -9,
        right: -10,
        bottom: -12,
      },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: true, color: theme.palette.divider,offsetY: 2 },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          fontSize: "14px",
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
        },
      },
    },
    yaxis: {
      show: true,
      labels: {
        formatter: function (value) {
          return value + "k";
        },
        style: {
          fontSize: "14px",
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
        },
      },
      axisBorder: {
        show: false,
      },
      min: 0,
      max: 50,
      tickAmount: 5,
    },
  };
  

  return (
    <Grid container spacing={6}>
     
        <Grid item xs={12} sm={6} md={3}>
          <Card >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderBottom: "5px solid #3586c7",
              }}
            >
              <CustomAvatar
                skin="light"
                variant="rounded"
                color="warning"
                sx={{ mb: 3.5, width: 42, height: 42 }}
              >
                <Icon icon="tabler:credit-card" fontSize="medium" />
              </CustomAvatar>
              <Typography variant="h6" sx={{ mb: 1 }}>
                
                {t(`TOTAL_SALES`)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.disabled" }}
              >
               {t(`THIS_YEAR`)}
              </Typography>
              <Typography sx={{ mb: 3.5, color: "text.secondary" }}>
                {"20,000 SAR"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderBottom: "5px solid #3586c7",
              }}
            >
              <CustomAvatar
                skin="light"
                variant="rounded"
                color="error"
                sx={{ mb: 3.5, width: 42, height: 42 }}
              >
                <Icon icon="tabler:credit-card" fontSize="medium" />
              </CustomAvatar>
              <Typography variant="h6" sx={{ mb: 1 }}>
                
              {t(`TOTAL_ORDERS`)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.disabled" }}
              >
             {t(`THIS_YEAR`)}
              </Typography>
              <Typography sx={{ mb: 3.5, color: "text.secondary" }}>
                {"100"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderBottom: "5px solid #3586c7",
              }}
            >
              <CustomAvatar
                skin="light"
                variant="rounded"
                color="success"
                sx={{ mb: 3.5, width: 42, height: 42 }}
              >
                 <Icon icon="tabler:credit-card" fontSize="medium" />
              </CustomAvatar>
              <Typography variant="h6" sx={{ mb: 1 }}>
                
              {t(`AVG_SALES`)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.disabled" }}
              >
             {t(`THIS_YEAR`)}
              </Typography>
              <Typography sx={{ mb: 3.5, color: "text.secondary" }}>
                {"200 SAR"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderBottom: "5px solid #3586c7",
              }}
            >
              <CustomAvatar
                skin="light"
                variant="rounded"
                color="success"
                sx={{ mb: 3.5, width: 42, height: 42 }}
              >
                 <Icon icon="tabler:credit-card" fontSize="medium" />
              </CustomAvatar>
              <Typography variant="h6" sx={{ mb: 1 }}>
                
              {t(`PROFIT`)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.disabled" }}
              >
              25/02/2024
              </Typography>
              <Typography sx={{ mb: 3.5, color: "text.secondary" }}>
                {"110 SAR"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ borderBottom: "5px solid #3586c7" }}>
            <CardHeader
              title={t(`MONTHLY_OVERVIEW`)}
              action={
                <OptionsMenu
                  options={["Share timeline", "Suggest edits", "Report bug"]}
                  iconButtonProps={{
                    size: "small",
                    sx: { color: "text.disabled" },
                  }}
                />
              }
            />
            <Grid pl={5} item xs={12} sx={{ display: "flex", gap: "20px" }}>
              <Box
                sx={{
                  height: "120px",
                  width: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border:
                    selectedAvatar === 0
                      ? "2px solid #3586c7"
                      : "2px solid lightgray",
                  borderStyle: selectedAvatar === 0 ? "" : "dashed",
                }}
                borderRadius={2}
                onClick={() => setSelectedAvatar(0)}
              >
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  color={selectedAvatar === 0 ? "primary" : "secondary"}
                  sx={{ mb: 3.5, width: 42, height: 42 }}
                >
                  <Icon icon={"tabler:shopping-cart"} fontSize={"24"} />
                </CustomAvatar>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", fontWeight: "700" }}
                >
                  Total Orders
                </Typography>
              </Box>
              <Box
                sx={{
                  height: "120px",
                  width: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border:
                    selectedAvatar === 1
                      ? "2px solid #3586c7"
                      : "2px solid lightgray",
                  borderStyle: selectedAvatar === 1 ? "" : "dashed",
                }}
                borderRadius={2}
                onClick={() => setSelectedAvatar(1)}
              >
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  color={selectedAvatar === 1 ? "primary" : "secondary"}
                  sx={{ mb: 3.5, width: 42, height: 42 }}
                >
                  <Icon icon={"tabler:chart-bar"} fontSize={"24"} />
                </CustomAvatar>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", fontWeight: "700" }}
                >
                  Sales
                </Typography>
              </Box>
              <Box
                sx={{
                  height: "120px",
                  width: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border:
                    selectedAvatar === 2
                      ? "2px solid #3586c7"
                      : "2px solid lightgray",
                  borderStyle: selectedAvatar === 2 ? "" : "dashed",
                }}
                borderRadius={2}
                onClick={() => setSelectedAvatar(2)}
              >
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  color={selectedAvatar === 2 ? "primary" : "secondary"}
                  sx={{ mb: 3.5, width: 42, height: 42 }}
                >
                  <Icon icon={"tabler:currency-dollar"} fontSize={"24"} />
                </CustomAvatar>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", fontWeight: "700" }}
                >
                  Returns
                </Typography>
              </Box>
            </Grid>
            <CardContent sx={{marginTop:"10px"}}>
              <ReactApexcharts
                type="bar"
                height={200}
                series={series}
                options={options}
              />
            </CardContent>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ borderBottom: "5px solid #3586c7"}}>
            <CardHeader
              title={t(`USER_ACTIVITY_TIMELINE`)}
              action={
                <OptionsMenu
                  options={["Share timeline", "Suggest edits", "Report bug"]}
                  iconButtonProps={{
                    size: "small",
                    sx: { color: "text.disabled" },
                  }}
                />
              }
            />
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="warning" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{ mb: (theme: any) => `${theme.spacing(3)} !important` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 500 }}>
                      {t(`PURCHASED_IN_STORE`)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   Today
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 3, color: "text.secondary" }}>
                    Purchase at 11:45 AM | 25/02/2024 | 5,000,00 SAR
                  </Typography>
                  <Box>
                    <Button>
                      <DescriptionIcon /> {t(`SALES_INVOICE`)}
                    </Button>
                  </Box>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="error" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{ mb: (theme: any) => `${theme.spacing(3)} !important` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 500, color: "red" }}>
                     {t(`RETURN_ONLINE`)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.disabled" }}>
                      2 Days Ago
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "text.secondary" }}>
                    Purchase at 11:45 AM | 25/02/2024 | 5,000,00 SAR
                  </Typography>
                  <Box>
                    <Button>
                      <DescriptionIcon /> {t(`RETURN_INVOICE`)}
                    </Button>
                  </Box>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="info" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{ mb: (theme: any) => `${theme.spacing(3)} !important` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 500 }}>
                      {t(`PURCHASE_ONLINE`)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.disabled" }}>
                      4 Days Ago
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 3, color: "text.secondary" }}>
                    Purchase at 11:45 AM | 25/02/2024 | 5,000,00 SAR
                  </Typography>
                  <Box>
                    <Button>
                      <DescriptionIcon />{t(`SALES_INVOICE`)}
                    </Button>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
        </Card>
      </Grid>

      {/*Purchase table */}
      <Grid item xs={12} sm={12} md={4} lg={4} >
      <Card>
      <CardHeader
        title={t(`PAYMENTS`)}
        subheaderTypographyProps={{ sx: { mt: "0 !important" } }}
        action={
          <OptionsMenu
            options={["Last Month", "Last 6 Months", "Last Year"]}
            iconButtonProps={{ size: "small", sx: { color: "text.disabled" } }}
          />
        }
      />
      <CardContent sx={{ borderBottom: "5px solid #3586c7"}}>
        {paymentData.map((item: PaymentDataType, index: number) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4
              }}
            >
              <CustomAvatar
                skin="light"
                variant="rounded"
                color={item.avatarColor}
                sx={{ mr: 4, width: 34, height: 34 }}
              >
                <Icon icon={item.icon} />
              </CustomAvatar>
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{ mr: 4, fontWeight: 500, color: "text.secondary" }}
                  >
                    {item.amount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
      </Grid>
      {/* Purchase timeline */}
      <Grid item xs={12} sm={12} md={8} lg={8}>
      <Card>
      <CardHeader
        title={t(`TOP_PURCHASED_PRODUCTS`)}
        subheaderTypographyProps={{ sx: { mt: "0 !important" } }}
        action={
          <OptionsMenu
            options={["Last Month", "Last 6 Months", "Last Year"]}
            iconButtonProps={{ size: "small", sx: { color: "text.disabled" } }}
          />
        }
      />
      <CardContent sx={{ borderBottom: "5px solid #3586c7"}}>
        {productData.map((item: ProductDataType, index: number) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4
              }}
            >
              <CustomAvatar
                skin="light"
                variant="rounded"
                color={item.avatarColor}
                sx={{ mr: 4, width: 34, height: 34 }}
              >
                <Icon icon={item.icon} />
              </CustomAvatar>
              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
              <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                    {item.subtitle}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{ mr: 4, fontWeight: 500, color: "text.secondary" }}
                  >
                    {item.amount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
      </Grid>
      </Grid>
  );
};

export default UserViewAccount;
