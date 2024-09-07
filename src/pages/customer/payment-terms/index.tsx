import { yupResolver } from "@hookform/resolvers/yup";
import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import ProductTermTable from "src/components/payment/payment-terms/ProductTermTable";
import ViewContent from "src/components/payment/payment-terms/ViewContent";
import PaymentForm from "src/components/payment/payment-terms/paymentform";
import useStyles from "src/components/payment/payment-terms/style";
import BusinessTaxGroupModel from "src/components/tax-configuration/tax-matrics/BusinessTaxGroupModel";
import ProductTaxGroupModel from "src/components/tax-configuration/tax-matrics/ProductTaxGroupModel";
import TaxMatricsHeader from "src/components/tax-configuration/tax-matrics/TaxMatricsHeader";
import { AppDispatch, RootState } from "src/store";
import { paymentTermSchema } from "src/components/payment/payment-terms/paymentTermSchema";
import {
  getPaymentTerms,
  paymentCreate,
  paymentUpdate,
} from "src/store/apps/payment-terms/payment_terms";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import * as yup from "yup";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

interface earlyDiscountInfo {
  id: number;
  uuid: "string";
  sno: string | number;
  noOfDays: string | number;
  discount: string | number;
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
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Credit");
  const [discountInfo, setDiscountInfo] = useState<earlyDiscountInfo[]>([
    {
      id: 0,
      uuid: "string",
      sno: "",
      noOfDays: "",
      discount: "",
    },
  ]);

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const paymentData: any = useSelector(
    (state: RootState) => state.paymentConfiguration
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const schema = yup.object().shape({
    code: yup.string().when("sequenceMapData.autoGeneration", {
      is: false,
      then: yup
        .string()
        .required("REQUIRED")
        .min(2, "Code must be at least 2 characters")
        .max(6, "Code can be at most 6 characters")
        .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric")
        .test("unique-code", "Code already exists", function (value) {
          return isCodeUnique(paymentData.data, value);
        }),
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
    paymentMethod: "",
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
    resolver: yupResolver(paymentTermSchema(paymentData)),
  });

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

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

  useEffect(() => {
    dispatch(getPaymentTerms({}));
    dispatch(sequenceMappingCodeSearch({ entityType: "PAYMENT_TERMS_CODE" }));
  }, []);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

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
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
  };

  const watchedValues = watch();

  interface DayInfo {
    dayOfWeek: string;
    formattedDate: string;
  }

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
      name: "",
      altName: "",
      description: "",
      paymentMethod: "",
      externalReference: "",
      endDate: "2023-11-03T10:02:41.617Z",
      startDate: "2023-11-03T10:02:41.617Z",
      active: true,
      companyId: 0,
      tenantId: 0,
      isFixedDayOfMonth: true,
      noOfDays: 0,
      paymentTermsDiscount: [
        {
          id: 0,
          uuid: "string",
          sno: 0,
          noOfDays: 0,
          discount: 0,
        },
      ],
      dayOfMonth: 0,
    };

    if (!sequenceMapData?.autoGeneration) {
      requestData.code = data.code;
    }
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
    requestData.active = switchActive;
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
    setDiscountInfo([...discountInfo, { sno: "", noOfDays: "", discount: "" }]);
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
            <PaymentForm
              control={control}
              errors={errors}
              item={item}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              discountInfo={discountInfo}
              addDiscountInfo={addDiscountInfo}
              handleInputChange={handleInputChange}
              switchActive={switchActive}
              setSwitchActive={setSwitchActive}
              sequenceMapData={sequenceMapData}
            />
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={paymentData?.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>

      <CommonDrawer open={viewOpen} toggle={viewToggle}>
        <ViewContent
          selectedViewRecord={selectedViewRecord}
          handleCloseViewDrawer={handleCloseViewDrawer}
          control={control}
          discountInfo={discountInfo}
          errors={errors}
        />
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
