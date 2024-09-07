import { makeStyles } from "@mui/styles";


const useStyles = makeStyles({
    drawerWrapper: {
      height: "100%",
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
    viewContents: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      columnGap: "8px",
      rowGap: "24px",
      margin: "24px 0",
      paddingBottom: "24px",
      // borderBottom: "6px solid #3586C7",
      borderRadius: "0px 0px 6px 6px",
    },
  
    viewRapper: {
      // margin:"22px",
      paddingLeft: "22px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      columnGap: "8px",
      rowGap: "24px",
      // margin: "24px 0",
  
      //  borderBottom: "6px solid #3586C7",
      borderRadius: "0px 0px 6px 6px",
    },
  
    viewContentbottom: {
      columnGap: "8px",
      rowGap: "24px",
      margin: "24px 0",
      paddingBottom: "24px",
      borderBottom: "6px solid #3586C7",
      borderRadius: "0px 0px 6px 6px",
      margginBotton: "100px",
    },
    viewContent: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      columnGap: "8px",
      rowGap: "24px",
      marginTop: "20px",
      paddingBottom: "24px",
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
      marginRight: "20px",
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
  });



  export default useStyles;