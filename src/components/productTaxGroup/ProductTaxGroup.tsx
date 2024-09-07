import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { defaultValues } from "src/types/forms/tax/businessTaxGroupTypes";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { makeStyles } from "@mui/styles";
import ProductTaxGroupDataTable from "src/components/tax-configuration/product-tax-group/ProductTaxGroupDataTable";
import {
  productTaxGroupCreate,
  productTaxGroupSearch,
  productTaxGroupUpdate,
  productTaxGroupToggle,
} from "src/store/apps/tax-configuration/product_tax_group";
import CommonButton from "src/components/common/CommonButton";
import { hours12 } from "src/@core/utils/format";
import { Card, FormHelperText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { isValueUnique } from "src/@core/utils/check-unique";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";
import { taxValidateSchema } from "src/components/tax-configuration/business-tax-group/componentConfig";
import { Key } from "src/@core/layouts/utils";

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
});

const ProductTaxGroup = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [taxGroupData, setTaxGroupData] = useState([]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const classes = useStyles();
  let statusRes: any;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

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
    resolver: yupResolver(taxValidateSchema(taxGroupData, item)),
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
    setValue("name", item?.name);
    setValue("altName", item?.altName);
    setValue("externalReference", item?.externalReference);
    setValue("id", item?.id);
    setValue("code", item?.code);
    setSwitchActive(item?.active);
  }, [item, setValue]);

  const productTaxGroup: any = useSelector(
    (state: RootState) => state.productTaxGroup
  );
  useEffect(() => {
    dispatch(productTaxGroupSearch({}));
  }, []);

  useEffect(() => {
    setTaxGroupData(productTaxGroup?.data);
  }, [productTaxGroup]);

  const handleEditPage = async (id: string) => {
    setOpen(true);
    statusRes = await dispatch(productTaxGroupToggle({ id: id }));
    statusRes?.payload?.message ? setDisabled(false) : setDisabled(true);
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
      code: "",
      name: "",
      altName: "",
      externalReference: "",
      active: true,
      productCategoryId: "",
      companyId: 0,
      tenantId: 0,
    };

    if (!data.id) {
      res = await dispatch(productTaxGroupCreate(data));
    } else {
      res = await dispatch(productTaxGroupUpdate(data));
    }

    handleCloseDrawer();
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") setValue("altName", e?.target?.value);
  };

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  return (
    <Card>
      <ProductTaxGroupDataTable
        data={taxGroupData}
        searchEnabled={searchEnabled}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        isLoading={productTaxGroup.isLoading}
        setItem={setItem}
        item={item}
        changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              item.id
                ? t(Key("Edit Product Tax Group"))
                : t(Key("New Product Tax Group"))
            }
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={handleChange}
          >
            <div className={classes.formContent}>
              <CommonInput
                name="code"
                id="code"
                label="Code"
                control={control}
                required={true}
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
                control={control}
                errors={errors}
                defaultValue={item.externalReference}
              />
              <>
                {!item.id && (
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
                )}
              </>
              {item.id && (
                <>
                  <div>
                    <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                      <CommonSwitch
                        active={switchActive}
                        disabled={disabled}
                        statusChange={() => setSwitchActive(!switchActive)}
                      />
                      {switchActive ? t("ACTIVE") : t("INACTIVE")}
                    </div>
                    {disabled && (
                      <FormHelperText>Status Cannot be changed</FormHelperText>
                    )}
                  </div>
                </>
              )}
            </div>
            <CommonFormActionButtons handleCloseDrawer={handleCloseDrawer} />
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

export default ProductTaxGroup;
