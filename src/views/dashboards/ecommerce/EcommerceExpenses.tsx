// ** MUI Imports
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Third Party Imports
import { ApexOptions } from "apexcharts";

// ** Custom Components Import
import ReactApexcharts from "src/@core/components/react-apexcharts";

// ** Util Import
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";

const EcommerceExpenses = () => {
  // ** Hook
  const theme = useTheme();

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true },
    },
    stroke: { lineCap: "round" },
    colors: [hexToRGBA(theme.palette.warning.main, 1)],
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    plotOptions: {
      radialBar: {
        endAngle: 90,
        startAngle: -90,
        hollow: { size: "64%" },
        track: {
          strokeWidth: "40%",
          background: hexToRGBA(theme.palette.customColors.trackBg, 1),
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -3,
            fontWeight: 600,
            fontSize: "22px",
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          },
        },
      },
    },
    grid: {
      padding: {
        bottom: 15,
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { height: 200 },
        },
      },
      {
        breakpoint: 430,
        options: {
          chart: { height: 150 },
        },
      },
    ],
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">82.5k</Typography>
        <Typography variant="body2" sx={{ color: "text.disabled" }}>
          Expenses
        </Typography>
        <ReactApexcharts
          type="radialBar"
          height={160}
          series={[78]}
          options={options}
        />
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "text.disabled" }}
        >
          $21k Expenses more than last month
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EcommerceExpenses;
