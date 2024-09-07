import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { ReactDatePickerProps } from "react-datepicker";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { hours12 } from "src/@core/utils/format";
import CommonButton from "src/components/common/CommonButton";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import ProductTypeTable from "src/components/product/product-type/ProductTypeTable";
import { AppDispatch, RootState } from "src/store";
import {
  ProductTypeCreate,
  ProductTypeCreateUpdate,
  getProductType,
} from "src/store/apps/product/product-type";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import * as yup from "yup";
import { makeStyles } from "@mui/styles";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameFormValidator,
} from "src/@core/form-validator";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import { getDate } from "src/utils/validationsMethods";

const ProductType = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [eDate, setEDate] = useState<Date | null>(null);
  const [productType, setProductType] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement: ReactDatePickerProps["popperPlacement"] =
    direction === "ltr" ? "bottom-start" : "bottom-end";

  interface ProductCategory {
    id: number;
    name: string;
    altName: string;
  }

  const ProductTypes: any = useSelector(
    (state: RootState) => state.ProductTypes
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(ProductTypes?.data, item),
    name: RevestNameFormValidator(ProductTypes?.data, item),
    altName: RevestAltNameFormValidator(ProductTypes?.data, item),
  });

  const isCodeUnique = (data: any, value: any) => {
    // When editing an existing item
    if (item.id) {
      // Check if there's another record with the same code and a different ID
      const matchingItem = data.find((record: any) => {
        return record.code === value && record.id !== item.id;
      });
      // If a matching item is found, it's not unique
      return !matchingItem;
    }

    // When creating a new item, check if the code is unique among all records
    return !data.some((record: any) => record.code === value);
  };

  const {
    control,
    clearErrors,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
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
    setValue("code", item?.code);
    setValue("name", item?.name);
    setValue("altName", item?.altName);
    setValue("taxRate", item?.taxRate);
    setValue("taxType", item?.taxTypes);
    setValue("externalReference", item?.externalReference);
    setValue("id", item?.id);
    setSwitchActive(item?.active);
    setEDate(item?.endDate ? new Date(item?.endDate) : eDate);
  }, [item, setValue]);

  useEffect(() => {
    dispatch(getProductType({}));
    dispatch(sequenceMappingCodeSearch({ entityType: "PRODUCT_TYPE_CODE" }));
  }, []);

  useEffect(() => {
    setProductType(ProductTypes?.data);
  }, [ProductTypes]);

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
    data.active = switchActive;

    const requestData: any = {
      // code: "",
      altName: "",
      active: true,
      companyId: 0,
      externalReference: "",
      name: "",
      tenantId: 0,
    };

    if (!sequenceMapData?.autoGeneration) {
      requestData.code = data.code;
    }
    requestData.name = data.name;
    requestData.altName = data.altName;
    requestData.externalReference = data.externalReference;
    requestData.active = switchActive;
    requestData.companyId = data.companyId;
    requestData.tenantId = data.tenantId;
    requestData.id = data.id;

    if (!data.id) {
      res = await dispatch(ProductTypeCreate(requestData));
    } else {
      res = await dispatch(ProductTypeCreateUpdate(requestData));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
  
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      setValue("altName", e?.target?.value);
      clearErrors("altName");
    }
  };

  return (
    <Card>
      <ProductTypeTable
        data={productType}
        handleEditPage={handleEditPage}
        item={item}
        isLoading={ProductTypes.isLoading}
        selectedRecord={selectedRecord}
        setItem={setItem}
      />

      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={item.id ? t("EDIT_PRODUCT_TYPE") : t("NEW_PRODUCT_TYPE")}
            handleClose={handleCloseDrawer}
          />
          <form
            autoComplete="off"
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={handleChange}
          >
            <div className={classes.formContent}>
              <CommonInput
                control={control}
                disabled={sequenceMapData?.autoGeneration}
                defaultValue={"Auto Generated"}
                errors={errors}
                id="code"
                label="Code"
                name="code"
                required={!sequenceMapData?.autoGeneration}
              />
              <CommonInput
                control={control}
                defaultValue={item.name}
                errors={errors}
                id="name"
                label="Name"
                name="name"
                required={true}
              />
              <CommonInput
                control={control}
                defaultValue={item.altName}
                errors={errors}
                id="altName"
                label="Alternate Name"
                name="altName"
                required={true}
              />
              <CommonInput
                control={control}
                defaultValue={item.externalReference}
                errors={errors}
                id="externalReference"
                label="Reference"
                name="externalReference"
                // required={true}
              />
              <div>
                <Box sx={{ marginLeft: "-12px", marginTop: "-8px" }}>
                  <CommonSwitch
                    active={switchActive}
                    setActive={setSwitchActive}
                    statusChange={() => ({})}
                  />{" "}
                  {switchActive ? t("ACTIVE") : t("INACTIVE")}
                </Box>
              </div>
            </div>
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={ProductTypes.isLoading}
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
          <Box sx={{ padding: "0 24px" }}>
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
          </Box>
        </div>
      </CommonDrawer>
    </Card>
  );
};

export default ProductType;
