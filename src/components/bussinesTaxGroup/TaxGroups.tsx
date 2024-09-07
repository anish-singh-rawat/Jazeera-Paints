import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BusinessTaxGroupDatatable from "src/components/tax-configuration/business-tax-group/BusinessTaxGroupDatatable";
import { AppDispatch, RootState } from "src/store";

import { Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import AppStorage from "src/app/AppStorage";
import CommonButton from "src/components/common/CommonButton";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import {
  SingleTaxGroup,
  TaxGroupsList,
} from "src/store/apps/tax-configuration/tax-groups";
import CommonInfoBlock from "../common/CommonInfoBlock";
import TaxGroupsForm from "./TaxGroupForm";
import { useStyles, viewObjectData } from "./taxGroupsConfig";

const TaxGroups = () => {
  const [item, setItem] = useState<SingleTaxGroup | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const listGroups = useSelector(
    (state: RootState) => state.taxGroupSlice.data.listGroups
  );
  const listGroupsLoading = useSelector(
    (state: RootState) => state.taxGroupSlice.listGroupsLoading
  );

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const businessTaxGroup: any = useSelector(
    (state: RootState) => state.businessTaxGroup
  );

  useEffect(() => {
    async function listGroup() {
      await dispatch(TaxGroupsList());
    }
    listGroup().catch(console.error);
  }, []);

  const handleEditPage = async (id: string) => {
    setOpen(true);
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };

  const handleCloseDrawer = () => {
    setItem(undefined);
    setOpen(false);
  };

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  const infoData = viewObjectData(selectedViewRecord, t);

  return (
    <>
      <Card>
        <BusinessTaxGroupDatatable
          data={listGroups}
          selectedRecord={selectedRecord}
          handleEditPage={handleEditPage}
          isLoading={listGroupsLoading}
          setItem={setItem}
          item={item}
          changeLanguage={changeLanguage}
        />

        {/* Edit Record inside Drawer */}
        <CommonDrawer open={open} toggle={handleCloseDrawer}>
          <TaxGroupsForm item={item} handleCloseDrawer={handleCloseDrawer} />
        </CommonDrawer>

        <CommonDrawer open={viewOpen} toggle={viewToggle}>
          <div className={classes.drawerWrapper}>
            <CommonDrawerHeader
              title={selectedViewRecord.name}
              handleClose={handleCloseViewDrawer}
            />
            <div style={{ padding: "0 24px" }}>
              <div className={classes.viewContent}>
                {infoData.map((d) => (
                  <CommonInfoBlock
                    info={{ code: d.code, value: d.value }}
                    key={d.code}
                  />
                ))}
              </div>
              <div className={classes.downLoadBtn}>
                <CommonButton
                  variant="contained"
                  label={t("DOWNLOAD")}
                  handleButton={() => {}}
                />
              </div>
            </div>
          </div>
        </CommonDrawer>
      </Card>
    </>
  );
};

export default TaxGroups;
