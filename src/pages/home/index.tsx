// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Title"></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>Dashboard Page.</Typography>
            <Typography>
              Please make sure to read our Template Documentation to understand
              where to go from here and how to use our template.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Title"></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              Access Control (ACL) and Authentication (JWT) are the two main
              security features of our project and are implemented in the
              project as well.
            </Typography>
            <Typography>
              Please read our Authentication and ACL Documentations to get more
              out of them.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;
