import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Grid,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { decryptSalesInvoiceId } from "src/utils/utils";
import { getOrderHistoryById } from "src/store/apps/orderHistory/orderHistory";
import { makeStyles, styled } from "@mui/styles";
import Icon from "src/@core/components/icon";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import OrderIcon from "@mui/icons-material/ShoppingCart";
import InvoiceIcon from "@mui/icons-material/Receipt";
import DeliveryIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import moment from "moment";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
// import { useTranslation } from "react-i18next";
// ** Translation
import { t } from "i18next";
import { Key } from "src/@core/layouts/utils";

const useStyles = makeStyles({
  ButtonIcon: {
    textAlign: "center",
    marginBottom: "10px",
  },
  invoiceActivityHeader: {
    color: "#3586C7",
  },
  activityIcon: {
    color: "#3586C7",
    bgcolor: "#3586C729",
    p: "5px",
    borderRadius: "50%",
    fontSize: "1.5rem",
  },
  companyLogo: {},
  "& .MuiTableCell-root": {
    borderBottom: "none !important",
  },
});
const OrderDetails = () => {
  //   const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const decryptId = decryptSalesInvoiceId(id);
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  // const { t } = useTranslation();
  const orderData: any = useSelector(
    (state: RootState) => state?.orderHistory.orderDetailsById
  );

  useEffect(() => {
    if (decryptId) {
      dispatch(getOrderHistoryById({ id: decryptId }));
    }
  }, [decryptId]);

  interface ProductStatusType {
    [key: string]: ThemeColor;
  }

  const productStatusObj: ProductStatusType = {
    PAID: "success",
    NOT_PAID: "error",
    PARTIAL: "warning",
    OPEN: "primary",
    CLOSED: "error",
  };

  const standardProducts =
    orderData?.salesOrderLines?.filter(
      (line) => line.parentProductType === "STANDARD_PRODUCT"
    ) || [];

  const serviceProducts =
    orderData?.salesOrderLines?.filter(
      (line) => line.parentProductType === "SERVICE_PRODUCT"
    ) || []; // Ensure it's always an array

  // Group service products by parentProductId
  const serviceProductsGroupedByParent = serviceProducts.reduce(
    (acc, serviceProduct) => {
      const parentProductId = serviceProduct.parentProductId.toString();
      if (!acc[parentProductId]) {
        acc[parentProductId] = [];
      }
      acc[parentProductId].push(serviceProduct);
      return acc;
    },
    {}
  );

  //  Create grouped lines including standard products and  service products
  let groupedOrderLines: any = [];

  standardProducts.forEach((standardProduct) => {
    const associatedServiceProducts =
      serviceProductsGroupedByParent[standardProduct.productId.toString()] ||
      [];
    // Delete the entry once it's used, to keep track of  service products
    delete serviceProductsGroupedByParent[standardProduct.productId.toString()];

    groupedOrderLines.push({
      ...standardProduct,
      serviceProducts: associatedServiceProducts,
    });
  });

  // Include service products (those without an associated standard product)
  Object.keys(serviceProductsGroupedByParent).forEach((parentId) => {
    serviceProductsGroupedByParent[parentId].forEach((serviceProduct) => {
      // Treat each  service product as a separate "standard" product entry
      groupedOrderLines.push({
        ...serviceProduct,
        serviceProducts: [], // These are standalone, so no associated services
      });
    });
  });

  console.log(groupedOrderLines, "groupedOrderLines");

  const calculateTotalAmounts = (product) => {
    const initialTotals = {
      totalLineGrossAmount: product.lineGrossAmount,
      totalDiscount: product.lineDisc,
      totalVAT: product.tax,
      totalNetAmount: product.netAmount,
    };

    return product.serviceProducts.reduce((totals, serviceProduct) => {
      return {
        totalLineGrossAmount:
          totals.totalLineGrossAmount + serviceProduct.lineGrossAmount,
        totalDiscount: totals.totalDiscount + serviceProduct.lineDisc,
        totalVAT: totals.totalVAT + serviceProduct.tax,
        totalNetAmount: totals.totalNetAmount + serviceProduct.netAmount,
      };
    }, initialTotals);
  };

  const orderDetails = (
    <>
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Grid container direction="column" alignItems="left" sx={{ pl: 5 }}>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Icon icon="tabler:file-invoice" />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    {t(Key("Order Details"))}
                  </Typography>
                </Grid>
                <Grid item ml={3}>
                  <Typography variant="subtitle1">
                    {t(Key("Items"))}: {orderData?.salesOrderLines?.length} |{" "}
                    {t(Key("Quantity"))} :
                    {orderData?.salesOrderLines?.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid container item>
              <Typography variant="body2">
                Items: {totals.itemCount} | Quantity: {totals.totalQuantity}
              </Typography>
            </Grid> */}
          </Grid>
          {/* <Grid container direction="column" alignItems="center">
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Icon icon="tabler:cash" />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">Payment Status</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                sx={{
                  color:
                    orderData.invoiceType === "SALES" ? "#28C76F" : "#EA5455",
                }}
              >
                {orderData.paymentStatus}
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="column" alignItems="end" sx={{ pr: 5 }}>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Icon icon="tabler:truck-delivery" />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">Delivery Mode</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="body2"> */}
          {/* {invoiceData.fulfilmentType} */}
          {/* </Typography>
            </Grid>
          </Grid> */}
        </Box>
        <Divider sx={{ mt: 3 }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>{t(Key("Qty"))}</TableCell>
                <TableCell sx={{ minWidth: "200px", width: "40%" }}>
                  {t(Key("DESCRIPTION"))}
                </TableCell>
                <TableCell>{t(Key("Price"))}</TableCell>
                <TableCell>{t(Key("Total"))}</TableCell>
                <TableCell>{t(Key("Discount"))}</TableCell>
                <TableCell>{t(Key("VAT"))}</TableCell>
                <TableCell>{t(Key("Net AMount"))}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedOrderLines?.map((product, productIndex, array) => {
                const {
                  totalLineGrossAmount,
                  totalDiscount,
                  totalVAT,
                  totalNetAmount,
                } = calculateTotalAmounts(product);
                return (
                  <React.Fragment key={`fragment-${product.id}`}>
                    <TableRow
                      key={`parent-${product.id}`}
                      style={{
                        borderBottom:
                          product.serviceProducts.length === 0
                            ? "1px solid rgba(224, 224, 224, 1)"
                            : "none",
                      }}
                    >
                      {/* Render cells for standard product */}
                      <TableCell component="th" scope="row">
                        {product.quantity}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {product.product?.image ? (
                            <img
                              src={product.product.image}
                              alt={product.product.shortName}
                              style={{
                                width: "30px",
                                height: "30px",
                                marginRight: "8px",
                              }}
                            />
                          ) : (
                            <Icon
                              icon="tabler:circle-filled"
                              fontSize={24}
                              style={{
                                color: product.product?.hexCode,
                                marginRight: "8px",
                              }}
                            />
                          )}
                          <Box>
                            <Typography variant="body1">
                              {product.product?.shortName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              SKU: {product.product?.code} | Unit:
                              {product.product?.salesUOM?.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {product.product?.retailPrice?.toFixed(2)}
                      </TableCell>
                      <TableCell>{totalLineGrossAmount?.toFixed(2)}</TableCell>
                      <TableCell>{totalDiscount?.toFixed(2)}</TableCell>
                      <TableCell>{totalVAT?.toFixed(2) || "-"}</TableCell>
                      <TableCell>{totalNetAmount?.toFixed(2)}</TableCell>
                    </TableRow>
                    {product.serviceProducts?.map(
                      (serviceProduct, serviceIndex) => (
                        <TableRow
                          key={`service-${serviceProduct.id}`}
                          style={{
                            borderBottom:
                              serviceIndex ===
                              product.serviceProducts.length - 1
                                ? "1px solid rgba(224, 224, 224, 1)"
                                : "none",
                          }}
                        >
                          {/* Render cells for service product */}
                          <TableCell component="th" scope="row">
                            {serviceProduct.quantity}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {serviceProduct.product?.image ? (
                                <img
                                  src={serviceProduct.product.image}
                                  alt={serviceProduct?.product?.shortName}
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    marginRight: "8px",
                                  }}
                                />
                              ) : (
                                <Icon
                                  icon="tabler:circle-filled"
                                  fontSize={24}
                                  style={{
                                    color: serviceProduct.product?.hexCode,
                                    marginRight: "8px",
                                  }}
                                />
                              )}
                              <Box>
                                <Typography variant="body1">
                                  {serviceProduct?.product?.shortName ||
                                    serviceProduct?.productName}
                                </Typography>
                                {/* <Typography variant="body2" color="text.secondary">
                              SKU: {item.product?.code} | Unit:
                              {item.product?.salesUOM?.name}
                            </Typography> */}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {serviceProduct?.product?.retailPrice?.toFixed(2) ||
                              serviceProduct?.price?.toFixed(2)}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      )
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Divider sx={{ mt: 3 }} /> */}
        <Box sx={{ mt: 4 }}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={1}>
                <Grid item>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t(Key("Salesperson"))}:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    {orderData?.salesPersonFirstName ||
                    orderData?.salesPersonLastName
                      ? `${orderData?.salesPersonFirstName} ${orderData?.salesPersonLastName}`
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Subtotal layout */}
              <Grid container>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t(Key("Subtotal"))}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1">
                    {/* {totalAmounts?.subtotal.toFixed(2)} SAR */}
                    {`${orderData?.grossAmount?.toFixed(2)} ${
                      orderData?.currencyCode
                    }`}
                  </Typography>
                </Grid>
              </Grid>
              {/* Total Discount layout */}
              <Grid container>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t(Key("Total Discount"))}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1">
                    {/* -{totalAmounts?.discount.toFixed(2)} SAR */}
                    {`${orderData?.totalDiscount?.toFixed(2)} ${
                      orderData?.currencyCode
                    }`}
                  </Typography>
                </Grid>
              </Grid>
              {/* VAT layout */}
              <Grid container>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t(Key("VAT"))} {orderData?.taxRate}%:
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1">
                    {/* {totalAmounts?.vat ? totalAmounts.vat.toFixed(2) : '0.00'} */}
                    {`${orderData?.tax ? orderData?.tax.toFixed(2) : "0.00"} ${
                      orderData?.currencyCode
                    }`}
                  </Typography>
                </Grid>
              </Grid>
              {/* Total Amount layout */}
              <Grid container>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {t(Key("Total Amount"))}:
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1">
                    {`${orderData?.netAmount?.toFixed(2)} ${
                      orderData?.currencyCode
                    }`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );

  const transactionDetails = (
    <>
      <Box>
        <Grid container sx={{ textAlign: "left" }}>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: 500 }} mb={4}>
              {t(Key("Transaction Details"))}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {orderData?.paymentTransactions?.map((item: any, index: number) => (
              <Grid container>
                <Grid item sm={2}>
                  <Typography variant="body1">
                    {item.paymentMethodType}
                  </Typography>
                </Grid>
                <Grid item sm={3}>
                  <Typography variant="body1" sx={{ textAlign: "right" }}>
                    {item.amount
                      ? `${item.amount?.toFixed(2)} ${orderData.currencyCode}`
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );

  const paymentBreakdown = (
    <>
      <Box>
        <Grid style={{ alignContent: "center" }}>
          <Typography
            variant="body1"
            gutterBottom
            mb={4}
            sx={{ fontWeight: 500 }}
          >
            {t(Key("Payment Breakdown"))}
          </Typography>
          <Grid item xs={12} sm={8}>
            <Grid container>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ fontWeight: 600 }}
                >
                  {t(Key("Total Amount"))}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Typography variant="body1" color="textSecondary">
                  {`${orderData?.grossAmount?.toFixed(2)} ${
                    orderData?.currencyCode
                  }`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ fontWeight: 600 }}
                >
                  {t(Key("Partial Pay"))}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Typography variant="body1" color="textSecondary">
                  {/* {`${orderData?.grossAmount?.toFixed(2)} ${
                    orderData.currencyCode
                  }`} */}
                  -
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ fontWeight: 600 }}
                  style={{ color: "#EA5455" }}
                >
                  {t(Key("Payment Due"))}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  style={{ color: "#EA5455" }}
                >
                  {`${orderData?.balanceAmount?.toFixed(2)} ${
                    orderData.currencyCode
                  }`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );

  const invoiceButtons = (
    <>
      <Box>
        <Grid style={{ alignContent: "center" }}>
          <div className={classes.ButtonIcon}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              fullWidth
              // disabled={true}
              // onClick={handlePrint}
              sx={{
                background: "#3586C729",
                "&:hover": { background: "#3586C729" },
                // "&.Mui-disabled": { background: "#e0e0e0", color: "#aaaaaa" },
              }}
            >
              {t(Key("Print"))}
            </Button>
          </div>
        </Grid>
        <Grid>
          <div className={classes.ButtonIcon}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              fullWidth
              sx={{
                background: "#3586C729",
                "&:hover": { background: "#3586C729" },
              }}
              // onClick={() => handleDownload(invoiceData.id)}
            >
              {t(Key("Download"))}
            </Button>
          </div>
        </Grid>
        <Grid>
          <div className={classes.ButtonIcon}>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              fullWidth
              // onClick={() => setShowDialog(true)}
              sx={{
                background: "#3586C729",
                "&:hover": { background: "#3586C729" },
              }}
            >
              {t(Key("E-Mail"))}
            </Button>
          </div>
        </Grid>
        {/* <Grid>
          <div className={classes.ButtonIcon}>
            <Button
              variant="outlined"
              startIcon={<WhatsAppIcon />}
              fullWidth
              sx={{
                background: "#3586C729",
                "&:hover": { background: "#3586C729" },
              }}
            >
              WhatsApp
            </Button>
          </div>
        </Grid> */}
      </Box>
    </>
  );

  const paymentStatus = (
    <>
      <Box>
        <Grid style={{ alignContent: "center" }}>
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
            Payment Status
          </Typography>
          <Typography variant="subtitle1" component="p">
            {orderData?.paymentStatus}
          </Typography>
        </Grid>
      </Box>
    </>
  );

  const customerDetails = (
    <>
      <Box>
        <Grid style={{ alignContent: "center" }} sx={{ mb: 2 }}>
          {/* <Avatar sx={{ bgcolor: "#f0f0f0" }}>MJ</Avatar> */}
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
            {t(Key("Customer Details"))}
          </Typography>
          <Typography variant="body1" component="h2" fontWeight={500}>
            {/* {orderData?.firstName} */}
            {orderData?.customer?.firstName || orderData?.customer?.lastName
              ? `${orderData?.customer?.firstName || ""} ${
                  orderData?.customer?.lastName || ""
                }`.trim()
              : ""}
          </Typography>
          <Typography color="textSecondary">
            {orderData?.customerId} | {orderData?.customer?.customerGroup?.name}{" "}
            | {orderData?.customer?.customerStatus}
          </Typography>
          <Typography variant="body1" component="p" color="textSecondary">
            {t(Key("Email"))}:{" "}
            {orderData?.customer?.email ? orderData?.customer?.email : ""}
          </Typography>
          <Typography variant="body1" component="p" color="textSecondary">
            {t(Key("Mobile"))}:{" "}
            {orderData?.customer?.mobileNumber
              ? orderData?.customer?.mobileNumber
              : ""}
          </Typography>
          <Typography variant="body1" component="p" color="textSecondary">
            {t(Key("VAT"))}:{" "}
            {orderData?.customer?.taxNumber
              ? orderData?.customer?.taxNumber
              : ""}
          </Typography>
        </Grid>
      </Box>
    </>
  );

  const deliveryMode = (
    <>
      <Box>
        <Grid style={{ alignContent: "center" }} sx={{ mb: 2 }}>
          {/* <Avatar sx={{ bgcolor: "#f0f0f0" }}>MJ</Avatar> */}
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
            {t(Key("Delivery Mode"))}
          </Typography>
          <Typography
            variant="body1"
            component="h2"
            gutterBottom
            color={"primary"}
          >
            {orderData?.fulfilmentType}
          </Typography>
          <Typography
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            {t(Key("Shipping Address"))}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            color="textSecondary"
            sx={{
              maxWidth: "170px",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {orderData?.fulfilmentAddress}
          </Typography>
        </Grid>
      </Box>
    </>
  );

  const activities = [
    {
      id: 1,
      type: "Order Initiated By",
      date: "31/12/2023",
      time: "10:32 am",
      name: "Shamus Tuttle",
      phone: "09748 | +91 987654321",
      avatar: "/path/to/shamus-avatar.jpg", // replace with actual path or URL
    },
    {
      id: 2,
      type: "Order Parked By",
      date: "31/12/2023",
      time: "10:32 am",
      name: "Swamy Cheruku",
      phone: "09748 | +91 987654321",
      avatar: "/path/to/shamus-avatar.jpg", // replace with actual path or URL
    },
    {
      id: 3,
      type: "Order Retrieve By",
      date: "02/01/2024",
      time: "10:32 am",
      name: "Shiva Sajja",
      phone: "09748 | +91 987654321",
      avatar: "/path/to/shamus-avatar.jpg", // replace with actual path or URL
    },
    {
      id: 4,
      type: "Order Placed By",
      date: "04/01/2024",
      time: "10:32 am",
      name: "Shiva Sajja",
      phone: "09748 | +91 987654321",
      avatar: "/path/to/shamus-avatar.jpg", // replace with actual path or URL
    },
    // ... other activities
  ];

  const getActivityIcon = (type: any) => {
    switch (type) {
      case "Order Initiated By":
        return <OrderIcon />;
      case "Order Parked By":
        return <LocalParkingIcon />;
      case "Order Retrieve By":
        return <FlightTakeoffIcon />;
      case "Order Placed By":
        return <CheckCircleIcon />;
      // Add more cases for different activity types
      default:
        return ""; // Default icon if no match is found
    }
  };

  const orderActivity = (
    <>
      <Box>
        {/* Invoice activity logs */}
        <List>
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
            Order Activity
          </Typography>
          {activities.map((activity) => (
            <React.Fragment key={activity.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    src={activity.avatar}
                    alt={activity.name}
                    className={classes.activityIcon}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <div className={classes.invoiceActivityHeader}>
                        {activity.type}
                      </div>
                      <Typography
                        component="span"
                        variant="caption"
                        color="textPrimary"
                        display="block" // Make it block to appear on a new line
                        sx={{ mb: 1.5 }}
                      >
                        {activity.date} | {activity.time}
                        {/* {activity.name} */}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        display="block" // Make it block to appear on a new line
                      >
                        {activity.name}
                        {/* {activity.phone} */}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="textSecondary"
                      >
                        {/* {activity.date} | {activity.time} */}
                        {activity.phone}
                      </Typography>
                    </React.Fragment>
                  }
                  // sx={{ ml: 4 }}
                />
              </ListItem>
              {/* <Divider variant="inset" component="li" /> */}
            </React.Fragment>
          ))}
        </List>
        {/* ... activity logs */}
      </Box>
    </>
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container flex={2}>
            <Grid>
              <Typography marginBottom={5} variant="h6">
                {orderData?.store?.name} |
              </Typography>
            </Grid>
            <Grid>
              <Typography marginBottom={5} variant="subtitle1" pl={1} pt={1}>
                {orderData?.store?.code}
              </Typography>
            </Grid>
          </Grid>
          <Grid container flex={2}>
            <Grid>
              <Typography
                // marginBottom={5}
                variant="body1"
                sx={{ fontWeight: 600 }}
              >
                {t(Key("Order Number"))} #
              </Typography>
            </Grid>
            <Grid>
              <Typography
                marginBottom={5}
                variant="subtitle1"
                pl={1}
                sx={{ fontWeight: 600 }}
              >
                {orderData?.orderNum}
                <Chip
                  rounded
                  skin="light"
                  size="small"
                  label={t(orderData?.paymentStatus)}
                  color={productStatusObj[orderData?.paymentStatus]}
                  sx={{ fontSize: "1rem", marginLeft: 2 }}
                />
                <Chip
                  rounded
                  skin="light"
                  size="small"
                  label={t(orderData?.fulfilmentStatus)}
                  // color={productStatusObj[orderData?.fulfilmentType]}
                  color={"primary"}
                  sx={{ fontSize: "1rem", marginLeft: 2 }}
                />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
          <Typography mb={4} mt={2}>
            {t(Key("Order Date & Time"))}
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>
            {moment(orderData?.orderDateTime).format("DD/MM/YYYY")} |
            {moment(orderData?.orderDateTime).format("hh:mm A")}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Card style={{ marginBottom: 10 }}>
            <CardContent>{orderDetails}</CardContent>
          </Card>
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={12} md={6} style={{ display: "flex" }}>
              <Card style={{ width: "100%" }}>
                <CardContent>{transactionDetails}</CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} style={{ display: "flex" }}>
              <Card style={{ width: "100%" }}>
                <CardContent>{paymentBreakdown}</CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* <Grid container>
            <Grid item xs={12}>
              <Card style={{ textAlign: "center", padding: "10px" }}>
                <Typography variant="body1">
                  Thank you for shopping with us
                </Typography>
              </Card>
            </Grid>
          </Grid> */}
        </Grid>
        <Grid item xs={12} md={3} spacing={2}>
          <Card style={{ marginBottom: 10 }}>
            <CardContent>{invoiceButtons}</CardContent>
          </Card>
          {/* <Card style={{ marginBottom: 10 }}>
            <CardContent>{paymentStatus}</CardContent>
          </Card> */}
          <Card style={{ marginBottom: 10 }}>
            <CardContent>{customerDetails}</CardContent>
          </Card>
          <Card style={{ marginBottom: 10 }}>
            <CardContent>{deliveryMode}</CardContent>
          </Card>
          {/* <Card style={{ marginBottom: 10 }}>
            <CardContent>{orderActivity}</CardContent>
          </Card> */}
        </Grid>
      </Grid>
    </>
  );
};

export default OrderDetails;
