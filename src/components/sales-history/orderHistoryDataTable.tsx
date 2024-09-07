import React, { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  Typography,
  FormControl,
  Autocomplete,
  Checkbox,
  ListItemText,
  TextField,
  InputLabel,
  Select,
  InputAdornment,
  IconButton,
  ClickAwayListener,
  MenuItem,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Close from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";
import { orderHistoryList } from "src/store/apps/orderHistory/orderHistory";
import CommonServerSidePaging from "src/components/common/CommonServerSidePaging/CommonServerSidePaging";
import Chip from "src/@core/components/mui/chip";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import RowOptions from "./orderRowOption";

//Date  range dependencies
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import { DateRange } from "@mui/x-date-pickers-pro";

//APIs
import {
  storesListGet,
  fetchAllStoresList,
} from "src/store/apps/storeSettings/storeSettings";

const OrderHistoryDataTable = (props: any) => {
  const {
    handleEditPage,
    isLoading,
    data,
    classification,
    orderStatus,
    rowCount,
    handleChangeStore,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const theme = useTheme();
  const [newValue, setNewValue] = useState([]);
  const [selectedRangeOption, setSelectedRangeOption] = useState("thisMonth");
  const [labelText, setLabelText] = useState(t("DATE_RANGE"));
  const [selectionMade, setSelectionMade] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [startDate, endDate] = dateRange;

  const storeSettingsStore: any = useSelector(
    (state: RootState) => state?.storeSettingsStore
  );

  useEffect(() => {
    // dispatch(storesListGet({}));
    dispatch(fetchAllStoresList());
  }, []);

  useEffect(() => {
    props.handleChangeStore(newValue, startDate, endDate);
  }, [newValue, startDate, endDate]);

  // const additionalParams = {
  //   classification: classification,
  // };
  const additionalParams = {
    storeId:
      newValue.length > 0 ? newValue.map((item: any) => item.id).join(",") : "",
    startDate: startDate ? startDate.toISOString() : "",
    endDate: endDate ? endDate.toISOString() : "",
    orderStatus: orderStatus === "ALL" ? "" : orderStatus,
  };

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

  //date filter functionality

  const dateOptions: any = {
    today: "TODAY",
    thisWeek: "THIS_WEEK",
    thisMonth: "THIS_MONTH",
    lastWeek: "LAST_WEEK",
    lastMonth: "LAST_MONTH",
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

  const handleCalendarIconClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setOpenPicker(true);
    event.preventDefault();
    event.stopPropagation();
  };

  const clearSelection = () => {
    setSelectedRangeOption("");
    setDateRange([dayjs().subtract(30, "day"), dayjs()]);
    setLabelText(t("DATE_RANGE"));
    setSelectionMade(false);
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase(); // Convert to uppercase if needed
  };

  const columns: any = [
    {
      field: "orderNo",
      width: 200,
      minWidth: 200,
      headerName: t("ORDER_NO."),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.orderNum;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.orderNum}`}</Typography>;
      },
    },
    {
      field: "date",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      headerName: t("DATE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.orderDateTime
              ? moment(row.orderDateTime).format("DD-MM-YYYY")
              : ""}
          </Typography>
        );
      },
      valueGetter: (params: any) => {
        return params?.row?.orderDateTime;
      },
    },
    {
      field: "source",
      minWidth: 150,
      headerName: t("SOURCE"),
      flex: 1,
      width: 150,
      valueGetter: ({ row }: any) => {
        return `${row.source || ""}`;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.source}`}</Typography>;
      },
    },
    {
      field: "store",
      minWidth: 150,
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
      field: "customer",
      minWidth: 150,
      headerName: t("CUSTOMER"),
      flex: 1,
      renderCell: ({ row }: any) => {
        const firstName = row.firstName ? row.firstName : "";
        const lastName = row.lastName ? row.lastName : "";
        const customerName = [firstName, lastName].filter(Boolean).join(" ");
        const initials = getInitials(firstName, lastName);
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
          // <Box sx={{ display: "flex", alignItems: "center" }}>
          //   <Box
          //     sx={{
          //       width: 30,
          //       height: 30,
          //       bgcolor: "primary.light",
          //       borderRadius: "50%",
          //       display: "flex",
          //       alignItems: "center",
          //       justifyContent: "center",
          //       marginRight: "8px",
          //       fontSize: "1rem",
          //       color: "primary.contrastText",
          //     }}
          //   >
          //     {initials}
          //   </Box>
          //   <Box>
          //     <Tooltip placement="bottom" title={customerName} arrow>
          //       <Typography variant="body2" noWrap>
          //         {customerName}
          //       </Typography>
          //     </Tooltip>
          //     <Typography variant="body2" color="text.secondary" noWrap>
          //       {row.customerId || ""} | {row.customer?.mobileNum || ""}
          //     </Typography>
          //   </Box>
          // </Box>
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
      field: "totalAmount",
      minWidth: 110,
      headerName: t("TOTAL_AMOUNT"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography>{`${row.orderAmount?.toFixed(2)} ${
            row.currencyCode
          }`}</Typography>
        );
      },
      valueGetter: (params: any) => {
        const amountWithCurrency = `${params.row.orderAmount?.toFixed(2)} ${
          params.row.currencyCode
        }`;
        return amountWithCurrency;
      },
    },
    {
      field: "paymentStatus",
      minWidth: 130,
      headerName: t("PAYMENT_STATUS"),
      flex: 1,
      valueGetter: ({ row }: any) => {
        return `${row.paymentStatus || ""}`;
      },
      renderCell: ({ row }: any) => {
        if (!row.paymentStatus) {
          // Return null for empty status
          return null;
        }
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={t(row?.paymentStatus)}
            color={productStatusObj[row.paymentStatus]}
            sx={{ fontSize: "1rem" }}
          />
        );
      },
    },
    {
      field: "orderStatus",
      minWidth: 110,
      maxWidth: 110,
      headerName: t("ORDER_STATUS"),
      flex: 1,
      renderCell: ({ row }: any) => {
        if (!row.orderStatus) {
          // Return null for empty status
          return null;
        }
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={t(row.orderStatus)}
            color={productStatusObj[row.orderStatus]}
            sx={{ fontSize: "1rem" }}
          />
        );
      },
      //   valueGetter: ({ row }: any) => (row.orderStatus === "OPEN" ? "open" : "closed"),
    },
    {
      headerName: t("ACTIONS"),
      sortable: false,
      disableColumnMenu: true,
      disableExport: true,
      flex: 1,
      minWidth: 150,
      maxWidth: 200,
      renderCell: ({ row }: any) => {
        // return (
        //   <Box style={{ display: "flex", alignItems: "center" }}>
        //     <CommonRowoptions
        //       id={row.id}
        //       row={row}
        //       selectedRecord={null}
        //       handleEditPage={handleEditPage}
        //       item={null}
        //       setItem={null}
        //     //   deleteCall={productDelete}
        //       entityCall={null}
        //     />
        //   </Box>
        // );
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <RowOptions
              id={row.id}
              row={row}
              // selectedRecord={selectedRecord}
              // handleEditPage={handleEditPage}
              // item={groupItem}
              // setItem={setGroupItem}
              // handleEmailClick={() => handleEmailClick(row.id)}
              // handleDownloadClick={()=>handleDownloadClick(row.id)}
              // handlePrint={()=>handlePrint(row.id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <CommonServerSidePaging
      rows={data || []}
      rowCount={rowCount}
      columns={columns || []}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
      fetchDataWithSearch={orderHistoryList}
      additionalParams={additionalParams}
      searchPlaceholder={"SEARCH_PRODUCTS"}
      hideImport={true}
      hideAddNew={true}
    >
      {/* store filters */}
      <FormControl size="small" sx={{ minWidth: 215 }}>
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={[...(storeSettingsStore?.data || [])].sort((a, b) =>
            newValue.some((item: any) => item.id === a.id)
              ? -1
              : newValue.some((item: any) => item.id === b.id)
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
                  : `${t("ALL_STORES")}`
              }
              InputLabelProps={{
                style: newValue.length > 0 ? { color: "#2196f3" } : {},
              }}
              size="small"
            />
          )}
          renderTags={() => null}
        />
      </FormControl>
      {/* date filters */}
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
            {Object.entries(dateOptions).map(([key, value]: any) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </LocalizationProvider>
    </CommonServerSidePaging>
  );
};

export default OrderHistoryDataTable;
