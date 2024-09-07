import React from "react";
import useStyles from "./style";
import CommonInput from "src/components/common/CommonInput";
import CommonTextArea from "src/components/common/CommonTextArea";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import CustomRadio from "./CustomRadio";
import Checkbox from "@mui/material/Checkbox";
import CustomDiscunt from "./CustomDiscunt";
import CommonSwitch from "src/components/common/CommonSwitch";

interface PaymentFormProps {
  control: any;
  errors: any;
  item: any;
  setSelectedPaymentMethod: (method: string) => void;
  nextWeekFormattedDate?: string | null;
  discountInfo: any;
  setSwitchActive: (active: boolean) => void;
  switchActive: boolean;
  addDiscountInfo: (info: any) => void;
  handleInputChange: any;
  sequenceMapData: any;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  control,
  errors,
  item,
  setSelectedPaymentMethod,
  discountInfo,
  setSwitchActive,
  switchActive,
  addDiscountInfo,
  handleInputChange,
  sequenceMapData,
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ margin: "30px" }}>
      <CommonInput
        name="code"
        id="code"
        label="Code"
        required={!sequenceMapData?.autoGeneration}
        control={control}
        errors={errors}
        disabled={sequenceMapData?.autoGeneration}
        defaultValue={t("AUTO_GENERATED")}
      />
      <CommonInput
        name="name"
        id="name"
        label="Name"
        required={true}
        control={control}
        errors={errors}
        defaultValue={item.name}
      />
      <CommonInput
        name="altName"
        id="altName"
        label="Alternate Name"
        // required={true}
        control={control}
        errors={errors}
        defaultValue={item.altName}
      />
      <CommonTextArea
        name="description"
        id="description"
        label={t("DESCRIPTION")}
        type={"string"}
        control={control}
        errors={errors}
        placeholder={t("DESCRIPTION")}
        defaultValue={item.description}
        rows={4}
      />

      <Typography sx={{ fontSize: "15px", fontWeight: "700" }}>
        {t("SET_UP")}
      </Typography>

      <Box sx={{ display: "flex", gap: "10px" }}>
        <CustomRadio control={control} name={"paymentMethod"} />
      </Box>
      <Box sx={{ display: "flex", gap: "10px" }}>
        <CommonInput
          name="days"
          id="days"
          label="No Of Days"
          control={control}
          errors={errors}
          defaultValue={item.days}
          required={true}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Checkbox />
        <Typography>{t("FIXED_DAY_OF_THE_MONTH")}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: "10px" }}>
        <CommonInput
          name="months"
          id="months"
          label="No Of Month"
          control={control}
          errors={errors}
          defaultValue={item.months}
          required={true}
        />
      </Box>

      <Typography sx={{ fontSize: "15px", fontWeight: "700" }}>
        {t("EARLY_DISCOUNT")}
      </Typography>
      <Box sx={{ display: "flex", gap: "10px" }}>
        <CustomDiscunt
          control={control}
          errors={errors}
          btn={true}
          discountInfo={discountInfo}
          addDiscountInfo={addDiscountInfo}
          handleInputChange={handleInputChange}
        />
      </Box>

      <Box sx={{ display: "flex", gap: "10px" }}>
        <div style={{ marginLeft: "12px" }}>
          <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
            <CommonSwitch
              active={switchActive}
              setActive={setSwitchActive}
              statusChange={() => ({})}
            />{" "}
            {switchActive ? t("ACTIVE") : t("INACTIVE")}
          </div>
        </div>
      </Box>
    </div>
  );
};

export default PaymentForm;
