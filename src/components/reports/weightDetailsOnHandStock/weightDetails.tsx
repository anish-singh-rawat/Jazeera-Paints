import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { t } from "i18next";
import {
  Card,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import GridCustomExport from "src/components/export/GridCustomExport";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";

const useStyles = makeStyles({
  dialogContentStyle: {
    "& .MuiDataGrid-footerContainer": {
      display: "none",
    },
  },
});

export default function OnHandStockWeightDetails(props: any) {
  const {
    openWeightDetails,
    setOpenWeightDetails,
  } = props;

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();

  let idCounter = 0;

  function createData(altUom: number, altName: number, Stock: number) {
    idCounter++; // Increment the counter for each new row
    return { id: idCounter, altUom, altName, Stock };
  }

  const rows = [
    createData(159, 6.0, 24),
    createData(237, 9.0, 37),
    createData(262, 16.0, 23),
    createData(305, 3.7, 67),
    //createData(356, 16.0, 49),
  ];
  const columns: any = [
    {
      field: "id",
      headerName: t("ID"),
      hide: true,
      hideable: false,
      filterable: false,
    },

    {
      field: "ALT_UOM",
      //minWidth: 60,
      headerName: t("Alt UOM"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.altUom || params?.row?.altUom;
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
      field: "ALT_NAME",
      // minWidth: 60,
      headerName: t("Alt Name"),
      flex: 1.25,
      valueGetter: (params: any) => {
        return params?.row?.altName || params?.row?.altName;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.baseUom?.altName ? `${row?.baseUom?.altName}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "Stock",
      // minWidth: 60,
      headerName: t("STOCK"),
      flex: 0.75,
      valueGetter: (params: any) => {
        return params?.row?.Stock || params?.row?.Stock;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{row?.Stock ? `${row?.Stock}` : "-"}</Typography>;
      },
    },
  ];

  return (
    <React.Fragment>
      <Dialog
        maxWidth={"xs"}
        open={openWeightDetails}
        onClose={() => setOpenWeightDetails(false)}
        PaperProps={{
          style: {
            width: "500px", // Fixed width of 400px
            height: "450px", // Adjust this value to set the desired height
          },
        }}
      >
        {/* Add border to the surrounding Box */}
        <DialogContent className={classes.dialogContentStyle}>
          <Card
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.20)", // Customizable: thickness, style, color
              boxShadow: "none", // Optional: removes the default shadow effect if you prefer a flat design
              "& .MuiCardHeader-root": {
                // Targets the CardHeader specifically if you want to style it separately
                borderBottom: "1px solid rgba(0, 0, 0, 0.20)", // Adds a border to the bottom of the card header
              },
            }}
          >
            <CardHeader
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    width={40}
                    style={{ marginRight: "10px" }}
                    alt="Alt Uom"
                    src={`/images/avatars/1.png`}
                  />
                  {t("Noval Blue")}
                </div>
              }
              sx={{ "& .MuiCardHeader-action": { m: 0 } }}
            />
            <GridCustomExport
              rows={rows}
              columns={columns}
              isLoading={false}
              checkboxSelection={false}
              isStackRequired={false}
              datagridtab={true}
              showHeaderActionBtn={false}
              isHeaderRequired={false}
              rowsPerPageOptions={[]}

              //   handleEditPage={handleEditPage}
            />
          </Card>
        </DialogContent>
        <DialogActions>
          {
            <Button
              variant="contained"
              onClick={() => setOpenWeightDetails(false)}
            >
              {t("CLOSE")}
            </Button>
          }
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
