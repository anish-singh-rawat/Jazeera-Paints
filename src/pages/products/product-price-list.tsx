import { yupResolver } from "@hookform/resolvers/yup";
import { Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { ReactDatePickerProps } from "react-datepicker";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { isValueUnique } from "src/@core/utils/check-unique";
import { hours12 } from "src/@core/utils/format";
import CommonButton from "src/components/common/CommonButton";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import ProductPriceListTable from "src/components/product/product-price-list/ProductPriceListTable";
import BusinessTaxGroupModel from "src/components/tax-configuration/tax-matrics/BusinessTaxGroupModel";
import ProductTaxGroupModel from "src/components/tax-configuration/tax-matrics/ProductTaxGroupModel";
import TaxMatricsHeader from "src/components/tax-configuration/tax-matrics/TaxMatricsHeader";
import { AppDispatch, RootState } from "src/store";
import {
  ProductPriceListCreate,
  ProductPriceListUpdate,
  getProductPriceList,
} from "src/store/apps/product/product-price-list";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import * as yup from "yup";

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
});

const ProductPriceList = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [dialogView, setDialogView] = useState(false);
  const [productDialogView, setProductDialogView] = useState(false);
  const [resData] = useState("");
  const [busData] = useState("");
  const [sDate, setSDate] = useState<Date | null>(null);
  const [eDate, setEDate] = useState<Date | null>(null);
  const [productSubCategorys, setSubProductCategorys] = useState<any>([]);

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement: ReactDatePickerProps["popperPlacement"] =
    direction === "ltr" ? "bottom-start" : "bottom-end";

  const schema = yup.object().shape({
    code: yup
      .string()
      .required("REQUIRED")
      .min(2, "Code must be at least 2 characters")
      .max(6, "Code can be at most 6 characters")
      .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric")
      .test("unique-code", "Code already exists", function (value) {
        return isValueUnique(productPriceList.data, value, "code", item);
      }),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isValueUnique(productPriceList.data, value, "name", item);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isValueUnique(productPriceList.data, value, "altName", item);
      }),
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    setError,
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
    setSwitchActive(item?.active);
    setSDate(
      sDate ? sDate : item?.startDate ? new Date(item?.startDate) : sDate
    );
    setEDate(item?.endDate ? new Date(item?.endDate) : eDate);
  }, [item, setValue]);

  const productPriceList: any = useSelector(
    (state: RootState) => state.productPriceList
  );

  const businessTaxGroup: any = useSelector(
    (state: RootState) => state.businessTaxGroup
  );

  const productTaxGroup: any = useSelector(
    (state: RootState) => state.productTaxGroup
  );

  useEffect(() => {
    dispatch(getProductPriceList({}));
  }, []);

  useEffect(() => {
    setSubProductCategorys(productPriceList?.data);
  }, [productPriceList]);

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
  };

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const handleUniqueCode = (e: any) => {
    console.log(e.target.value);
    const { value } = e.target;

    const matchingItem = productPriceList.data.find(
      (item: any) => item.code === value
    );
    if (matchingItem) {
      setError("code", {
        type: "manual",
        message: "THIS_CODE_ALREADY_EXIST_",
      });
    }
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.active = switchActive;

    if (!data.id) {
      res = await dispatch(ProductPriceListCreate(data));
    } else {
      res = await dispatch(ProductPriceListUpdate(data));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
  
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  return (
    <Card>
      <ProductPriceListTable
        data={productSubCategorys ? productSubCategorys : []}
        searchEnabled={searchEnabled}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        item={item}
        isLoading={productPriceList.isLoading}
      />

      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              item.id ? t("EDIT_PRODUCT_PRICELIST") : t("ADD_PRODUCT_PRICELIST")
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
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                // required={true}
                control={control}
                errors={errors}
                defaultValue={item.externalReference}
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
              disabled={productPriceList?.isLoading}
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
                <div className={classes.viewContent_label}>
                  {t("Reference")}
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

export default ProductPriceList;
