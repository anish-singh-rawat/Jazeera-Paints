import React, { useState } from "react";
import { Pagination } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import UsePagination from "./PrevNextPagination";

const useStyles = makeStyles({
  dataGridPagination: {
    position: "relative",

    "& .MuiDataGrid-root": {
      height: "496px",
    },

    "& .MuiDataGrid-footerContainer": {
      position: "relative",
    },

    "& .MuiTablePagination-root": {
      display: "none",
    },
  },
  pagenationContainer: {
    position: "absolute",
    height: "52px",
    width: "100%",
    bottom: 0,
    left: 0,
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    lineHeight: "52px",
  },
});

const CommonPagenationDataGrid = (props: any) => {
  const { rows, columns, pageSize, checkboxSelection } = props;

  const classes = useStyles();
  let totalRows = rows;

  const [page, setPage] = React.useState(1);
  const [pageFirstItemNum, setPageFirstItemNum] = useState(1);
  const [pageLastItemNum, setPageLastItemNum] = useState(pageSize[0]);

  const totalPages = Math.ceil(rows.length / pageSize[0]);

  const handlePageChange = (value: any) => {
    if (value === 0) {
      if (page !== 1) {
        setPage(page - 1);
        setPageFirstItemNum(pageFirstItemNum - pageSize[0]);
        setPageLastItemNum(pageLastItemNum - pageSize[0]);
      }
    } else if (value === totalPages + 1) {
      if (value !== totalPages) {
        setPage(page + 1);
        setPageFirstItemNum(pageFirstItemNum + pageSize[0]);
        setPageLastItemNum(pageLastItemNum + pageSize[0]);
      }
    } else {
      setPage(value);
      let firstNum = (value - 1) * pageSize[0] + 1;
      setPageFirstItemNum(firstNum);
      let lastNum = (value - 1) * pageSize[0] + pageSize[0];
      if (totalPages === value) {
        setPageLastItemNum(totalRows.length);
      } else {
        setPageLastItemNum(lastNum);
      }
    }
  };

  const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={classes.dataGridPagination}>
      <DataGrid
        rows={paginatedRows}
        columns={columns}
        checkboxSelection={checkboxSelection || true}
        disableSelectionOnClick
      />
      <div className={classes.pagenationContainer}>
        <div>
          Showing <span> {pageFirstItemNum} </span> -
          <span> {pageLastItemNum} </span> of
          <span> {totalRows.length} </span> entries
        </div>
        <UsePagination count={totalPages} handlePageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default CommonPagenationDataGrid;
