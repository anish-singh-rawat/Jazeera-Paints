import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import CommonAddNewModel from "src/components/common/CommonAddNewModel";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { productTaxGroupCreate } from "src/store/apps/tax-configuration/product_tax_group";
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

const ProductTaxGroupModel = (props: any) => {
  const { setDialogView, productTaxGroup, productProp, setproductGroupItems } =
    props;
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const { t } = useTranslation();
  const [switchActive, setSwitchActive] = useState(true);
  const [defaultValue, setDefaultValues] = useState({
    code: "",
    name: props.resData,
    altName: props.resData,
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(taxValidateSchema(productTaxGroup, undefined)),
  });

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  // const onSubmit = (data: any) => {
  //   data.active = switchActive;
  //   dispatch(productTaxGroupCreate(data));
  //   setDialogView(false);
  // };

  const onSubmit = async (data: any) => {
    try {
      data.active = switchActive;
      props.setProductProp(data);
      const response = await dispatch(productTaxGroupCreate(data) as any);
      setDialogView(false);
      const dataItems = {
        id: response?.payload?.id,
        active: response?.meta?.arg?.active,
        name: response?.meta?.arg?.name,
        altName: response?.meta?.arg?.altName,
        code: response?.meta?.arg?.code,
      };

      setproductGroupItems(dataItems);
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
        title={t("NEW_PRODUCT_TAX_GROUP")}
        handleDialogClose={() => setDialogView(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onErrors)}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          onChange={handleChange}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <CommonInput
              name="code"
              id="code"
              label="Code"
              required={true}
              control={control}
              errors={errors}
              defaultValue={defaultValue.code}
            />
            <CommonInput
              name="name"
              id="name"
              label="Name"
              defaultValue={productProp.name}
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
                required={true}
                defaultValue={productProp.name}
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
                props.setProductProp({});
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

export default ProductTaxGroupModel;
