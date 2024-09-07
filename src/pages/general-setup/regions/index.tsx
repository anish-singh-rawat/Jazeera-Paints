import { yupResolver } from "@hookform/resolvers/yup";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getDateFormate, hours12 } from "src/@core/utils/format";
import AppStorage from "src/app/AppStorage";
import CommonButton from "src/components/common/CommonButton";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import { AppDispatch, RootState } from "src/store";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { defaultValues } from "src/types/forms/customerGroupTypes";
import * as yup from "yup";

// Styles
import { isValid } from "date-fns";
import RegionsDataTable from "src/components/generalSetup/regions/regionsDataTable";
import { fetchCountry } from "src/store/apps/customers";
import {
  createNewRegion,
  getRegionList,
  patchRegion,
} from "src/store/apps/regions";
import { useStyles } from "src/styles/viewEdit.style";
import { validateDropdownItem } from "src/utils/validationsMethods";
import CommonSelect from "src/components/common/CommonSelect";

type RegionType = {
  active: boolean;
  altName: string;
  code: string;
  company: null;
  companyId: number;
  country: {
    id: number;
    uuid: string;
    code: string;
    name: string;
    altName: string;
  };
  countryId: number;
  createdBy: string;
  createdByUser: {
    id: number;
    uuid: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
  };
  createdOn: string;
  deletedByUser: null;
  error: null;
  externalReference: string;
  id: number;
  legalEntityId: number;
  message: string;
  name: string;
  tenant: null;
  tenantId: number;
  totalCustomers: string;
  updatedBy: string;
  updatedByUser: {
    id: number;
    uuid: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
  };
  updatedOn: string;
  uuid: string;
};

const Regions = () => {
  const [groupItem, setGroupItem] = useState<RegionType>({});
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [regions, setRegions] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  let statusRes: any;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const allRegions: any = useSelector((state: RootState) => state.regions);

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );
  const countries: any = useSelector(
    (state: RootState) => state?.customers?.countries
  );

  useEffect(() => {
    async function fetch() {
      const data = await dispatch(getRegionList());

      if (Array.isArray(data.payload.data)) setRegions(data.payload.data);

      dispatch(sequenceMappingCodeSearch({ entityType: "REGION" }));
    }

    fetch().catch(console.error);
  }, []);

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const handleEditPage = async (id: string) => {
    setOpen(true);
    await dispatch(fetchCountry());
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
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : yup
          .string()
          .test("unique-code", "code already exists", function (value) {
            return isCodeUnique(regions.data, value);
          }),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isNameUnique(regions.data, value);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isAltNameUnique(regions.data, value);
      }),
    country: yup
      .mixed()
      .test("country", "REQUIRED", (item: any) => validateDropdownItem(item)),
  });

  const isNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item
    if (!groupItem.id) {
      const lowercaseValue = value?.toLowerCase();
      const uppercaseValue = value?.toUpperCase();
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
      const lowercaseValue = value?.toLowerCase();
      const uppercaseValue = value?.toUpperCase();
      let unique = data?.some((item: any) => {
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
    const currentItem = data?.find((record: any) => record.id === groupItem.id);
    if (!currentItem) {
      return true; // The current item doesn't exist in the data, so it's effectively unique.
    }
    const matchingItem = data?.find((record: any) => {
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
      const matchingItem = data?.find((record: any) => {
        return record.code === value && record.id !== groupItem.id;
      });
      // If a matching item is found, it's not unique
      return !matchingItem;
    }

    // When creating a new item, check if the code is unique among all records
    return !data?.some((record: any) => record.code === value);
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
    defaultValues: groupItem,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue(
      "code",
      sequenceMapData?.autoGeneration && !groupItem?.id
        ? "Auto Generated"
        : groupItem?.code
    );
    setValue("name", groupItem?.name);
    setValue("altName", groupItem?.altName);
    setValue("externalReference", groupItem?.externalReference);
    // setValue(
    //   "createdBy",
    //   `${groupItem?.createdByUser?.firstName} ${groupItem?.createdByUser?.lastName}`
    // );
    // setValue(
    //   "createdOn",
    //   getDateFormate(groupItem?.createdOn)
    //     ? new Date(groupItem?.createdOn).toLocaleString()
    //     : ""
    // );
    // setValue(
    //   "updatedBy",
    //   `${groupItem?.updatedByUser?.firstName} ${groupItem?.updatedByUser?.lastName}`
    // );
    // setValue(
    //   "updatedOn",
    //   isValid(groupItem?.updatedOn)
    //     ? new Date(groupItem?.updatedOn).toLocaleString()
    //     : ""
    // );
    setValue("id", groupItem?.id);
    setValue("country", groupItem?.country?.name as unknown as any);
    setSwitchActive(groupItem?.active);
  }, [groupItem, setValue]);

  const handleCloseDrawer = () => {
    setOpen(false);
    reset();
    setGroupItem(defaultValues);
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
    const payload: Record<string, any> = {
      name: data?.name,
      altName: data?.altName,
      countryId: data?.country?.id,
      active: switchActive,
      externalReference: data?.externalReference,
    };

    sequenceMapData?.autoGeneration && !data.id && delete data.code;

    if (!sequenceMapData?.autoGeneration) payload.code = data?.code;

    if (data?.id) payload.id = data?.id;

    if (!data.id) {
      res = await dispatch(createNewRegion(payload));
    } else {
      res = await dispatch(patchRegion(payload));
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
      <RegionsDataTable
        data={allRegions?.data}
        isLoading={allRegions.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setGroupItem={setGroupItem}
        groupItem={groupItem}
        changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={groupItem.id ? t("EDIT_REGION") : t("NEW_REGION")}
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
                defaultValue={groupItem.name}
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
              <CommonSelect
                name="country"
                options={countries || []}
                control={control}
                label={"Country"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                defaultValue={groupItem.id ? groupItem.country : null}
                noOptionsText={false}
                clearErrors={clearErrors}
              />

              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                control={control}
                errors={errors}
                defaultValue={groupItem.externalReference}
              />
              {!groupItem.id && (
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
              {!!groupItem?.id && (
                <>
                  <div>
                    <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                      <CommonSwitch
                        active={switchActive}
                        // setActive={
                        //   statusRes?.payload?.error?.message ? "" : setSwitchActive
                        // }
                        // checkSuccess={true}
                        statusChange={() => setSwitchActive(!switchActive)}
                      />
                      {switchActive ? t("ACTIVE") : t("INACTIVE")}
                    </div>
                  </div>
                  {/* <CommonInput
                    name="createdOn"
                    id="createdOn"
                    label="Created date time"
                    control={control}
                    errors={errors}
                    defaultValue={new Date(groupItem.createdOn).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="createdBy"
                    id="createdBy"
                    label="Created By"
                    control={control}
                    errors={errors}
                    defaultValue={groupItem.createdBy}
                    disabled={true}
                  />

                  <CommonInput
                    name="updatedOn"
                    id="updatedOn"
                    label="Modified date time"
                    control={control}
                    errors={errors}
                    defaultValue={
                      isValid(groupItem.updatedOn) &&
                      new Date(groupItem.updatedOn).toUTCString()
                    }
                    disabled={true}
                  />
                  <CommonInput
                    name="updatedBy"
                    id="updatedBy"
                    label="Modified By"
                    control={control}
                    errors={errors}
                    defaultValue={`${groupItem?.updatedByUser?.firstName} ${groupItem?.updatedByUser?.lastName}`}
                    disabled={true}
                  /> */}
                </>
              )}
            </div>

            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={regions.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>

      <CommonDrawer open={viewOpen} toggle={viewToggle}>
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
              <div>
                <div className={classes.viewContent_label}>{t("COUNTRY")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord?.country?.name}
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
                  {getDateFormate(selectedViewRecord.createdOn) && (
                    <>
                      {getDate(selectedViewRecord.createdOn)}
                      {` | ${hours12(selectedViewRecord.createdOn)}`}
                    </>
                  )}
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
                  {getDateFormate(selectedViewRecord.updatedOn) && (
                    <>
                      {getDate(selectedViewRecord.updatedOn)}
                      {` | ${hours12(selectedViewRecord.updatedOn)}`}
                    </>
                  )}
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

export default Regions;
