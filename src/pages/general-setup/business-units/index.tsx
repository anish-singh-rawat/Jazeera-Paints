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
import { defaultValues } from "src/types/forms/generalSetup/orgTenant";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonButton from "src/components/common/CommonButton";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { hours12 } from "src/@core/utils/format";
import { useTranslation } from "react-i18next";
import AppStorage from "src/app/AppStorage";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import OrgGroupDataTable from "src/components/generalSetup/org-group/OrgGroupDataTable";
import CommonSelect from "src/components/common/CommonSelect";
import {
  createTenantGroup,
  fetchDeploymentModes,
  fetchGroupTenant,
  updateGroupTenant,
} from "src/store/apps/general-setup/enterpriseGroup";
import { currencyList } from "src/store/apps/general-setup/currency";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestDropDownValidator,
  RevestNameFormValidator,
} from "src/@core/form-validator";

const Groups = () => {
  const [groupTenant, setGroupTenant] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);

  let statusRes: any;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const enterpriseGroupStore: any = useSelector(
    (state: RootState) => state.groupTenant
  );
  const currencyStore: any = useSelector((state: RootState) => state.currency);

  useEffect(() => {
    dispatch(fetchGroupTenant({ data: "all" }));
    // ** Please add correct sequenceMapping code
    // dispatch(sequenceMappingCodeSearch({ entityType: "CUSTOMER_GROUP_CODE" }));
  }, []);

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  const handleEditPage = async (id: string) => {
    setOpen(true);
    // statusRes = await dispatch(customerGroupToggle({ id: id }));
    statusRes = await dispatch(currencyList({}));
    statusRes = await dispatch(fetchDeploymentModes({}));
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };

  const schema = yup.object().shape({
    code: RevestCodeFormValidator(enterpriseGroupStore.data, groupTenant),
    name: RevestNameFormValidator(enterpriseGroupStore.data, groupTenant),

    altName: RevestAltNameFormValidator(enterpriseGroupStore.data, groupTenant),
    reportingCurrency: yup.object().shape({
      name: yup.string().required("Required"),
    }),
    deploymentMode: yup
      .mixed()
      .test("deploymentMode", "REQUIRED", (groupTenant: any) =>
        RevestDropDownValidator(groupTenant)
      ),
    address: yup.string(),
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: groupTenant,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("id", groupTenant?.id);
    setValue("code", groupTenant?.code);
    setValue("name", groupTenant?.name);
    setValue("altName", groupTenant?.altName);
    setValue("reportingCurrency", groupTenant?.reportingCurrency);
    setValue("deploymentMode", groupTenant?.deploymentMode);
    setValue("address", groupTenant?.address);
    setValue("externalReference", groupTenant?.externalReference);
    setValue("createdBy", groupTenant?.createdBy);
    setValue("createdOn", new Date(groupTenant?.createdOn).toLocaleString());
    setValue("updatedBy", groupTenant?.updatedBy);
    setValue("updatedOn", new Date(groupTenant?.updatedOn).toLocaleString());
    setSwitchActive(groupTenant?.active);
  }, [groupTenant, setValue]);

  const handleCloseDrawer = () => {
    setOpen(false);
    reset();
    setGroupTenant(defaultValues);
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
    data.reportingCurrencyId = data.reportingCurrency?.id;
    data.deploymentMode = data.deploymentMode?.code;
    // sequenceMapData?.autoGeneration && !data.id && delete data.code;
    if (!data.id) {
      res = await dispatch(createTenantGroup(data));
    } else {
      res = await dispatch(updateGroupTenant(data));
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
      <OrgGroupDataTable
        data={enterpriseGroupStore.data ?? []}
        isLoading={enterpriseGroupStore.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setGroupTenant={setGroupTenant}
        groupTenant={groupTenant}
        changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={groupTenant.id ? t("EDIT_ORG_GROUP") : t("NEW_ORG_GROUP")}
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
                defaultValue={groupTenant.code}
              />
              <CommonInput
                name="name"
                id="name"
                label="Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={groupTenant.name}
              />

              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={groupTenant.altName}
              />
              <CommonSelect
                name="reportingCurrency"
                options={currencyStore.data}
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
                name="deploymentMode"
                options={enterpriseGroupStore.deploymentModes}
                control={control}
                label={"DEPLOYMENT_MODE"}
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
                defaultValue={groupTenant.altName}
              />
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="External Reference"
                control={control}
                errors={errors}
                defaultValue={groupTenant.externalReference}
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
              disabled={enterpriseGroupStore.isLoading}
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
                  {selectedViewRecord.reportingCurrency?.name}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("DEPLOYMENT_MODES")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.deploymentMode}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("ADDRESS")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.address}
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

export default Groups;
