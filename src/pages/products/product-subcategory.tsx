import { yupResolver } from "@hookform/resolvers/yup";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameFormValidator,
} from "src/@core/form-validator";
import { hours12 } from "src/@core/utils/format";
import CommonButton from "src/components/common/CommonButton";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";
import ProductSubCategoryTable from "src/components/product/product-sub-category/ProductSubCategoryTable";
import { ProductCategory } from "src/components/product/type";
import { axiosInstance as axios } from "src/configs/axios";
import { AppDispatch, RootState } from "src/store";
import { ROOT_BASE_API } from "src/store/apps";
import { getProductCategory } from "src/store/apps/product/product-category";
import { clearProductData } from "src/store/apps/product/product-search";
import {
  ProductSubcategoryCreate,
  ProductSubcategoryUpdate,
  getProductSubCategory,
} from "src/store/apps/product/product-sub-category";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import * as yup from "yup";

// Styles
import { useStyles } from "src/styles/viewEdit.style";

const ProductSubCategory = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const searchEnabled = false;
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [productSubCategories, setProductsSubCategories] = useState([]);
  const [productData, setProductData] = useState([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const productCategory: ProductCategory[] = useSelector(
    (state: RootState) => state?.productCategory?.data
  ) as ProductCategory[];

  const productSubCategory: any = useSelector(
    (state: RootState) => state?.productSubCategory
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(productSubCategory.data, item),
    name: RevestNameFormValidator(productSubCategory.data, item),
    altName: RevestAltNameFormValidator(productSubCategory.data, item),
    productCategory: item?.productCategory
      ? yup.mixed()
      : yup.object().typeError("select product catogary").required("REQUIRED"),
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

    setValue("tenantId", item?.tenantId);
    setValue("companyId", item?.companyId);
    setValue("tax", item?.tax);
    setSwitchActive(item?.active);
  }, [item, setValue]);

  useEffect(() => {
    dispatch(getProductSubCategory({}));
    dispatch(getProductCategory({}));
    dispatch(
      sequenceMappingCodeSearch({ entityType: "PRODUCT_SUB_CATEGORY_CODE" })
    );
  }, []);

  useEffect(() => {
    setProductsSubCategories(productSubCategory?.data);
  }, [productSubCategory]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

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
  };

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    const requestData: any = {
      // code: "",
      name: "",
      altName: "",
      externalReference: "",
      active: true,
      productCategoryId: "",
      companyId: 0,
      tenantId: 0,
    };
    if (!sequenceMapData?.autoGeneration) {
      requestData.code = data.code;
    }
    requestData.name = data.name;
    requestData.altName = data.altName;
    requestData.productCategoryId = data?.productCategory?.id;
    requestData.externalReference = data.externalReference;
    requestData.active = switchActive;
    requestData.companyId = data.companyId;
    requestData.tenantId = data.tenantId;
    requestData.id = data.id;

    if (!data.id) {
      res = await dispatch(ProductSubcategoryCreate(requestData));
    } else {
      res = await dispatch(ProductSubcategoryUpdate(requestData));
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

  const mystate = useSelector((state: any) => state?.productSlice?.name);
  const myId = useSelector((state: any) => state?.productSlice?.id);

  useEffect(() => {
    if (myId && mystate) {
      axios
        .get(ROOT_BASE_API + "Productsubcategory", {
          params: {
            searchItem: myId,
          },
        })
        .then((response) => {
          setProductData(response?.data?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const searchStateHandler = (v: string) => {
    if (v === "" && myId && mystate) {
      dispatch(getProductSubCategory({}));
      dispatch(getProductCategory({}));
      setProductData([]);
      dispatch(clearProductData());
    }
  };

  return (
    <Card>
      <ProductSubCategoryTable
        data={productData?.length ? productData : productSubCategories}
        searchEnabled={searchEnabled}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        item={item}
        isLoading={productSubCategory.isLoading}
        name={mystate}
        searchStateHandler={searchStateHandler}
      />

      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              item.id
                ? t("EDIT_PRODUCT_SUBCATEGORY")
                : t("NEW_PRODUCT_SUBCATEGORY")
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
                defaultValue={"code"}
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
                name="productCategory"
                options={productCategory.filter((item) => {
                  return item.active;
                })}
                control={control}
                label={"Product Category"}
                placeholder={"Select Product Category"}
                validateForm={{}}
                required={true}
                errors={errors}
                setValue={setValue}
                noOptionsText={false}
                clearErrors={clearErrors}
                active={true}
                defaultValue={item?.productCategory}
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
              disabled={productSubCategory?.isLoading}
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

export default ProductSubCategory;
