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
  InputAdornment,
  IconButton,
  ClickAwayListener,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useTranslation } from "react-i18next";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
// import Rowoptions from "./invoice-row-option";
// import CommonServerSidePaging from "../common/CommonServerSidePaging/CommonServerSidePaging";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import moment from "moment";
import { useEffect, useState } from "react";
import { invoiceHistoryList } from "src/store/apps/invoiceHistory/invoiceHistory";
import { storesListGet } from "src/store/apps/storeSettings/storeSettings";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs, { Dayjs } from "dayjs"; // Ensure you have imported Dayjs
// import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { LocalizationProvider } from '@mui/lab';
// import DateRangeCalendar from "@mui/lab/DateRangePicker";
// import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import CommonServerSidePaging from "src/components/common/CommonServerSidePaging/CommonServerSidePaging";
import { getstockTransaction } from "src/store/apps/stock-transaction";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro";
import { makeStyles } from "@mui/styles";
import Close from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

const StockTransactiondatatable = (props: any) => {
  const {
    rows,
    data,
    handleEditPage,
    groupItem,
    storeId,
    setGroupItem,
    selectedRecord,
    handleFilterDate,
    isLoading,
    rowCount,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [newValue, setNewValue] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRangeOption, setSelectedRangeOption] = useState("thisMonth");
  const [openCustomRangePicker, setOpenCustomRangePicker] = useState(false);
  const [customRange, setCustomRange] = useState([null, null]);
  const [openPicker, setOpenPicker] = useState(false);
  const [labelText, setLabelText] = useState("Date Range");
  const [selectionMade, setSelectionMade] = useState(false);

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(30, "day"), // Start date
    dayjs(), // End date
  ]);
  const [startDate, endDate] = dateRange;

  const invoiceHistoryData: any = useSelector(
    (state: RootState) => state?.invoiceHistory
  );
  const storeSettingsStore: any = useSelector(
    (state: RootState) => state?.storeSettingsStore
  );
  const additionalParams = {
    storeId: storeId,
    // Check if startDate and endDate are not null before calling toISOString
    startDate: startDate ? startDate.toISOString() : "",
    endDate: endDate ? endDate.toISOString() : "",
  };

  useEffect(() => {
    Promise.allSettled([
      //   dispatch(invoiceHistoryList({})),
    ]).catch(console.error);
    dispatch(storesListGet());
    // handleFetchInvoiceHistory();
  }, []);

  // useEffect(()=>{
  //   props.handleChangeStore(newValue, startDate, endDate)
  // },[newValue,startDate,endDate])

  interface UserStatusType {
    [key: string]: ThemeColor;
  }

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

  const userStatusObj: UserStatusType = {
    Invoice: "success",
    Return: "error",
    Recieved: "primary",
    Shipment: "warning",
  };

  const dateOptions = {
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
        start = lastSunday;
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

  // useEffect(() => {
  //   handleFilterDate(startDate, endDate);
  // }, [startDate, endDate]);

  const clearSelection = () => {
    setSelectedRangeOption("");
    setDateRange([dayjs().subtract(30, "day"), dayjs()]);
    setLabelText("Date Range");
    setSelectionMade(false);
  };

  const handleDateRangeOptionChange = (event: any) => {
    const newRangeOption = event.target.value;
    setSelectionMade(!selectionMade);
    setSelectedRangeOption(newRangeOption);
    if (newRangeOption === "custom") {
      // console.log("calllllled");
      setOpenPicker(true);
      setLabelText("Custom Range");
    } else {
      setLabelText(dateOptions[newRangeOption]);
      const [newStart, newEnd] = calculateDateRange(newRangeOption);
      setDateRange([dayjs(newStart), dayjs(newEnd)]);
    }
  };

  const columns: any = [
    {
      field: "SKU",
      minWidth: 80,
      headerName: t("SKU"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.shortName || params?.row?.product?.shortName;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.product?.shortName ? `${row.product?.code}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "productname",
      minWidth: 185,
      headerName: t("PRODUCT_NAME"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.shortName || params?.row?.product?.shortName;
      },
      renderCell: ({ row }: any) => {
        // console.log(row.stockTransType, "row");
        return (
          <Typography>
            {row?.product?.shortName ? `${row?.product?.shortName}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "UOM.",
      minWidth: 90,
      headerName: t("UOM"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.name || params?.row?.baseUom?.name;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.baseUom?.name ? `${row?.baseUom?.name}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "batchno.",
      minWidth: 100,
      headerName: t("BATCH_NO"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.code || params?.row?.productBatch?.code;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.productBatch?.code ? `${row?.productBatch?.code}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "storecode",
      minWidth: 100,
      headerName: t("STORE_CODE"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.code || params?.row?.store?.code;
      },
      renderCell: ({ row }: any) => {
        // const amountWithCurrency = `${row.store?.code} ${row.store?.code}`;
        return (
          <Typography>
            {row?.store?.code ? `${row?.store?.code}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "storename",
      minWidth: 110,
      headerName: t("STORE_NAME"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.name || params?.row?.store?.name;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.store?.name ? `${row?.store?.name}` : "-"}
          </Typography>
        );
      },
    },

    {
      field: "date",
      minWidth: 100,
      headerName: t("DATE"),
      flex: 1,
      valueGetter: (params: any) => {
        // Assuming `postedDate` is either a moment object or a string that can be parsed by moment
        // If `postedDate` is already a moment object, you don't need to parse it again
        const date = params.row.postedDate
          ? moment(params.row.postedDate)
          : null;
        return date ? date.format("DD-MM-YYYY") : "";
      },
      renderCell: ({ row }: any) => {
        const invoiceDate = row.paymentTransactions
          ?.map((transaction: any) => transaction.paymentDate)
          .join("  ");
        return (
          <Typography>
            {row?.postedDate ? moment(row.postedDate).format("DD-MM-YYYY") : ""}
          </Typography>
        );
      },
    },
    {
      field: "stockin",
      minWidth: 80,
      headerName: t("STOCK_IN"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.stockIn || params?.row?.stockIn;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>{row?.stockIn ? `${row?.stockIn}` : "-"}</Typography>
        );
      },
    },
    {
      field: "stockout",
      minWidth: 80,
      headerName: t("STOCK_OUT"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.stockOut || params?.row?.stockOut;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>{row?.stockOut ? `${row?.stockOut}` : "-"}</Typography>
        );
      },
    },
    {
      field: "transactionno.",
      minWidth: 100,
      headerName: t("TRANSACTION_NO"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.name || params?.row?.store?.name;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.store?.name ? `${row?.store?.name}` : "-"}
          </Typography>
        );
      },
    },
    // ** in future use
    {
      field: "transaction type",
      headerName: t("TRANSACTION_TYPE"),
      flex: 0.8,
      minWidth: 140,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.stockTransType}
            color={
              userStatusObj[
                row.stockTransType === "OPENING_BALANCE"
                  ? "Recieved"
                  : row.stockTransType === "SALES_INVOICE"
                  ? "Invoice"
                  : row.stockTransType === "TRANSFER_ORDER_SHIP"
                  ? "Shipment"
                  : "Return"
              ]
            }
            sx={{ fontSize: "0.75rem" }}
          />
        );
      },
      valueGetter: ({ row }: any) => (row.invoice ? "Invoice" : "Return"),
    },
    {
      // Here the HeaderName can be used for Future Purpose
      // headerName: t("ACTION"),
      disableExport: true,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <Rowoptions
          id={row.id}
          row={row}
          selectedRecord={selectedRecord}
          handleEditPage={handleEditPage}
          item={groupItem}
          setItem={setGroupItem}
        //   deleteCall={getPriceListDelete}
        //   entityCall={productsDivisionGetById}
        /> */}
          </div>
        );
      },
    },
  ];

  const handleCalendarIconClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {

    if (selectionMade) {
      setDateRange([dayjs().subtract(30, "day"), dayjs()]);
      setSelectionMade(false); // Reset selection state
      setLabelText("Date Range");
    } else {
      setOpenPicker(true);
    }
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

  const handleSelectionChange = (event: any, newValue: any) => {
    setNewValue(newValue);
  };

  return (
    <>
      <CommonServerSidePaging
        rows={data || []}
        columns={columns}
        isLoading={isLoading}
        handleEditPage={handleEditPage}
        fetchDataWithSearch={getstockTransaction}
        additionalParams={additionalParams}
        hideImport={true}
        hideAddNew={true}
        rowCount={rowCount}
        handleSearch={(val: any) => setSearch(val)}
        moduleType={"stockTransactionStats"}
        searchPlaceholder={"Search by SKU, Product Name, Store Name..."}
      >
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
                  <IconButton edge="end" onClick={handleCalendarIconClick}>
                    <CalendarTodayIcon />
                  </IconButton>
                  <ClickAwayListener onClickAway={() => setOpenPicker(false)}>
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
    </>
  );
};
export default StockTransactiondatatable;
