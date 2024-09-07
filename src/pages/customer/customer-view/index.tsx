import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import UserViewLeft from "src/views/apps/user/view/UserViewLeft";
import UserViewRight from "src/views/apps/user/view/UserViewRight";

// ** Types
import { useRouter } from "next/router";
import { axiosInstance as axios } from "src/configs/axios";
import { decryptPriceId as decryptId } from "src/utils/utils";

type Props = {
  tab: string;
  invoiceData: any[];
};

const CustomerView = (props: any) => {
  const { customerFakeData } = props;
  const [customerData, setCustomerData] = useState<any>(null);
  const router = useRouter();

  const fetchCustomerData = async (id: string) => {
    try {
      const response = await axios.get(`customer/${id}`);
      if (response.data) {
        setCustomerData(response.data);
      } else {
        console.log("Data not found");
      }
    } catch (e) {
      console.log(e, "error while fetching data");
    }
  };

  useEffect(() => {
    if (
      router.isReady &&
      router.query?.id &&
      typeof router.query?.id === "string"
    ) {
      const realId = decryptId(router.query?.id);
      fetchCustomerData(realId);
    }
  }, [router.isReady, router.query?.id]);

  return (
    <Grid
      className="scrollbar-hidden"
      container
      spacing={6}
      sx={{ position: "relative", overflowY: "scroll" }}
    >
      <style>
        {`
          .scrollbar-hidden::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <Grid
        item
        xs={12}
        md={5}
        lg={4}
        sx={{ position: { md: "sticky", sm: "" }, top: 0 }}
      >
        <UserViewLeft customerData={customerData} fetchCustomerData={fetchCustomerData} />
      </Grid>
      <Grid item xs={12} md={7} lg={8} sx={{ maxHeight: "calc(100vh - 64px)" }}>
        <UserViewRight tab={"Overview"} customerData={customerData} />
      </Grid>
    </Grid>
  );
};

export default CustomerView;
