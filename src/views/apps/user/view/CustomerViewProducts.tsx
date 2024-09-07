import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
// ** Styles Import
import "react-credit-cards/es/styles-compiled.css";
import { Box, MenuItem, Select, TableHead, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

interface DataType {
  code: string;
  productName: string;
  datetime: string;
  quantity: string;
  netAmount: string;
}

const data: DataType[] = [
  {
    code: "2244",
    productName: "NOVEL CHARM",
    quantity: "65",
    netAmount: "356.00",
    datetime: "14, July 2022 20:20",
  },
  {
    code: "2244",
    productName: "NOVEL CHARM",
    quantity: "69",
    netAmount: "356.00",
    datetime: "14, July 2022 20:20",
  },
  {
    code: "2244",
    productName: "NOVEL CHARM",
    quantity: "40",
    netAmount: "356.00",
    datetime: "14, July 2022 20:20",
  },
  {
    code: "2244",
    productName: "NOVEL CHARM",
    quantity: "78",
    netAmount: "356.00",
    datetime: "14, July 2022 20:20",
  },
  {
    code: "2244",
    productName: "NOVEL CHARM",
    quantity: "65",
    netAmount: "356.00",
    datetime: "14, July 2022 20:20",
  },
  {
    code: "2244",
    productName: "NOVEL CHARM",
    quantity: "65",
    netAmount: "356.00",
    datetime: "14, July 2022 20:20",
  },
  {
    code: "2244",
    productName: "NOVEL CHARM",
    quantity: "65",
    netAmount: "356.00",
    datetime: "14, July 2022 20:20",
  },
];
const CustomerViewProduct = () => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={6}>
      <Grid item xs={9}>
        <TextField type="search" placeholder="Placeholder" size="small" />
      </Grid>
      <Grid item xs={3}>
        <Box sx={{ display: "flex", gap: "10px",justifyContent:"end" }}>
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
                  <TableCell>Code</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Last Purchased</TableCell>
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
                        {item.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: "text.secondary" }}>
                        {item.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: "text.secondary" }}>
                        {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: "text.secondary" }}>
                        {item.netAmount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ color: "text.secondary" }}>
                        {item.datetime}
                      </Typography>
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

export default CustomerViewProduct;
