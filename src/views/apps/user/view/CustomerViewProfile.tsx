import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useTranslation } from "react-i18next";
import Icon from "src/@core/components/icon";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, } from "@mui/material";
import { useState } from "react";

const CustomerViewProfile = ({customerData}:any) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const { t } = useTranslation();

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t(`CUSTOMER_DETAILS`)} />
          <Divider />
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
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`CUSTOMER_CODE`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.code}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`CUSTOMER_TYPE`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.customerType}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`CUSTOMER_GROUP`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.customerGroup?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`CUSTOMER_CLASS`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.customerClass?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`DUSTRIBUTION_CHANNEL`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.distributionChannel?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`CUSTOMER_DIVISION`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.customerDivision?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`PARENT_CUSTOMER`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.parentCustomer?.firstName} {customerData?.parentCustomer?.lastName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`COMPANY_NAME`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.company?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`SALESMAN`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`EXTERNAL_REFERENCE`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                 {customerData?.externalReference}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(25% - 24px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.disabled" }}>
                   {t(`LONGITUDE_LATITUDE`)}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                  {customerData?.latitude}
                  </Typography>
                </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title={t(`ADDRESS`)} />
          <Divider />
          <CardContent sx={{ borderBottom: "5px solid #3586c7" }}>
            <Box
              sx={{
                rowGap: 6,
                columnGap: 6,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
                <Box
                  sx={{
                    width: "calc(33.33% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography pb={1} sx={{ fontWeight: 500,display:"flex",justifyContent:"center",gap:"10px"}}>
                    {t(`HOME`)} <span  onClick={handleEditClickOpen}><Icon icon={"tabler:edit"} fontSize={"20"} /></span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`STREET`)} : {customerData?.street?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`CITY`)} : {customerData?.city?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`STATE`)} : {""}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`PHONE_NUMBER`)} : {customerData?.mobileNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`COUNTRY`)} : {customerData?.country?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(33.33% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography pb={1} sx={{ fontWeight: 500,display:"flex",justifyContent:"center",gap:"10px"}}>
                    {t(`OFFICE`)} <span  onClick={handleEditClickOpen}><Icon icon={"tabler:edit"} fontSize={"20"} /></span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`STREET`)} : {customerData?.street?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`CITY`)} : {customerData?.city?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`STATE`)} : {""}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`PHONE_NUMBER`)} : {customerData?.mobileNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`COUNTRY`)} : {customerData?.country?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(33.33% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography pb={1} sx={{ fontWeight: 500,display:"flex",justifyContent:"center",gap:"10px"}}>
                    {t(`OTHER`)} <span  onClick={handleEditClickOpen}><Icon icon={"tabler:edit"} fontSize={"20"} /></span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`STREET`)} : {customerData?.street?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`CITY`)} : {customerData?.city?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`STATE`)} : {""}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`PHONE_NUMBER`)} : {customerData?.mobileNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "secondary" }}>
                    {t(`COUNTRY`)} : {customerData?.country?.name}
                  </Typography>
                </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Card>
          <CardHeader title={t(`FINANCIAL_DETAILS`)} />
          <Divider />
          <CardContent sx={{ borderBottom: "5px solid #3586c7" }}>
            <Box
              sx={{
                rowGap: 6,
                columnGap: 6,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
                <Box
                  sx={{
                    width: "calc(50% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography sx={{ color: "text.disabled", fontWeight: 500 }}>
                    {t(`TAX_NUMBER`)}
                  </Typography>
                  <Typography>{customerData?.taxNumber}</Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(50% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography sx={{ color: "text.disabled", fontWeight: 500 }}>
                    {t(`CREDIT_LIMIT`)}
                  </Typography>
                  <Typography>{customerData?.creditLimit}</Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(50% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography sx={{ color: "text.disabled", fontWeight: 500 }}>
                    {t(`PAYMENT_TERMS`)}
                  </Typography>
                  <Typography>{customerData?.paymentTerms?.name}</Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(50% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography sx={{ color: "text.disabled", fontWeight: 500 }}>
                    {t(`CURRENCY`)}
                  </Typography>
                  <Typography>{customerData?.currency?.name}</Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(50% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography sx={{ color: "text.disabled", fontWeight: 500 }}>
                    {t(`CUSTOMER_BALANCE`)}
                  </Typography>
                  <Typography>{customerData?.customerBalance}</Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(50% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography sx={{ color: "text.disabled", fontWeight: 500 }}>
                    {t(`PRICE_LIST`)}
                  </Typography>
                  <Typography>{customerData?.priceList?.name}</Typography>
                </Box>
                <Box
                  sx={{
                    width: "calc(50% - 16px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    paddingLeft: "12px",
                  }}
                >
                  <Typography sx={{ color: "text.disabled", fontWeight: 500 }}>
                    {t(`BASIC_TAX`)}
                  </Typography>
                  <Typography>{customerData?.basicTax?.name}</Typography>
                </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Card>
          <CardHeader title={t(`NOTES`)} />
          <Divider />
          <CardContent sx={{ borderBottom: "5px solid #3586c7" }}>
            <Typography variant="body2" sx={{ color: "secondary" }}>
             {customerData?.notes}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Dialog
                open={openEdit}
                onClose={handleEditClose}
                aria-labelledby="user-view-edit"
                aria-describedby="user-view-edit-description"
                sx={{ "& .MuiPaper-root": { width: "40%", maxWidth: 650 } }}
              >
                <DialogTitle
                  id="user-view-edit"
                 sx={{marginLeft:"40px"}}
                >
                 {t(`EDIT`)}
                </DialogTitle>
                <DialogContent
                  sx={{
                    pb: (theme) => `${theme.spacing(8)} !important`,
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                  }}
                >
                  <form>
                    <Grid container>
                      <Grid item xs={12} mt={2}>
                         <InputLabel id="user-view-status-label">
                            {t(`ADDRESS_TYPE`)}
                          </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            defaultValue={"home"}
                            id="user-view-status"
                            labelId="user-view-status-label"
                          >
                            <MenuItem value="home">Home</MenuItem>
                            <MenuItem value="office">Office</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}  mt={2}>
                         <InputLabel id="user-view-status-label">
                            {t(`COUNTRY`)}
                          </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            defaultValue={""}
                            id="user-view-status"
                            placeholder="Select country"
                            labelId="user-view-status-label"
                          >
                            <MenuItem value="home">Home</MenuItem>
                            <MenuItem value="office">Office</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}  mt={2}>
                         <InputLabel id="user-view-status-label">
                            {t(`REGION`)}
                          </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            defaultValue={""}
                            id="user-view-status"
                            placeholder="Select region"
                            labelId="user-view-status-label"
                          >
                            <MenuItem value="home">Home</MenuItem>
                            <MenuItem value="office">Office</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}  mt={2}>
                         <InputLabel id="user-view-status-label">
                            {t(`CITY`)}
                          </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            defaultValue={""}
                            id="user-view-status"
                            placeholder="Select city"
                            labelId="user-view-status-label"
                          >
                            <MenuItem value="home">Home</MenuItem>
                            <MenuItem value="office">Office</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}  mt={2}>
                         <InputLabel id="user-view-status-label">
                            {t(`DISTRICT`)}
                          </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            defaultValue={""}
                            id="user-view-status"
                            placeholder="Select district"
                            labelId="user-view-status-label"
                          >
                            <MenuItem value="home">Home</MenuItem>
                            <MenuItem value="office">Office</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}  mt={2}>
                         <InputLabel id="user-view-status-label">
                            {t(`STREET`)}
                          </InputLabel>
                        <FormControl fullWidth>
                          <TextField
                          type="text"
                          placeholder="Street"
                          value={""}
                          // onChange={}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </form>
                </DialogContent>
                <DialogActions
                  sx={{
                    justifyContent: "center",
                    pt:5
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{ mr: 2 }}
                    onClick={handleEditClose}
                  >
                      {t(`CANCEL`)}
                  </Button>
                  <Button
                   variant="contained"
                    onClick={handleEditClose}
                  >
                      {t(`SAVE`)}
                  </Button>
                </DialogActions>
              </Dialog>
    </Grid>
  );
};

export default CustomerViewProfile;
