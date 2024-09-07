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
import { makeStyles, styled } from "@mui/styles";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import OrderIcon from "@mui/icons-material/ShoppingCart";
import InvoiceIcon from "@mui/icons-material/Receipt";
import DeliveryIcon from "@mui/icons-material/LocalShipping";
import Icon from "src/@core/components/icon";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import {
  downloadInvoice,
  getInvoiceHistoryById,
} from "src/store/apps/invoiceHistory/invoiceHistory";
import moment from "moment";
import { decryptSalesInvoiceId } from "src/utils/utils";
import EmailInvoice from "src/components/invoice-history/emailInvoice";
import { downloadFile, printPDFBase64 } from "src/utils/downloadUtils";
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
  "& .css-1ae8s8w-MuiTableCell-root ": {
    borderBottom: "none !important",
  },
});

type LineItem = {
  id: string;
  description: string;
  price: number;
  total: number;
  discount: number;
  vat: number;
  netAmount: number;
};

type InvoiceProps = {
  items: LineItem[];
  // ... include other dynamic data types here as needed
};

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

const InvoiceDetails = () => {
  const [totals, setTotals] = useState({ itemCount: 0, totalQuantity: 0 });
  const [showDialog, setShowDialog] = useState(false);
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const decryptId = decryptSalesInvoiceId(id);
  const dispatch = useDispatch<AppDispatch>();
  // const printRef = useRef(null);

  const invoiceData: any = useSelector(
    (state: RootState) => state?.invoiceHistory.invoiceDetailsById
  );

  useEffect(() => {
    if (decryptId) {
      dispatch(getInvoiceHistoryById({ id: decryptId }));
    }
  }, [decryptId]);

  useEffect(() => {
    if (
      invoiceData.salesInvoiceLines &&
      invoiceData.salesInvoiceLines.length > 0
    ) {
      calculateTotals(invoiceData.salesInvoiceLines);
    }
  }, [invoiceData.salesInvoiceLines]);

  const standardProducts =
    invoiceData?.salesInvoiceLines?.filter(
      (line) => line.parentProductType === "STANDARD_PRODUCT"
    ) || [];

  const serviceProducts =
    invoiceData?.salesInvoiceLines?.filter(
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

  // Create grouped lines including standard products and  service products
  let groupedOrderLines = [];

  standardProducts.forEach((standardProduct) => {
    const associatedServiceProducts =
      serviceProductsGroupedByParent[standardProduct.productId.toString()] ||
      [];
    // Delete the entry once it's used, to keep track of service products
    delete serviceProductsGroupedByParent[standardProduct.productId.toString()];

    groupedOrderLines.push({
      ...standardProduct,
      serviceProducts: associatedServiceProducts,
    });
  });

  // Include standalone service products (those without an associated standard product)
  Object.keys(serviceProductsGroupedByParent).forEach((parentId) => {
    serviceProductsGroupedByParent[parentId].forEach((serviceProduct) => {
      // Treat each standalone service product as a separate "standard" product entry
      groupedOrderLines.push({
        ...serviceProduct,
        serviceProducts: [], // These are standalone, so no associated services
      });
    });
  });

  // Now, groupedOrderLines contains all standard products with or without service products,
  // and  service products treated as separate entries.

  const calculateTotals = (invoiceLines: any) => {
    let itemCount = invoiceLines.length;
    let totalQuantity = invoiceLines.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setTotals({ itemCount, totalQuantity });
  };

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

  const invoiceDetails = (
    <>
      {/* <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable, .printable * {
              visibility: visible;
            }
            .printable {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style> */}
      <Box sx={{ p: 3 }}>
        {/* Invoice details go here */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            className={classes.companyLogo}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {/* <Logo /> Your logo component */}
            <img
              src={invoiceData.company?.image}
              alt={invoiceData.store?.name}
              style={{ width: "230px", height: "60px", marginRight: "8px" }}
            />
          </Box>
          <Box>
            <Typography variant="h6">
              {t(Key("Invoice"))} #{invoiceData?.invoiceNum}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "right" }}>
              {t(Key("Invoice Date"))}:{" "}
              {moment(invoiceData?.invoiceDateTime).format("DD/MM/YYYY")}
              {/* moment(row.invoiceDateTime).format("DD-MM-YYYY") */}
            </Typography>
          </Box>

          {/* <QrCode value="http://example.com" size={64} /> */}
        </Box>
        <Divider sx={{ mt: 3, mb: 3 }} />
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              {/* <Paper sx={{ p: 2 }}> */}
              <Typography
                variant="body1"
                gutterBottom
                component="div"
                sx={{ textAlign: "left" }}
              >
                {t(Key("From"))}:
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: "left", fontWeight: 600 }}
              >
                {invoiceData?.store?.altName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: "left", fontWeight: 600 }}
              >
                {invoiceData?.store?.name}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                {t(Key("Phone"))}: {invoiceData?.store?.mobileNumber || ""} |{" "}
                {t(Key("Fax"))}: {invoiceData?.store?.fax || ""}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                {t(Key("VAT No"))}.{" "}
                {invoiceData?.company?.taxRegistrationNumber || ""}
              </Typography>
              {/* Add additional details as needed */}
              {/* </Paper> */}
            </Grid>
            <Grid item xs={12} sm={5}>
              {/* <Paper sx={{ p: 2 }}> */}
              <Typography
                variant="body1"
                gutterBottom
                component="div"
                sx={{ textAlign: "left" }}
              >
                {t(Key("Invoice To"))}:
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: "left", fontWeight: 600 }}
              >
                {invoiceData.customer?.firstName ||
                invoiceData.customer?.lastName
                  ? `${invoiceData.customer?.firstName || ""} ${
                      invoiceData.customer?.lastName || ""
                    }`.trim()
                  : ""}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                {invoiceData.customerId} |{" "}
                {invoiceData.customer?.customerGroup?.name} |{" "}
                {invoiceData.customer?.status}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                {invoiceData?.customer?.email} |{" "}
                {invoiceData?.customer?.mobileNumber}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                {t(Key("VAT No"))}. {invoiceData?.customer?.taxNumber}
              </Typography>
              {/* Add additional details as needed */}
              {/* </Paper> */}
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mt: 3, mb: 3 }} />
        <Box display="flex" justifyContent="space-between">
          <Grid container direction="column" alignItems="left" sx={{ pl: 5 }}>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Icon icon="tabler:file-invoice" />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    {t(Key("Invoice Details"))}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container item>
              <Typography variant="body2">
                {t(Key("Items"))}: {totals.itemCount} | {t(Key("Quantity"))}:{" "}
                {totals.totalQuantity}
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Icon icon="tabler:cash" />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    {t(Key("Payment Status"))}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                sx={{
                  color:
                    invoiceData.invoiceType === "SALES" ? "#28C76F" : "#EA5455",
                }}
              >
                {invoiceData.paymentStatus}
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
                  <Typography variant="subtitle1">
                    {t(Key("Delivery Mode"))}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {invoiceData.fulfilmentType}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mt: 3 }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>{t(Key("Qty"))}</TableCell>
                <TableCell sx={{ minWidth: "200px", width: "40%" }}>
                  {t(Key("Description"))}
                </TableCell>
                <TableCell>{t(Key("Price"))}</TableCell>
                <TableCell>{t(Key("Total"))}</TableCell>
                <TableCell>{t(Key("Discount"))}</TableCell>
                <TableCell>{t(Key("VAT"))}</TableCell>
                <TableCell>{t(Key("Net Amount"))}</TableCell>
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
        <Box sx={{ mt: 2 }}>
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
                    {invoiceData.salesPersonFirstName ||
                    invoiceData.salesPersonLastName
                      ? `${invoiceData?.salesPersonFirstName} ${invoiceData?.salesPersonLastName}`
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
                    {`${invoiceData?.grossAmount?.toFixed(2)} ${
                      invoiceData.currencyCode
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
                    {`${invoiceData?.totalDiscount?.toFixed(2)} ${
                      invoiceData.currencyCode
                    }`}
                  </Typography>
                </Grid>
              </Grid>
              {/* VAT layout */}
              <Grid container>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t(Key("VAT"))} {invoiceData?.taxRate}%:
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography variant="body1">
                    {/* {totalAmounts?.vat ? totalAmounts.vat.toFixed(2) : '0.00'} */}
                    {`${
                      invoiceData?.tax ? invoiceData.tax.toFixed(2) : "0.00"
                    } ${invoiceData.currencyCode}`}
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
                      color:
                        invoiceData.invoiceType === "SALES"
                          ? "inherit"
                          : "#EA5455",
                    }}
                  >
                    {invoiceData.invoiceType === "SALES"
                      ? t("TOTAL_AMOUNT")
                      : t("REFUND_AMOUNT")}
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color:
                        invoiceData.invoiceType === "SALES"
                          ? "inherit"
                          : "#EA5455",
                    }}
                  >
                    {`${invoiceData?.netAmount?.toFixed(2)} ${
                      invoiceData.currencyCode
                    }`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mt: 3 }} />
        <Box sx={{ mt: 2 }}>
          <Grid container sx={{ textAlign: "left" }}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, mt: 3, mb: 5 }}
              >
                {t(Key("Payment Details"))}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {invoiceData.paymentTransactions?.map(
                (item: any, index: number) => (
                  <Grid container>
                    <Grid item sm={2}>
                      <Typography variant="body1">
                        {item.paymentMethodType}
                      </Typography>
                    </Grid>
                    <Grid item sm={3}>
                      <Typography variant="body1" sx={{ textAlign: "right" }}>
                        {item.amount
                          ? `${item.amount?.toFixed(2)} ${
                              invoiceData.currencyCode
                            }`
                          : ""}
                      </Typography>
                    </Grid>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mt: 3 }} />
        <Box sx={{ mt: 2 }}>
          <Grid container sx={{ textAlign: "left" }}>
            <Grid item xs={12}>
              <Grid container>
                <Grid item sm={2}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color:
                        invoiceData.invoiceType === "SALES"
                          ? "inherit"
                          : "#EA5455",
                    }}
                  >
                    {invoiceData.invoiceType === "SALES"
                      ? t("AMOUNT_PAID")
                      : t("REFUNDED_AMOUNT")}
                  </Typography>
                </Grid>
                <Grid item sm={3}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      textAlign: "right",
                      color:
                        invoiceData.invoiceType === "SALES"
                          ? "inherit"
                          : "#EA5455",
                    }}
                  >
                    {invoiceData.paymentTransactions
                      ? `${invoiceData.paymentTransactions
                          ?.reduce(
                            (acc, transaction) => acc + transaction.amount,
                            0
                          )
                          .toFixed(2)}
                 ${invoiceData.currencyCode}`
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {/* <Divider sx={{ mt: 3 }} />
        <Box sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}>
          <Typography variant="body2">Thankyou for shopping with us</Typography>
        </Box> */}
      </Box>
    </>
  );

  const handlePrint = async () => {
    let payload = {
      invoiceId: invoiceData.id,
      storeId: invoiceData.store?.id,
      templateId: 301,
    };
    try {
      const downloadResponse = await dispatch(downloadInvoice(payload));
      const pdfBase64 = downloadResponse.payload.pdfResponse;
      printPDFBase64(pdfBase64);
    } catch (error) {
      console.error("Failed to load or print the invoice:", error);
    }
  };

  const handleDownload = async (id: any) => {
    let payload = {
      invoiceId: invoiceData.id,
      storeId: invoiceData.store?.id,
      templateId: 301,
    };
    const downloadResponse = await dispatch(downloadInvoice(payload));
    const pdfBase64 = downloadResponse.payload.pdfResponse; // Adjust based on actual response
    const downloadLink = `data:application/pdf;base64,${pdfBase64}`;
    downloadFile(downloadLink, "invoice.pdf");
  };

  const invoiceButtons = (
    <Box>
      <Grid style={{ alignContent: "center" }}>
        <div className={classes.ButtonIcon}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            fullWidth
            onClick={handlePrint}
            sx={{
              background: "#3586C729",
              "&:hover": { background: "#3586C729" },
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
            onClick={() => handleDownload(invoiceData.id)}
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
            onClick={() => setShowDialog(true)}
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
  );

  const activities = [
    {
      id: 1,
      type: "Order Placed By",
      date: "31/12/2023",
      time: "10:32 am",
      name: "Shamus Tuttle",
      phone: "09748 | +91 987654321",
      avatar: "/path/to/shamus-avatar.jpg", // replace with actual path or URL
    },
    {
      id: 2,
      type: "Invoice Created By",
      date: "31/12/2023",
      time: "10:32 am",
      name: "Swamy Cheruku",
      phone: "09748 | +91 987654321",
      avatar: "/path/to/shamus-avatar.jpg", // replace with actual path or URL
    },
    {
      id: 3,
      type: "Item Delivered By",
      date: "31/12/2023",
      time: "10:32 am",
      name: "Shiva Sajja",
      phone: "09748 | +91 987654321",
      avatar: "/path/to/shamus-avatar.jpg", // replace with actual path or URL
    },
    // ... other activities
  ];

  const getActivityIcon = (type: any) => {
    switch (type) {
      case "Order Placed By":
        return <OrderIcon />;
      case "Invoice Created By":
        return <InvoiceIcon />;
      case "Item Delivered By":
        return <DeliveryIcon />;
      // Add more cases for different activity types
      default:
        return ""; // Default icon if no match is found
    }
  };

  const invoiceActivity = (
    <Box>
      {/* Invoice activity logs */}
      <List>
        <Typography variant="h6" gutterBottom>
          Invoice Activity
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
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Item elevation={3}>{invoiceDetails}</Item>
        </Grid>
        <Grid item xs={12} md={3} spacing={2}>
          <Card style={{ marginBottom: 10 }}>
            <CardContent>{invoiceButtons}</CardContent>
          </Card>
          {/* <Card style={{ marginBottom: 10 }}>
            <CardContent>{invoiceActivity}</CardContent>
          </Card> */}
        </Grid>
      </Grid>
      <EmailInvoice
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={() => setShowDialog(false)}
        // defaultEmail={invoiceData?.customer?.email || ""}
        defaultEmail="hellosayeed@gmail.com"
        // isLoading={isLoading}
        invoiceId={invoiceData.id} // Assuming `invoiceData` has `id`
        storeId={invoiceData.store?.id}
      />
    </>
  );
};
export default InvoiceDetails;
