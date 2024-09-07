import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultValues, BatchItem } from "src/types/forms/productsBatchTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonDatePicker from "src/components/common/CommonDatePicker";
import { AppDispatch, RootState } from "src/store";
import Grid from "@mui/material/Grid";
import { TextField, Theme, useTheme } from "@mui/material";
import differenceInMonths from "date-fns/differenceInMonths";
import differenceInDays from "date-fns/differenceInDays";
import differenceInYears from "date-fns/differenceInYears";
import Typography from "@mui/material/Typography";
import {
  productBatch,
  productBatchUpdate,
  productsBatchCreate,
} from "src/store/apps/productBatch/productBatch";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { productsGet } from "src/store/apps/products/products-add/productsAdd";
import AppEvent from "src/app/AppEvent";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonTextArea from "src/components/common/CommonTextArea";
import { isValueUnique } from "src/@core/utils/check-unique";

const useStyles = makeStyles({
  formContent: {
    overflow: "auto",
    padding: "16px 24px 8px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
  shelf: {
    padding: "8px 24px",
  },
  disabled: {
    borderRadius: "5px",
    "& .MuiInputBase-input": {
      color: "red !important",
      height: "10px !important",
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === "light" ? "#e3e3e3" : "#2F3349",
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
  autoComplete: {
    "& .MuiFormControl-root": {
      "& .MuiInputBase-sizeSmall": {
        paddingTop: "1px",
        paddingBottom: "13px",
      },
    },
  },
});

interface AddBatchProps {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setBatchPayload: React.Dispatch<React.SetStateAction<BatchItem[]>>;
  setNewBatchPayload: React.Dispatch<React.SetStateAction<BatchItem[]>>;
  newBatchPayload: BatchItem[];
  batchPayload: BatchItem[];
}
const AddBatch: React.FC<AddBatchProps> = (props) => {
  const {
    setOpenDialog,
    setBatchPayload,
    setNewBatchPayload,
    newBatchPayload,
    batchPayload,
  } = props;

  const [batchItem, setBatchItem] = useState<BatchItem>(defaultValues);
  const [open, setOpen] = useState<Boolean>(false);
  const [productsBatchData, setProductsBatchData] = useState<{}[]>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [sequenceMapData, setSequenceMapData] = useState<any>({});
  const [autoCodeGenStatus, setAutoCodeGenStatus] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const classes = useStyles(theme);

  const addBatchSchema = yup.object().shape(
    {
      code: yup.string().when("code", (val, schema) => {
        if (!autoCodeGenStatus) {
          return yup
            .string()
            .required("REQUIRED")
            .min(2, "CODE_MUST_BE_AT_LEAST_TWO_CHARACTERS")
            .max(6, "CODE_MUST_BE_AT_MOST_SIX_CHARACTERS")
            .matches(/^[a-zA-Z0-9]+$/, "CODE_MUST_BE_ALPHANUMERIC")
            .test("unique-code", "Code already exists", function (value) {
              return isValueUnique(productsBatchData, value, "code", batchItem);
            });
        } else {
          return yup.string().notRequired();
        }
      }),
      // name: yup.string().required("REQUIRED"),
      // altName: yup.string().required("REQUIRED"),
      startDate: yup.string().required(""),
      endDate: yup.string().required(""),
    },
    [["code", "code"]]
  );

  const productsBatch = useSelector((state: RootState) => state.productsBatch);
  
  const products = useSelector(
    (state: RootState) => state.productsAdd.data.addedProducts
  ) as any;

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    setProductsBatchData(productsBatch?.data);
  }, [productsBatch]);

  useEffect(() => {
    dispatch(productBatch());
    // dispatch(productsGet());
    dispatch(sequenceMappingCodeSearch({ entityType: "PRODUCT_BATCH_CODE" }));
  }, []);

  const { t } = useTranslation();

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
    setAutoCodeGenStatus(sequenceMappingCode?.data?.autoGeneration);
  }, [sequenceMappingCode?.data]);

  const {
    reset: addBatchReset,
    control: addBatchControl,
    setValue: addBatchSetValue,
    handleSubmit: handleSubmitAddBatch,
    formState: { errors: addBatchErrors },
    clearErrors: addBatchClearErrors,
  } = useForm({
    defaultValues: { ...batchItem },
    mode: "onChange",
    resolver: yupResolver(addBatchSchema),
  });

  // inorder to change the status when
  useEffect(() => {
    setSwitchActive(batchItem.active);
  }, [batchItem?.active]);

  useEffect(() => {
    if (batchItem?.id) {
      addBatchSetValue("code", batchItem?.code);
      addBatchSetValue("name", batchItem?.name);
      addBatchSetValue("altName", batchItem?.altName);
      addBatchSetValue("products", batchItem?.products);
      addBatchSetValue("dateOfManufacture", batchItem?.dateOfManufacture);
      addBatchSetValue("shelfLifeExpiryDate", batchItem?.shelfLifeExpiryDate);
      addBatchSetValue("externalReference", batchItem?.externalReference);
      addBatchSetValue("supplierBatchNumber", batchItem?.supplierBatchNumber);
      addBatchSetValue("description", batchItem?.description);
    }
  }, [batchItem?.id]);

  const handleEditPage = (type: string | undefined) => {
    type === "view" ? setViewOpen(true) : setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpenDialog(false);
    addBatchReset();
    setBatchItem({
      ...defaultValues,
      dateOfManufacture: null,
      shelfLifeExpiryDate: null,
    });
    setOpen(false);
    addBatchClearErrors();
    setSwitchActive(true);
    setBatchItem(defaultValues);
  };

  const onSubmit = async (data: any, event: any) => {
    let payload: any = {
      code: data?.code,
      name: data?.name,
      altName: data?.altName,
      dateOfManufacture: batchItem?.dateOfManufacture?.toISOString(),
      shelfLifeExpiryDate: batchItem?.shelfLifeExpiryDate?.toISOString(),
      externalReference: data?.externalReference,
      active: batchItem?.active,
      supplierBatchNumber: data?.supplierBatchNumber,
      description: data?.description,
    };

    if (sequenceMapData?.sequenceSetup) {
      const { companyId, tenantId } = sequenceMapData.sequenceSetup;
      payload.companyId = companyId;
      payload.tenantId = tenantId;
    }
    if (!batchItem.id) {
      setNewBatchPayload(payload);
      setBatchPayload([...batchPayload, payload]);
      setNewBatchPayload([]);
    }
    handleCloseDrawer();
  };

  const onErrors = (data: any) => {
    console.log(data, "addBatchErrors");
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      addBatchSetValue("name", e.target.value);
      addBatchSetValue("altName", e.target.value);
      addBatchClearErrors("altName");
    }
  };

  const handleSetView = (data: any) => {
    setViewOpen(true);
  };

  return (
    <form
      key={3}
      onChange={handleChange}
      onSubmit={handleSubmitAddBatch(onSubmit, onErrors)}
    >
      <div className={classes.formContent}>
        {/* <CommonInput
          name="name"
          id="name"
          label="Name"
          required={true}
          control={addBatchControl}
          errors={addBatchErrors}
          defaultValue={batchItem.name}
        />
        <CommonInput
          name="altName"
          id="altName"
          label="Alternate Name"
          required={true}
          control={addBatchControl}
          errors={addBatchErrors}
          defaultValue={batchItem.altName}
        /> */}
        <CommonInput
          disabled={autoCodeGenStatus ? true : false}
          name="code"
          id="code"
          label={"BATCH_CODE"}
          control={addBatchControl}
          errors={addBatchErrors}
          required={autoCodeGenStatus ? false : true}
          placeholder={t("CODE")}
        />
        <CommonInput
          name="supplierId"
          id="supplierId"
          label={"SUPPLIER_ID"}
          required={false}
          control={addBatchControl}
          errors={addBatchErrors}
          defaultValue={"supplierId"}
          disabled={true}
        />
        {/* <CommonSelect
          name="supplierId"
          options={[]}
          control={addBatchControl}
          label={t("SUPPLIER_ID")}
          placeholder={t("SUPPLIER_ID")}
          required={false}
          errors={addBatchErrors}
          setValue={addBatchSetValue}
          // defaultValue={}
          noOptionsText={false}
          clearErrors={addBatchClearErrors}
          value=""
          disabled
        /> */}
        <CommonInput
          name="supplierBatchNumber"
          id="supplierBatchNumber"
          label={t("SUPPLIER_BATCH_NO") as string}
          control={addBatchControl}
          errors={addBatchErrors}
          defaultValue={batchItem?.supplierBatchNumber}
          disabled
        />

        <Grid item xs={12}>
          <CommonDatePicker
            name="startDate"
            control={addBatchControl}
            required={true}
            placeholderText={t("START_DATE")}
            label={t("MANUFACTURING_DATE")}
            errors={addBatchErrors}
            clearErrors={addBatchClearErrors}
            format={"dd-MM-yyyy"}
            cb={(date: any) => {
              setBatchItem({
                ...batchItem,
                dateOfManufacture: new Date(date),
              });
            }}
            selectedDate={batchItem?.dateOfManufacture}
          />
        </Grid>
        <Grid item xs={12}>
          <CommonDatePicker
            name="endDate"
            control={addBatchControl}
            required={true}
            placeholderText={t("END_DATE")}
            label={t("EXPIRY_DATE")}
            errors={addBatchErrors}
            clearErrors={addBatchClearErrors}
            format={"dd-MM-yyyy"}
            cb={(date: any) => {
              setBatchItem({
                ...batchItem,
                shelfLifeExpiryDate: new Date(date),
              });
            }}
            selectedDate={batchItem?.shelfLifeExpiryDate}
            minDate={
              batchItem?.dateOfManufacture
                ? new Date(batchItem?.dateOfManufacture)
                : null
            }
            showpreferedDate={false}
            disabled={batchItem?.dateOfManufacture ? false : true}
          />
        </Grid>
        <CommonInput
          name="externalReference"
          id="externalReference"
          label="Reference"
          control={addBatchControl}
          errors={addBatchErrors}
          defaultValue={batchItem.externalReference}
        />
      </div>
      <div style={{ padding: "0 24px 8px" }}>
        <CommonTextArea
          name="description"
          id="description"
          label={"Description"}
          type={"string"}
          control={addBatchControl}
          errors={addBatchErrors}
          defaultValue={batchItem.description}
          rows={5}
        />
      </div>
      <div className={classes.shelf}>
        <div>
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
              <TextField
                className={classes.disabled}
                name="days"
                id="days"
                value={differenceInDays(
                  batchItem?.shelfLifeExpiryDate ?? new Date(),
                  batchItem?.dateOfManufacture ?? new Date()
                )}
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <div>{t("MONTHS")}</div>
              <TextField
                className={classes.disabled}
                name="months"
                id="months"
                value={differenceInMonths(
                  batchItem?.shelfLifeExpiryDate ?? new Date(),
                  batchItem?.dateOfManufacture ?? new Date()
                )}
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <div>{t("YEARS")}</div>
              <TextField
                className={classes.disabled}
                name="years"
                id="years"
                value={differenceInYears(
                  batchItem?.shelfLifeExpiryDate ?? new Date(),
                  batchItem?.dateOfManufacture ?? new Date()
                )}
                disabled
              />
            </Grid>
          </Grid>
        </div>
        <div style={{ paddingTop: "8px" }}>
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
              <TextField
                className={classes.disabled}
                name="days"
                id="days"
                value={differenceInDays(
                  batchItem?.shelfLifeExpiryDate ?? new Date(),
                  new Date()
                )}
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <div>{t("MONTHS")}</div>
              <TextField
                className={classes.disabled}
                name="months"
                id="months"
                value={differenceInMonths(
                  batchItem?.shelfLifeExpiryDate ?? new Date(),
                  new Date()
                )}
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <div>{t("YEARS")}</div>
              <TextField
                className={classes.disabled}
                name="years"
                id="years"
                value={differenceInYears(
                  batchItem?.shelfLifeExpiryDate ?? new Date(),
                  new Date()
                )}
                disabled
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <CommonFormActionButtons
          handleCloseDrawer={handleCloseDrawer}
          disabled={productsBatch?.isLoading}
        />
      </div>
    </form>
  );
};

export default AddBatch;
