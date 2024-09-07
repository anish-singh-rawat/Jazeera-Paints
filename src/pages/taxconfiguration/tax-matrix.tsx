import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameFormValidator,
} from "src/@core/form-validator";
import { hours12 } from "src/@core/utils/format";
import AppStorage from "src/app/AppStorage";
import CommonButton from "src/components/common/CommonButton";
import CommonDatePicker from "src/components/common/CommonDatePicker";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";
import BusinessTaxGroupModel from "src/components/tax-configuration/tax-matrics/BusinessTaxGroupModel";
import ProductTaxGroupModel from "src/components/tax-configuration/tax-matrics/ProductTaxGroupModel";
import TaxMatricsDataTable from "src/components/tax-configuration/tax-matrics/TaxMatricsDataTable";
import { AppDispatch, RootState } from "src/store";
import { businessTaxGroupSearch } from "src/store/apps/tax-configuration/business_tax_group";
import { productTaxGroupSearch } from "src/store/apps/tax-configuration/product_tax_group";
import {
  taxConfigurationCreate,
  taxConfigurationSearch,
  taxConfigurationUpdate,
  taxTypeLookup,
} from "src/store/apps/tax-configuration/tax_matrics";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import * as yup from "yup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { isValueUnique } from "src/@core/utils/check-unique";

const useStyles = makeStyles({
  drawerWrapper: {
    height: "100vh",
  },
  form: {
    height: "calc(100vh - 80px)",
  },
  formContent: {
    height: "calc(100% - 80px)",
    overflow: "auto",
    padding: "16px 24px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  viewContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "8px",
    rowGap: "24px",
    margin: "24px 0",
    paddingBottom: "24px",
    borderBottom: "6px solid #3586C7",
    borderRadius: "0px 0px 6px 6px",
  },
  viewContent_label: {
    color: "#a7a5aa",
    fontWeight: 400,
    fontSize: "15px",
  },
  viewContent_value: {
    color: "#6f6b7d",
    fontWeight: 600,
    fontSize: "15px",
  },
  downLoadBtn: {
    display: "flex",
    justifyContent: "flex-end",
  },
  radioContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",

    "& .MuiFormControlLabel-root": {
      height: "30px",
    },
  },
  radioError: {
    color: "#EA5455",
    fontSize: "12px",
    marginTop: "-2px",
  },

  inputField: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    "& .MuiInputBase-input": {
      padding: "10px",
    },
  },
  commonSelect: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    "& .MuiOutlinedInput-root": {
      paddingTop: "3px",
      paddingBottom: "2px",
    },
  },
  option: {
    padding: "0 5px",
    "&:hover": {
      backgroundColor: "rgba(115, 103, 240, 0.08) !important",
      color: "#3586C7",
      borderRadius: "5px",
    },
    '&[aria-selected="true"]': {
      backgroundColor: "#3586C7 !important",
      borderRadius: "5px",
      padding: "0 5px",
      "&:hover": {
        color: "#ffffff",
      },
    },
    height: "40px",
  },
  popper: {
    padding: "0 5px",
  },
  errorMsg: {
    color: "#EA5455",
  },
  modal: {
    padding: "0px 0px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    justifyContent: "center",
  },
  modalText: {
    textAlign: "center",
    width: "i",
  },
});

const customerDetail = {
  code: "",
  name: "",
  altName: "",
  active: true,
  externalReference: "",
};

const TaxMatrics = () => {
  const [item, setItem] = useState(defaultValues);

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [dialogView, setDialogView] = useState(false);
  const [productDialogView, setProductDialogView] = useState(false);
  const [resData, setResData] = useState("");
  const [busData, setBusData] = useState("");
  const [sDate, setSDate] = useState<Date | null>(null);
  const [eDate, setEDate] = useState<Date | null>(null);
  const [TaxMatricsData, setTaxMatrixData] = useState([]);
  const [customerProp, setCustomerProp] = useState<any>(customerDetail);
  const [productProp, setProductProp] = useState<any>(customerDetail);
  const [customerClassView, setCustomerClassView] = useState(false);
  const [bussinessGroupItems, setBussinessGroupItems] = useState({});
  const [productGroupItems, setproductGroupItems] = useState({});
  const [validateForm, setValidateForm] = useState(false);
  const [selectUSer, setSelectedUser] = useState(defaultValues);
  const [tax, setTax] = useState("EXCLUSIVE");
  // const [selectedUser, setSelectedUser] = useState<any>(defaultValues);

  const isFormValid = (u: any = {}): boolean => {
    return u.businessTaxGroups?.id && u.productTaxGroups?.id;
    return false;
  };

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { direction } = theme;

  const schema = yup.object().shape({
    code: RevestCodeFormValidator(TaxMatricsData, item),
    // name: RevestNameFormValidator(TaxMatricsData, item),
    // altName: RevestAltNameFormValidator(TaxMatricsData, item),

    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isValueUnique(TaxMatricsData, value, "name", item);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isValueUnique(TaxMatricsData, value, "altName", item);
      }),

    taxRate: yup
      .string()
      .max(3, "Tax Rate is too long")
      .required("Tax Field is Required"),
    taxType: yup.object().shape({
      name: yup.string().required("Tax Type is Required"),
    }),
    startDate: yup.date().required("Start Date is Required"),
    endDate: yup.date().required("End Date is Required"),
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

  useEffect(() => {
    setValue("code", item?.code);
    setValue("name", item?.name);
    setValue("altName", item?.altName);
    setValue("taxRate", item?.taxRate);
    setValue("taxType", item?.taxTypes);
    setValue("externalReference", item?.externalReference);
    setValue("id", item?.id);
    setValue("businessTaxGroups", item?.businessTaxGroups);

    setValue("productTaxGroups", item?.productTaxGroups);
    if (item?.startDate) setValue("startDate", new Date(item?.startDate));
    if (item?.endDate) setValue("endDate", new Date(item?.endDate));
    setValue("tax", item?.tax);
    setSwitchActive(item?.active);
    setSDate(
      sDate ? sDate : item?.startDate ? new Date(item?.startDate) : sDate
    );
    setEDate(item?.endDate ? new Date(item?.endDate) : eDate);
    setTax(item?.tax);
  }, [
    item?.code,
    item?.name,
    item?.altName,
    item?.taxRate,
    item?.taxTypes,
    item?.externalReference,
    item?.id,
    item?.businessTaxGroups,
    item?.productTaxGroups,
    item?.startDate,
    item?.endDate,
    item?.tax,
    item?.active,
    item?.startDate,
    item?.startDate,
  ]);

  const taxConfiguration: any = useSelector(
    (state: RootState) => state.taxConfiguration
  );

  const businessTaxGroup: any = useSelector(
    (state: RootState) => state.businessTaxGroup
  );

  const productTaxGroup: any = useSelector(
    (state: RootState) => state.productTaxGroup
  );

  useEffect(() => {
    setTaxMatrixData(taxConfiguration?.data);
  }, [taxConfiguration]);

  const btgActiveTax =
    businessTaxGroup?.data?.length > 0 &&
    businessTaxGroup?.data
      ?.filter((item: any) => item?.active === true)
      ?.map((item: any) => {
        return item;
      });

  const ptgActiveTax =
    productTaxGroup?.data?.length > 0 &&
    productTaxGroup?.data
      ?.filter((item: any) => item?.active === true)
      ?.map((item: any) => {
        return item;
      });

  useEffect(() => {
    dispatch(taxConfigurationSearch({}));
    dispatch(businessTaxGroupSearch({}));
    dispatch(productTaxGroupSearch({}));
    dispatch(taxTypeLookup({ lookupTypesCode: "TAX_TYPES" }));
  }, []);

  const handleEditPage = () => {
    setOpen(true);
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
    setProductProp(null);
    setCustomerProp(null);
    setSelectedUser(defaultValues);
    setValidateForm(false);
    setTax("EXCLUSIVE");
  };

  const onErrors = (data: any) => {
    console.log(data, "errors...");
    setValidateForm(true);
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
      businessTaxGroups: {},
      productTaxGroups: {},
      taxType: "",
      taxRate: 0,
      endDate: "",
      startDate: "",
      active: true,
      companyId: 0,
      tenantId: 0,
      tax: "",
    };

    requestData.code = data.code;
    requestData.name = data.name;
    requestData.altName = data.altName;
    requestData.externalReference = data.externalReference;
    requestData.businessTaxGroups = selectUSer?.businessTaxGroups
      ? selectUSer?.businessTaxGroups
      : bussinessGroupItems;
    requestData.productTaxGroups = selectUSer?.productTaxGroups
      ? selectUSer?.productTaxGroups
      : productGroupItems;
    requestData.taxType = data?.taxType.code;
    requestData.taxRate = data?.taxRate;
    requestData.active = switchActive;
    requestData.tax = data?.tax.toUpperCase();
    requestData.companyId = data.companyId;
    requestData.tenantId = data.tenantId;
    requestData.id = data.id;

    let myStartDate = moment(data.startDate).add(-1, "days");
    requestData.startDate = myStartDate;
    let myEndDate = moment(data.endDate).add(-1, "days");
    requestData.endDate = myEndDate;

    if (!data.id) {
      res = await dispatch(taxConfigurationCreate(requestData));
    } else {
      res = await dispatch(taxConfigurationUpdate(requestData));
    }
    handleCloseDrawer();

    setValidateForm(false);
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  const handleCustomerClassChange = (
    event: any,
    businessTaxGroups: any | null
  ) => {
    const usr: any = {
      ...selectUSer,
      businessTaxGroups,
    } as any;
    setSelectedUser(usr);
    //setDialogView(false);
  };

  const handleProductChange = (event: any, productTaxGroups: any | null) => {
    const usr: any = {
      ...selectUSer,
      productTaxGroups,
    } as any;
    //setSelectedUser((p: any) => ({ ...p, ...usr }));
    setSelectedUser(usr);
  };

  const handleCustomerClassForm = () => {
    // setFormTitle("Customer Class");
    setCustomerClassView(true);
  };

  const handleProductView = () => {
    // setFormTitle("Customer Class");
    setProductDialogView(true);
  };

  const ChangeLanguage = AppStorage.getData("lang");

  const handleChangeClass = (e: any) => {
    setCustomerProp(
      ChangeLanguage === "en-US"
        ? { name: e?.target?.value }
        : { altName: e?.target?.value }
    );
  };

  const handleChangeProduct = (e: any) => {
    setProductProp(
      ChangeLanguage === "en-US"
        ? { name: e?.target?.value }
        : { altName: e?.target?.value }
    );
  };

  return (
    <Card>
      <TaxMatricsDataTable
        data={TaxMatricsData}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        isLoading={taxConfiguration.isLoading}
        item={item}
        changeLanguage={changeLanguage}
        setSelectedUser={setSelectedUser}
      />
      {/* Edit Page */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={item.id ? t("EDIT_TAX_SETUP") : t("NEW_TAX_SETUP")}
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
                control={control}
                errors={errors}
                defaultValue={item.code}
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
              <CommonSelect
                name="taxType"
                options={taxConfiguration.taxType}
                control={control}
                label={"Tax Type"}
                placeholder={"select type"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                defaultValue={item.id ? item.taxTypes : null}
                noOptionsText={false}
                clearErrors={clearErrors}
              />

              <CommonInput
                name="taxRate"
                id="taxRate"
                label={"TAX"}
                type={"number"}
                required={true}
                control={control}
                errors={errors}
                placeholder="Tax"
                defaultValue={item.taxRate}
                inputProps={{
                  maxLength: 3,
                  minLength: 1,
                }}
              />
              <CommonDatePicker
                name="startDate"
                item={item}
                control={control}
                required={true}
                placeholderText={"Click to select a date"}
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
                  setValue("endDate", null);
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
                required={true}
                placeholderText={"Click to select a date"}
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
              />
              {item?.id ? (
                <Controller
                  name="tax"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className={classes.radioContainer}>
                        <div>{t("TAX")}</div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              {...field}
                              onChange={(e) => {
                                const checkedValue = e.target.checked
                                  ? "INCLUSIVE"
                                  : "EXCLUSIVE";
                                setValue("tax", checkedValue);
                                setTax(checkedValue);
                              }}
                              defaultChecked={item?.tax === "INCLUSIVE"}
                            />
                          }
                          label={<Typography>{t(tax)}</Typography>}
                        />
                      </div>
                    );
                  }}
                />
              ) : (
                <Controller
                  name="tax"
                  control={control}
                  render={({ field }) => {
                    const { value } = field;
                    return (
                      <div className={classes.radioContainer}>
                        <div>{t("TAX")}</div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              {...field}
                              onChange={(e) => {
                                const checkedValue = e.target.checked
                                  ? "INCLUSIVE"
                                  : "EXCLUSIVE";
                                setValue("tax", checkedValue);
                                setTax(checkedValue);
                              }}
                              checked={tax === "INCLUSIVE"}
                            />
                          }
                          label={<Typography>{t(tax)}</Typography>}
                        />
                      </div>
                    );
                  }}
                />
              )}
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
              <div>
                <div>
                  <Accordion sx={{ border: "1px solid #E8E8E9" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      sx={{ minHeight: "40px" }}
                    >
                      <Typography>{t("ADVANCE_TAX_SETUP")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div
                        style={{ marginTop: "20px" }}
                        className={classes.commonSelect}
                      >
                        <label>{t("PRODUCTS_TAX_GROUP")}</label>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <Autocomplete
                            size="medium"
                            classes={{
                              option: classes.option,
                            }}
                            options={ptgActiveTax || []}
                            value={
                              selectUSer?.productTaxGroups
                                ? selectUSer?.productTaxGroups
                                : productProp
                            }
                            getOptionLabel={(option: any) => {
                              const label =
                                ChangeLanguage === "en-US"
                                  ? option.name
                                  : option.altName;
                              return label || ""; // Return an empty string if label is undefined
                            }}
                            onChange={handleProductChange}
                            noOptionsText={
                              <div className={classes.modal}>
                                <div
                                  className={classes.modalText}
                                >{`No Record Found`}</div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Button
                                    onClick={handleProductView}
                                    variant="contained"
                                    fullWidth={false}
                                    sx={{
                                      textTransform: "unset",
                                      width: "99px",
                                    }}
                                  >
                                    {t("NEW")}
                                  </Button>
                                </div>
                              </div>
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder={t("PRODUCTS_TAX_GROUP")!}
                                onChange={handleChangeProduct}
                                error={
                                  validateForm &&
                                  !Boolean(
                                    selectUSer?.productTaxGroups ||
                                      productProp?.name ||
                                      productProp?.altName
                                  )
                                }
                              />
                            )}
                          />

                          {validateForm &&
                            !Boolean(
                              selectUSer?.productTaxGroups ||
                                productProp?.name ||
                                productProp?.altName
                            ) && (
                              <FormHelperText
                                className={classes.errorMsg}
                                id="validation-schema-first-name"
                              >
                                {t("REQUIRED")}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>

                      <div className={classes.commonSelect}>
                        <label>{t("BUSINESS_TAX_GROUP")}</label>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <Autocomplete
                            size="medium"
                            classes={{
                              option: classes.option,
                            }}
                            options={btgActiveTax || []}
                            value={
                              selectUSer?.businessTaxGroups
                                ? selectUSer?.businessTaxGroups
                                : customerProp
                            }
                            getOptionLabel={(option: any) => {
                              const label =
                                ChangeLanguage === "en-US"
                                  ? option.name
                                  : option.altName;
                              return label || ""; // Return an empty string if label is undefined
                            }}
                            onChange={handleCustomerClassChange}
                            noOptionsText={
                              <div className={classes.modal}>
                                <div
                                  className={classes.modalText}
                                >{`No Record Found`}</div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Button
                                    onClick={handleCustomerClassForm}
                                    variant="contained"
                                    fullWidth={false}
                                    sx={{
                                      textTransform: "unset",
                                      width: "99px",
                                    }}
                                  >
                                    {t("NEW")}
                                  </Button>
                                </div>
                              </div>
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder={t("BUSINESS_TAX_GROUP")!}
                                onChange={handleChangeClass}
                                error={
                                  validateForm &&
                                  !Boolean(
                                    selectUSer?.businessTaxGroups ||
                                      customerProp?.name ||
                                      customerProp?.altName
                                  )
                                }
                              />
                            )}
                          />

                          {validateForm &&
                            !Boolean(
                              selectUSer?.businessTaxGroups ||
                                customerProp?.name ||
                                customerProp?.altName
                            ) && (
                              <FormHelperText
                                className={classes.errorMsg}
                                id="validation-schema-first-name"
                              >
                                {t("REQUIRED")}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            </div>
            <CommonFormActionButtons handleCloseDrawer={handleCloseDrawer} />
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
                <div className={classes.viewContent_label}>{t("TYPE")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.taxType}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("TAX")} %</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.taxRate}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("BUSINESS_TAX_GROUP")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.businessTaxGroups?.name}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("PRODUCT_TAX_GROUP")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.productTaxGroups?.name}
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
                <div className={classes.viewContent_label}>{"CREATED_BY"}</div>
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
      {/* Dialog Popup */}
      {customerClassView ? (
        <BusinessTaxGroupModel
          busData={busData}
          setDialogView={setCustomerClassView}
          businessTaxGroup={businessTaxGroup?.data}
          customerProp={customerProp}
          setBussinessGroupItems={setBussinessGroupItems}
          setCustomerProp={setCustomerProp}
        />
      ) : null}
      {productDialogView ? (
        <ProductTaxGroupModel
          resData={resData}
          setDialogView={setProductDialogView}
          productTaxGroup={productTaxGroup?.data}
          productProp={productProp}
          setproductGroupItems={setproductGroupItems}
          setProductProp={setProductProp}
        />
      ) : null}
    </Card>
  );
};

export default TaxMatrics;
