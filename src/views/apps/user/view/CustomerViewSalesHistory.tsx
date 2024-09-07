import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import Icon from "src/@core/components/icon";
import {
  Box,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  MenuItem,
  Select,
  TableHead,
  TablePagination,
  useTheme
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstance as axios } from "src/configs/axios";
import { decryptPriceId as decryptId } from "src/utils/utils";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
interface UserStatusType {
  [key: string]: ThemeColor;
}
const userStatusObj: UserStatusType = {
  NOTPAID: "error",
  PORTAL: "warning",
  PAID: "success",
};
interface DataType {
  orderNum: string;
  source: string;
  invoiceDateTime: string;
  invoiceAmount: number;
  delivery: string;
  paymentStatus: string;
}

const CustomerViewSalesHistory = () => {
  const { t } = useTranslation();
  const [customerSalesHistory, setCustomerSalesHistory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const router = useRouter();
  const theme=useTheme()
  const fetchCustomerSalesHistoryData = async (id: string) => {
    try {
      const response = await axios.get(
        `SalesInvoiceHeader?skip=0&limit=100&customerId=${id}`
      );
      if (response.data) {
        setCustomerSalesHistory(response.data.data);
      } else {
        console.log("Data not found");
      }
    } catch (e) {
      console.log(e, "error while fetching data");
    }
  };

  const fetchCustomerSalesHistorySearchData = async (id: string) => {
    try {
      const response = await axios.get(
        `SalesInvoiceHeader?skip=0&limit=10&searchItem=${searchQuery}&customerId=${id}`
      );
      if (response.data) {
        setCustomerSalesHistory(response.data.data);
      } else {
        console.log("Data not found");
      }
    } catch (e) {
      console.log(e, "error while fetching data");
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (
      router.isReady &&
      router.query?.id &&
      typeof router.query?.id === "string"
    ) {
      const realId = decryptId(router.query?.id);
      fetchCustomerSalesHistorySearchData(realId);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (
      router.isReady &&
      router.query?.id &&
      typeof router.query?.id === "string"
    ) {
      const realId = decryptId(router.query?.id);
      fetchCustomerSalesHistoryData(realId);
    }
  }, [router.isReady, router.query?.id]);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const CId = decryptId(router.query?.id);
  const applyFilter = async() => {
    try {
      const response = await axios.get(
        `SalesInvoiceHeader?skip=0&limit=10&startDate=${moment(startDate).format("MMM DD, YYYY")}&endDate=${moment(endDate).format("MMM DD, YYYY")}&customerId=${CId}`
      );
      if (response.data) {
        setCustomerSalesHistory(response.data.data);
        setOpenDatePicker(false);
      } else {
        console.log("Data not found");
      }
    } catch (e) {
      console.log(e, "error while fetching data");
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPageOption, setRowPerPageOption] = useState([10, 30, 50, 70]);
  const handlePageChange = (event: any, updatedPage: any) =>
    setPage(updatedPage);
  const [rowPerPage, setRowPerPage] = useState(10);
  const handleRowPerPageChange = (event: any) => {
    setRowPerPage(event.target.value);
    setPage(0);
  };
  const clearFilter = () => {
    fetchCustomerSalesHistoryData(CId)
    setStartDate(null);
    setEndDate(null);
  };
  const closeDialog=()=>{
    setOpenDatePicker(false)
    setStartDate(null);
    setEndDate(null);
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <TextField
          size="small"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <TextField
            type="text"
            size="small"
            value={
              startDate && endDate
                ? `${moment(startDate).format("MMM DD, YYYY")} -To- ${moment(
                    endDate
                  ).format("MMM DD, YYYY")}`
                : "All"
            }
            InputProps={{
              endAdornment: (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {
                     startDate && endDate?(
                     <Icon icon="tabler:x" style={{ color: "red" }} onClick={() => clearFilter()} />
                     ):(
                      <Icon icon="tabler:calendar" style={{ color: "gray" }} onClick={() => setOpenDatePicker(true)} />
                     )
                  }
                </Box>
              ),
              readOnly: true,
            }}
          />
          <Dialog
             open={openDatePicker}
             onClose={() => closeDialog()}
          >
            <DialogContent>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  inline
                />
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  inline
                />
              </Box>
            </DialogContent>
            <Divider />
            <DialogActions sx={{marginTop:"10px"}}>
              <Typography>
                {startDate && endDate
                  ? `${moment(startDate).format("MMM DD, YYYY")} - ${moment(
                      endDate
                    ).format("MMM DD, YYYY")}`
                  : ""}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => closeDialog()}
              >
                Cancel
              </Button>
              <Button variant="contained" size="small" onClick={applyFilter}>
                Apply
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableContainer>
            <Table sx={{ minWidth: 500 }}>
              <TableHead sx={{ background:theme.palette.mode==="light"? "#F6F6F7":"#4A5072" }}>
                <TableRow>
                  <TableCell>{t(`ORDER_NO`)}</TableCell>
                  <TableCell>{t(`SOURCE`)}</TableCell>
                  <TableCell>{t(`DATE_TIME`)}</TableCell>
                  <TableCell>{t(`NET_AMOUNT`)}</TableCell>
                  <TableCell>{t(`DELIVERY`)}</TableCell>
                  <TableCell>{t(`STATUS`)}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  customerSalesHistory?.length>0?(
                    <>
                    {customerSalesHistory
                      ?.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                      ?.map((item: DataType, index: any) => (
                        <TableRow
                          hover
                          key={index}
                          sx={{ "&:last-of-type td": { border: 0 } }}
                        >
                          <TableCell>
                            <Typography noWrap color="primary">
                              {item?.orderNum}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap sx={{ color: "text.secondary" }}>
                              {item?.source}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap sx={{ color: "text.secondary" }}>
                              {moment(item?.invoiceDateTime).format(
                                "MMMM Do YYYY, h:mm a"
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap sx={{ color: "text.secondary" }}>
                              {item?.invoiceAmount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap sx={{ color: "text.secondary" }}>
                              <Chip
                                rounded
                                skin="light"
                                size="small"
                                style={{ textTransform: "capitalize" }}
                                label={
                                  item?.delivery === "pickup" ? (
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                      }}
                                    >
                                      <Icon
                                        icon={"tabler:building-store"}
                                        fontSize={"15"}
                                      />
                                      {item?.delivery}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                      }}
                                    >
                                      <Icon
                                        icon={"tabler:truck-delivery"}
                                        fontSize={"15"}
                                      />
                                      {item?.delivery}
                                    </span>
                                  )
                                }
                                color={"primary"}
                                sx={{ fontSize: "1rem", width: "100%" }}
                              />
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              rounded
                              skin="light"
                              size="small"
                              style={{ textTransform: "capitalize" }}
                              label={t(item?.paymentStatus)}
                              color={
                                userStatusObj[
                                  item?.paymentStatus === "not_paid"
                                    ? "NOTPAID"
                                    : item?.paymentStatus === "portal"
                                    ? "PORTAL"
                                    : "PAID"
                                ]
                              }
                              sx={{ fontSize: "1rem", width: "100%" }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                        </>
                  ):(
                    <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body1" align="center">
                        No data
                      </Typography>
                    </TableCell>
                  </TableRow>
                  )
                }
                <TablePagination
                  rowsPerPageOptions={rowsPerPageOption}
                  count={customerSalesHistory?.length}
                  page={
                    !customerSalesHistory?.length ||
                    customerSalesHistory?.length <= 0
                      ? 0
                      : page
                  }
                  rowsPerPage={rowPerPage}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowPerPageChange}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomerViewSalesHistory;
