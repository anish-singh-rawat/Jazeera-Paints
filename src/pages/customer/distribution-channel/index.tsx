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
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonButton from "src/components/common/CommonButton";
import { defaultValues } from "src/types/forms/distributionChannelTypes";
import {
  distributionChannelCreate,
  distributionChannelSearch,
  distributionChannelUpdate,
  distributionChannelToggle,
} from "src/store/apps/dimensions/distribution-channel/distribution_channel";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import DistributionChannelDataTable from "src/components/dimentions/distribution-channel/DistributionChannelDataTable";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { hours12 } from "src/@core/utils/format";
import { useTranslation } from "react-i18next";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";
import { Key } from "src/@core/layouts/utils";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import { RevestCodeFormValidator } from "src/@core/form-validator";

const Divisions = () => {
  const [distributionChannelItem, setDistributionChannelItem] =
    useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [distributionChannels, setDistributionChannels] = useState([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchClick, setSearchClick] = useState(false);
  const [disabled, setDisabled] = useState(false);

  let statusRes: any;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const distributionChannel: any = useSelector(
    (state: RootState) => state.distributionChannel
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    dispatch(distributionChannelSearch({}));
    dispatch(
      sequenceMappingCodeSearch({ entityType: "DISTRIBUTION_CHANNEL_CODE" })
    );
  }, []);

  useEffect(() => {
    if (searchValue) {
      let filterData: any = distributionChannel?.data?.filter((ele: any) => {
        if (
          ele["name"]?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
          ele["altName"]?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
          ele["code"]?.toLowerCase()?.includes(searchValue?.toLowerCase())
        ) {
          return ele;
        }
      });
      setDistributionChannels(filterData);
    } else {
      setDistributionChannels(distributionChannel?.data);
    }
  }, [searchClick, searchValue, distributionChannel]);

  const handleEditPage = async (id: string) => {
    setOpen(true);
    statusRes = await dispatch(distributionChannelToggle({ id: id }));
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

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

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
      : RevestCodeFormValidator(distributionChannel.data, distributionChannelItem),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isNameUnique(distributionChannel.data, value);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isAltNameUnique(distributionChannel.data, value);
      }),
  });

  const isNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item
    if (!distributionChannelItem.id) {
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
      (record: any) => record.id === distributionChannelItem.id
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
        record.id !== distributionChannelItem.id
      );
    });
    return !matchingItem;
  };

  const isAltNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item

    if (!distributionChannelItem.id) {
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
      (record: any) => record.id === distributionChannelItem.id
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
        record.id !== distributionChannelItem.id
      );
    });
    return !matchingItem;
  };

  const isCodeUnique = (data: any, value: any) => {
    // When editing an existing item
    if (distributionChannelItem.id) {
      // Check if there's another record with the same code and a different ID
      const matchingItem = data.find((record: any) => {
        return (
          record.code === value && record.id !== distributionChannelItem.id
        );
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
    defaultValues: distributionChannelItem,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue(
      "code",
      sequenceMapData?.autoGeneration && !distributionChannelItem?.id
        ? "Auto Generated"
        : distributionChannelItem?.code
    );
    setValue("name", distributionChannelItem?.name);
    setValue("altName", distributionChannelItem?.altName);
    setValue("externalReference", distributionChannelItem?.externalReference);
    setValue("createdBy", distributionChannelItem?.createdBy);
    setValue(
      "createdOn",
      new Date(distributionChannelItem?.createdOn).toLocaleString()
    );
    setValue("updatedBy", distributionChannelItem?.updatedBy);
    setValue(
      "updatedOn",
      new Date(distributionChannelItem?.updatedOn).toLocaleString()
    );
    setValue("id", distributionChannelItem?.id);
    setSwitchActive(distributionChannelItem?.active);
  }, [distributionChannelItem, setValue]);

  const handleCloseDrawer = () => {
    reset();
    setDistributionChannelItem(defaultValues);
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
  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.active = switchActive;
    sequenceMapData?.autoGeneration && !data.id && delete data.code;
    if (!data.id) {
      res = await dispatch(distributionChannelCreate(data));
    } else {
      res = await dispatch(distributionChannelUpdate(data));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };
  return (
    <Card>
      <DistributionChannelDataTable
        data={distributionChannels}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setDistributionChannelItem={setDistributionChannelItem}
        distributionChannelItem={distributionChannelItem}
        isLoading={distributionChannel.isLoading}
        changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              distributionChannelItem.id
                ? t(Key("Edit distribution channel"))
                : t(Key("New distribution channel"))
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
                defaultValue={distributionChannelItem.name}
              />

              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={distributionChannelItem.altName}
              />
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                control={control}
                errors={errors}
                defaultValue={distributionChannelItem.externalReference}
              />
              {!distributionChannelItem.id && (
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
              {distributionChannelItem.id && (
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
                      distributionChannelItem.createdOn
                    ).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="createdBy"
                    id="createdBy"
                    label="Created By"
                    control={control}
                    errors={errors}
                    defaultValue={distributionChannelItem.createdBy}
                    disabled={true}
                  />
                  <CommonInput
                    name="updatedOn"
                    id="updatedOn"
                    label="Modified date time"
                    control={control}
                    errors={errors}
                    defaultValue={new Date(
                      distributionChannelItem.updatedOn
                    ).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="updatedBy"
                    id="updatedBy"
                    label="Modified By"
                    control={control}
                    errors={errors}
                    defaultValue={distributionChannelItem.updatedBy}
                    disabled={true}
                  /> */}
                </>
              )}
            </div>
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={distributionChannel?.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>

      <CommonDrawer
        open={viewOpen}
        toggle={viewToggle}
        // styles={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
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
      </CommonDrawer>
    </Card>
  );
};

export default Divisions;
