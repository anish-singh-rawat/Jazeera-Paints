import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaxMatricsHeader from "src/components/tax-configuration/tax-matrics/TaxMatricsHeader";
import { AppDispatch, RootState } from "src/store";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonSelect from "src/components/common/CommonSelect";
import BusinessTaxGroupModel from "src/components/tax-configuration/tax-matrics/BusinessTaxGroupModel";
import ProductTaxGroupModel from "src/components/tax-configuration/tax-matrics/ProductTaxGroupModel";
import { Box, Card, Typography } from "@mui/material";
import CommonDatePicker from "src/components/common/CommonDatePicker";
import CommonButton from "src/components/common/CommonButton";
import moment, { months } from "moment";
import { useTranslation } from "react-i18next";
import AppStorage from "src/app/AppStorage";
import {
  getPaymentTerms,
  paymentCreate,
  paymentUpdate,
} from "src/store/apps/payment-terms/payment_terms";
import ProductTermTable from "src/components/payment/payment-terms/ProductTermTable";
import CommonTextArea from "src/components/common/CommonTextArea";
import CommonNote from "src/components/common/CommonNote";
import CustomRadio from "src/components/payment/payment-terms/CustomRadio";
import CustomDiscunt from "src/components/payment/payment-terms/CustomDiscunt";
import Checkbox from "@mui/material/Checkbox";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const useStyles = makeStyles({
  drawerWrapper: {
    height: "100%",
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
  viewContents: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "8px",
    rowGap: "24px",
    margin: "24px 0",
    paddingBottom: "24px",
    // borderBottom: "6px solid #3586C7",
    borderRadius: "0px 0px 6px 6px",
  },

  viewRapper: {
    // margin:"22px",
    paddingLeft: "22px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "8px",
    rowGap: "24px",
    // margin: "24px 0",

    //  borderBottom: "6px solid #3586C7",
    borderRadius: "0px 0px 6px 6px",
  },

  viewContentbottom: {
    columnGap: "8px",
    rowGap: "24px",
    margin: "24px 0",
    paddingBottom: "24px",
    borderBottom: "6px solid #3586C7",
    borderRadius: "0px 0px 6px 6px",
    margginBotton: "100px",
  },
  viewContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "8px",
    rowGap: "24px",
    marginTop: "20px",
    paddingBottom: "24px",
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
    marginRight: "20px",
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
});

interface earlyDiscountInfo {
  name: string;
  class: string;
  dob: string;
}

const PaymentTerm = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [dialogView, setDialogView] = useState(false);
  const [productDialogView, setProductDialogView] = useState(false);
  const [resData, setResData] = useState("");
  const [busData, setBusData] = useState("");
  const [sDate, setSDate] = useState<Date | null>(null);
  const [eDate, setEDate] = useState<Date | null>(null);
  const [discountInfo, setDiscountInfo] = useState<earlyDiscountInfo[]>([
    { name: "", class: "", dob: "" },
  ]);

  const isCodeUnique = (data: any, value: any) => {
    const matchingItem = data.find((item: any) => item.code === value);
    return !matchingItem;
  };

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const schema = yup.object().shape({
    code: yup
      .string()
      .min(6, "Code must be at least 6 characters")
      .when("id", {
        is: (id: any) => !!id,
        then: yup.string(),
        otherwise: yup
          .string()
          .test("unique-code", "Code already exists", function (value) {
            return isCodeUnique(paymentData.data, value);
          })
          .required("Code Field is Required"),
      }),
    name: yup.string().required("Name Field is Required"),

    paymentStartDates: yup
      .date()
      .when(["paymentMethod"], (paymentMethod, startDateSchema) => {
        if (paymentMethod == "CREDIT") {
          return startDateSchema.required("startDate is required");
        } else {
          return startDateSchema;
        }
      }),

    paymentEndDate: yup
      .date()
      .when(["paymentMethod"], (paymentMethod, schema) => {
        return paymentMethod == "CREDIT"
          ? schema.required("endDate  is required")
          : schema;
      }),
    weekdayOfPayment: yup
      .string()
      .when(["paymentMethod"], (paymentMethod, schema) => {
        return paymentMethod == "END_OF_CURRENT_WEEK"
          ? schema.required("Required")
          : schema;
      }),

    months: yup
      .number()
      .when(["paymentMethod"], (paymentMethod, schema) => {
        return paymentMethod === "CREDIT"
          ? schema.required("Month is required")
          : schema;
      })
      .min(1, "Month must be between 1 and 12")
      .max(12, "Month must be between 1 and 12"),

    days: yup
      .number()
      .nullable()
      .typeError("Days must be a number")
      .when("months", {
        is: (months: any) => months !== undefined,
        then: yup
          .number()
          .test(
            "is-valid-day",
            "Invalid day for selected month",
            function (value: any) {
              const month = this.parent?.months as number;
              if (month !== undefined) {
                const daysInMonth = new Date(
                  new Date().getFullYear(),
                  month,
                  0
                ).getDate();
                return value >= 1 && value <= daysInMonth;
              }
              return false;
            }
          ),
      }),
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch,

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
  function formatDateToCustom(dateString: any) {
    let startDate = new Date(dateString);

    let formattedDate =
      (startDate.getUTCDate() < 10 ? "0" : "") +
      startDate.getUTCDate() +
      "-" +
      (startDate.getUTCMonth() + 1 < 10 ? "0" : "") +
      (startDate.getUTCMonth() + 1) +
      "-" +
      startDate.getUTCFullYear();

    return formattedDate;
  }

  useEffect(() => {
    setValue("code", item?.code);
    setValue("name", item?.name);
    setValue("altName", item?.altName);
    setValue("id", item?.id);
    setValue("description", item?.description);
    setValue("termsOfPayment", item?.termsOfPayment);
    setValue("externalReference", item?.externalReference);
    setValue("termsOfPayment", item?.termsOfPayment);
    setValue("days", item?.days);
    setValue("months", item?.months);

    setValue("discount", item?.discount);
    setValue("paymentMethod", item?.paymentMethod);
    setValue("weekdayOfPayment", item?.weekdayOfPayment);
    setSwitchActive(item?.active);

    setSDate(
      sDate ? sDate : item?.startDate ? new Date(item?.startDate) : sDate
    );
    setEDate(item?.endDate ? new Date(item?.endDate) : eDate);
  }, [item, setValue]);

  const payment_method = [
    "CASH",
    "CREDIT",
    "END_OF_CURRENT_WEEK",
    "END_OF_CURRENT_MONTH",
    "END_OF_CURRENT_QUARTER",
    "END_OF_CURRENT_YEAR",
  ];
  const week_day_payment = [
    t("NONE"),
    t("SUNDAY"),
    t("MONDAY"),
    t("TUESDAY"),
    t("WEDNESDAY"),
    t("THURSDAY"),
    t("FRIDAY"),
    t("SATURDAY"),
  ];

  const paymentData: any = useSelector(
    (state: RootState) => state.paymentConfiguration
  );

  useEffect(() => {
    dispatch(getPaymentTerms({}));
  }, []);

  const searchData = (searchValue: string) => {
    let filterData: any = paymentData?.data?.filter((ele: any) => {
      // come later here to change keys
      if (
        ele["name"]?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        ele["altName"]?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        ele["code"]?.toLowerCase()?.includes(searchValue?.toLowerCase())
      ) {
        return ele;
      }
    });
    if (searchValue) {
      setSearchEnabled(true);
    } else setSearchEnabled(false);
    setFilteredData(filterData);
  };

  const handleEditPage = () => {
    setOpen(true);
  };

  const watchedValues = watch();

  interface DayInfo {
    dayOfWeek: string;
    formattedDate: string;
  }

  function getDayOfWeek(month: number, day: number): DayInfo | string {
    const monthIndex = month - 1;

    if (monthIndex < 0 || monthIndex > 11 || day < 1 || day > 31) {
      return "Invalid input";
    }

    const currentYear = moment().year();
    const date = moment().year(currentYear).month(monthIndex).date(day);
    const dayOfWeek = date.format("dddd");
    const formattedDate = date.format("MMMM D, YYYY");

    return { dayOfWeek, formattedDate };
  }

  const inputMonth = watchedValues.months ? watchedValues.months : 0;
  const inputDay = watchedValues.days ? watchedValues.days : 0;
  const watchedValuesWeekdayOfPayment = watchedValues.weekdayOfPayment;

  let nextWeekFormattedDate = null;
  const dayInfoOrError = getDayOfWeek(inputMonth, inputDay);

  if (typeof dayInfoOrError === "string") {
  } else {
    const { dayOfWeek, formattedDate } = dayInfoOrError;

    if (dayOfWeek !== watchedValuesWeekdayOfPayment) {
      const currentDate = moment()
        .year(moment().year())
        .month(inputMonth - 1)
        .date(inputDay);
      const daysToAdd =
        (7 +
          moment()
            .day(
              watchedValuesWeekdayOfPayment
                ? watchedValuesWeekdayOfPayment
                : "sunday"
            )
            .diff(currentDate, "days")) %
        7;
      const nextWeekDate = currentDate.add(daysToAdd, "days");
      nextWeekFormattedDate = nextWeekDate.format("MMMM D, YYYY");
    }
  }

  let getmonth = nextWeekFormattedDate?.split(" ");

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
      termsOfPayment: "",
      description: "",
      paymentMethod: "",
      months: 0,
      days: 0,
      weekdayOfPayment: "",
      discount: 0,
      externalReference: "",
      endDate: "",
      startDate: "",
      active: true,
      companyId: 0,
      tenantId: 0,
    };

    requestData.code = data.code;
    requestData.name = data.name;
    requestData.altName = data.altName;
    requestData.termsOfPayment = data.termsOfPayment;
    requestData.description = data.description;
    requestData.paymentMethod = data.paymentMethod;
    requestData.months = data.months;
    requestData.days = data.days;
    requestData.weekdayOfPayment = data.weekdayOfPayment;
    requestData.discount = data.discount;
    requestData.externalReference = data.externalReference;
    requestData.endDate = data.paymentEndDate;
    requestData.startDate = data.paymentStartDate;
    requestData.active = data.active;
    requestData.companyId = data.companyId;
    requestData.tenantId = data.tenantId;
    requestData.id = data.id;

    try {
      await schema.validate(data, { abortEarly: false });

      if (!data.id) {
        res = await dispatch(paymentCreate(requestData));
      } else {
        res = await dispatch(paymentUpdate(requestData));
      }

      handleCloseDrawer();

    } catch (validationError) {}
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") setValue("altName", e?.target?.value);
  };

  const addDiscountInfo = () => {
    setDiscountInfo([...discountInfo, { name: "", class: "", dob: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof earlyDiscountInfo,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedStudentInfo = [...discountInfo];
    updatedStudentInfo[index][field] = event.target.value;
    setDiscountInfo(updatedStudentInfo);
  };

  return (
    <Card>
      <TaxMatricsHeader
        searchData={searchData}
        handleEditPage={handleEditPage}
      />

      <ProductTermTable
        data={searchEnabled ? filteredData : paymentData.data}
        searchEnabled={searchEnabled}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        isLoading={paymentData.isLoading}
        item={item}
        changeLanguage={changeLanguage}
      />

      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={item.id ? t("EDIT_PAYMENT_TERM") : t("NEW_PAYMENT_TERM")}
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
                // required={true}
                control={control}
                errors={errors}
                defaultValue={item.altName}
              />
              <CommonTextArea
                name="description"
                id="description"
                label={"Description"}
                type={"string"}
                control={control}
                errors={errors}
                defaultValue={item.description}
                rows={4}
              />
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                control={control}
                errors={errors}
                defaultValue={item.externalReference}
              />

              <Typography sx={{ fontSize: "15px", fontWeight: "700" }}>
                {t("SET_UP")}
              </Typography>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <CustomRadio />
              </Box>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <CommonInput
                  name="days"
                  id="days"
                  label="No Of Days"
                  control={control}
                  errors={errors}
                  defaultValue={item.days}
                  required={true}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox {...label} />
                <Typography>{t("FIXED_DAY_OF_THE_MONTH")}</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: "10px" }}>
                <CommonInput
                  name="months"
                  id="months"
                  label="No Of Month"
                  control={control}
                  errors={errors}
                  defaultValue={item.months}
                  required={true}
                />
              </Box>

              <Typography sx={{ fontSize: "15px", fontWeight: "700" }}>
                {t("EARLY_DISCOUNT")}
              </Typography>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <CustomDiscunt
                  control={control}
                  errors={errors}
                  btn={true}
                  discountInfo={discountInfo}
                  addDiscountInfo={addDiscountInfo}
                  handleInputChange={handleInputChange}
                />
              </Box>

              <Box sx={{ display: "flex", gap: "10px" }}>
                <div style={{ marginLeft: "12px" }}>
                  <div>{t("STATUS")}</div>
                  <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                    <CommonSwitch
                      active={switchActive}
                      setActive={setSwitchActive}
                      statusChange={() => ({})}
                    />{" "}
                    {switchActive ? t("ACTIVE") : t("INACTIVE")}
                  </div>
                </div>
              </Box>
              {nextWeekFormattedDate &&
                watchedValues.paymentMethod === "CREDIT" &&
                watchedValues?.weekdayOfPayment && (
                  <CommonNote getmonth={getmonth} />
                )}
            </div>
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={paymentData?.isLoading}
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
              <div className="">
                <div className={classes.viewContent_label}>{t("TYPE")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.externalReference}
                </div>
              </div>
            </div>
            <div>
              <div className={classes.viewContent_label}>
                {t("DESCRIPTION")}
              </div>
              <div style={{ width: "100%", wordWrap: "break-word" }}>
                {selectedViewRecord.description}
              </div>
            </div>
          </div>
          <Typography sx={{ margin: "22px", fontWeight: "bold" }}>
            SetUp
          </Typography>
          <div className={classes.viewRapper}>
            <div className="">
              <div className={classes.viewContent_label}>
                {t("PAYMENT_METHOD")}
              </div>
              <div className={classes.viewContent_value}>
                {selectedViewRecord.paymentMethod}
              </div>
            </div>

            <div className="">
              <div className={classes.viewContent_label}>{t("DAYS")}</div>
              <div className={classes.viewContent_value}>
                {selectedViewRecord.days}
              </div>
            </div>
            <div className="">
              <div className={classes.viewContent_label}>{t("MONTHS")}</div>
              <div className={classes.viewContent_value}>
                {selectedViewRecord.weekdayOfPayment}
              </div>
            </div>

            <div className="">
              <div className={classes.viewContent_label}>{t("STATUS")}</div>
              <div className={classes.viewContent_value}>
                {selectedViewRecord.active === true ? "Active" : "InActive"}
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "20px", marginRight: "20px" }}>
            <div className="">
              <div className={classes.viewContent_label}>
                {t("EARLY_DISCOUNT")}
              </div>
              <div className={classes.viewContent_value}>
                {selectedViewRecord.discount}
              </div>
            </div>

            <CustomDiscunt control={control} errors={errors} />
          </div>
          <div className={classes.viewContentbottom}>
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
      {dialogView ? (
        <BusinessTaxGroupModel
          busData={busData}
          setDialogView={setDialogView}
        />
      ) : null}
      {productDialogView ? (
        <ProductTaxGroupModel
          resData={resData}
          setDialogView={setProductDialogView}
        />
      ) : null}
    </Card>
  );
};

export default PaymentTerm;
