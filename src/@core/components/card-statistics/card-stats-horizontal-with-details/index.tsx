// ** MUI Imports
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// ** Type Import
import { CardStatsHorizontalWithDetailsProps } from "src/@core/components/card-statistics/types";

// ** Custom Component Import
import Icon from "src/@core/components/icon";
import CustomAvatar from "src/@core/components/mui/avatar";
import { addCommas } from "src/@core/layouts/utils";

const dataLoader = (
  trendDiff: number,
  stats: number,
  trend: "negative" | "positive",
  showDiff = true
) => {
  if (isNaN(trendDiff) || isNaN(stats))
    return <CircularProgress color="primary" size={"1.3rem"} />;

  let trendDiffs = String(trendDiff).startsWith("-")
    ? Number(trendDiff).toFixed()
    : `+${Number(trendDiff).toFixed()}`;

  let OriginalStats = addCommas(stats);

  return (
    <>
      <Typography variant="h5">{OriginalStats}</Typography>
      {showDiff && (
        <Typography
          sx={{
            color: trend === "negative" ? "error.main" : "success.main",
          }}
        >{`(${trendDiffs})%`}</Typography>
      )}
    </>
  );
};

const CardStatsHorizontalWithDetails = (
  props: CardStatsHorizontalWithDetailsProps
) => {
  // ** Props
  const {
    sx,
    icon,
    stats,
    title,
    subtitle,
    trendDiff,
    iconSize = 24,
    avatarSize = 38,
    trend = "positive",
    avatarColor = "primary",
    showDifference = true,
  } = props;

  return (
    <Card sx={{ ...sx }}>
      <CardContent
        sx={{ gap: 3, display: "flex", justifyContent: "space-between" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            sx={{ mb: 1, color: "text.secondary", fontWeight: "bold" }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              mb: 1,
              columnGap: 1.5,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {dataLoader(trendDiff, stats, trend, showDifference)}
          </Box>

          <Typography sx={{ color: "text.secondary", display: "none" }}>
            {subtitle}
          </Typography>
        </Box>
        <CustomAvatar
          skin="light"
          variant="rounded"
          color={avatarColor}
          sx={{ width: avatarSize, height: avatarSize }}
        >
          <Icon icon={icon} fontSize={iconSize} />
        </CustomAvatar>
      </CardContent>
    </Card>
  );
};

export default CardStatsHorizontalWithDetails;
