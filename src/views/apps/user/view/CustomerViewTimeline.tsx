// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import MuiTimeline, { TimelineProps } from "@mui/lab/Timeline";
import { Button} from "@mui/material";

// ** Custom Components Imports
import OptionsMenu from "src/@core/components/option-menu";
import { useTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTranslation } from "react-i18next";

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  "& .MuiTimelineItem-root": {
    "&:before": {
      display: "none",
    },
    "&:last-child": {
      minHeight: 60,
    },
  },
}));

const CustomerViewTimeline = (props: any) => {
  const { invoiceData } = props;
const {t}=useTranslation();
  const theme = useTheme();
 
  return (
    <Grid container spacing={6}>
      {/* timeline */}
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ borderBottom: "5px solid #3586c7"}}>
            <CardHeader
              title={t(`USER_ACTIVITY_TIMELINE`)}
              action={
                <OptionsMenu
                  options={["Share timeline", "Suggest edits", "Report bug"]}
                  iconButtonProps={{
                    size: "small",
                    sx: { color: "text.disabled" },
                  }}
                />
              }
            />
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="warning" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{ mb: (theme: any) => `${theme.spacing(3)} !important` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 500 }}>
                      {t(`PURCHASED_IN_STORE`)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   Today
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 3, color: "text.secondary" }}>
                    Purchase at 11:45 AM | 25/02/2024 | 5,000,00 SAR
                  </Typography>
                  <Box>
                    <Button>
                      <DescriptionIcon /> {t(`SALES_INVOICE`)}
                    </Button>
                  </Box>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="error" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{ mb: (theme: any) => `${theme.spacing(3)} !important` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 500, color: "red" }}>
                     {t(`RETURN_ONLINE`)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.disabled" }}>
                      2 Days Ago
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "text.secondary" }}>
                    Purchase at 11:45 AM | 25/02/2024 | 5,000,00 SAR
                  </Typography>
                  <Box>
                    <Button>
                      <DescriptionIcon /> {t(`RETURN_INVOICE`)}
                    </Button>
                  </Box>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="info" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{ mb: (theme: any) => `${theme.spacing(3)} !important` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 500 }}>
                      {t(`PURCHASE_ONLINE`)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.disabled" }}>
                      4 Days Ago
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 3, color: "text.secondary" }}>
                    Purchase at 11:45 AM | 25/02/2024 | 5,000,00 SAR
                  </Typography>
                  <Box>
                    <Button>
                      <DescriptionIcon />{t(`SALES_INVOICE`)}
                    </Button>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
        </Card>
      </Grid>
      </Grid>
  );
};

export default CustomerViewTimeline;
