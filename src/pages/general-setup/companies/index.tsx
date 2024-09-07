import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Card, FormHelperText } from "@mui/material";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonInput from "src/components/common/CommonInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { defaultValues } from "src/types/forms/generalSetup/companyTypes";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonButton from "src/components/common/CommonButton";
import CustomerGroupDataTable from "src/components/customers/group/CustomerGroupDataTable";
import {
  customerGroupCreate,
  customerGroupSearch,
  customerGroupToggle,
  customerGroupUpdate,
} from "src/store/apps/customers/group/customer_group";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { hours12 } from "src/@core/utils/format";
import { useTranslation } from "react-i18next";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import OrgGroupDataTable from "src/components/generalSetup/org-group/OrgGroupDataTable";
import CommonSelect from "src/components/common/CommonSelect";
import CompanyDataTable from "src/components/generalSetup/company/CompanyDataTable";
import {
  fetchCompany,
  createCompany,
  fetchCompanyType,
  updateCompany,
} from "src/store/apps/general-setup/company";
import { currencyList } from "src/store/apps/general-setup/currency";
import { fetchGroupTenant } from "src/store/apps/general-setup/enterpriseGroup";
import { RevestCodeFormValidator } from "src/@core/form-validator";
import { log } from "console";

const Companies = () => {
  const [selectedCompany, setSelectedCompany] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [disabled, setDisabled] = useState(false);

  let statusRes: any;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const currencies: any = useSelector((state: RootState) => state.currency);
  const companyStore: any = useSelector((state: RootState) => state.company);
  const groupTenantStore: any = useSelector(
    (state: RootState) => state.groupTenant
  );

  useEffect(() => {
    dispatch(fetchCompany({ data: "all" }));
    // dispatch(sequenceMappingCodeSearch({ entityType: "CUSTOMER_GROUP_CODE" }));
  }, []);

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  // useEffect(() => {
  //   setCustomerGroups(customerGroup?.data);
  // }, [customerGroup]);

  // useEffect(() => {
  //   setSequenceMapData(sequenceMappingCode?.data);
  // }, [sequenceMappingCode]);

  const handleEditPage = async (id: string) => {
    setOpen(true);
    // statusRes = await dispatch(customerGroupToggle({ id: id }));
    statusRes = await dispatch(currencyList({}));
    statusRes = await dispatch(fetchCompanyType({}));
    statusRes = await dispatch(fetchGroupTenant({active:true}));
    statusRes?.payload?.message ? setDisabled(false) : setDisabled(true);
    // setValue(
    //   "code",
    //   sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    // );
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
    }
    // else if (valueLen > 0 && valueLen < min) {
    //   return `${field} must be at least ${min} characters`;
    // } else {
    //   return "";
    // }
  };

  const schema = yup.object().shape({
    code: RevestCodeFormValidator(companyStore.data, selectedCompany),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isNameUnique(companyStore.data, value);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isAltNameUnique(companyStore.data, value);
      }),
    reportingCurrency: yup.object().shape({
      name: yup.string().required("Required"),
    }),
    companyType: yup.object().shape({
      name: yup.string().required("Required"),
    }),
    tenant: yup.object().shape({
      name: yup.string().required("Required"),
    }),
    address: yup.string(),
  });

  const isNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item
    if (!selectedCompany.id) {
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
      (record: any) => record.id === selectedCompany.id
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
        record.id !== selectedCompany.id
      );
    });
    return !matchingItem;
  };

  const isAltNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item

    if (!selectedCompany.id) {
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
      (record: any) => record.id === selectedCompany.id
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
        record.id !== selectedCompany.id
      );
    });
    return !matchingItem;
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
    defaultValues: selectedCompany,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue(
      "code",
      sequenceMapData?.autoGeneration && !selectedCompany?.id
        ? "Auto Generated"
        : selectedCompany?.code
    );
    setValue("name", selectedCompany?.name);
    setValue("altName", selectedCompany?.altName);
    setValue("externalReference", selectedCompany?.externalReference);
    setValue("companyType", selectedCompany?.companyType);
    setValue("reportingCurrency", selectedCompany?.reportingCurrency);
    setValue("createdBy", selectedCompany?.createdBy);
    setValue("tenant", selectedCompany?.tenant);
    setValue(
      "createdOn",
      new Date(selectedCompany?.createdOn).toLocaleString()
    );
    setValue("updatedBy", selectedCompany?.updatedBy);
    setValue(
      "updatedOn",
      new Date(selectedCompany?.updatedOn).toLocaleString()
    );
    setValue("id", selectedCompany?.id);
    setValue("address", selectedCompany?.address);
    setSwitchActive(selectedCompany?.active);
  }, [selectedCompany, setValue]);

  const handleCloseDrawer = () => {
    setOpen(false);
    reset();
    setSelectedCompany(defaultValues);
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

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.active = switchActive;
    data.tenantId = data.tenant.id;
    data.reportingCurrencyId = data.reportingCurrency.id;
    data.companyType = data.companyType.code;
    if (!data.id) {
      res = await dispatch(createCompany(data));
    } else {
      res = await dispatch(updateCompany(data));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
    AppEvent.messageEmit({
      type: res?.payload?.message ? "success" : "error",
      message: res?.payload?.message
        ? res?.payload?.message
        : res?.payload?.error?.message,
    });
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  return (
    <Card>
      <CompanyDataTable
        data={companyStore.data}
        isLoading={companyStore.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setSelectedCompany={setSelectedCompany}
        selectedCompany={selectedCompany}
        changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={selectedCompany.id ? t("EDIT_COMPANY") : t("NEW_COMPANY")}
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
                required={true}
                control={control}
                errors={errors}
                defaultValue={selectedCompany.code}
              />
              <CommonInput
                name="name"
                id="name"
                label="Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={selectedCompany.name}
              />

              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={selectedCompany.altName}
              />
              <CommonSelect
                name="reportingCurrency"
                options={currencies.data}
                control={control}
                label={"REPORTING_CURRENCY"}
                // placeholder={"Select type of permission"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                noOptionsText={false}
                clearErrors={clearErrors}
                active={true}
                // defaultValue={t("ALL")}
              />
              <CommonSelect
                name="companyType"
                options={companyStore.companyTypes}
                control={control}
                label={"COMPANY_TYPE"}
                // placeholder={"Select type of permission"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                noOptionsText={false}
                clearErrors={clearErrors}
                active={true}
                // defaultValue={t("ALL")}
              />

              <CommonSelect
                name="tenant"
                options={groupTenantStore?.data || []}
                control={control}
                label={"GROUP"}
                // placeholder={"Select type of permission"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                noOptionsText={false}
                clearErrors={clearErrors}
                active={true}
                // defaultValue={t("ALL")}
              />
              <CommonInput
                name="address"
                id="address"
                label="Address"
                // required={true}
                control={control}
                errors={errors}
                defaultValue={selectedCompany.address}
              />
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="External Reference"
                control={control}
                errors={errors}
                defaultValue={selectedCompany.externalReference}
              />

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
            </div>

            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={companyStore.isLoading}
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
                  {t("REPORTING_CURRENCY")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.externalReference}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("COMPANY_TYPE")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.externalReference}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("GROUP")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.externalReference}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("ADDRESS")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.externalReference}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("EXTERNAL_REFERENCE")}
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
                    selectedViewRecord?.createdByUser?.firstName
                      ? selectedViewRecord?.createdByUser?.firstName
                      : "-"
                  } ${
                    selectedViewRecord?.createdByUser?.lastName
                      ? selectedViewRecord?.createdByUser?.lastName
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
                  {t("MODIFIED_BY")}
                </div>
                <div className={classes.viewContent_value}>
                  {`${
                    selectedViewRecord?.updatedByUser?.firstName
                      ? selectedViewRecord?.updatedByUser?.firstName
                      : "-"
                  } ${
                    selectedViewRecord?.updatedByUser?.lastName
                      ? selectedViewRecord?.updatedByUser?.lastName
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

export default Companies;
