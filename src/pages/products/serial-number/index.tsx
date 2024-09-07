import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Grid, Card } from "@mui/material";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonInput from "src/components/common/CommonInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import CommonButton from "src/components/common/CommonButton";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { hours12 } from "src/@core/utils/format";
import { useTranslation } from "react-i18next";
import AppStorage from "src/app/AppStorage";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import {
  productSerialNumbersCreate,
  productSerialNumbersGet,
  productSerialNumbersUpdate,
} from "src/store/apps/productSerialNumber/productSerialNumber";
import ProductsSerialNumberDataTable from "src/components/productSerialNumber/productSerialNumberDataTable";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import {
  fetchProductsListData,
  productsGet,
} from "src/store/apps/products/products-add/productsAdd";
import {
  SerialNumberItem,
  defaultValues,
} from "src/types/forms/productsSerialNumberType";
import CommonSelect from "src/components/common/CommonSelect";
import CommonServerSelect from "src/components/common/CommonServerSelect";
import { RevestCodeFormValidator } from "src/@core/form-validator";

const index = () => {
  const [serialNumberItem, setSerialNumberItem] =
    useState<SerialNumberItem>(defaultValues);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [setserialNumbers, setSetserialNumbers] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [optionSelected, setOptionSelected] = useState<boolean>(false);

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const productSerialNumbersStore: any = useSelector(
    (state: RootState) => state.productSerialNumbersStore
  );

  const products = useSelector(
    (state: RootState) => state.productsAdd.data.addedProducts
  ) as any;

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    dispatch(productSerialNumbersGet());
    dispatch(productsGet());
    dispatch(
      sequenceMappingCodeSearch({ entityType: "PRODUCTS_SERIAL_NUMBERS" })
    );
  }, []);

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  useEffect(() => {
    setSetserialNumbers(productSerialNumbersStore?.data);
  }, [productSerialNumbersStore]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const handleEditPage = async (id: string) => {
    setOpen(true);
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
    //  code: sequenceMapData?.autoGeneration
    // ? yup.string()
    // : RevestCodeFormValidator(productSerialNumbersStore.data, serialNumberItem),
    serialNumber: yup
      .string()
      .required("REQUIRED")
      .min(2, "Serial Number must be at least 2 characters")
      .max(30, "Serial Number can be at most 30 characters"),
    products: yup.object().shape({
      shortName: yup.string().required("Product is Required"),
    }),
  });

  const isCodeUnique = (data: any, value: any) => {
    // When editing an existing item
    if (serialNumberItem.id) {
      // Check if there's another record with the same code and a different ID
      const matchingItem = data.find((record: any) => {
        return record.code === value && record.id !== serialNumberItem.id;
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
    defaultValues: serialNumberItem,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue(
      "code",
      sequenceMapData?.autoGeneration && !serialNumberItem?.id
        ? "Auto Generated"
        : serialNumberItem?.code
    );
    setValue("externalReference", serialNumberItem?.externalReference);
    setValue("createdBy", serialNumberItem?.createdBy);
    setValue(
      "createdOn",
      new Date(serialNumberItem?.createdOn).toLocaleString()
    );
    setValue("updatedBy", serialNumberItem?.updatedBy);
    setValue(
      "updatedOn",
      new Date(serialNumberItem?.updatedOn).toLocaleString()
    );
    setValue("id", serialNumberItem?.id);
    setValue("serialNumber", serialNumberItem?.serialNumber);
    setValue("products", serialNumberItem?.products);
  }, [serialNumberItem, setValue]);

  const handleCloseDrawer = () => {
    setOpen(false);
    reset();
    setSerialNumberItem(defaultValues);
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

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    (data.products = {
      id: data?.products?.id,
    }),
      sequenceMapData?.autoGeneration && !data.id && delete data.code;
    if (!data.id) {
      res = await dispatch(productSerialNumbersCreate(data));
    } else {
      console.log("======update");

      res = await dispatch(productSerialNumbersUpdate(data));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={6}
            // justifyContent={"center"}
          >
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={111}
                trendDiff={0}
                title={t("TOTAL")}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:device-tablet"
                title={t("ASSIGNED")}
                stats={111}
                trendDiff={0}
                // avatarColor="success"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:device-desktop"
                title={t("UNASSIGNED")}
                stats={111}
                trendDiff={0}
                avatarColor="error"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <Card>
        <ProductsSerialNumberDataTable
          data={setserialNumbers}
          isLoading={productSerialNumbersStore.isLoading}
          selectedRecord={selectedRecord}
          handleEditPage={handleEditPage}
          setSerialNumberItem={setSerialNumberItem}
          serialNumberItem={serialNumberItem}
          changeLanguage={changeLanguage}
        />

        {/* Edit Record inside Drawer */}
        <CommonDrawer open={open} toggle={handleCloseDrawer}>
          <div className={classes.drawerWrapper}>
            <CommonDrawerHeader
              title={
                serialNumberItem.id
                  ? t("EDIT_PRODUCT_SERIAL_NUMBER")
                  : t("NEW_PRODUCT_SERIAL_NUMBER")
              }
              handleClose={handleCloseDrawer}
            />
            <form
              className={classes.form}
              onSubmit={handleSubmit(onSubmit, onErrors)}
            >
              <div className={classes.formContent}>
                {/* <CommonInput
                  name="code"
                  id="code"
                  label="Code"
                  required={!sequenceMapData?.autoGeneration}
                  control={control}
                  errors={errors}
                  disabled={sequenceMapData?.autoGeneration}
                  defaultValue={"Auto Generated"}
                /> */}
                <CommonInput
                  name="serialNumber"
                  id="serialNumber"
                  label="Serial Number"
                  required={true}
                  control={control}
                  errors={errors}
                  defaultValue={serialNumberItem?.serialNumber}
                />
                {/* <CommonSelect
                  name="products"
                  options={products}
                  control={control}
                  label={"Products"}
                  validateForm={{}}
                  required={true}
                  errors={errors}
                  setValue={setValue}
                  defaultValue={
                    serialNumberItem.id ? serialNumberItem.products : null
                  }
                  noOptionsText={false}
                  clearErrors={clearErrors}
                /> */}
                <CommonServerSelect
                  getOptionLabel={(option: any) =>
                    option?.shortName || option?.code || ""
                  }
                  dispatchFunction={fetchProductsListData} // Pass your thunk function
                  defaultList={products}
                  helperText={errors?.products?.message}
                  error={errors?.products?.message as any}
                  label="products"
                  required={true}
                  onChange={(e: any, value: any) => {
                    setValue("products", value);
                    clearErrors("products");
                    setOptionSelected(true);
                  }}
                  setOptionSelected={setOptionSelected}
                  optionSelected={optionSelected}
                  defaultValue={serialNumberItem.products}
                />
                <CommonInput
                  name="externalReference"
                  id="externalReference"
                  label="External Reference"
                  control={control}
                  errors={errors}
                  defaultValue={serialNumberItem.externalReference}
                />
              </div>

              <CommonFormActionButtons
                handleCloseDrawer={handleCloseDrawer}
                disabled={productSerialNumbersStore.isLoading}
              />
            </form>
          </div>
        </CommonDrawer>

        <CommonDrawer
          open={viewOpen}
          toggle={viewToggle}
          // styles={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
        >
          <div className={classes.drawerWrapper}>
            <CommonDrawerHeader
              title={selectedViewRecord.serialNumber}
              handleClose={handleCloseViewDrawer}
            />
            <div style={{ padding: "0 24px" }}>
              <div className={classes.viewContent}>
                <div className="">
                  <div className={classes.viewContent_label}>{t("CODE")}</div>
                  <div className={classes.viewContent_value}>
                    {selectedViewRecord?.code
                      ? selectedViewRecord?.code
                      : selectedViewRecord?.products?.code}
                  </div>
                </div>
                <div className="">
                  <div className={classes.viewContent_label}>
                    {t("SERIAL_NUMBER")}
                  </div>
                  <div className={classes.viewContent_value}>
                    {selectedViewRecord.serialNumber}
                  </div>
                </div>
                <div className="">
                  <div className={classes.viewContent_label}>
                    {t("PRODUCT_NAME")}
                  </div>
                  <div className={classes.viewContent_value}>
                    {selectedViewRecord.products?.shortName}
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
                  {selectedViewRecord.createdOn && (
                    <div className={classes.viewContent_value}>
                      {getDate(selectedViewRecord.createdOn)}
                      {` | ${hours12(selectedViewRecord.createdOn)}`}
                    </div>
                  )}
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
                  {selectedViewRecord.updatedOn && (
                    <div className={classes.viewContent_value}>
                      {getDate(selectedViewRecord.updatedOn)}
                      {` | ${hours12(selectedViewRecord.updatedOn)}`}
                    </div>
                  )}
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
    </>
  );
};

export default index;
