import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Icon from "src/@core/components/icon";
import CustomAvatar from "src/@core/components/mui/avatar";

type OfferData = {
  title: string;
  description: string;
  icon: string;
};

const data: OfferData[] = [
  {
    title: "Flat 25% Discount",
    description: "Flat 25% discount on purchase above 2500 SAR ",
    icon: "tabler:rosette-discount",
  },
  {
    title: "Flat 25% Discount",
    description: "Flat 25% discount on purchase above 2500 SAR ",
    icon: "tabler:gift",
  },
  {
    title: "Flat 25% Discount",
    description: "Flat 25% discount on purchase above 2500 SAR ",
    icon: "tabler:rosette-discount",
  },
];

const CustomerViewOffers = () => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ borderBottom: "5px solid #3586c7" }}>
            <Box
              sx={{
                rowGap: 6,
                columnGap: 8,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Grid container display={"table-column"} spacing={6}>
                {data.map((item: OfferData, index: number) => (
                  <>
                    <Grid item xs={12} sm={12} key={index} width="100%">
                      <Box
                        sx={{
                          mb: 2.5,
                          display: "flex",
                          alignItems: "center",
                          minWidth: "100%",
                        }}
                      >
                        <CustomAvatar
                          skin="light"
                          variant="rounded"
                          sx={{ mr: 4, width: 50, height: 50 }}
                        >
                          <Icon fontSize="2.525rem" icon={item.icon} />
                        </CustomAvatar>
                        <Stack>
                          <Typography sx={{ fontWeight: 500 }} variant="h6">
                            {item.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ mb: 2.5 }}
                            fontSize="1rem"
                          >
                            {item.description}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                    {index !== data.length - 1 && <Divider />}
                  </>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomerViewOffers;
