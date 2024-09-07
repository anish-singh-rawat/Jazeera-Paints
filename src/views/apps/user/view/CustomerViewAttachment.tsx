import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
// ** Styles Import
import "react-credit-cards/es/styles-compiled.css";
import { Avatar, Box, CardContent, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle,} from "@mui/material";
import { useState } from "react";
import {useTheme } from "@mui/material/styles";
interface UserStatusType {
  [key: string]: ThemeColor;
}
const userStatusObj: UserStatusType = {
  REJECTED: "error",
  APPROVED: "success",
  PENDING: "warning",
};

const CustomerViewAttachment = () => {

  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  // Handle Edit dialog
  const handleViewAttachment = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{borderBottom:"5px solid #3586c7"}}>
            <Box py={4}>
            <Typography
              variant="body2"
              sx={{
                color: "text.disabled",
                display: "flex",
                justifyContent: "end",
              }}
            >
              Today
            </Typography>
              <Box sx={{ display: "flex", gap: "20px" }}>
                <Box>
                <Avatar variant="square" sx={{height:"30px",width:"50px"}} alt="passport" src="/static/images/avatar/1.jpg" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>
                    Passport
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    1234567890102
                  </Typography>
                  <Box mt={2} sx={{ display: "flex", gap: "20px" }}>
                    <Button onClick={handleViewAttachment} variant="outlined" size="small">
                      View
                    </Button>
                    <Button variant="outlined" size="small">
                      Download
                    </Button>
                  </Box>
                </Box>
                <Chip
                  rounded
                  skin="light"
                  size="small"
                  style={{ textTransform: "capitalize" }}
                  label={t("Pending")}
                  color={userStatusObj["Pending" && "PENDING"]}
                  sx={{ fontSize: "1rem" }}
                />
              </Box>
              </Box>
              <Divider/>
              <Box py={4}>
            <Typography
              variant="body2"
              sx={{
                color: "text.disabled",
                display: "flex",
                justifyContent: "end",
              }}
            >
              30/12/2023
            </Typography>
              <Box sx={{ display: "flex", gap: "20px" }}>
                <Box>
                <Avatar variant="square" sx={{height:"30px",width:"50px"}} alt="aadhar card" src="/static/images/avatar/1.jpg" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>
                    Aadhar Card
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    1234567890102
                  </Typography>
                  <Box mt={2} sx={{ display: "flex", gap: "20px" }}>
                    <Button onClick={handleViewAttachment} variant="outlined" size="small">
                      View
                    </Button>
                    <Button variant="outlined" size="small">
                      Download
                    </Button>
                  </Box>
                </Box>
                <Chip
                  rounded
                  skin="light"
                  size="small"
                  style={{ textTransform: "capitalize" }}
                  label={t("Approved")}
                  color={userStatusObj["Approved" && "APPROVED"]}
                  sx={{ fontSize: "1rem" }}
                />
              </Box>
              </Box>
              <Divider/>
              <Box py={4}>
            <Typography
              variant="body2"
              sx={{
                color: "text.disabled",
                display: "flex",
                justifyContent: "end",
              }}
            >
              24/02/2024
            </Typography>
              <Box sx={{ display: "flex", gap: "20px" }}>
                <Box>
                <Avatar variant="square" sx={{height:"30px",width:"50px"}} alt="aadhar card" src="/static/images/avatar/1.jpg" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>
                    Aadhar Card
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    1234567890102
                  </Typography>
                  <Box mt={2} sx={{ display: "flex", gap: "20px" }}>
                    <Button onClick={handleViewAttachment} variant="outlined" size="small">
                      View
                    </Button>
                    <Button variant="outlined" size="small">
                      Download
                    </Button>
                  </Box>
                </Box>
                <Chip
                  rounded
                  skin="light"
                  size="small"
                  style={{ textTransform: "capitalize" }}
                  label={t("Rejected")}
                  color={userStatusObj["Rejected" && "REJECTED"]}
                  sx={{ fontSize: "1rem" }}
                />
              </Box>
              </Box>
          </CardContent>
        </Card>
      </Grid>
      <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="user-view-edit"
                aria-describedby="user-view-edit-description"
                sx={{ "& .MuiPaper-root": { width: "40%", maxWidth: 600 } }}
              >
                <DialogTitle
                  id="user-view-edit"
                  sx={{
                    textAlign: "center",
                    fontSize: "1.5rem !important",
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                    pt: (theme) => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`,
                    ],
                  }}
                >
                 {t(`ATTACHMENTS`)}
                </DialogTitle>
                <DialogContent
                  sx={{
                    textAlign:"center",
                    pb: (theme) => `${theme.spacing(8)} !important`,
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                  }}
                >  
                <img src="" alt="Not image found"/>   
                </DialogContent>
                <DialogActions
                  sx={{
                    justifyContent: "center",
                    px: (theme) => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`,
                    ],
                    pb: (theme) => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`,
                    ],
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{ mr: 2 }}
                    size="small"
                    color="success"
                  >
                      {t(`APPROVE`)}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ mr: 2 }}
                    size="small"
                    color="error"
                  >
                      {t(`REJECT`)}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={handleClose}
                  >
                      {t(`CLOSE`)}
                  </Button>
                </DialogActions>
              </Dialog>
    </Grid>
  );
};

export default CustomerViewAttachment;
