import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    drawerWrapper: {
      height: "100vh",
    },
    form: {
      height: "calc(100vh - 80px)",
    },
    formContent: {
      height: "calc(100% - 80px)",
      overflow: "auto",
      padding: "16px 24px 8px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    formContent_row: {
      display: "flex",
      gap: "20px",
    },
    formContent_card: {
      padding: "15px",
      background: "#DBDADE",
      boxShadow: "none",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      overflowY: "auto",
    },
    formContent_cardContent: {
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      boxShadow: "none",
      gap: "18px",
      minHeight: "156px",
    },
    viewContent: {
      display: "grid",
      columnGap: "8px",
      rowGap: "24px",
      margin: "24px 0",
      paddingBottom: "24px",
      borderBottom: "6px solid #3586C7",
      borderRadius: "0px 0px 6px 6px",
    },
    viewContent_label: {
      color: "#a7a5aa",
      fontWeight: 400,
      fontSize: "15px",
    },
    viewContent_value: {
      color: "#6f6b7d",
      fontWeight: 600,
      fontSize: "15px",
    },
    downLoadBtn: {
      display: "flex",
      justifyContent: "flex-end",
    },
    radioContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "0px",
      "& .MuiFormControlLabel-root": {
        height: "30px",
      },
    },
    radioError: {
      color: "#EA5455",
      fontSize: "12px",
      marginTop: "-2px",
    },
    errorMsg: {
      color: "#EA5455",
      margin: 0,
      marginTop: "-20px",
    },
    "@global": {
      ".MuiDataGrid-columnHeaderTitleContainerContent": {
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "normal",
        letterSpacing: "1px",
      },
    },
  });