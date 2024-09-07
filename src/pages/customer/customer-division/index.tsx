import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  customerDivisionCreate,
  customerDivisionSearch,
  customerDivisionToggle,
  customerDivisionUpdate,
} from "src/store/apps/dimensions/customer-division/customer_division";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { AppDispatch, RootState } from "src/store";
import CustomerDivisionDataTable from "src/components/dimentions/customer-division/CustomerDivisionDataTable";
import { Card, FormHelperText } from "@mui/material";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonInput from "src/components/common/CommonInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { defaultValues } from "src/types/forms/customerDivisionTypes";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonButton from "src/components/common/CommonButton";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { hours12 } from "src/@core/utils/format";
import { t } from "i18next";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import { RevestCodeFormValidator } from "src/@core/form-validator";

const Divisions = () => {
  const [divisionItem, setDivisionItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [customerDivisions, setCustomerDivisions] = useState([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [disabled, setDisabled] = useState(false);

  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  let statusRes: any;

  const customerDivision: any = useSelector(
    (state: RootState) => state.customerDivision
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    dispatch(customerDivisionSearch({ data: "all" }));
    dispatch(
      sequenceMappingCodeSearch({ entityType: "CUSTOMER_DIVISION_CODE" })
    );
  }, []);

  useEffect(() => {
    setCustomerDivisions(customerDivision?.data);
  }, [customerDivision]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const handleEditPage = async (id: string) => {
    setOpen(true);
    statusRes = await dispatch(customerDivisionToggle({ id: id }));
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

  const showErrors: any = (field: string, valueLen: number, min: number) => {
    if (valueLen === 0) {
      return `${field} field is required`;
    } else if (valueLen > 0 && valueLen < min) {
      return `${field} must be at least ${min} characters`;
    } else {
      return "";
    }
  };

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(customerDivision.data, divisionItem),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isNameUnique(customerDivision.data, value);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isAltNameUnique(customerDivision.data, value);
      }),
  });

  const isNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item
    if (!divisionItem.id) {
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
      (record: any) => record.id === divisionItem.id
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
        record.id !== divisionItem.id
      );
    });
    return !matchingItem;
  };

  const isAltNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item

    if (!divisionItem.id) {
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
      (record: any) => record.id === divisionItem.id
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
        record.id !== divisionItem.id
      );
    });
    return !matchingItem;
  };

  const isCodeUnique = (data: any, value: any) => {
    // When editing an existing item
    if (divisionItem.id) {
      // Check if there's another record with the same code and a different ID
      const matchingItem = data.find((record: any) => {
        return record.code === value && record.id !== divisionItem.id;
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
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: divisionItem,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue(
      "code",
      sequenceMapData?.autoGeneration && !divisionItem?.id
        ? "Auto Generated"
        : divisionItem?.code
    );
    setValue("name", divisionItem?.name);
    setValue("altName", divisionItem?.altName);
    setValue("externalReference", divisionItem?.externalReference);
    setValue("createdBy", divisionItem?.createdBy);
    setValue("createdOn", new Date(divisionItem?.createdOn).toLocaleString());
    setValue("updatedBy", divisionItem?.updatedBy);
    setValue("updatedOn", new Date(divisionItem?.updatedOn).toLocaleString());
    setValue("id", divisionItem?.id);
    setSwitchActive(divisionItem?.active);
  }, [divisionItem, setValue]);

  const handleCloseDrawer = () => {
    reset();
    setDivisionItem(defaultValues);
    setOpen(false);
    clearErrors();
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

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

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.active = switchActive;
    sequenceMapData?.autoGeneration && !data.id && delete data.code;
    if (!data.id) {
      res = await dispatch(customerDivisionCreate(data));
    } else {
      res = await dispatch(customerDivisionUpdate(data));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  return (
    <Card>
      <CustomerDivisionDataTable
        data={customerDivisions}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setDivisionItem={setDivisionItem}
        divisionItem={divisionItem}
        isLoading={customerDivision.isLoading}
        changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              divisionItem.id
                ? t("EDIT_CUSTOMER_DIVISION")
                : t("NEW_CUSTOMER_DIVISION")
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
                defaultValue={divisionItem.name}
              />

              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={divisionItem.altName}
              />
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                control={control}
                errors={errors}
                defaultValue={divisionItem.externalReference}
              />
              {!divisionItem.id && (
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
              {divisionItem.id && (
                <>
                  <div>
                    <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                      <CommonSwitch
                        disabled={disabled}
                        active={switchActive}
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
                      divisionItem.createdOn
                    ).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="createdBy"
                    id="createdBy"
                    label="Created By"
                    control={control}
                    errors={errors}
                    defaultValue={divisionItem.createdBy}
                    disabled={true}
                  />

                  <CommonInput
                    name="updatedOn"
                    id="updatedOn"
                    label="Modified date time"
                    control={control}
                    errors={errors}
                    defaultValue={new Date(
                      divisionItem.updatedOn
                    ).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="updatedBy"
                    id="updatedBy"
                    label="Modified By"
                    control={control}
                    errors={errors}
                    defaultValue={divisionItem.updatedBy}
                    disabled={true}
                  /> */}
                </>
              )}
            </div>
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={customerDivision?.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>

      <CommonDrawer
        open={viewOpen}
        toggle={viewToggle}
        // styles={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 500 } } }}
      >
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
              <div className={classes.viewContent_label}>{t("REFERENCE")}</div>
              <div className={classes.viewContent_value}>
                {selectedViewRecord.externalReference}
              </div>
            </div>
            <div className="">
              <div className={classes.viewContent_label}>{t("CREATED_ON")}</div>
              <div className={classes.viewContent_value}>
                {getDate(selectedViewRecord.createdOn)}
                {` | ${hours12(selectedViewRecord.createdOn)}`}
              </div>
            </div>
            <div className="">
              <div className={classes.viewContent_label}>{t("CREATED_BY")}</div>
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
      </CommonDrawer>
    </Card>
  );
};

export default Divisions;
