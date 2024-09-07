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
// ** Styles Import
import "react-credit-cards/es/styles-compiled.css";
import { Box, MenuItem, Select, TableHead, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
interface UserStatusType {
  [key: string]: ThemeColor;
}
const userStatusObj: UserStatusType = {
  FAILED: "error",
  SUCCESS: "success",
};
interface DataType {
  transactionId: string;
  comment: string;
  type: string;
  amount: number;
  status: string;
  date:string;
}

const data: DataType[] = [
  {
    transactionId: "2244",
    type: "online",
    date:"12/02/2024",
    status: "success",
    comment: "Loyalty points for orderid:223434",
    amount: 356.00,
  },
  {
    transactionId: "2244",
    type: "online",
    date:"12/02/2024",
    status: "failed",
    comment: "Loyalty points for orderid:223434",
    amount: 3566.00,
  },
  {
    transactionId: "2244",
    type: "online",
    date:"12/02/2024",
    status: "success",
    comment: "Loyalty points for orderid:223434",
    amount: -3256.00,
  },
  {
    transactionId: "2244",
    type: "online",
    date:"12/02/2024",
    status: "failed",
    comment: "Loyalty points for orderid:223434",
    amount: 3345.00,
  },
  {
    transactionId: "2244",
    type: "online",
    date:"12/02/2024",
    status: "success",
    comment: "Loyalty points for orderid:223434",
    amount: -756.00,
  },
  
];
const CustomerViewWallet = () => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <TextField type="search" placeholder="Search..." size="small" />
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ display: "flex", gap: "10px",justifyContent:"end",alignItems:"center" }}>
          <Typography color="#28c76f">Balance : 25,000.00</Typography>
          <Select
          size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            // onChange={handleChange}
          >
            <MenuItem value={10}>All</MenuItem>
            <MenuItem value={20}>This week</MenuItem>
            <MenuItem value={30}>This month</MenuItem>
            <MenuItem value={30}>Custom</MenuItem>
          </Select>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableContainer>
            <Table sx={{ minWidth: 500 }}>
              <TableHead sx={{ background: "lightgray" }}>
                <TableRow>
                  <TableCell>Txn ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((item: DataType, index: number) => (
                  <TableRow
                    hover
                    key={index}
                    sx={{ "&:last-of-type td": { border: 0 } }}
                  >
                    <TableCell>
                      <Typography noWrap color="primary">
                        {item.transactionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap color="primary">
                        {item.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: item.amount<0?"red":"#28c76f" }}>
                        {item.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: "text.secondary" }}>
                        {item.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: "text.secondary" }}>
                        {item.comment}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        rounded
                        skin="light"
                        size="small"
                        style={{textTransform:"capitalize"}}
                        label={t(
                          item.status 
                        )}
                        color={
                          userStatusObj[
                            item.status === "failed"
                              ? "FAILED":"SUCCESS"
                          ]
                        }
                        sx={{ fontSize: "1rem",width:"100%" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomerViewWallet;
