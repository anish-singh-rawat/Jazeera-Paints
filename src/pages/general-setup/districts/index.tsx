import { yupResolver } from "@hookform/resolvers/yup";
import { Card, FormHelperText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameValidator,
} from "src/@core/form-validator";
import { getDateFormate, hours12 } from "src/@core/utils/format";
import AppStorage from "src/app/AppStorage";
import CommonButton from "src/components/common/CommonButton";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";
import { AppDispatch, RootState } from "src/store";
import { defaultValues } from "src/types/forms/tax/basicTaxSetup";
import * as yup from "yup";
import { Key } from "src/@core/layouts/utils";

// Styles
import { useStyles } from "src/styles/viewEdit.style";

// Store
import {
  districtCreate,
  districtSearch,
  districtUpdate,
} from "src/store/apps/general-setup/district_store";
import DistrictDataTable from "src/components/generalSetup/district/DistrictDataTable";
import {
  citySearch,
  countryList,
  getRegionList,
} from "src/store/apps/general-setup/city_store";

const index = () => {
  //States
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [altErrorShow, setAltErrorShow] = useState<boolean>(false);
  // const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const globalDistrict: any = useSelector(
    (state: RootState) => state.globalDistrict
  );
  const globalCity: any = useSelector((state: RootState) => state.globalCity);

  // const sequenceMappingCode: any = useSelector(
  //   (state: RootState) => state.sequenceMappingCode
  // );

  // useEffect(() => {
  //   setSequenceMapData(sequenceMappingCode?.data);
  // }, [sequenceMappingCode]);

  useEffect(() => {
    dispatch(districtSearch({ data: "all" }));
    dispatch(countryList({ data: "all" }));
    dispatch(citySearch({ data: "all" }));
    dispatch(getRegionList());
  }, []);

  const schema = yup.object().shape({
    // code: sequenceMapData?.autoGeneration
    //   ? yup.string()
    //   : RevestCodeFormValidator(globalDistrict?.data, item),
    code: yup.string().max(10, "Code is too long").required("REQUIRED"),
    name: RevestNameValidator(globalDistrict?.data, item || "altName"),
    altName: RevestAltNameFormValidator(globalDistrict?.data, item),
    country: yup.object().shape({
      name: yup.string().required("Country is Required"),
    }),
    region: yup.object().shape({
      name: yup.string().required("Region is Required"),
    }),
    city: yup.object().shape({
      name: yup.string().required("City is Required"),
    }),
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: item,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  useEffect(() => {
    setValue("id", item?.id);
    setValue("code", item?.code);
    setValue("name", item?.name);
    setValue("altName", item?.altName);
    setValue("externalReference", item?.externalReference);
    setSwitchActive(item?.active);
    setValue("country", item?.country);
    setValue("region", item?.region);
    setValue("city", item?.city);
  }, [item, setValue]);

  const handleEditPage = () => {
    setOpen(true);
    // setValue(
    //   "code",
    //   sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    // );
    setValue("code", "");
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };

  const handleCloseDrawer = () => {
    reset();
    setItem(defaultValues);
    setOpen(false);
    clearErrors();
  };

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};

    const requestData: any = {
      code: "",
      name: "",
      altName: "",
      externalReference: "",
      active: true,
      country: "",
      region: "",
      city: "",
    };

    // if (!sequenceMapData?.autoGeneration) {
    //   requestData.code = data.code;
    // }
    requestData.code = data.code;
    requestData.id = data.id;
    requestData.name = data.name;
    requestData.altName = data.altName;
    requestData.externalReference = data.externalReference;
    requestData.active = switchActive;
    requestData.countryId = data?.country?.id;
    requestData.regionId = data?.region?.id;
    requestData.cityId = data?.city?.id;

    if (!data.id) {
      res = await dispatch(districtCreate(requestData));
    } else {
      res = await dispatch(districtUpdate(requestData));
    }
    handleCloseDrawer();
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
      if (e?.target?.value?.length > 25) {
        setAltErrorShow(true);
      } else setAltErrorShow(false);
    }
  };

  return (
    <Card>
      <DistrictDataTable
        data={globalDistrict.data ?? []}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        isLoading={globalDistrict?.isLoading}
        item={item}
        changeLanguage={changeLanguage}
      />
      {/* Edit Page */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={item.id ? t("EDIT_DISTRICT") : t("NEW_DISTRICT")}
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={handleChange}
            autoComplete="off"
          >
            <div className={classes.formContent}>
              <CommonInput
                name="code"
                id="code"
                label="Code"
                required={true}
                // required={!sequenceMapData?.autoGeneration}
                control={control}
                errors={errors}
                // disabled={sequenceMapData?.autoGeneration}
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
              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={item.altName}
              />
              {altErrorShow && (
                <FormHelperText
                  className={classes.errorMsg}
                  id="validation-schema-alt-name"
                >
                  {t(
                    Key("Alt name can be at most 25 characters" || "REQUIRED")
                  )}
                </FormHelperText>
              )}
              <CommonSelect
                name="country"
                options={globalCity?.countryData || []}
                control={control}
                label={"Country"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                defaultValue={item.id ? item.country : null}
                noOptionsText={false}
                clearErrors={clearErrors}
              />
              <CommonSelect
                name="region"
                options={globalCity?.regionData || []}
                control={control}
                label={"REGION"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                defaultValue={item.id ? item.region : null}
                noOptionsText={false}
                clearErrors={clearErrors}
              />
              <CommonSelect
                name="city"
                options={globalCity?.data || []}
                control={control}
                label={"CITY"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                defaultValue={item.id ? item.city : null}
                noOptionsText={false}
                clearErrors={clearErrors}
              />
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                control={control}
                errors={errors}
                defaultValue={item.externalReference}
                inputProps={{
                  maxLength: 25,
                  minLength: 1,
                  step: "any",
                }}
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
              disabled={globalDistrict?.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>
      {/* View Page */}
      <CommonDrawer open={viewOpen} toggle={viewToggle}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={selectedViewRecord.name}
            handleClose={handleCloseViewDrawer}
          />
          <div style={{ padding: "0 24px" }}>
            <div className={classes.viewContent}>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>{t("CODE")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord?.code}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>{t("NAME")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord?.name}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>
                  {t("ALTERNATE_NAME")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord?.altName}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>{t("COUNTRY")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord?.country?.name}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>{t("REGION")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord?.region?.name}
                </div>
              </div>

              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>{t("CITY")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord?.city?.name}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("CREATED_ON")}
                </div>
                <div className={classes.viewContent_value}>
                  {getDateFormate(selectedViewRecord.createdOn)}
                  {` | ${hours12(selectedViewRecord.createdOn)}`}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
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
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>
                  {t("MODIFIED_ON")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.updatedOn
                    ? getDateFormate(selectedViewRecord.updatedOn)
                    : "-"}
                  {selectedViewRecord.updatedOn
                    ? ` | ${hours12(selectedViewRecord.updatedOn)}`
                    : "-"}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
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

export default index;
