import {
  DataGrid,
  GridPagination,
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
} from "@mui/x-data-grid";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { makeStyles } from "@mui/styles";
import { TablePaginationProps } from "@mui/material/TablePagination";
import { useTranslation } from "react-i18next";
// ** Icon Imports
import Icon from "src/@core/components/icon";
import AppStorage from "src/app/AppStorage";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const useStyles = makeStyles({
  grid: {
    // boxShadow: "0 2px 8px 1px #9994",
    fontSize: "1rem",

    "& .MuiPaginationItem-previousNext": {
      background: "rgba(75, 70, 92, 0.08)",
      // border: "none",
      // color: "#4B465C",
    },
    "& .MuiPaginationItem-previousNext .MuiButtonBase-root": {
      textTransform: "capitalize",
      // color: "#555",
    },

    "& .MuiDataGrid-selectedRowCount": {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      // color: "#A5A3AE",
    },

    "& .MuiDataGrid-main": {
      borderRight: "1px solid #9994",
      borderLeft: "1px solid #9994",
      fontSize: "1rem",
      // color: "color: rgba(51, 48, 60, 0.6)",
    },

    "& .MuiDataGrid-columnHeaders": {
      // background: "#f6f6f7",
      borderRadius: 0,
      maxHeight: "168px !important",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "1px",
      whiteSpace: "normal",
      lineHeight: "normal",
    },

    "& .MuiDataGrid-cell--textLeft": {
      // color: "rgba(51, 48, 60, 0.6)",
      fontSize: "1rem",
    },

    "& .MuiDataGrid-footerContainer": {
      display: "flex",
      flexDirection: "row-reverse",
      paddingTop: "20px",
      paddingBottom: "6px",
      "& .MuiTablePagination-root": {
        width: "100%",
        "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular.MuiTablePagination-toolbar ":
          {
            display: "flex",
            flexDirection: "row-reverse",
          },
      },
      "& .MuiPaginationItem-rounded.Mui-selected": {
        backgroundColor: "#f0f0f0",
        color: "#000",
      },
    },
    "& .MuiTablePagination-select.MuiSelect-standard": {
      border: "1px solid #DBDADE",
      padding: "4px 26px 4px 4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      width: "80px",
      height: "34px",
      boxSizing: "border-box",
    },

    "& .MuiSvgIcon-root": {
      right: "12px",
    },

    "& .MuiTablePagination-actions": {
      display: "none",
    },

    "& .MuiTablePagination-displayedRows": {
      //   width: "900px",
      position: "relative",
      // color: "#A5A3AE",

      "&::before": {
        content: `"Showing"`,
        padding: "0 4px",
      },

      "&::after": {
        content: `"entries"`,
        padding: "0 4px",
      },
    },

    "& .MuiTablePagination-selectLabel": {
      display: "none",
    },
  },
  arrowBtn: {
    width: "32px",
    height: "32px",
    display: "flex",
    margin: "0 2px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    outline: "none",
    // border: "none",
    border: "1px solid rgba(51, 48, 60, 0.22)",
    cursor: "pointer",
    color: "rgba(51, 48, 60, 0.87)",
    background: "transparent",
  },
  customPagination: {
    position: "absolute",
    "& .MuiPaginationItem-ellipsis": {
      display: "none",
    },
  },
});

const CommonClientSidePagination = (props: any) => {
  const { t } = useTranslation();
  const settings: any = window.localStorage.getItem("settings");
  const mode = JSON.parse(settings)?.mode;
  const { rows, columns, checkboxSelection, isLoading } = props;
  const [pageSize, setPageSize] = useState(10);

  const myLan = localStorage.getItem("i18nextLng");
  

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  // const NextBtn = () => {
  //   return (
  //     <Button
  //       color="secondary"
  //       // variant="contained"
  //       // onClick={handleButton}
  //       fullWidth
  //     >
  //       {t("NEXT")}
  //     </Button>
  //   );
  // };

  // const PrevBtn = () => {
  //   return (
  //     <Button
  //       // onClick={handleButton}
  //       color="secondary"
  //     >
  //       {t("PREVIOUS")}
  //     </Button>
  //   );
  // };

  const CustomEllipsis = () => {
    return (
      <div
        style={
          mode === "dark"
            ? {
                color: "rgba(228, 230, 244, 0.87)",
                padding: "2px 8px",
                fontSize: "15px",
              }
            : {
                color: "rgba(51, 48, 60, 0.87)",
                padding: "2px 8px",
                fontSize: "15px",
              }
        }
      >
        of
      </div>
    );
  };
  let pageCount = 0;
  const CustomEllipsisStart = () => {
    return (
      <button
        className={classes.arrowBtn}
        style={
          mode === "dark"
            ? {
                background: "rgba(75, 70, 92, 0.08)",
                color: "rgba(228, 230, 244, 0.87)",
                borderColor: "rgba(228, 230, 244, 0.22)",
              }
            : {
                background: "rgba(0, 0, 0, 0)",
                color: "rgba(51, 48, 60, 0.87)",
              }
        }
      >
        {pageCount - pageCount + 3}
      </button>
    );
  };

  function myPage({
    page,
    onPageChange,
  }: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
    const apiRef = useGridApiContext();
    pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <>
        <Pagination
          className={classes.customPagination}
          color="secondary"
          count={pageCount}
          // defaultPage={1}
          siblingCount={page === 3 ? 0 : 0}
          boundaryCount={page <= 3 ? 1 : 1}
          variant="outlined"
          shape="rounded"
          renderItem={(item) => (
            <>
              <PaginationItem
                components={{
                  last: (props) => <Icon icon="tabler:chevrons-right" />,
                  next: (props) => <Icon icon="tabler:chevron-right" />,
                  first: (props) => <Icon icon="tabler:chevrons-left" />,
                  previous: (props) => <Icon icon="tabler:chevron-left" />,
                }}
                {...item}
              />
              {item?.type === "end-ellipsis" ? (
                <CustomEllipsis />
              ) : item?.type === "start-ellipsis" ? (
                <CustomEllipsisStart />
              ) : (
                ""
              )}
            </>
          )}
          showFirstButton
          showLastButton
          page={page + 1}
          onChange={(event, newPage) => {
            onPageChange(event as any, newPage - 1);
          }}
        />

        <FormControl>
          <Select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={myLan=="en-US" ? {
              padding: "0px",
              height: "35px",
              width: "70px",
              marginRight: "30px",
            } :  {
              paddingLeft: "30px",
              height: "35px",
              width: "70px",
              marginRight: "30px",
            }}
          >
            {[10, 30, 50, 70, 100].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  }

  function CustomPagination(props: any) {
    return <GridPagination ActionsComponent={myPage} {...props} />;
  }
  const classes = useStyles();
 

  return (
    <Box className={classes.grid}>
      <Box></Box>
      <DataGrid
        autoHeight
        rows={rows || []}
        columns={columns || []}
        pageSize={pageSize}
        loading={isLoading}
        disableSelectionOnClick
        getRowId={(row: any) => row?.id || 0}
        pagination
        checkboxSelection={checkboxSelection || true}
        components={{
          Pagination: CustomPagination,
        }}
      />
    </Box>
  );
};

export default CommonClientSidePagination;
