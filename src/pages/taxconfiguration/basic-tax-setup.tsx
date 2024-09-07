import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import CommonDatePicker from "src/components/common/CommonDatePicker";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";
import { AppDispatch, RootState } from "src/store";
import { defaultValues } from "src/types/forms/tax/basicTaxSetup";
import * as yup from "yup";
import BasicTaxSetupDataTable from "src/components/tax-configuration/tax-matrics/BasicTaxSetupDataTable";
import {
  basicTaxCreate,
  basicTaxSearch,
  basicTaxUpdate,
  taxTypeLookup,
} from "src/store/apps/tax-configuration/basic-tax-setup";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { Key } from "src/@core/layouts/utils";

// Styles
import { useStyles } from "src/styles/viewEdit.style";

const BasicTaxSetup = () => {
  //States
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [sDate, setSDate] = useState<Date | null>(null);
  const [eDate, setEDate] = useState<Date | null>(null);
  const [basicTaxData, setBasicTaxData] = useState<any>([]);
  const [selectUSer, setSelectedUser] = useState(defaultValues);
  const [taxInPrice, setTaxInPrice] = useState("EXCLUSIVE");
  const [altErrorShow, setAltErrorShow] = useState<boolean>(false);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(basicTaxData, item),
    name: RevestNameValidator(basicTaxData, item || "altName"),
    altName: RevestAltNameFormValidator(basicTaxData, item),
    tax: yup
      .string()
      .max(5, "Tax Rate is too long")
      .required("Tax Field is Required"),
    taxType: yup.object().shape({
      name: yup.string().required("Tax Type is Required"),
    }),
    startDate: yup.date().required("Start Date is Required"),
    // endDate: yup.date().required("End Date is Required"),
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
    setValue("tax", item?.tax);
    setValue("taxType", item?.taxTypes);
    setValue("externalReference", item?.externalReference);
    if (item?.startDate) setValue("startDate", new Date(item?.startDate));
    if (item?.endDate) setValue("endDate", new Date(item?.endDate));
    setValue("taxInPrice", item?.taxInPrice);
    setSwitchActive(item?.active);
    setSDate(
      sDate ? sDate : item?.startDate ? new Date(item?.startDate) : sDate
    );
    setEDate(item?.endDate ? new Date(item?.endDate) : eDate);
    setTaxInPrice(item?.taxInPrice);
  }, [
    item?.code,
    item?.name,
    item?.altName,
    item?.tax,
    item?.taxTypes,
    item?.externalReference,
    item?.id,
    item?.businessTaxGroups,
    item?.productTaxGroups,
    item?.startDate,
    item?.endDate,
    item?.taxInPrice,
    item?.active,
    item?.startDate,
    item?.startDate,
  ]);

  const basicTaxSetup: any = useSelector(
    (state: RootState) => state.basicTaxSetup
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    setBasicTaxData(basicTaxSetup?.data);
  }, [basicTaxSetup]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  useEffect(() => {
    dispatch(basicTaxSearch({}));
    dispatch(taxTypeLookup({ lookupTypesCode: "TAX_TYPES" }));
    dispatch(sequenceMappingCodeSearch({ entityType: "BASIC_TAX_CODE" }));
  }, []);

  const handleEditPage = () => {
    setOpen(true);
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
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
    setSDate(null);
    setEDate(null);
    setTaxInPrice("EXCLUSIVE");
  };

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};

    const requestData: any = {
      // code: "",
      name: "",
      altName: "",
      externalReference: "",
      taxType: "",
      tax: 0,
      endDate: new Date("2099-12-31"),
      startDate: "",
      active: true,
      companyId: 0,
      tenantId: 0,
      taxInPrice: "",
    };

    if (!sequenceMapData?.autoGeneration) {
      requestData.code = data.code;
    }
    requestData.name = data.name;
    requestData.altName = data.altName;
    requestData.externalReference = data.externalReference;
    requestData.taxType = data?.taxType.code;
    requestData.tax = data?.tax;
    requestData.active = switchActive;
    requestData.taxInPrice = data?.taxInPrice?.toUpperCase();
    requestData.companyId = data.companyId;
    requestData.tenantId = data.tenantId;
    requestData.id = data.id;

    let myStartDate = moment(data.startDate).add(-1, "days");
    requestData.startDate = myStartDate;
    let myEndDate =
      new Date(data.endDate).toString() ===
      "Thu Dec 31 2099 05:30:00 GMT+0530 (India Standard Time)"
        ? moment(data.endDate)
        : moment(data.endDate).add(-1, "days");
    requestData.endDate = !myEndDate ? new Date("2099-12-31") : myEndDate;
    if (!data.id) {
      res = await dispatch(basicTaxCreate(requestData));
    } else {
      res = await dispatch(basicTaxUpdate(requestData));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
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
      <BasicTaxSetupDataTable
        data={basicTaxData ?? []}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        isLoading={basicTaxSetup?.isLoading}
        item={item}
        changeLanguage={changeLanguage}
        setSelectedUser={setSelectedUser}
      />
      {/* Edit Page */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              item.id ? t("EDIT_BASIC_TAX_SETUP") : t("NEW_BASIC_TAX_SETUP")
            }
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
                name="taxType"
                options={basicTaxSetup?.taxType}
                control={control}
                label={"Tax Type"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                defaultValue={item.id ? item.taxTypes : null}
                noOptionsText={false}
                clearErrors={clearErrors}
              />

              <CommonInput
                name="tax"
                id="tax"
                label={"TAX"}
                type={"float"}
                required={true}
                control={control}
                errors={errors}
                placeholder={t("Tax")}
                defaultValue={item.tax}
                inputProps={{
                  maxLength: 5,
                  minLength: 1,
                }}
              />
              <CommonDatePicker
                name="startDate"
                item={item}
                control={control}
                required={true}
                label={"Start Date"}
                setValue={setValue}
                minDate={new Date()}
                errors={errors}
                clearErrors={clearErrors}
                defaultValue={
                  item?.startDate ? new Date(item?.startDate) : null
                }
                cb={(date: any) => {
                  let myDate: any = moment(date).add(1, "days");
                  setValue("startDate", new Date(myDate));
                  // setValue("endDate", null);
                  setSDate(date);
                  setEDate(null);
                  clearErrors("startDate");
                }}
                selectedDate={sDate}
              />
              <CommonDatePicker
                name="endDate"
                item={item}
                control={control}
                // required={true}
                label={"End Date"}
                minDate={sDate ? new Date(sDate) : null}
                errors={errors}
                setValue={setValue}
                disabled={sDate ? false : true}
                clearErrors={clearErrors}
                cb={(date: any) => {
                  let myDate: any = moment(date).add(1, "days");
                  setValue("endDate", new Date(myDate));
                  setEDate(date);
                  clearErrors("endDate");
                }}
                selectedDate={eDate}
                defaultValue={item?.endDate ? new Date(item?.endDate) : null}
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
              {/* {item?.id ? (
                <Controller
                  name="taxInPrice"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className={classes.radioContainer}>
                        <div>{t("TAX_IN_PRICE")}</div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              {...field}
                              onChange={(e) => {
                                const checkedValue = e.target.checked
                                  ? "INCLUSIVE"
                                  : "EXCLUSIVE";
                                setValue("taxInPrice", checkedValue);
                                setTaxInPrice(checkedValue);
                              }}
                              defaultChecked={item?.taxInPrice === "INCLUSIVE"}
                            />
                          }
                          label={<Typography>{t(taxInPrice)}</Typography>}
                        />
                      </div>
                    );
                  }}
                />
              ) : (
                <Controller
                  name="taxInPrice"
                  control={control}
                  render={({ field }) => {
                    const { value } = field;
                    return (
                      <div className={classes.radioContainer}>
                        <div>{t("TAX_IN_PRICE")}</div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              {...field}
                              onChange={(e) => {
                                const checkedValue = e.target.checked
                                  ? t("INCLUSIVE")
                                  : t("EXCLUSIVE");
                                setValue("taxInPrice", checkedValue);
                                setTaxInPrice(checkedValue);
                              }}
                              checked={taxInPrice === t("INCLUSIVE")}
                            />
                          }
                          label={<Typography>{t(taxInPrice)}</Typography>}
                        />
                      </div>
                    );
                  }}
                />
              )} */}
              {/* new Radio changes  */}
              <Controller
                name="taxInPrice"
                control={control}
                render={({ field }) => {
                  return (
                    <div className={classes.radioContainer}>
                      <div>{t("TAX_IN_PRICE")}</div>
                      <RadioGroup
                        aria-label="taxInPrice"
                        name="taxInPrice"
                        value={field.value}
                        onChange={(e) => {
                          setValue("taxInPrice", e.target.value);
                          setTaxInPrice(e.target.value);
                        }}
                        sx={{ display: "inline" }}
                      >
                        <FormControlLabel
                          value="INCLUSIVE"
                          control={<Radio size="small" />}
                          label={<Typography>{t("INCLUSIVE")}</Typography>}
                        />
                        <FormControlLabel
                          value="EXCLUSIVE"
                          control={<Radio size="small" />}
                          label={<Typography>{t("EXCLUSIVE")}</Typography>}
                        />
                      </RadioGroup>
                    </div>
                  );
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
              disabled={basicTaxSetup?.isLoading}
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
                  {selectedViewRecord.code}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>{t("NAME")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.name}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>
                  {t("ALTERNATE_NAME")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.altName}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>{t("TYPE")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.taxType}
                </div>
              </div>
              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>{t("TAX")} %</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.tax
                    ? ("" + selectedViewRecord.tax).slice(0, 9)
                    : "-"}
                </div>
              </div>

              <div className={classes.viewContent_wrapper}>
                <div className={classes.viewContent_label}>
                  {t("CREATED_ON")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.createdOn
                    ? getDateFormate(selectedViewRecord.createdOn)
                    : "-"}
                  {selectedViewRecord.createdOn
                    ? ` | ${hours12(selectedViewRecord.createdOn)}`
                    : "-"}
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

export default BasicTaxSetup;
