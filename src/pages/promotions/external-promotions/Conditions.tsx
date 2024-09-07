import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import {
  Card,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonInput from "src/components/common/CommonInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { defaultValues } from "src/types/forms/promotion/externalPromotion/externalPromotionTypes";
import CommonSwitch from "src/components/common/CommonSwitch";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { useTranslation } from "react-i18next";
import AppStorage from "src/app/AppStorage";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import ConditionDataTable from "src/components/promotion/extrenalPromotion/ConditionDataTable";
import {
  externalPromotionHeaderCreate,
  externalPromotionHeaderList,
  externalPromotionHeaderToggle,
  externalPromotionHeaderUpdate,
  lookUpValue,
} from "src/store/apps/promotion/externalPromotion/externalPromotion";
import CommonSelect from "src/components/common/CommonSelect";
import { Key } from "src/@core/layouts/utils";
import ReusableCardDialog from "src/components/promotion/extrenalPromotion/DialogBoxWithBtn";
import { externalPromotionHeaderColumnList } from "src/store/apps/promotion/externalPromotion/externalPromotionColumn";

const Conditions = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [disabled, setDisabled] = useState(false);
  const [dialogData, setDialogData] = useState<any>([]);

  let statusRes: any;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const externalPromotion: any = useSelector(
    (state: RootState) => state.externalPromotion
  );

  const externalPromotionColumn: any = useSelector(
    (state: RootState) => state.externalPromotionColumn
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    dispatch(externalPromotionHeaderList({ data: "all" }));
    dispatch(externalPromotionHeaderColumnList({ data: "all" }));
    dispatch(sequenceMappingCodeSearch({ entityType: "PROMOTION_HEADER" }));
    dispatch(lookUpValue({ lookupTypesCode: "PROMOTION_TYPE" }));
  }, []);

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const handleEditPage = async (id: string) => {
    setOpen(true);
    statusRes = await dispatch(externalPromotionHeaderToggle({ id: id }));
    statusRes?.payload?.message ? setDisabled(false) : setDisabled(true);
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };

  const schema = yup.object().shape({
    code: yup.string().when("sequenceMapData.autoGeneration", {
      is: false,
      then: yup
        .string()
        .required("REQUIRED")
        .min(2, "Code must be at least 2 characters")
        .max(6, "Code can be at most 6 characters")
        .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric"),
    }),
    promotionType: yup
      .mixed()
      .test("promotionType", "REQUIRED", (item: any) => item?.name),
    externalConditionNumber: yup.string().required("REQUIRED"),
    offerDescription: yup.string().required("REQUIRED"),
    priority: yup
      .string()
      .required("REQUIRED")
      .min(1, "priority must be at least 1 characters")
      .max(3, "priority can be at most 3 characters"),
  });

  // ** MayBe used in future
  // const isCodeUnique = (data: any, value: any) => {
  //   // When editing an existing item
  //   if (item.id) {
  //     // Check if there's another record with the same code and a different ID
  //     const matchingItem = data.find((record: any) => {
  //       return record.code === value && record.id !== item.id;
  //     });
  //     // If a matching item is found, it's not unique
  //     return !matchingItem;
  //   }

  //   // When creating a new item, check if the code is unique among all records
  //   return !data.some((record: any) => record.code === value);
  // };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: item,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("id", item?.id);
    setValue(
      "code",
      sequenceMapData?.autoGeneration && !item?.id
        ? "Auto Generated"
        : item?.code
    );
    setValue("name", item?.name);
    setValue("promotionType", item?.promotionTypes);
    setValue("altName", item?.altName);
    setValue("externalConditionNumber", item?.externalConditionNumber);
    setValue(
      "externalSalesConditionNumber",
      item?.externalSalesConditionNumber
    );
    setValue("offerDescription", item?.offerDescription);
    setValue("priority", item?.priority);
    setValue("createdBy", item?.createdBy);
    // setValue("createdOn", new Date(item?.createdOn).toLocaleString());
    setValue("updatedBy", item?.updatedBy);
    // setValue("updatedOn", new Date(item?.updatedOn).toLocaleString());
    setSwitchActive(item?.active);
  }, [item, setValue]);

  const handleCloseDrawer = () => {
    setOpen(false);
    reset();
    setItem(defaultValues);
    clearErrors();
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.active = switchActive;
    data.promotionHeaderColumnsMapping = dialogData;
    data.promotionType = data?.promotionType?.code;
    sequenceMapData?.autoGeneration && !data.id && delete data.code;
    if (!data.id) {
      res = await dispatch(externalPromotionHeaderCreate(data));
    } else {
      res = await dispatch(externalPromotionHeaderUpdate(data));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  return (
    <Card>
      <ConditionDataTable
        data={(externalPromotion?.data as []) ?? []}
        isLoading={externalPromotion.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        item={item}
        changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={item.id ? t("EDIT_CONDITION") : t("ADD_NEW")}
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={handleChange}
          >
            <div className={classes.formContent}>
              <CommonInput
                name="code"
                id="code"
                label="Code"
                required={!sequenceMapData?.autoGeneration}
                control={control}
                errors={errors}
                disabled={sequenceMapData?.autoGeneration}
                defaultValue={"Auto Generated"}
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
              <CommonSelect
                name="promotionType"
                options={externalPromotion?.lookUpData || []}
                control={control}
                label={"CONDITION_TYPE"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                defaultValue={[]}
                noOptionsText={false}
                clearErrors={clearErrors}
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

              <CommonInput
                name="externalConditionNumber"
                id="externalConditionNumber"
                label="external condition number"
                control={control}
                errors={errors}
                defaultValue={item.externalConditionNumber}
                required={true}
              />
              <CommonInput
                name="externalSalesConditionNumber"
                id="externalSalesConditionNumber"
                label="external sales condition number"
                control={control}
                errors={errors}
                defaultValue={item.externalSalesConditionNumber}
              />
              <CommonInput
                name="offerDescription"
                id="offerDescription"
                label="offer desc"
                control={control}
                errors={errors}
                defaultValue={item.offerDescription}
                required={true}
              />
              <CommonInput
                name="priority"
                id="priority"
                type="number"
                label="priority"
                control={control}
                errors={errors}
                defaultValue={item.priority}
                required={true}
              />
              <div>
                <ReusableCardDialog
                  cardHeaderTitle="Header Key Combinations"
                  dialogTitle={t("Attributes")}
                  subTitle={
                    "Assign multiple attributes to the particular header"
                  }
                  leftListItems={externalPromotionColumn?.data}
                  buttonTitle={"SELECT_ATTRIBUTES"}
                  viewButtonTitle={"VIEW_ATTRIBUTES"}
                  setDialogData={setDialogData}
                  item={item}
                  dialogViewTitle={"ASSIGNED_ATTRIBUTES"}
                />
              </div>

              {!item.id && (
                <div>
                  <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                    <CommonSwitch
                      active={switchActive}
                      setActive={setSwitchActive}
                      statusChange={() => ({})}
                    />{" "}
                    {switchActive ? t("ACTIVE") : t("INACTIVE")}
                  </div>
                </div>
              )}
              {item.id && (
                <>
                  <div>
                    <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                      <CommonSwitch
                        disabled={disabled}
                        active={switchActive}
                        statusChange={() => setSwitchActive(!switchActive)}
                      />
                      {switchActive ? t("ACTIVE") : t("INACTIVE")}
                    </div>
                    {disabled && (
                      <FormHelperText>Status Cannot be changed</FormHelperText>
                    )}
                  </div>
                </>
              )}
              <div className={classes.radioContainer}>
                <Controller
                  control={control}
                  name={`internalCustomer`}
                  defaultValue={true}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      label={t(Key(`Apply for Internal Customers`))}
                      control={<Checkbox checked={value} onChange={onChange} />}
                    />
                  )}
                />
              </div>
            </div>

            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={externalPromotion.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>
    </Card>
  );
};

export default Conditions;
