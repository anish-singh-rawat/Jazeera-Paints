// ** React Imports
import { useEffect } from "react";
import Grid from "@mui/material/Grid";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { useRouter } from "next/router";

const InvoiceList = () => {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const customerListRoute = "customers/customer-list/";
    // Redirect user to URL
    router.replace(customerListRoute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}></Grid>
    </DatePickerWrapper>
  );
};

export default InvoiceList;
