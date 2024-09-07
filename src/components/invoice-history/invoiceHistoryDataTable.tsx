import {
  Autocomplete,
  ListItemText,
  TextField,
  Typography,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControl,
  Grid,
  Card,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  DialogActions,
  Button,
  IconButton,
  InputAdornment,
  Popover,
  ClickAwayListener,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Close from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import Rowoptions from "./invoice-row-option";
import CommonServerSidePaging from "../common/CommonServerSidePaging/CommonServerSidePaging";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import {
  downloadInvoice,
  getInvoiceHistoryById,
  invoiceEmail,
  invoiceHistoryList,
} from "src/store/apps/invoiceHistory/invoiceHistory";
import {
  storesListGet,
  fetchAllStoresList,
} from "src/store/apps/storeSettings/storeSettings";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import { DateRange } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import AppEvent from "src/app/AppEvent";
import { makeStyles } from "@mui/styles";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";

// ** Yup
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import CommonInput from "../common/CommonInput";
import CommonFormActionButtons from "../common/CommonFormActionButtons";
import EmailInvoice from "./emailInvoice";
import { downloadFile, printPDFBase64 } from "src/utils/downloadUtils";

const InvoiceHistoryDataTable = (props: any) => {
  const {
    rows,
    data,
    handleEditPage,
    groupItem,
    setGroupItem,
    selectedRecord,
    isLoading,
    rowCount,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [newValue, setNewValue] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRangeOption, setSelectedRangeOption] = useState("thisMonth");
  const [openCustomRangePicker, setOpenCustomRangePicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [startDate, endDate] = dateRange;
  const [labelText, setLabelText] = useState("Date Range");
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const [selectionMade, setSelectionMade] = useState(false);

  const invoiceHistoryData: any = useSelector(
    (state: RootState) => state?.invoiceHistory
  );
  const invoiceData: any = useSelector(
    (state: RootState) => state?.invoiceHistory.invoiceDetailsById
  );
  const storeSettingsStore: any = useSelector(
    (state: RootState) => state?.storeSettingsStore
  );
  const additionalParams = {
    storeId:
      newValue.length > 0 ? newValue.map((item: any) => item.id).join(",") : "",
    startDate: startDate ? startDate.toISOString() : "",
    endDate: endDate ? endDate.toISOString() : "",
  };
  useEffect(() => {
    Promise.allSettled([
      //   dispatch(invoiceHistoryList({})),
    ]).catch(console.error);
    // dispatch(storesListGet({}));
    dispatch(fetchAllStoresList());
    // handleFetchInvoiceHistory();
  }, []);
  useEffect(() => {
    props.handleChangeStore(newValue, startDate, endDate);
  }, [newValue, startDate, endDate]);

  const schema: any = yup.object().shape({
    email: yup.string().email().required(),
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const emailValue = invoiceData?.customer?.email || "";
    reset({ email: emailValue });
  }, [invoiceData, reset]);
  interface UserStatusType {
    [key: string]: ThemeColor;
  }
  const userStatusObj: UserStatusType = {
    Invoice: "success",
    Return: "error",
  };

  const theme = useTheme();

  const useStyles = makeStyles({
    calendarContainer: {
      position: "absolute",
      zIndex: 1300,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: theme.palette.background.paper,
      borderRadius: 6,
      top: "100%",
      left: "-35%",
      transform: "translateX(-50%)",
      minWidth: "280px",
      width: "auto",
      overflow: "visible",
      height: "auto",
    },
    "& .MuiPaper-root-MuiCard-root": {
      overflow: "visible",
    },
    paperRootCardRoot: {
      overflow: "visible !important",
    },
  });

  const classes = useStyles();

  const dateOptions: any = {
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    lastWeek: "Last Week",
    lastMonth: "Last Month",
    // custom: "Custom Range",
  };

  const calculateDateRange = (rangeKey: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to start of day for consistency
    let start, end;

    switch (rangeKey) {
      case "today":
        start = end = today;
        break;
      case "thisWeek":
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        end = new Date();
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      case "lastWeek":
        const lastSunday = new Date(
          today.setDate(today.getDate() - today.getDay() - 7)
        );
        start = new Date(lastSunday);
        end = new Date(lastSunday.setDate(lastSunday.getDate() + 6));
        break;
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        start = end = today;
    }

    return [start, end];
  };

  const handleDateRangeOptionChange = (event: any) => {
    const newRangeOption = event.target.value;
    setSelectedRangeOption(newRangeOption);
    setSelectionMade(true);

    setLabelText(dateOptions[newRangeOption]);
    const [newStart, newEnd] = calculateDateRange(newRangeOption);
    setDateRange([dayjs(newStart), dayjs(newEnd)]);
  };

  const clearSelection = () => {
    setSelectedRangeOption("");
    setDateRange([dayjs().subtract(30, "day"), dayjs()]);
    setLabelText("Date Range");
    setSelectionMade(false);
  };

  const columns: any = [
    {
      field: "invoiceNumber",
      minWidth: 200,
      headerName: t("INVOICE_NO"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.invoiceNum;
      },
      renderCell: ({ row }: any) => (
        <Tooltip placement="bottom" title={row?.invoiceNum} arrow>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="table-cell-trucate"
          >
            {row?.invoiceNum}
          </span>
        </Tooltip>
      ),
    },
    {
      field: "dateOfSale",
      minWidth: 100,
      headerName: t("DATE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        const invoiceDate = row.paymentTransactions
          ?.map((transaction: any) => transaction.paymentDate)
          .join("  ");
        return (
          <Typography>
            {row?.invoiceDateTime
              ? moment(row.invoiceDateTime).format("DD-MM-YYYY")
              : ""}
          </Typography>
        );
      },
      valueGetter: (params: any) => {
        return params?.row?.invoiceDateTime;
      },
    },
    {
      field: "customer",
      minWidth: 120,
      headerName: t("CUSTOMER"),
      flex: 1,
      renderCell: ({ row }: any) => {
        const firstName = row.firstName ? row.firstName : "";
        const lastName = row.lastName ? row.lastName : "";
        const customerName = [firstName, lastName].filter(Boolean).join(" ");
        return (
          <Tooltip placement="bottom" title={customerName} arrow>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              className="table-cell-trucate"
            >
              {customerName}
            </span>
          </Tooltip>
        );
      },
      valueGetter: (params: any) => {
        const firstName = params.row.firstName ? params.row.firstName : "";
        const lastName = params.row.lastName ? params.row.lastName : "";
        const customerName = [firstName, lastName].filter(Boolean).join(" ");
        return customerName;
      },
    },
    {
      field: "store",
      minWidth: 120,
      headerName: t("STORE"),
      flex: 1,
      renderCell: ({ row }: any) => (
        <Tooltip placement="bottom" title={row?.store?.name} arrow>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="table-cell-trucate"
          >
            {row?.store?.name}
          </span>
        </Tooltip>
      ),
      valueGetter: (params: any) => {
        return params?.row?.store?.name;
      },
    },
    {
      field: "amount",
      minWidth: 100,
      headerName: t("AMOUNT"),
      flex: 1,
      renderCell: ({ row }: any) => {
        const amountWithCurrency = `${row.grossAmount?.toFixed(2)} ${
          row.currencyCode
        }`;
        return <Typography>{amountWithCurrency}</Typography>;
      },
      valueGetter: (params: any) => {
        const amountWithCurrency = `${params.row.grossAmount?.toFixed(2)} ${
          params.row.currencyCode
        }`;
        return amountWithCurrency;
      },
    },
    {
      field: "paymentMethod",
      minWidth: 100,
      headerName: t("PAYMENT_METHOD"),
      flex: 1,
      renderCell: ({ row }: any) => {
        const paymentTypes = row.paymentTransactions
          ?.map((transaction: any) => transaction.paymentMethodType)
          .join(", ");
        //paymentMethodType
        return <Typography>{paymentTypes}</Typography>;
      },
      valueGetter: (params: any) => {
        const paymentTypes = params.row.paymentTransactions
          ?.map((transaction: any) => transaction.paymentMethodType)
          .join("  ");
        return paymentTypes;
      },
    },
    // ** in future use
    {
      field: "trnsactionType",
      headerName: t("TRANSACTION_TYPE"),
      flex: 1,
      minWidth: 100,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.invoiceType}
            color={
              userStatusObj[
                row.invoiceType === "RETURNS" ? "Return" : "Invoice"
              ]
            }
            sx={{ fontSize: "1rem" }}
          />
        );
      },
      valueGetter: (params: any) =>
        params?.row.invoiceType === "RETURNS" ? "Return" : "Invoice",
    },
    {
      headerName: t("ACTION"),
      disableExport: true,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Rowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={groupItem}
              setItem={setGroupItem}
              handleEmailClick={() => handleEmailClick(row.id)}
              handleDownloadClick={() => handleDownloadClick(row.id)}
              handlePrint={() => handlePrint(row.id)}
            />
          </div>
        );
      },
    },
  ];
  const handleSelectionChange = (event: any, newValue: any) => {
    setNewValue(newValue);
  };

  const handleEmailClick = async (id: any) => {
    await dispatch(getInvoiceHistoryById({ id }));
    setShowDialog(true);
  };

  const handleDownloadClick = async (id: any) => {
    await dispatch(getInvoiceHistoryById({ id }))
      .unwrap()
      .then(async (invoiceData) => {
        let payload = {
          invoiceId: invoiceData.id,
          storeId: invoiceData.store?.id,
          templateId: 301,
        };
        const downloadResponse = await dispatch(downloadInvoice(payload));
        const pdfBase64 = downloadResponse.payload.pdfResponse; // Adjust based on actual response
        const downloadLink = `data:application/pdf;base64,${pdfBase64}`;
        downloadFile(downloadLink, "invoice.pdf");
      })
      .catch((error) => {
        console.error("Failed to fetch invoice details:", error);
      });
  };

  const handlePrint = async (id: any) => {
    await dispatch(getInvoiceHistoryById({ id }))
      .unwrap()
      .then(async (invoiceData) => {
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
      })
      .catch((error) => {
        console.error("Failed to fetch invoice details:", error);
      });
  };

  const handleCalendarIconClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setOpenPicker(true);
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDateChange = (
    newDate: [Dayjs | null, Dayjs | null],
    type: any
  ) => {
    if (type === "finish") {
      setDateRange(newDate);
      setSelectionMade(true);
      setOpenPicker(false);
      const newLabelText = `${newDate[0].format(
        "DD-MM-YYYY"
      )} - ${newDate[1].format("DD-MM-YYYY")}`;
      setLabelText(newLabelText);
    }
  };

  return (
    <>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card classes={{ root: classes.paperRootCardRoot }}>
              <CommonServerSidePaging
                rows={invoiceHistoryData.data || []}
                columns={columns}
                isLoading={invoiceHistoryData?.isLoading}
                handleEditPage={handleEditPage}
                fetchDataWithSearch={invoiceHistoryList}
                additionalParams={additionalParams}
                hideImport={true}
                hideAddNew={true}
                rowCount={invoiceHistoryData?.totalCount}
                // handleSearch={(val:any)=>setSearch(val)}
                moduleType={"invoiceType"}
                searchPlaceholder={
                  "SEARCH_INVOICE_NO_PAYMENT_METHOD_TRANSACTION_TYPE"
                }
                //   dropdownOptions = {storeSettingsStore?.data}
              >
                <FormControl size="small" sx={{ minWidth: 215 }}>
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={[...(storeSettingsStore?.data || [])].sort(
                      (a, b) =>
                        newValue.some((item) => item.id === a.id)
                          ? -1
                          : newValue.some((item) => item.id === b.id)
                          ? 1
                          : 0
                    )}
                    disableCloseOnSelect
                    getOptionLabel={(option: any) => option?.name || ""}
                    // filterSelectedOptions
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={option.id}>
                        <Checkbox
                          icon={<CheckBoxOutlineBlankIcon fontSize="medium" />}
                          checkedIcon={<CheckBoxIcon fontSize="medium" />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        <ListItemText primary={option?.name} />
                      </li>
                    )}
                    style={{ width: 215 }}
                    value={newValue}
                    onChange={handleSelectionChange}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        label={
                          newValue.length > 0
                            ? `${newValue.length}/${storeSettingsStore?.data.length} Selected`
                            : "All Stores"
                        }
                        InputLabelProps={{
                          style:
                            newValue.length > 0 ? { color: "#2196f3" } : {},
                        }}
                        size="small"
                      />
                    )}
                    renderTags={() => null}
                  />
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <FormControl size="small" sx={{ minWidth: 215 }}>
                    <InputLabel id="date-range-label"></InputLabel>
                    <Select
                      labelId="date-range-label"
                      id="date-range-select"
                      value={selectedRangeOption}
                      onChange={handleDateRangeOptionChange}
                      renderValue={() => labelText}
                      displayEmpty
                      endAdornment={
                        <InputAdornment position="end">
                          {selectionMade && (
                            <IconButton edge="end" onClick={clearSelection}>
                              <Close />
                            </IconButton>
                          )}
                          <IconButton
                            edge="end"
                            onClick={handleCalendarIconClick}
                          >
                            <CalendarTodayIcon />
                          </IconButton>
                          <ClickAwayListener
                            onClickAway={() => setOpenPicker(false)}
                          >
                            <div>
                              {openPicker && (
                                <Box className={classes.calendarContainer}>
                                  <DateRangeCalendar
                                    defaultValue={dateRange}
                                    onChange={handleDateChange}
                                    calendars={2}
                                  />
                                </Box>
                              )}
                            </div>
                          </ClickAwayListener>
                        </InputAdornment>
                      }
                      IconComponent={() => null}
                    >
                      {Object.entries(dateOptions).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </LocalizationProvider>
              </CommonServerSidePaging>
            </Card>
          </Grid>
        </Grid>
      </DatePickerWrapper>
      <EmailInvoice
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={() => setShowDialog(false)}
        defaultEmail="hellosayeed@gmail.com"
        // defaultEmail={invoiceData?.customer?.email || ''}
        isLoading={isLoading}
        invoiceId={invoiceData.id} // Assuming `invoiceData` has `id`
        storeId={invoiceData.store?.id}
      />
    </>
  );
};

export default InvoiceHistoryDataTable;
