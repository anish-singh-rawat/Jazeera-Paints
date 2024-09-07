import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import React from "react";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import { useStyles } from "src/styles/viewEdit.style";
import CommonInput from "src/components/common/CommonInput";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import CommonSelect from "src/components/common/CommonSelect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import {
  createUnitOfMeasure,
  getUOMLookups,
  getUnitOfMeasure,
  getUnitOfMeasureById,
  updateUnitOfMeasure,
} from "src/store/apps/products/products-add/productsAdd";
import AppEvent from "src/app/AppEvent";
import { validateDropdownItem } from "src/utils/validationsMethods";
import UOMConversionFactorListDataTable from "src/components/products/uom-conversion-factor/UOMConversionFactorListDataTable";
import { isValueUnique } from "src/@core/utils/check-unique";

const index = () => {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const unitClass: any = useSelector(
    (state: RootState) => state?.productsAdd?.UOMlookups ?? []
  );

  const uom = useSelector(
    (state: RootState) => state?.productsAdd?.data?.unitOfMeasures ?? []
  );

  useEffect(() => {
    dispatch(getUOMLookups());
    dispatch(getUnitOfMeasure());
  }, []);

  const schema = yup.object().shape({
    code: yup.string().when("sequenceMapData.autoGeneration", {
      is: false,
      then: yup
        .string()
        .required("REQUIRED")
        .min(1, "Code must be at least 1 characters")
        .max(10, "Code can be at most 10 characters")
        .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric")
        // .test("unique-code", "Code already exists", function (value) {
        //   return isValueUnique(productCategory.data, value, "code", item);
        // }),
    }),
    name: yup.string().required(),
    uomClass: yup
      .mixed()
      .test("uomClass", "REQUIRED", (item: any) => validateDropdownItem(item)),
  });

  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      id: "",
      code: "",
      uomCode: "",
      name: "",
      altName: "",
      uomClass: null as any,
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleCloseDrawer = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: any) => {
    const payload = {
      code: data?.code,
      name: data?.name,
      altName: data?.altName,
      active: true,
      unitClass: data?.uomClass?.code,
    };
  };

  const onErrors = (error: any) => {
    console.log(error);
  };

  const handleEdit = async (id: string) => {
    let edit: any = await dispatch(getUnitOfMeasureById(id));

    setValue("id", edit?.payload?.id);
    setValue("code", edit?.payload?.code);
    setValue("uomCode", edit?.payload?.uomCode);
    setValue("name", edit?.payload?.name);
    setValue("altName", edit?.payload?.altName);
    setValue("uomClass", edit?.payload?.unitClass);
    setOpen(true);
  };

  const handleChange = (e: any) => {
    if (e.target.name === "name") {
      setValue("altName", e?.target?.value);
    }
  };

  return (
    <>
      <Card>
        <UOMConversionFactorListDataTable
          data={[]}
          handleEditPage={(id: string) => handleEdit(id)}
        />
      </Card>
      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={t("ADD_NEW")}
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={(e) => handleChange(e)}
          >
            <div className={classes.formContent}>
              <CommonInput
                control={control}
                defaultValue={getValues("code")}
                errors={errors}
                id="code"
                label="CODE"
                name="code"
                required={false}
              />
              <CommonInput
                control={control}
                defaultValue={getValues("uomCode")}
                errors={errors}
                id="uomCode"
                label="UOM_CODE"
                name="uomCode"
                required={false}
              />
              <CommonInput
                control={control}
                defaultValue={getValues("name")}
                errors={errors}
                id="name"
                label="NAME"
                name="name"
                required={true}
              />
              <CommonInput
                control={control}
                defaultValue={getValues("altName")}
                errors={errors}
                id="altName"
                label="ALTERNATE_NAME"
                name="altName"
                required={false}
              />
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                customText={true}
                disabled={false}
                errors={errors}
                id="uomClass"
                label={"UOM_CLASS"}
                name="uomClass"
                options={unitClass}
                placeholder={t("SELECT")}
                required={true}
                setSelectedFieldType={""}
                setValue={setValue}
                addNew={true}
              />
            </div>

            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={false}
            />
          </form>
        </div>
      </CommonDrawer>
    </>
  );
};

export default index;
