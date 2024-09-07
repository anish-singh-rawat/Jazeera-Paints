// ** React
import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "src/store";

// ** Redux
import { useDispatch, useSelector } from "react-redux";

// ** Components
import CommonCardWithHeader from "src/components/common/CommonCardWithHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import ContactSection from "./stores-setup/ContactSection";
import AdditionalSection from "./stores-setup/AdditionalSection";
import CustomFieldsSection from "./stores-setup/CustomFieldsSection";
import GeneralSection from "./stores-setup/GeneralSection";
import OrganisationSection from "./stores-setup/OrganisationSection";

// ** Yup
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// ** Translation
import { t } from "i18next";

// ** Next Import
import { useRouter } from "next/router";

// ** MUI
import { Card, Grid, Typography } from "@mui/material";

// ** Utils
import { Key } from "src/@core/layouts/utils";
import { phoneRegExp } from "src/constants/validation/regX";
import { validateDropdownItem } from "src/utils/validationsMethods";

// ** Styles
import { useStyles } from "src/styles/viewEdit.style";

// ** Default Values
import {
  StoreItemTypes,
  defaultValues,
} from "src/types/forms/storesSettings/storeType";

// ** APIs
import {
  businessUnit,
  companyByLegalEntityId,
  legalEntity,
  offlinePOS,
  storesCreate,
  storesTypes,
  storesUpdate,
  customerData,
  priceList,
} from "src/store/apps/storeSettings/storeSettings";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import {
  activeCustomerProfiles,
  customerProfiles,
} from "src/store/apps/customer-profile/customer_profile";
import {
  fetchCity,
  fetchDistrict,
  fetchRegion,
} from "src/store/apps/customers";

const StoresSetup = (props: any) => {
  const { setModTabVal, onStoreSetupSuccess } = props;
  // ** States
  const [storeItem, setStoreItem] = useState<StoreItemTypes>(defaultValues);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [legalEntityOption, setLegalEntityOption] = useState<any>("");
  const [regionId, setRegionId] = useState<any>("");
  const [cityId, setCityId] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceListManual, setIsPriceListManual] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  // ** Hooks
  const router = useRouter();
  const classes = useStyles();

  const storeSettingsStore: any = useSelector(
    (state: RootState) => state.storeSettingsStore
  );
  // console.log(storeSettingsStore, "storeSettingsStore");
  // console.log(storeItem, "storeItem");
  const customerProfile: any = useSelector(
    (state: RootState) => state.customerProfile
  );

  const store: any = useSelector((state: RootState) => state.customers);

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  useEffect(() => {
    // ** General Section APIs
    dispatch(storesTypes({}));
    //dispatch(customerProfiles());
    dispatch(activeCustomerProfiles());
    dispatch(offlinePOS({}));
    dispatch(sequenceMappingCodeSearch({ entityType: "STORE_CODE" }));
    // ** Organization Section APIs
    dispatch(businessUnit({}));
    // dispatch(legalEntity({}));
    dispatch(customerData({}));
    dispatch(priceList({}));
    dispatch(legalEntity(true));
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
  }, []);

  const countryId = storeSettingsStore?.company?.country?.id;

  // ** Contact Section APIs Start
  useEffect(() => {
    if (storeItem?.countryId || countryId)
      dispatch(
        fetchRegion({
          countryId: storeItem.id ? storeItem?.countryId || 0 : countryId,
        })
      );
  }, [storeItem.countryId, countryId]);

  useEffect(() => {
    if (regionId) {
      const payload = {
        countryId: storeItem.id ? storeItem?.countryId || 0 : countryId,
        regionId: regionId,
      };
      dispatch(fetchCity(payload));
    } else {
      setValue("city", "");
      setValue("district", "");
    }
  }, [regionId]);

  useEffect(() => {
    if (cityId) {
      const payload = {
        countryId: storeItem.id ? storeItem?.countryId || 0 : countryId,
        regionId: regionId,
        cityId: cityId,
      };
      dispatch(fetchDistrict(payload));
    } else {
      setValue("district", "");
    }
  }, [cityId, dispatch]);

  useEffect(() => {
    if (legalEntityOption) {
      dispatch(companyByLegalEntityId({ id: legalEntityOption }));
    }
  }, [legalEntityOption]);

  // ** Contact Section APIs End

  const schema: any = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : yup
          .string()
          .required("REQUIRED")
          .min(2, "CODE_MUST_BE_AT_LEAST_TWO_CHARACTERS")
          .max(6, "CODE_MUST_BE_AT_MOST_SIX_CHARACTERS")
          .matches(/^[a-zA-Z0-9]+$/, "CODE_MUST_BE_ALPHANUMERIC"),
    name: yup
      .string()
      .required("REQUIRED")
      .min(1, "Name must be at least 1 characters")
      // .max(25, "Name can be at most 25 characters")
      .matches(/^[a-zA-Z0-9 ]+$/, "Name must be alphanumeric only"),
    storeTypes: yup
      .mixed()
      .test("storeTypes", "REQUIRED", (item: any) =>
        validateDropdownItem(item)
      ),
    customerProfile: yup
      .mixed()
      .test("customerProfile", "REQUIRED", (item: any) => Boolean(item)),
    businessUnit: yup
      .mixed()
      .test("businessUnit", "REQUIRED", (item: any) =>
        validateDropdownItem(item)
      ),
    defaultCustomer: yup
      .mixed()
      .test("defaultCustomer", "REQUIRED", (item: any) =>
        validateDropdownItem(item)
      ),
    legalEntity: yup
      .mixed()
      .test("legalEntity", "REQUIRED", (item: any) =>
        validateDropdownItem(item)
      ),
    email: yup.string().email().required(),
    mobileNumber: yup
      .string()
      .required()
      .matches(phoneRegExp, "Phone number is not valid")
      .max(10, "Phone number is too long"),
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
    defaultValues: storeItem,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // ** Edit Flow - Getting DataById

  useEffect(() => {
    if (storeSettingsStore?.dataById?.id) {
      setStoreItem({ ...storeItem, ...storeSettingsStore?.dataById });
    }
  }, [storeSettingsStore?.dataById?.id]);

  // ** Edit Flow - Setting DataByName

  useEffect(() => {
    setValue("id", storeItem?.id);
    setValue("code", storeItem?.code);
    setValue("name", storeItem?.name);
    setValue("altName", storeItem?.altName);
    setValue("storeTypes", storeItem?.storeTypes);
    setValue("customerProfile", storeItem?.customerProfileSettings);
    setValue("offlinePOS", storeItem?.offlinePos);
    setValue("latitude", storeItem?.latitude);
    setValue("longitude", storeItem?.longitude);
    setValue("dateFormate", storeItem?.dateFormate);
    setValue("timeZone", storeItem?.timeZone);
    setSwitchActive(storeItem?.active);
    setValue("businessUnit", storeItem?.businessUnits);
    setValue("defaultCustomer", storeItem?.customer);
    setValue("legalEntity", storeItem?.legalEntity);
    // setValue("company", storeItem?.legalEntity?.company);
    setValue("company", storeItem?.company);
    setValue("currency", storeItem?.currency);
    setValue("entityType", storeItem?.entityType);
    setValue("email", storeItem?.email);
    setValue("mobileNumber", storeItem?.mobileNumber);
    setValue("fax", storeItem?.fax);
    setValue("country", storeItem?.country);
    setValue("region", storeItem?.region);
    setValue("city", storeItem?.city);
    setValue("district", storeItem?.district);
    setValue("address", storeItem?.address);
    setValue("externalReference", storeItem?.externalReference);
    setValue("externalCustomerCode", storeItem?.externalCustomerCode);
    setValue("externalCostCenter", storeItem?.externalCostCenter);
    setValue("createdBy", storeItem?.createdBy);
    setValue("createdOn", new Date(storeItem?.createdOn).toLocaleString());
    setValue("updatedBy", storeItem?.updatedBy);
    setValue("updatedOn", new Date(storeItem?.updatedOn).toLocaleString());
    setValue("vatNumber", storeItem?.vatNumber);
    setValue("priceList", storeItem?.priceList);
    if (storeItem?.priceListId === storeSettingsStore?.company?.priceList?.id) {
      setIsPriceListManual(false);
    }
  }, [storeItem, setValue]);

  useEffect(() => {
    if (legalEntityOption) {
      setValue("company", storeSettingsStore?.company?.company);
      setValue("currency", storeSettingsStore?.company?.baseCurrency?.name);
      setValue("country", storeSettingsStore?.company?.country?.name);
      setValue("entityType", storeSettingsStore?.company?.entityType);
      setValue("vatNumber", storeSettingsStore?.company?.vatNumber);
      const priceListAvailable = !!storeSettingsStore?.company?.priceList;
      // setValue("priceList", storeSettingsStore?.company?.priceList);
      setIsPriceListManual(!priceListAvailable);
      if (!isPriceListManual) {
        // If the checkbox indicates automatic handling, set the priceList
        setValue("priceList", storeSettingsStore?.company?.priceList);
      }
    } else {
      setValue("company", "");
      setValue("currency", "");
      setValue("country", "");
      setValue("entityType", "");
      setValue("region", "");
      setValue("city", "");
      setValue("district", "");
      setValue("vatNumber", "");
      setValue("priceList", "");
      setIsPriceListManual(true);
    }
  }, [legalEntityOption, storeSettingsStore?.company]);

  useEffect(() => {
    if (!isPriceListManual && storeItem?.legalEntity) {
      setValue("priceList", storeSettingsStore?.company?.priceList);
    }
  }, [isPriceListManual, storeSettingsStore?.company]);

  const handleCloseDrawer = () => {
    reset();
    setStoreItem(defaultValues);
    clearErrors();
    // storeItem?.id ? router.back() : setModTabVal(2);
    setModTabVal(2);
  };

  const handleCancel = () => {
    reset();
    setStoreItem(defaultValues);
    clearErrors();
    router.back();
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  const onSubmit = async (data: any, event: any) => {
    console.log(data, "data");
    event.preventDefault();
    const {
      code,
      name,
      altName,
      dateFormate,
      email,
      mobileNumber,
      street,
      basicTaxId,
      // customerId,
      customerProfileSettingId,
      fax,
      address,
      entityType,
      externalReference,
      externalCustomerCode,
      externalCostCenter,
      latitude,
      longitude,
      vatNumber,
    } = data;

    let payload: any = {
      id: data.id,
      tenantId: 0,
      businessUnitId: data?.businessUnit?.id,
      code,
      name,
      altName,
      dateFormate,
      mobileNumber,
      email,
      street,
      companyId: [storeSettingsStore?.company?.company][0]?.id || 0,
      countryId: [storeSettingsStore?.company?.country][0]?.id || 0,
      currencyId: [storeSettingsStore?.company?.baseCurrency][0]?.id || 0,
      customerProfileSettingId: data?.customerProfile?.id,
      regionId: data?.region?.id,
      districtId: data?.district?.id,
      cityId: data?.city?.id,
      externalCustomerCode,
      externalCostCenter,
      externalReference,
      storeTypes: {
        id: data?.storeTypes?.id,
      },
      basicTaxId,
      // customerId,
      customerId: data?.defaultCustomer?.id,
      offlinePosId: data?.offlinePOS?.id,
      dateFormat: data?.dateFormate?.name,
      timeZone: "",
      legalEntityId: data?.legalEntity?.id,
      entityType,
      fax,
      address,
      active: switchActive,
      latitude,
      longitude,
      vatNumber,
      priceListId: data?.priceList?.id,
    };
    let res: any = {};
    sequenceMapData?.autoGeneration && !data.id && delete data.code;
    if (!data.id) {
      res = await dispatch(storesCreate(payload));
    } else {
      res = await dispatch(storesUpdate(payload));
    }

    if (res?.payload?.message) {
      onStoreSetupSuccess(res?.payload?.name, res?.payload?.altName);
      handleCloseDrawer();
    }
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  return (
    <>
      {/* header card as of now commenting*/}
      {/* <Card style={{marginBottom:'20px'}}>
        <Grid container display={"flex"} flexDirection={"column"} sx={{ p: 6 }}>
          <Typography variant={"h6"}>{t(Key("STORE_SETUP"))}</Typography>
          <Typography variant="body2">
            {t(Key("NAME_ADDRESS_CONTACT"))}
          </Typography>
        </Grid>
      </Card> */}
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit, onErrors)}
        onChange={handleChange}
      >
        <CommonCardWithHeader
          header={t("GENERAL")}
          height={"50px"}
          component={
            <GeneralSection
              clearErrors={clearErrors}
              errors={errors}
              setValue={setValue}
              control={control}
              storeSettingsStore={storeSettingsStore}
              customerProfile={customerProfile}
              sequenceMapData={sequenceMapData}
              switchActive={switchActive}
              setSwitchActive={setSwitchActive}
            />
          }
        />
        <CommonCardWithHeader
          header={t("ORGANIZATION")}
          height={"50px"}
          component={
            <OrganisationSection
              clearErrors={clearErrors}
              errors={errors}
              setValue={setValue}
              control={control}
              storeSettingsStore={storeSettingsStore}
              setLegalEntityOption={setLegalEntityOption}
              isPriceListManual={isPriceListManual}
              setIsPriceListManual={setIsPriceListManual}
            />
          }
        />
        <CommonCardWithHeader
          header={t("CONTACT")}
          height={"50px"}
          component={
            <ContactSection
              clearErrors={clearErrors}
              errors={errors}
              setValue={setValue}
              control={control}
              store={store}
              setRegionId={setRegionId}
              setCityId={setCityId}
            />
          }
        />
        <CommonCardWithHeader
          header={t("ADDITIONAL")}
          height={"50px"}
          component={
            <AdditionalSection
              clearErrors={clearErrors}
              errors={errors}
              setValue={setValue}
              control={control}
            />
          }
        />
        {/* <CommonCardWithHeader
          header={t("CUSTOM_FIELDS")}
          height={"50px"}
          component={
            <CustomFieldsSection
              clearErrors={clearErrors}
              errors={errors}
              setValue={setValue}
              control={control}
            />
          }
        /> */}
        <Card
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <CommonFormActionButtons
            handleCloseDrawer={handleCancel}
            disabled={isLoading}
          />
        </Card>
      </form>
    </>
  );
};

export default StoresSetup;
