// styles.ts

import { makeStyles } from "@mui/styles";

interface StyleTypes {
  newPage?: number;
  direction?: string;
}

interface StyleTypes {
  newPage?: number;
  direction?: string;
}

export const useGridStyles = makeStyles({
  disabledRow: {
    pointerEvents: "none" /* Disable pointer events to prevent interaction */,
    opacity: 0.5 /* Reduce opacity to visually indicate disabled state */,
    /* Add any other styles to indicate the disabled appearance */
  },
});

export const useStyles = makeStyles({
  treeLabel: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
  },
  boxContainer: {
    display: "flex",
    flexDirection: "column",
  },
  filterBox: {
    background: "white",
  },
  innerFilterBox: {
    minHeight: 180,
    flexGrow: 1,
    maxWidth: 300,
    background: "#F3F3F3",
    margin: "10px",
    height: "100%",
    flexDirection: "column",
  },
  filterText: {
    padding: "10px",
  },
  clearText: {
    marginTop: "120%",
    textAlign: "center",
    background: "#F3F3F3",
    display: "flex",
    justifyContent: "center",
    maxWidth: 300,
    padding: "10px",
  },
  productList: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexDirection: "column",
  },
  treeViewHeight: {},
  treeView: {
    margin: "10px",
  },

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
    "& .MuiDataGrid-overlay": {
      height: "100px !important",
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
            float: ({ direction }: StyleTypes) =>
              direction === "rtl" ? "right" : "left",
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
    margin: "0 4px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    outline: "none",
    // border: "none",
    border: "1px solid rgba(51, 48, 60, 0.22)",
    cursor: "pointer",
    color: "rgba(51, 48, 60, 0.87)",
    background: "white",
    "&:disabled": {
      background: "#d7d7d7a3",
      cursor: "no-drop",
    },
  },
  customPagination: {
    position: "absolute",
    "& .MuiPaginationItem-ellipsis": {
      display: "none",
    },
  },
  commonHeaderRoot: {
    padding: "16px 24px",
    border: "1px solid rgba(75, 70, 92, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "none",
  },
  search: {
    gap: "12px",
  },
  search_button: {
    textTransform: "capitalize",
  },
  actionBtns: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
  },
  createRecordBtn: {
    textTransform: "unset",
    fontSize: "12.5px",
  },
  redSearch: {
    "& input": {
      border: "1px solid red",
    },
  },
  buttonbox: {
    border: "1px solid #3586C7",
    borderRadius: "5px",
    "& li": {
      fontSize: "0.875rem !important",
      color: "#3586C7",
      borderColor: "#3586C7",
      fontWeight: "600",
      margin: "2px 5px",
      "&:hover": {
        background: "none !important",
      },
    },
  },
  pagination: {
    gap: "12px",
    justifyContent: "end",
    float: "right",
  },
  input: {
    minWidth: "30px",
    width: ({ newPage }: StyleTypes) =>
      String(newPage).length > 2 ? "65px" : "32px",
    height: "32px",
    borderRadius: "6px",
    maxWidth: "65px",
    outline: "none",
    border: "1px solid rgba(51, 48, 60, 0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    background: "white",
    margin: "0 4px",
    cursor: "pointer",
    "&:disabled": {
      cursor: "no-drop",
      background: "#d7d7d7a3",
      color: "#000000",
    },
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "30px",
    fontSize: "15px",
    lineHeight: "22px",
    color: "rgba(51, 48, 60, 0.87)",
  },
  countBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    outline: "none",
    border: "1px solid #D9D9D9",
    cursor: "pointer",
    padding: "0 10px",
  },

  stack: {
    position: "absolute",
    bottom: "18px",
    right: ({ direction }) => (direction === "ltr" ? "24px" : "none"),
    left: ({ direction }) => (direction === "rtl" ? "24px" : "none"),
    direction: "ltr",
  },
  buttons: {
    display: "flex",
    direction: "ltr",
    flexDirection: ({ direction }) =>
      direction === "rtl" ? "row-reverse" : "row",

    "& .iconify": {
      transform: ({ direction }) =>
        direction === "rtl" ? "rotate(180deg)" : "rotate(0deg)",
    },
  },
  mainHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  innerHeader: {
    display: "flex",
    gap: "20px",
  },
  backButton: {
    background: "#A8AAAE",
    width: "120px",
    border: "none",
    color: "white",
  },
  doneButton: {
    background: "#3f50b5",
    width: "120px",
    border: "none",
    color: "white",
  },
  // styles.js
  containerStyles: {
    width: "100%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "15px",
    background: "white",
  },

  innerContainerStyle: {
    background: "#F7F7F7 !important",
    width: "95%",
    height: "400px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "15px",
    margin: "30px",
  },

  buttonStyle: {
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },

  importButtonStyle: {
    variant: "outlined",
    px: 5,
    py: 2,
    textTransform: "unset",
    border: "1px solid #A8AAAE",
    // color: "#A8AAAE",
  },

  addButtonStyle: {
    color: "primary",
    variant: "outlined",
    cursor: "pointer",
    textTransform: "unset",
    background: "#3586C729",
    border: "none",
    // width:"100%"
  },
  tableCustom: {
    height: "300px",
    width: "100%",
    background: "white",
    borderTop: "1px solid #E6E6E7",
    "& .actions": {
      color: "text.secondary",
    },
    "& .textPrimary": {
      color: "text.primary",
    },
  },
  customHeader: {
    backgroundColor: "white",
  },
  tableContainer: {
    height: "80px",
    width: "100%",
    background: "#F3F3F3",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    gap: "40px",
  },
  tableHeaderBox: {
    display: "flex",
    height: "100px",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
    padding: "10px",
  },
  filterBtnStyles: {
    display: "flex",
    gap: "20px",
  },
  autoComplete: {
    "& .MuiInputBase-root": {
      paddingLeft: "0px !important",
    },
    "&::placeholder": {
      paddingLeft: "0px !important",
    },
  },
  importStyle: {
    px: 5,
    py: 2,
    marginRight: "5px",
    textTransform: "unset",
  },
  filter: {
    color: "primary",
    variant: "outlined",
    cursor: "pointer",
    textTransform: "unset",
    background: "#3586C729",
    border: "none",
  },
  filterOne: {
    color: "primary",
    variant: "outlined",
    cursor: "pointer",
    textTransform: "unset",
    background: "#3586C729",
    border: "none",
  },
  buttonStyleHeader: {
    background: "#3586C729",
    height: "38px",
    color: "#3586C7",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#3c52b2",
      border: "2px solid #3586C729",
    },
  },
  productView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  chechkBoxWidth: {
    width: "20%",
  },
  createPrice: {
    background: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    width: "100%",
    "@media (max-width:750px)": { flexWrap: "wrap" },
  },
  cancel_Button: {
    position: "absolute",
    top: "30%",
    right: "35%",
    zIndex: 1,
    "@media (max-width: 2600px)": {
      right: "38.5%",
    },

    "@media (max-width: 2200px)": {
      right: "38%",
    },
    "@media (max-width: 1300px)": {
      right: "36%",
    },

    "@media (max-width: 1200px)": {
      right: "34%",
    },
    "@media (max-width: 1100px)": {
      right: "33%",
    },
    "@media (max-width: 1000px)": {
      right: "31%",
    },
    "@media (max-width: 900px)": {
      right: "29%",
    },
    "@media (max-width: 800px)": {
      right: "27%",
    },
    "@media (max-width: 750px)": {
      right: "25%",
    },
    "@media (max-width: 700px)": {
      right: "24%",
    },
    "@media (max-width: 650px)": {
      right: "20%",
    },
    "@media (max-width: 550px)": {
      right: "15%",
    },
    "@media (max-width: 500px)": {
      right: "12%",
    },

    "@media (max-width: 450px)": {
      right: "7%",
    },
    "@media (max-width: 400px)": {
      right: "5%",
    },
  },
  cancel_Button2: {
    position: "absolute",
    top: "27%",
    right: "38%",
    zIndex: 1,
    "@media (max-width: 2560px)": {
      right: "39%",
      top: "33%",
    },
    "@media (max-width: 1900px)": {
      right: "38%",
      top: "23%",
    },
    "@media (max-width: 1264px)": {
      right: "35%",
      top: "26%",
    },
    "@media (max-width: 1024px)": {
      right: "32%",
      top: "17%",
    },
    "@media (max-width: 915px)": {
      right: "27%",
      top: "17%",
    },
    "@media (max-width: 650px)": {
      right: "21%",
      top: "16%",
    },
    "@media (max-width: 455px)": {
      right: "8%",
      top: "17%",
    },
  },
  ".css-aa4fze-MuiDataGrid-root .MuiDataGrid-columnHeaderDraggableContainer": {
    background: "white",
  },
});

export const bgColor = (theme: any) => ({
  padding: "20px",
  background: theme?.palette.mode === "dark" ? "" : "#F3F3F3",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

// styles.js
export const containerStyle = (theme: any) => ({
  background:
    theme?.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "white",
});
const BoxStyle = {
  padding: "20px",
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  width: "100%",
};

export const darkModeStyle = {
  backgroundColor: "rgba(255, 255, 255, .05)",
};

export const lightModeStyle = {
  background: "white",
};

export const responsiveStyle = {
  "@media (max-width:750px)": {
    flexWrap: "wrap",
  },
};

export const getBoxStyles = (theme: any) => {
  return {
    ...BoxStyle,
    ...responsiveStyle,
    ...(theme?.palette.mode === "dark" ? darkModeStyle : lightModeStyle),
  };
};

// // Example usage
// const theme = getTheme(); // Replace this with your actual theme retrieval
// const sx = getBoxStyles(theme);
