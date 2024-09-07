import { useEffect, useState } from "react";
import CustomerProfileDataTable from "src/components/customer-profile/CustomerProfileData";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { customerProfiles } from "src/store/apps/customer-profile/customer_profile";
import Card from "@mui/material/Card";
import CustomerProfileAccordian from "src/components/customer-profile/CustomerProfileAccordian";

const CustomerProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [customerProfileData, setCustomerProfileData] = useState<any>([]);
  const [toggle, setToggle] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<any>({});

  const customerProfile: any = useSelector(
    (state: RootState) => state.customerProfile
  );

  useEffect(() => {
    dispatch(customerProfiles());
  }, []);

  useEffect(() => {
    setCustomerProfileData(customerProfile?.data ?? []);
  }, [customerProfile]);

  const handleSetToggle = (type: string) => {
    setToggle(type);
  };

  return (
    <>
      {toggle === "add" || toggle === "edit" || toggle === "view" ? (
        <CustomerProfileAccordian
          setToggle={setToggle}
          isLoading={customerProfile?.isLoading}
          toggle={toggle}
          selectedRow={selectedRow}
          setSelectedRecord={setSelectedRow}
        />
      ) : (
        <Card>
          <CustomerProfileDataTable
            isLoading={customerProfile?.isLoading}
            data={customerProfileData}
            handleEditPage={handleSetToggle}
            selectedRecord={selectedRow}
            setSelectedRecord={setSelectedRow}
          />
        </Card>
      )}
    </>
  );
};

export default CustomerProfile;
