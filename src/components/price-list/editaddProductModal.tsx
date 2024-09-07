import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isValidDate } from "src/utils/utils";
import CommonDatePicker from "../common/CommonDatePicker";
import CommonInput from "../common/CommonInput";
import CommonSwitch from "../common/CommonSwitch";
import { dateConvert } from "./commonActionRow";

const EditaddProductModal = ({
  row,
  errors,
  control,
  setValue,
  clearErrors,
  getValues,
  switchActive,
  setSwitchActive,
  conversion,
  setConversion,
  setError,
}: any) => {
  const { t } = useTranslation();
  const startDate = isValidDate(row?.startDate);
  const endDate = isValidDate(row?.endDate);
  const [rdate, setDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate,
    endDate,
  });
  return (
    <div>
      <div style={{ width: "350px" }}>
        <CommonInput
          name="Product Name"
          id="productname"
          defaultValue={row.productName}
          label="product Name"
          control={control}
          errors={errors}
          disabled={true}
        />
        <CommonInput
          name="SKU"
          id="sku"
          label="SKU"
          defaultValue={row.sku}
          control={control}
          errors={errors}
          disabled={true}
        />
        <CommonInput
          name="UOM"
          id="uom"
          label="UOM"
          defaultValue={row.UOMId?.name}
          control={control}
          errors={errors}
          disabled={true}
        />
        <CommonInput
          name="price"
          id="price"
          label="Price"
          defaultValue={row.price}
          control={control}
          errors={errors}
          regValue={/^(?:[0-9]+(?: [0-9]+)*|)$/}
          clearErrors={clearErrors}
          required={true}
        />
        <CommonInput
          name="minimumPrice"
          id="minimumprice"
          label="Minimum Price"
          defaultValue={row.minimumPrice}
          control={control}
          errors={errors}
          regValue={/^(?:[0-9]+(?: [0-9]+)*|)$/}
          clearErrors={clearErrors}
          required={true}
        />
        <CommonDatePicker
          name="startDate"
          control={control}
          required={true}
          label={"start Date"}
          setValue={setValue}
          errors={errors}
          clearErrors={clearErrors}
          defaultValue={isValidDate(row?.startDate)}
          cb={(date: any) => {
            setDate((p) => ({ ...p, startDate: date }));
            setValue("startDate", date);
            clearErrors("startDate");
            if (rdate.endDate && date > rdate.endDate) {
              setDate((p) => ({ ...p, endDate: null }));
              setValue("endDate", null);
              setError("endDate", {
                type: "manual",
                message: "End date cannot be in the future",
              });
            }
          }}
          selectedDate={rdate.startDate}
        />
        <CommonDatePicker
          name="endDate"
          control={control}
          required={true}
          label={"End Date"}
          setValue={setValue}
          showpreferedDate={false}
          minDate={dateConvert(getValues()["startDate"] ?? startDate)}
          errors={errors}
          clearErrors={clearErrors}
          cb={(date: any) => {
            setDate((p) => ({ ...p, endDate: date }));
            setValue("endDate", date);
            clearErrors("endDate");
          }}
          selectedDate={rdate.endDate}
          defaultValue={isValidDate(row?.endDate)}
        />

        <div>
          <label>{t("STATUS")}</label>
          <CommonSwitch
            active={switchActive}
            setActive={setSwitchActive}
            statusChange={() => ({})}
          />{" "}
          {switchActive ? t("ACTIVE") : t("INACTIVE")}
        </div>
        <div>
          <label htmlFor="con">{t("CONVERSION")}</label>
          <Checkbox
            checked={conversion}
            onChange={(e, c) => setConversion(c)}
            id="con"
          />
        </div>
      </div>
    </div>
  );
};

export default EditaddProductModal;
