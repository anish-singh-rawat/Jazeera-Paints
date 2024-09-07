import React from "react";
import { Box, Card, Paper, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles({
  headerBox: {
    padding: "20px 20px",
    //marginTop: "15px",
    display: "flex",
    alignItems: "center",
    // background: (theme: Theme) =>
    //   theme.palette.mode === "light" ? "#f3f3f3" : "#2F3349 !important",
  },
  heading: {
    fontSize: "15px",
    fontWeight: 600,
  },
  component: {
    padding: "20px !important",
  },
});

const CommonCardWithHeader: React.FunctionComponent<{
  header: string;
  component: any;
  height?: string;
}> = ({ header, component, height }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <Card style={{marginBottom:'20px'}}>
      <Box className={classes.headerBox} style={{ height: height || "64px" }}>
        <Typography className={classes.heading} variant="h6">
          {header}
        </Typography>
      </Box>
      <Paper className={classes.component} elevation={0}>
        {component}
      </Paper>
    </Card>
  );
};

export default CommonCardWithHeader;
