import React from "react";
import useStyles from "./style";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import CustomDiscunt from "./CustomDiscunt";
import CommonButton from "src/components/common/CommonButton";

interface ViewContentProps {
    selectedViewRecord: {
      code: string;
      name: string;
      altName: string;
      externalReference: string;
      description: string;
      paymentMethod: string;
      days: number;
      weekdayOfPayment: number;
      active: boolean;
      discount: string; 
    };
    handleCloseViewDrawer: () => void;
    control: any; // Change the type based on the actual type of control
    discountInfo:any
    errors:any
  }

const ViewContent : React.FC<ViewContentProps> = ({
  selectedViewRecord,
  handleCloseViewDrawer,
  control,
  discountInfo,
  errors
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.drawerWrapper}>
      <CommonDrawerHeader
        title={selectedViewRecord.name}
        handleClose={handleCloseViewDrawer}
      />

      <div style={{ padding: "0 24px" }}>
        <div className={classes.viewContent}>
          <div className="">
            <div className={classes.viewContent_label}>{t("CODE")}</div>
            <div className={classes.viewContent_value}>
              {selectedViewRecord.code}
            </div>
          </div>
          <div className="">
            <div className={classes.viewContent_label}>{t("NAME")}</div>
            <div className={classes.viewContent_value}>
              {selectedViewRecord.name}
            </div>
          </div>
          <div className="">
            <div className={classes.viewContent_label}>
              {t("ALTERNATE_NAME")}
            </div>
            <div className={classes.viewContent_value}>
              {selectedViewRecord.altName}
            </div>
          </div>
          <div className="">
            <div className={classes.viewContent_label}>{t("TYPE")}</div>
            <div className={classes.viewContent_value}>
              {selectedViewRecord.externalReference}
            </div>
          </div>
        </div>
        <div>
          <div className={classes.viewContent_label}>{t("DESCRIPTION")}</div>
          <div style={{ width: "100%", wordWrap: "break-word" }}>
            {selectedViewRecord.description}
          </div>
        </div>
      </div>
      <Typography sx={{ margin: "22px", fontWeight: "bold" }}>SetUp</Typography>
      <div className={classes.viewRapper}>
        <div className="">
          <div className={classes.viewContent_label}>{t("PAYMENT_METHOD")}</div>
          <div className={classes.viewContent_value}>
            {selectedViewRecord.paymentMethod}
          </div>
        </div>

        <div className="">
          <div className={classes.viewContent_label}>{t("DAYS")}</div>
          <div className={classes.viewContent_value}>
            {selectedViewRecord.days}
          </div>
        </div>
        <div className="">
          <div className={classes.viewContent_label}>{t("MONTHS")}</div>
          <div className={classes.viewContent_value}>
            {selectedViewRecord.weekdayOfPayment}
          </div>
        </div>

        <div className="">
          <div className={classes.viewContent_label}>{t("STATUS")}</div>
          <div className={classes.viewContent_value}>
            {selectedViewRecord.active === true ? "Active" : "InActive"}
          </div>
        </div>
      </div>
      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
        <div className="">
          <div className={classes.viewContent_label}>{t("EARLY_DISCOUNT")}</div>
          <div className={classes.viewContent_value}>
            {selectedViewRecord.discount}
          </div>
        </div>

        <CustomDiscunt
          control={control}
          errors={errors}
          discountInfo={discountInfo}
        />
      </div>
      <div className={classes.viewContentbottom}>
        <div className={classes.downLoadBtn}>
          <CommonButton
            variant="contained"
            label={t("DOWNLOAD")}
            handleButton={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewContent;
