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
    viewContent: {
      display: "grid",
      gridTemplateColumns: "1fr",
      columnGap: "8px",
      rowGap: "24px",
      margin: "24px 0",
      paddingBottom: "24px",
      borderBottom: "6px solid #3586C7",
      borderRadius: "0px 0px 6px 6px",
      width: "100%",
    },
    viewContent_wrapper: {
      width: "80%",
      overflowWrap: "break-word",
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
  
    inputField: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
  
      "& .MuiInputBase-input": {
        padding: "10px",
      },
    },
    commonSelect: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
  
      "& .MuiOutlinedInput-root": {
        paddingTop: "3px",
        paddingBottom: "2px",
      },
    },
    option: {
      padding: "0 5px",
      "&:hover": {
        backgroundColor: "rgba(115, 103, 240, 0.08) !important",
        color: "#3586C7",
        borderRadius: "5px",
      },
      '&[aria-selected="true"]': {
        backgroundColor: "#3586C7 !important",
        borderRadius: "5px",
        padding: "0 5px",
        "&:hover": {
          color: "#ffffff",
        },
      },
      height: "40px",
    },
    popper: {
      padding: "0 5px",
    },
    errorMsg: {
      color: "#EA5455",
      margin: 0,
      marginTop: "-14px",
    },
    modal: {
      padding: "0px 0px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      justifyContent: "center",
    },
    modalText: {
      textAlign: "center",
      width: "i",
    },
    pos_setup:{
      padding: "10px",
      margin: "10px 0px",
      borderRadius: "7px",
      background: "#e4e4e4",
    }
  });