import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import CommonAddNewModel from "src/components/common/CommonAddNewModel";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { businessTaxGroupCreate } from "src/store/apps/tax-configuration/business_tax_group";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { taxValidateSchema } from "../business-tax-group/componentConfig";

const useStyles = makeStyles({
  formActionSave: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
  formActionCancel: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
});

const BusinessTaxGroupModel = (props: any) => {
  const {
    setDialogView,
    businessTaxGroup,
    customerProp,
    setBussinessGroupItems,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const [defaultValue, setDefaultValues] = useState({
    code: "",
    name: props.busData,
    altName: props.busData,
  });
  const [switchActive, setSwitchActive] = useState(true);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(taxValidateSchema(businessTaxGroup, undefined)),
  });

  const dispatch = useDispatch<AppDispatch>();

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const onSubmit = async (data: any) => {
    try {
      data.active = switchActive;
      props.setCustomerProp(data);
      const response = await dispatch(businessTaxGroupCreate(data) as any);
      setDialogView(false);
      const dataItems = {
        id: response?.payload?.id,
        active: response?.meta?.arg?.active,
        name: response?.meta?.arg?.name,
        altName: response?.meta?.arg?.altName,
        code: response?.meta?.arg?.code,
      };

      setBussinessGroupItems(dataItems);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") setValue("altName", e?.target?.value);
  };

  return (
    <div>
      <CommonAddNewModel
        title={t("NEW_BUSINESS_TAX_GROUP")}
        handleDialogClose={() => setDialogView(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onErrors)}
          onChange={handleChange}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <CommonInput
              name="code"
              id="code"
              label="Code"
              required={true}
              control={control}
              errors={errors}
            />

            <CommonInput
              name="name"
              id="name"
              label="Name"
              defaultValue={props.customerProp.name}
              required={true}
              control={control}
              errors={errors}
            />
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ width: "50%" }}>
              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                control={control}
                errors={errors}
                defaultValue={props.customerProp.name}
              />
            </div>
            <div style={{ width: "50%" }}>
              <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                <CommonSwitch
                  active={switchActive}
                  setActive={setSwitchActive}
                  statusChange={() => ({})}
                />{" "}
                {switchActive ? t("ACTIVE") : t("INACTIVE")}
              </div>
            </div>
          </div>

          {/* <CommonFormActionButtons handleCloseDrawer={() => setDialogView(false)} /> */}
          <div style={{ display: "flex", gap: "16px" }}>
            <Button
              type="submit"
              variant="contained"
              className={classes.formActionSave}
            >
              {t("SAVE")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                props.setCustomerProp({});
                setDialogView(false);
              }}
              className={classes.formActionCancel}
            >
              {t("CANCEL")}
            </Button>
          </div>
        </form>
      </CommonAddNewModel>
    </div>
  );
};

export default BusinessTaxGroupModel;
