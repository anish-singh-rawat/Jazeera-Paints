import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductsBatchDataTable from "src/components/productsBatch/productsBatchDataTable";
import { defaultValues, BatchItem } from "src/types/forms/productsBatchTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import CommonDrawer from "src/components/common/CommonDrawer";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import { useTranslation } from "react-i18next";
import CommonInput from "src/components/common/CommonInput";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonDatePicker from "src/components/common/CommonDatePicker";
import { AppDispatch, RootState } from "src/store";
import Grid from "@mui/material/Grid";
import { Autocomplete, TextField } from "@mui/material";
import differenceInMonths from "date-fns/differenceInMonths";
import differenceInDays from "date-fns/differenceInDays";
import differenceInYears from "date-fns/differenceInYears";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import CommonButton from "src/components/common/CommonButton";
import CommonTextArea from "src/components/common/CommonTextArea";
import {
  productBatchUpdate,
  productsBatchCreate,
} from "src/store/apps/productBatch/productBatch";
import CommonAssignUnAssignModal from "src/components/common/CommonAssignUnAssignModal";
import {
  fetchProductsListData,
  productsGet,
} from "src/store/apps/products/products-add/productsAdd";
import CommonSelect from "src/components/common/CommonSelect";
import CommonServerSelect from "src/components/common/CommonServerSelect";
import { RevestCodeFormValidator } from "src/@core/form-validator";

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
  expiryShelf: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    // paddingBottom: "24px",
    borderBottom: "6px solid #3586C7",
    borderRadius: "0px 0px 6px 6px",
  },
  downLoadBtn: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  },
  disabled: {
    borderRadius: "5px",
    "& .MuiInputBase-input": {
      height: "10px !important",
      backgroundColor: "#e3e3e3 !important",
      padding: "12px !important",
      borderRadius: "5px",
    },
  },
  dateHeadings: {
    fontSize: 13,
    fontWeight: 700,
  },
  dateSubHeading: {
    fontSize: 12,
    marginBottom: 5,
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
});

const theme = createTheme({
  components: {
    MuiInput: {
      styleOverrides: {
        input: {
          color: "#fff", // Change '#fff' to the desired color for disabled text
        },
      },
    },
  },
});

const ProductsBatch: React.FC<{}> = () => {
  const [batchItem, setBatchItem] = useState<BatchItem>(defaultValues);
  const [open, setOpen] = useState<Boolean>(false);
  const [productsBatchData, setProductsBatchData] = useState<{}[]>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [fetchLatestData, setFetchLatestData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optionSelected, setOptionSelected] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const classes = useStyles();

  const productsBatch = useSelector((state: RootState) => state.productsBatch);

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(productsBatch?.data, batchItem),
    startDate: yup.string().required(""),
    endDate: yup.string().required(""),
    products: yup
      .mixed()
      .test("products", "REQUIRED", (item: any) => item?.shortName),
  });

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const products = useSelector(
    (state: RootState) => state.productsAdd.data.addedProducts
  ) as any;

  useEffect(() => {
    setProductsBatchData(productsBatch?.data);
  }, [productsBatch]);

  useEffect(() => {
    dispatch(sequenceMappingCodeSearch({ entityType: "PRODUCT_BATCH_CODE" }));
    dispatch(productsGet());
  }, []);

  const { t } = useTranslation();

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: { ...batchItem },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (batchItem?.id) {
      setValue("id", batchItem?.id);
      setValue("code", batchItem?.code);
      setValue("name", batchItem?.name);
      setValue("altName", batchItem?.altName);
      setValue("dateOfManufacture", batchItem?.dateOfManufacture);
      setValue("shelfLifeExpiryDate", batchItem?.shelfLifeExpiryDate);
      setValue("externalReference", batchItem?.externalReference);
      setValue("description", batchItem?.description);
      setValue(
        "startDate",
        moment(batchItem?.dateOfManufacture).format("DD-MM-YYYY")
      );
      setValue(
        "endDate",
        moment(batchItem?.shelfLifeExpiryDate).format("DD-MM-YYYY")
      );
      setSwitchActive(batchItem?.active);
      setValue("products", batchItem?.products);
    }
  }, [batchItem?.id]);

  const handleEditPage = (type: string | undefined) => {
    type === "view" ? setViewOpen(true) : setOpen(true);
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
  };

  const handleCloseDrawer = () => {
    reset();
    setBatchItem({
      ...defaultValues,
      dateOfManufacture: null,
      shelfLifeExpiryDate: null,
    });
    setValue("startDate", null);
    setValue("endDate", null);
    setOpen(false);
    clearErrors();
    setBatchItem(defaultValues);
  };
  const onSubmit = async (data: any, event: any) => {
    let res: any;
    let payload: any = {
      // code: data?.code,
      // name: "nameText",
      products: {
        id: data?.products?.id,
      },
      description: data?.description,
      dateOfManufacture: batchItem?.dateOfManufacture,
      shelfLifeExpiryDate: batchItem?.shelfLifeExpiryDate,
      externalReference: data?.externalReference,
      active: switchActive,
      id: data?.id,
    };
    if (!sequenceMapData?.autoGeneration) {
      payload.code = data.code;
    }
    if (!data.id) {
      res = await dispatch(productsBatchCreate(payload));
    } else {
      // let newpayload = { id: batchItem.id, ...payload };
      res = await dispatch(productBatchUpdate(payload));
    }

    if (res?.payload?.message) {
      handleCloseDrawer();
      setFetchLatestData(true);
    }
  
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      setBatchItem({
        ...batchItem,
        [e.target.name]: e.target.value,
        ["altName"]: e.target.value,
      });
      clearErrors("altName");
    } else {
      setBatchItem({
        ...batchItem,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSetView = (data: any) => {
    setViewOpen(true);
  };

  return (
    <>
      <div>
        <ProductsBatchDataTable
          data={(productsBatchData as []) ?? []}
          fetchLatestData={fetchLatestData}
          setFetchLatestData={setFetchLatestData}
          isLoading={productsBatch?.isLoading}
          selectedRecord={handleSetView}
          handleEditPage={handleEditPage}
          setBatchItem={setBatchItem}
          batchItem={batchItem}
          rowCount={productsBatch?.totalCount}
        />
      </div>

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={batchItem?.id ? t("EDIT_PRODUCT_BATCH") : t("ADD_NEW")}
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={(e) => handleChange(e)}
          >
            <div className={classes.formContent}>
              <CommonInput
                name="code"
                id="code"
                label={"BATCH_"}
                required={!sequenceMapData?.autoGeneration}
                control={control}
                errors={errors}
                disabled={sequenceMapData?.autoGeneration}
                defaultValue={"Auto Generated"}
              />
              {/* <div>{t("PRODUCTS")}*</div>
              <Autocomplete
                size="small"
                disablePortal
                classes={{
                  option: classes.option,
                  popper: classes.popper,
                }}
                defaultValue={batchItem?.products}
                placeholder={t("PRODUCTS") as string}
                options={products ?? []}
                onChange={(e, value: any) => {
                  setValue("products", value);
                  clearErrors("products");
                }}
                renderInput={(params) => (
                  <TextField
                    helperText={errors?.products?.message}
                    error={errors?.products?.message as any}
                    {...params}
                  />
                )}
                getOptionLabel={(option: any) => option?.shortName ?? ""}
                renderOption={(props, option: any) => {
                  return (
                    <li {...props} key={option.id}>
                      {option?.shortName}
                    </li>
                  );
                }}
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
                defaultValue={batchItem?.products}
              />
              <Grid
                container
                rowSpacing={1}
                alignItems={"end"}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12}>
                  <CommonDatePicker
                    name="startDate"
                    control={control}
                    required={true}
                    placeholderText={t("START_DATE")}
                    label={t("MANUFACTURING_DATE")}
                    errors={errors}
                    clearErrors={clearErrors}
                    format={"dd-MM-yyyy"}
                    cb={(date: any) => {
                      setBatchItem({
                        ...batchItem,
                        dateOfManufacture: new Date(date),
                      });
                    }}
                    selectedDate={
                      batchItem?.dateOfManufacture
                        ? new Date(batchItem?.dateOfManufacture)
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <CommonDatePicker
                    name="endDate"
                    control={control}
                    required={true}
                    placeholderText={t("END_DATE")}
                    label={t("EXPIRY_DATE")}
                    errors={errors}
                    clearErrors={clearErrors}
                    format={"dd-MM-yyyy"}
                    cb={(date: any) => {
                      setBatchItem({
                        ...batchItem,
                        shelfLifeExpiryDate: new Date(date),
                      });
                    }}
                    selectedDate={
                      batchItem?.shelfLifeExpiryDate
                        ? new Date(batchItem?.shelfLifeExpiryDate)
                        : null
                    }
                    minDate={
                      batchItem?.dateOfManufacture
                        ? new Date(batchItem?.dateOfManufacture)
                        : null
                    }
                    showpreferedDate={false}
                    disabled={batchItem?.dateOfManufacture ? false : true}
                  />
                </Grid>
              </Grid>
              <div>
                <Typography className={classes.dateHeadings}>
                  {t("TOTAL_SHELF_LIFE")}
                </Typography>
                <Typography className={classes.dateSubHeading}>
                  {t("DATE_HINT")}
                </Typography>
                <ThemeProvider theme={theme}>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={4}>
                      <div>{t("DAYS")}</div>
                      <TextField
                        className={classes.disabled}
                        name="days"
                        id="days"
                        value={
                          batchItem?.shelfLifeExpiryDate
                            ? differenceInDays(
                                new Date(batchItem?.shelfLifeExpiryDate) ??
                                  new Date(),
                                new Date(batchItem?.dateOfManufacture) ??
                                  new Date()
                              )
                            : 0
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <div>{t("MONTHS")}</div>
                      <TextField
                        className={classes.disabled}
                        name="months"
                        id="months"
                        value={
                          batchItem?.shelfLifeExpiryDate
                            ? differenceInMonths(
                                new Date(batchItem?.shelfLifeExpiryDate) ??
                                  new Date(),
                                new Date(batchItem?.dateOfManufacture) ??
                                  new Date()
                              )
                            : 0
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <div>{t("YEARS")}</div>
                      <TextField
                        className={classes.disabled}
                        name="years"
                        id="years"
                        value={
                          batchItem?.shelfLifeExpiryDate
                            ? differenceInYears(
                                new Date(batchItem?.shelfLifeExpiryDate) ??
                                  new Date(),
                                new Date(batchItem?.dateOfManufacture) ??
                                  new Date()
                              )
                            : 0
                        }
                        disabled
                      />
                    </Grid>
                  </Grid>
                </ThemeProvider>
              </div>
              <div>
                <Typography className={classes.dateHeadings}>
                  {t("REMAINING_SHELF_LIFE")}
                </Typography>
                <Typography className={classes.dateSubHeading}>
                  {t("DATE_HINT")}
                </Typography>
                <ThemeProvider theme={theme}>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={4}>
                      <div>{t("DAYS")}</div>
                      <TextField
                        className={classes.disabled}
                        name="days"
                        id="days"
                        value={
                          batchItem?.dateOfManufacture
                            ? differenceInDays(
                                new Date(batchItem?.dateOfManufacture) ??
                                  new Date(),
                                new Date()
                              )
                            : 0
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <div>{t("MONTHS")}</div>
                      <TextField
                        className={classes.disabled}
                        name="months"
                        id="months"
                        value={
                          batchItem?.shelfLifeExpiryDate
                            ? differenceInMonths(
                                new Date(batchItem?.shelfLifeExpiryDate) ??
                                  new Date(),
                                new Date()
                              )
                            : 0
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <div>{t("YEARS")}</div>
                      <TextField
                        className={classes.disabled}
                        name="years"
                        id="years"
                        value={
                          batchItem?.shelfLifeExpiryDate
                            ? differenceInYears(
                                new Date(batchItem?.shelfLifeExpiryDate) ??
                                  new Date(),
                                new Date()
                              )
                            : 0
                        }
                        disabled
                      />
                    </Grid>
                  </Grid>
                </ThemeProvider>
              </div>
              <CommonSelect
                name="supplierId"
                options={[]}
                control={control}
                label={t("SUPPLIER_ID")}
                placeholder={t("TYPE_SELECT")}
                validateForm={{}}
                // required={true}
                errors={errors}
                setValue={setValue}
                defaultValue={[]}
                noOptionsText={false}
                clearErrors={clearErrors}
                disabled
              />
              <CommonInput
                name="supplierBatchNumber"
                id="supplierBatchNumber"
                label={t("SUPPLIER_BATCH_NO") as string}
                control={control}
                errors={errors}
                defaultValue={batchItem?.supplierBatchNumber}
                disabled
              />

              <CommonTextArea
                name="description"
                id="description"
                label={"Description"}
                type={"string"}
                control={control}
                errors={errors}
                defaultValue={batchItem.description}
                rows={5}
              />
              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                control={control}
                errors={errors}
                defaultValue={batchItem.externalReference}
              />
              {/* inFutureWeCanUse */}
              <div>
                <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                  <CommonSwitch
                    id={"commonSwitch"}
                    active={switchActive}
                    statusChange={() => {
                      setSwitchActive(!switchActive);
                    }}
                  />
                  {switchActive ? t("ACTIVE") : t("INACTIVE")}
                </div>
              </div>
            </div>

            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={isLoading}
            />
          </form>
        </div>
      </CommonDrawer>

      {/* * May be Used in Future * */}
      <CommonDrawer
        open={viewOpen}
        toggle={viewToggle}
        // styles={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
      >
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={t("PRODUCTS_BATCH")}
            handleClose={handleCloseViewDrawer}
          />
          <div style={{ padding: "0 24px" }}>
            <div className={classes.viewContent}>
              <div className="">
                <div className={classes.viewContent_label}>{t("ID")}</div>
                <div className={classes.viewContent_value}>{batchItem.id}</div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("BATCH_NO")}</div>
                <div className={classes.viewContent_value}>
                  {batchItem.code}
                </div>
              </div>

              <div className="">
                <div className={classes.viewContent_label}>
                  {t("REFERENCE")}
                </div>
                <div className={classes.viewContent_value}>
                  {batchItem.externalReference}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("MANUFACTURING_DATE")}
                </div>
                <div className={classes.viewContent_value}>
                  {moment(batchItem?.dateOfManufacture).format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("EXPIRY_DATE")}
                </div>
                <div className={classes.viewContent_value}>
                  {moment(batchItem?.shelfLifeExpiryDate).format("DD-MM-YYYY")}
                </div>
              </div>
            </div>
            <div className={classes.expiryShelf}>
              <div style={{ width: "100%" }}>
                <Typography className={classes.dateHeadings}>
                  {t("TOTAL_SHELF_LIFE")}
                </Typography>
                <Typography className={classes.dateSubHeading}>
                  {t("DATE_HINT")}
                </Typography>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={4}>
                    <div>{t("DAYS")}</div>
                    <div>
                      {differenceInDays(
                        batchItem?.shelfLifeExpiryDate ?? new Date(),
                        batchItem?.dateOfManufacture ?? new Date()
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div>{t("MONTHS")}</div>
                    <div>
                      {differenceInMonths(
                        batchItem?.shelfLifeExpiryDate ?? new Date(),
                        batchItem?.dateOfManufacture ?? new Date()
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div>{t("YEARS")}</div>
                    <div>
                      {differenceInYears(
                        batchItem?.shelfLifeExpiryDate ?? new Date(),
                        batchItem?.dateOfManufacture ?? new Date()
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
              <br></br>
              <div>
                <div style={{ width: "100%" }}>
                  <Typography className={classes.dateHeadings}>
                    {t("REMAINING_SHELF_LIFE")}
                  </Typography>
                  <Typography className={classes.dateSubHeading}>
                    {t("DATE_HINT")}
                  </Typography>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={4}>
                      <div>{t("DAYS")}</div>
                      <div>
                        {differenceInDays(
                          batchItem?.shelfLifeExpiryDate ?? new Date(),
                          new Date()
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div>{t("MONTHS")}</div>
                      <div>
                        {differenceInMonths(
                          batchItem?.shelfLifeExpiryDate ?? new Date(),
                          new Date()
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div>{t("YEARS")}</div>
                      <div>
                        {differenceInYears(
                          batchItem?.shelfLifeExpiryDate ?? new Date(),
                          new Date()
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <br></br>
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
    </>
  );
};

export default ProductsBatch;
