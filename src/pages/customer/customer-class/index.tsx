import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card, FormHelperText } from "@mui/material";
import { defaultValues } from "src/types/forms/customerClassTypes";
import CommonDrawer from "src/components/common/CommonDrawer";
import {
  customerClassCreate,
  customerClassSearch,
  customerClassToggle,
  customerClassUpdate,
} from "src/store/apps/customers/customers-class/customer_class";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import CustomerClassDataTable from "src/components/customers/customers-class/CustomerClassDataTable";
import CommonButton from "src/components/common/CommonButton";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { hours12 } from "src/@core/utils/format";
import { useTranslation } from "react-i18next";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { RevestCodeFormValidator } from "src/@core/form-validator";

const CustomerClass = () => {
  const [customerClassItem, setCustomerClassItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [customerClasses, setCustomerClasses] = useState([]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const classes = useStyles();
  const { t } = useTranslation();
  const customerClass: any = useSelector(
    (state: RootState) => state.customerClass
  );
  const dispatch = useDispatch<AppDispatch>();

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(customerClass.data, customerClassItem),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isNameUnique(customerClass.data, value);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isAltNameUnique(customerClass.data, value);
      }),
  });

  const isNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item
    if (!customerClassItem.id) {
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      let unique = data.some((item: any) => {
        const lowercaseItemName = item?.name?.toLowerCase();
        const uppercaseItemName = item?.name?.toUpperCase();
        return (
          lowercaseItemName === lowercaseValue ||
          uppercaseItemName === uppercaseValue
        );
      });
      return !unique;
    }
    // When editing an existing item, check for uniqueness among other records
    const currentItem = data.find(
      (record: any) => record.id === customerClassItem.id
    );
    if (!currentItem) {
      return true; // The current item doesn't exist in the data, so it's effectively unique.
    }
    const matchingItem = data.find((record: any) => {
      const lowercaseItemName = record?.name?.toLowerCase();
      const uppercaseItemName = record?.name?.toUpperCase();
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      return (
        (lowercaseItemName === lowercaseValue ||
          uppercaseItemName === uppercaseValue) &&
        record.id !== customerClassItem.id
      );
    });
    return !matchingItem;
  };

  const isAltNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item

    if (!customerClassItem.id) {
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      let unique = data.some((item: any) => {
        const lowercaseItemAltName = item?.altName?.toLowerCase();
        const uppercaseItemAltName = item?.altName?.toUpperCase();
        return (
          lowercaseItemAltName === lowercaseValue ||
          uppercaseItemAltName === uppercaseValue
        );
      });
      return !unique;
    }
    // When editing an existing item, check for uniqueness among other records
    const currentItem = data.find(
      (record: any) => record.id === customerClassItem.id
    );
    if (!currentItem) {
      return true; // The current item doesn't exist in the data, so it's effectively unique.
    }
    const matchingItem = data.find((record: any) => {
      const lowercaseItemAltName = record?.altName?.toLowerCase();
      const uppercaseItemAltName = record?.altName?.toUpperCase();
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      return (
        (lowercaseItemAltName === lowercaseValue ||
          uppercaseItemAltName === uppercaseValue) &&
        record.id !== customerClassItem.id
      );
    });
    return !matchingItem;
  };

  const isCodeUnique = (data: any, value: any) => {
    // When editing an existing item
    if (customerClassItem.id) {
      // Check if there's another record with the same code and a different ID
      const matchingItem = data.find((record: any) => {
        return record.code === value && record.id !== customerClassItem.id;
      });
      // If a matching item is found, it's not unique
      return !matchingItem;
    }

    // When creating a new item, check if the code is unique among all records
    return !data.some((record: any) => record.code === value);
  };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: customerClassItem,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleEditPage = async (id: string) => {
    setOpen(true);
    statusRes = await dispatch(customerClassToggle({ id: id }));
    statusRes?.payload?.message ? setDisabled(false) : setDisabled(true);
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    dispatch(customerClassSearch({}));
    dispatch(sequenceMappingCodeSearch({ entityType: "CUSTOMER_CLASS_CODE" }));
  }, []);

  const handleCloseDrawer = () => {
    reset();
    setCustomerClassItem(defaultValues);
    setOpen(false);
    clearErrors();
  };

  useEffect(() => {
    setValue(
      "code",
      sequenceMapData?.autoGeneration && !customerClassItem?.id
        ? "Auto Generated"
        : customerClassItem?.code
    );
    setValue("name", customerClassItem?.name);
    setValue("altName", customerClassItem?.altName);
    setValue("externalReference", customerClassItem?.externalReference);
    setValue("createdBy", customerClassItem?.createdBy);
    setValue(
      "createdOn",
      new Date(customerClassItem?.createdOn).toLocaleString()
    );
    setValue("updatedBy", customerClassItem?.updatedBy);
    setValue(
      "updatedOn",
      new Date(customerClassItem?.updatedOn).toLocaleString()
    );
    setValue("id", customerClassItem?.id);
    setSwitchActive(customerClassItem?.active);
  }, [customerClassItem, setValue]);

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };
  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  useEffect(() => {
    setCustomerClasses(customerClass?.data);
  }, [customerClass]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  // function for Date formate
  const getDate = (date: any) => {
    const startDate = new Date(date);
    const [month, day, year] = [
      startDate.getMonth(),
      startDate.getDate(),
      startDate.getFullYear(),
    ];

    return `${day >= 10 ? day : "0" + day}-${
      month >= 10 ? month + 1 : "0" + (month + 1)
    }-${year}`;
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.active = switchActive;
    sequenceMapData?.autoGeneration && !data.id && delete data.code;
    if (!data.id) {
      res = await dispatch(customerClassCreate(data));
    } else {
      res = await dispatch(customerClassUpdate(data));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  let statusRes: any;

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  return (
    <Card>
      <CustomerClassDataTable
        data={customerClasses}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setCustomerClassItem={setCustomerClassItem}
        customerClassItem={customerClassItem}
        isLoading={customerClass?.isLoading}
        changeLanguage={changeLanguage}
      />

      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              customerClassItem.id
                ? t("EDIT_CUSTOMER_CLASS")
                : t("NEW_CUSTOMER_CLASS")
            }
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
                label="CODE"
                required={!sequenceMapData?.autoGeneration}
                control={control}
                errors={errors}
                disabled={sequenceMapData?.autoGeneration}
                defaultValue={"Auto Generated"}
              />
              <CommonInput
                name="name"
                id="name"
                label="NAME"
                required={true}
                control={control}
                errors={errors}
                defaultValue={customerClassItem.name}
              />

              <CommonInput
                name="altName"
                id="altName"
                label="ALTERNATE_NAME"
                required={true}
                control={control}
                errors={errors}
                defaultValue={customerClassItem.altName}
              />
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="REFERENCE"
                control={control}
                errors={errors}
                defaultValue={customerClassItem.externalReference}
              />
              {!customerClassItem.id && (
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
              {customerClassItem.id && (
                <>
                  <div>
                    <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                      <CommonSwitch
                        active={switchActive}
                        disabled={disabled}
                        // setActive={
                        //   statusRes?.payload?.error?.message ? "" : setSwitchActive
                        // }
                        // checkSuccess={true}
                        statusChange={() => setSwitchActive(!switchActive)}
                      />
                      {switchActive ? t("ACTIVE") : t("INACTIVE")}
                    </div>
                    {disabled && (
                      <FormHelperText>Status Cannot be changed</FormHelperText>
                    )}
                  </div>
                  {/* <CommonInput
                    name="createdOn"
                    id="createdOn"
                    label="Created date time"
                    control={control}
                    errors={errors}
                    defaultValue={new Date(
                      customerClassItem.createdOn
                    ).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="createdBy"
                    id="createdBy"
                    label="Created By"
                    control={control}
                    errors={errors}
                    defaultValue={customerClassItem.createdBy}
                    disabled={true}
                  />

                  <CommonInput
                    name="updatedOn"
                    id="updatedOn"
                    label="Modified date time"
                    control={control}
                    errors={errors}
                    defaultValue={new Date(
                      customerClassItem.updatedOn
                    ).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="updatedBy"
                    id="updatedBy"
                    label="Modified By"
                    control={control}
                    errors={errors}
                    defaultValue={customerClassItem.updatedBy}
                    disabled={true}
                  /> */}
                </>
              )}
            </div>
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={customerClass?.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>

      <CommonDrawer
        open={viewOpen}
        toggle={viewToggle}
        // styles={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
      >
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
                <div className={classes.viewContent_label}>
                  {t("REFERENCE")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.externalReference}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("CREATED_ON")}
                </div>
                <div className={classes.viewContent_value}>
                  {getDate(selectedViewRecord.createdOn)}
                  {` | ${hours12(selectedViewRecord.createdOn)}`}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("CREATED_BY")}
                </div>
                <div className={classes.viewContent_value}>
                  {`${
                    selectedViewRecord.createdByUser
                      ? selectedViewRecord.createdByUser?.firstName
                      : "-"
                  } ${
                    selectedViewRecord.createdByUser?.lastName
                      ? selectedViewRecord.createdByUser?.lastName
                      : ""
                  }`}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("MODIFIED_ON")}
                </div>
                <div className={classes.viewContent_value}>
                  {getDate(selectedViewRecord.updatedOn)}
                  {` | ${hours12(selectedViewRecord.updatedOn)}`}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {" "}
                  {t("MODIFIED_BY")}
                </div>
                <div className={classes.viewContent_value}>
                  {`${
                    selectedViewRecord.updatedByUser
                      ? selectedViewRecord.updatedByUser?.firstName
                      : "-"
                  } ${
                    selectedViewRecord.updatedByUser?.lastName
                      ? selectedViewRecord.updatedByUser?.lastName
                      : ""
                  }`}
                </div>
              </div>
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
  );
};

export default CustomerClass;
