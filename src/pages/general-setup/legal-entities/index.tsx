import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RevestCodeFormValidator } from "src/@core/form-validator";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";
import LegalEntitiesDataTable from "src/components/generalSetup/stores/legalEntities/LegalEntitiesDatatable";
import { AppDispatch, RootState } from "src/store";
import {
  fetchBasicTaxdropdownchannel,
  fetchCoastingMethod,
  fetchEntityTypes,
  fetchlegalentitiescompanydropdown,
  fetchlegalentitiescountrydropdown,
  fetchlegalentitiescurrencydropdown,
  fetchlegalentitiespricelistdropdown,
  getLegalEntities,
  legalEntitiesCreate,
  legalEntitiesUpdate,
} from "src/store/apps/general-setup/legalEntities";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { useStyles } from "src/styles/viewEdit.style";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import AppEvent from "src/app/AppEvent";
import { getDate } from "src/utils/validationsMethods";
import { hours12 } from "src/@core/utils/format";
import CommonButton from "src/components/common/CommonButton";
import { legalEntitydefaultValues } from "src/types/forms/legalentity/legalEntitydefaultValues";
import AppStorage from "src/app/AppStorage";

const LegalEntities = () => {
  const [groupItem, setGroupItem] = useState(legalEntitydefaultValues);
  const [open, setOpen] = useState(false);
  const [Legalentities, setLegalentities] = useState<any>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>({});
  const [switchActive, setSwitchActive] = useState(true);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleCloseDrawer = () => {
    reset();
    setGroupItem(legalEntitydefaultValues);
    setOpen(false);
    clearErrors();
  };

  useEffect(() => {
    dispatch(getLegalEntities({}));
    dispatch(fetchlegalentitiescompanydropdown());
    dispatch(fetchBasicTaxdropdownchannel());
    dispatch(fetchlegalentitiescountrydropdown());
    dispatch(fetchlegalentitiespricelistdropdown());
    dispatch(fetchlegalentitiescurrencydropdown());
    dispatch(fetchEntityTypes());
    dispatch(fetchCoastingMethod());

    //  dispatch(
    //       sequenceMappingCodeSearch({ entityType: "PRODUCT_DIVISION_CODE" })
    //       );
  }, []);

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const handleEditPage = (id: string) => {
    setOpen(true);
    // setValue(
    //   "code",
    //   sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    // );
  };
  // A single call to useSelector fetching both pieces of state
  const {
    legalEntity,
    Company,
    country,
    priceList,
    currency,
    BasicTax,
    EntityTypes,
    coastingMethod,
  } = useSelector((state: RootState) => ({
    legalEntity: state.legalEntity,
    Company: state.legalEntity.Company,
    country: state.legalEntity.country,
    priceList: state.legalEntity.priceList,
    currency: state.legalEntity.currency,
    BasicTax: state.legalEntity.BasicTax,
    EntityTypes: state.legalEntity.EntityTypes,
    coastingMethod: state.legalEntity.coastingMethod,
  }));

  useEffect(() => {
    setLegalentities(legalEntity?.data);
  }, [legalEntity]);

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(legalEntity.data, groupItem),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isNameUnique(legalEntity.data, value);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isAltNameUnique(legalEntity.data, value);
      }),
    // Country: yup.object().shape({
    //   Country: yup.string().required("Country is Required"),
    // }),
    // entityType: yup.object().shape({
    //   name: yup.string().required("entityType is Required"),
    // }),
    // Company: yup.object().shape({
    //   name: yup.string().required("Company is Required"),
    // }),
    // BaseCurrency: yup
    //   .object()
    //   .shape({
    //     name: yup.string().nullable(true).required("BaseCurrency is Required"),
    //   })
    //   .required("BaseCurrency is Required"),
    // coastingMethod: yup
    //   .object()
    //   .shape({
    //     name: yup
    //       .string()
    //       .nullable(true)
    //       .required("coastingMethod is Required"),
    //   })
    //   .required("coastingMethod is Required"),
    // priceList: yup.object().shape({
    //   name: yup.string().required("priceList is Required"),
    // }),
    // Tax: yup.object().shape({
    //   name: yup.string().required("Tax is Required"),
    // }),
    // // priceList: yup.object().shape({
    // //   name: yup.string().required("Country is Required"),
    // // }),
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
    legalEntitydefaultValues: groupItem,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

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

  const isNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item
    if (!groupItem.id) {
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      let unique = data?.some((item: any) => {
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
    const currentItem = data?.find((record: any) => record.id === groupItem.id);
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
        record.id !== groupItem.id
      );
    });
    return !matchingItem;
  };

  const isAltNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item

    if (!groupItem.id) {
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
    const currentItem = data.find((record: any) => record.id === groupItem.id);
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
        record.id !== groupItem.id
      );
    });
    return !matchingItem;
  };

  const isCodeUnique = (data: any, value: any) => {
    // When editing an existing item
    if (groupItem.id) {
      // Check if there's another record with the same code and a different ID
      const matchingItem = data.find((record: any) => {
        return record.code === value && record.id !== groupItem.id;
      });
      // If a matching item is found, it's not unique
      return !matchingItem;
    }

    // When creating a new item, check if the code is unique among all records
    return !data.some((record: any) => record.code === value);
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any;
    data.active = switchActive;
    // console.log(data, "ddd");
    const payload: Record<string, any> = {
      code: data?.code,
      name: data?.name,
      altName: data?.altName,
      // country: data?.Country?.name,
      countryId: data?.Country?.id,
      active: switchActive,
      externalReference: data?.externalReference,
      priceListId: data?.priceList?.id,
      // priceList: data?.priceList?.name,
      // entityTypes: data?.entityTypes?.id,
      entityType: data?.entityType?.name,
      baseCurrencyId: data?.BaseCurrency?.id,
      // baseCurrency: data?.BaseCurrency?.name,
      CompaniesId: data?.Company?.id,
      // Companies: data?.Company?.altName,
      vatNumber: data?.vatNumber,
      // basicTax: data?.Tax?.code,
      basicTaxId: data?.Tax?.id,
      coastingMethod: data?.coastingMethod?.code,
      // coastingMethods: data?.coastingMethods?.id
    };

    sequenceMapData?.autoGeneration && !data.id && delete data.code;

    // console.log(payload, "ddddddddddddddddddddddddddddddddd");
    // debugger;
    if (data?.id) payload.id = data?.id;
    if (!data.id) {
      res = await dispatch(legalEntitiesCreate(payload));
    } else {
      res = await dispatch(legalEntitiesUpdate(payload));
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

  useEffect(() => {
    //console.log(groupItem, "groupItemgroupItemgroupItemgroupItem");

    setValue("code", groupItem?.code);
    setValue("name", groupItem?.name);
    setValue("altName", groupItem?.altName);
    setValue("externalReference", groupItem?.externalReference);
    setValue("vatNumber", groupItem?.vatNumber);
    setValue("entityType", groupItem?.entityType);
    setValue("Country", groupItem?.country?.altName);
    setValue("Company", groupItem?.company?.altName);
    setValue("BaseCurrency", groupItem?.baseCurrency?.altName);
    setValue("coastingMethod", groupItem?.coastingMethod);
    setValue("priceList", groupItem?.priceList?.name);
    setValue("Tax", groupItem?.basicTax?.altName);
    setValue("id", groupItem?.id);
    setSwitchActive(groupItem?.active);
  }, [groupItem, setValue]);

  const userProfileString: any = localStorage.getItem("userData");
  const userProfileData = JSON.parse(userProfileString);

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  return (
    <Card>
      <LegalEntitiesDataTable
        changeLanguage={changeLanguage}
        data={Legalentities}
        isLoading={legalEntity.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setGroupItem={setGroupItem}
        groupItem={groupItem}
      />
      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              groupItem.id ? t("EDIT_LEGAL_ENTITIES") : t("NEW_LEGAL_ENTITIES")
            }
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit)}
            onChange={handleChange}
          >
            <div className={classes.formContent}>
              <CommonInput
                name="code"
                id="code"
                label="Code"
                // required={!sequenceMapData?.autoGeneration}
                control={control}
                errors={errors}
                //disabled={sequenceMapData?.autoGeneration}
                defaultValue={"Auto Generated"}
              />

              <CommonInput
                name="name"
                id="name"
                label="Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={groupItem?.name} // Make sure groupItem is not undefined
              />

              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={groupItem.altName}
              />

              <Grid item md={6}>
                <CommonSelect
                  id={"entityType"}
                  control={control}
                  required={true}
                  customText={true}
                  clearErrors={clearErrors}
                  disabled={false}
                  defaultValue={""}
                  errors={errors}
                  label={"Entity type"}
                  name="entityType"
                  noOptionsText={true}
                  //options={["Owned", "Associate"]}
                  options={EntityTypes || []}
                  placeholder={t("SELECT")}
                  // validateForm={{}}
                  setSelectedFieldType={""}
                  setValue={setValue}
                  sx={{ width: 300 }}
                />
              </Grid>

              <Grid item md={6}>
                <CommonSelect
                  id={"COMPANY"}
                  control={control}
                  required={true}
                  customText={true}
                  clearErrors={clearErrors}
                  // disabled={true}
                  defaultValue={""}
                  errors={errors}
                  label={"Company"}
                  name="Company"
                  noOptionsText={true}
                  // options={[" "]}
                  options={Company || []}
                  // placeholder={t("SELECT")}
                  validateForm={{}}
                  setSelectedFieldType={""}
                  setValue={setValue}
                  sx={{ width: 300 }}
                />
              </Grid>

              <Grid item md={6}>
                <CommonSelect
                  id={"BASE_CURRENCY"}
                  control={control}
                  required={true}
                  customText={true}
                  clearErrors={clearErrors}
                  disabled={false}
                  defaultValue={""}
                  errors={errors}
                  label={"BaseCurrency"}
                  name="BaseCurrency"
                  noOptionsText={true}
                  //options={[" "]}
                  options={currency || []}
                  // placeholder={t("SELECT")}
                  validateForm={{}}
                  setSelectedFieldType={""}
                  setValue={setValue}
                  sx={{ width: 300 }}
                />
              </Grid>

              <Grid item md={6}>
                <CommonSelect
                  id={"COUNTRY"}
                  control={control}
                  required={true}
                  customText={true}
                  clearErrors={clearErrors}
                  disabled={false}
                  defaultValue={""}
                  errors={errors}
                  label={"Country"}
                  name="Country"
                  noOptionsText={true}
                  //options={[" "]}
                  options={country || []}
                  // placeholder={t("SELECT")}
                  validateForm={{}}
                  setSelectedFieldType={""}
                  setValue={setValue}
                  sx={{ width: 300 }}
                />
              </Grid>

              <Grid item md={6}>
                <CommonSelect
                  id={"PRICE_LIST"}
                  control={control}
                  required={true}
                  customText={true}
                  clearErrors={clearErrors}
                  disabled={false}
                  defaultValue={""}
                  errors={errors}
                  label={"priceList"}
                  name="priceList"
                  noOptionsText={true}
                  // options={[" "]}
                  options={priceList || []}
                  // placeholder={t("SELECT")}
                  validateForm={{}}
                  setSelectedFieldType={""}
                  setValue={setValue}
                  sx={{ width: 300 }}
                />
              </Grid>

              <Grid item md={6}>
                <CommonSelect
                  id={"TAX"}
                  control={control}
                  required={true}
                  customText={true}
                  clearErrors={clearErrors}
                  disabled={false}
                  defaultValue={""}
                  errors={errors}
                  label={"Tax"}
                  name="Tax"
                  noOptionsText={true}
                  // options={[" "]}
                  options={BasicTax || []}
                  // placeholder={t("SELECT")}
                  validateForm={{}}
                  setSelectedFieldType={""}
                  setValue={setValue}
                  sx={{ width: 300 }}
                />
              </Grid>

              <Grid item md={6}>
                <CommonSelect
                  id={"COASTING_METHOD"}
                  control={control}
                  required={true}
                  customText={true}
                  clearErrors={clearErrors}
                  disabled={false}
                  defaultValue={""}
                  errors={errors}
                  label={"coastingMethod"}
                  name="coastingMethod"
                  noOptionsText={true}
                  //options={[" "]}
                  options={coastingMethod || []}
                  // placeholder={t("SELECT")}
                  validateForm={{}}
                  setSelectedFieldType={""}
                  setValue={setValue}
                  sx={{ width: 300 }}
                />
              </Grid>

              <CommonInput
                name="vatNumber"
                id="vatNumber"
                label="VATNumber"
                control={control}
                errors={errors}
                defaultValue={groupItem.vatNumber}
              />

              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                control={control}
                errors={errors}
                defaultValue={groupItem.externalReference}
              />

              <div>
                <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                  {/* <span style={{ marginRight: 8 }}>Status:</span> Label added here */}
                  {groupItem?.id ? (
                    <CommonSwitch
                      active={switchActive}
                      setActive={setSwitchActive}
                      statusChange={() => setSwitchActive(!switchActive)}
                    />
                  ) : (
                    <CommonSwitch
                      active={switchActive}
                      setActive={setSwitchActive}
                      statusChange={() => ({})}
                    />
                  )}
                  {switchActive ? t("ACTIVE") : t("INACTIVE")}
                </div>
              </div>
            </div>

            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={legalEntity.isLoading}
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
                  {t("ENTITY_TYPE")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.entityType}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("COMPANY")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.company?.altName}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("BASE_CURRENCY")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.baseCurrency?.altName}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("COUNTRY")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.country?.altName}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("PRICE_LIST")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.priceList?.altName}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("TAX")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.basicTax?.altName}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("COSTING_METHOD")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.coastingMethods?.altName}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("VAT_NUMBER")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.vatNumber}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("STATUS")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.isActive ? t("ACTIVE") : t("INACTIVE")}
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

export default LegalEntities;
