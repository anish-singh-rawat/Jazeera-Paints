import { yupResolver } from "@hookform/resolvers/yup";
import { Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
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
import ProductCategoryTable from "src/components/product/product-category/ProductCategoryTable";
import { AppDispatch, RootState } from "src/store";
import {
  ProductcategoryCreate,
  ProductcategoryUpdate,
  getProductCategory,
} from "src/store/apps/product/product-category";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import * as yup from "yup";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import { RevestCodeFormValidator } from "src/@core/form-validator";

const ProductCategory = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [sDate, setSDate] = useState<Date | null>(null);
  const [eDate, setEDate] = useState<Date | null>(null);
  const [productCategorys, setProductCategorys] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const classes = useStyles();
  const { t } = useTranslation();
  const productCategory: any = useSelector(
    (state: RootState) => state.productCategory
  );
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
    ? yup.string()
    : RevestCodeFormValidator(productCategory.data, item),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isValueUnique(productCategory.data, value, "name", item);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isValueUnique(productCategory.data, value, "altName", item);
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


  const businessTaxGroup: any = useSelector(
    (state: RootState) => state.businessTaxGroup
  );

  const productTaxGroup: any = useSelector(
    (state: RootState) => state.productTaxGroup
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

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
    dispatch(getProductCategory({}));
    dispatch(
      sequenceMappingCodeSearch({ entityType: "PRODUCT_CATEGORY_CODE" })
    );
  }, []);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  useEffect(() => {
    setProductCategorys(productCategory?.data);
  }, [productCategory]);

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
  };

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.active = switchActive;
    sequenceMapData?.autoGeneration && !data.id && delete data.code;

    if (!data.id) {
      res = await dispatch(ProductcategoryCreate(data));
    } else {
      res = await dispatch(ProductcategoryUpdate(data));
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

  const disableActiveToggle = productCategorys.filter(
    (d: any) => d?.id == item?.id && d?.productSubCategory?.length
  ).length;

  return (
    <Card>
      <ProductCategoryTable
        data={productCategorys}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        item={item}
        isLoading={productCategory.isLoading}
      />
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              item.id ? t("EDIT_PRODUCT_CATEGORY") : t("NEW_PRODUCT_CATEGORY")
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
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="REFERENCE"
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
                    disabled={disableActiveToggle}
                  />{" "}
                  {switchActive ? t("ACTIVE") : t("INACTIVE")}
                  {disableActiveToggle ? (
                    <div>
                      {" "}
                      {/* <Typography variant="caption" fontSize={".8"}>
                        {t("CATOGARY_ASSOCIATION_TOGGLE_ERROR")}
                      </Typography> */}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={productCategory?.isLoading}
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
                  {t("EXTERNAL_REFERENCE")}
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

export default ProductCategory;
