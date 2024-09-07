import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton, Stack,
  Tab,
  TextField,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Icon from "src/@core/components/icon";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";
import { RootState } from "src/store";
import LargeTextInput from "./largeTextInput";

import { useDispatch } from "react-redux";
import { Key } from "src/@core/layouts/utils";
import { WeighingMachineIcon } from "src/assets/weighingMachineIcon";
import { onlyNumeric } from "src/constants/validation/regX";
import { checkBarCodeUniqueness } from "src/store/apps/products/products-add/productsAdd";
import LightTooltip from "src/utils/tooltip";
import CodeTypeForm from "./CodeTypeForm";
import CreateNewDropdownOption from "./CreateNewDropdownOption";

interface Props {
  autoCodeGenStatus: boolean;
  control: Control<any, any>;
  errors: any;
  setValue: Function;
  clearErrors: Function;
  getValues: Function;
  editData: any;
  conversion: any;
  setConversion: Function;
  switchActive: boolean;
  setSwitchActive: Function;
  setStandardProductError: Function;
  barCodeDuplicateError: any;
  setBarCodeDuplicateError: Function;
  openSerialOrBatch: boolean;
  handleBatchOrSerialToggle: () => void;
}

interface UOMMODALS {
  UOM?: any;
  netWeight?: number;
  grossWeight?: number;
  height?: 0;
  width?: 0;
  length?: 0;
}

let resetWeightValues: UOMMODALS = {
  UOM: {
    code: "",
  },
  netWeight: 0,
  grossWeight: 0,
};

let resetPackageValues: UOMMODALS = {
  UOM: {
    code: "",
  },
  height: 0,
  width: 0,
  length: 0,
};

const useStyles = makeStyles({
  tableContainer: {
    background: "rgb(51 48 60 / 6%)",
    borderRadius: "5px",
  },
  header: {
    height: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    borderBottom: "1px solid #ccc",
    padding: "0 30px",
  },
  headerTitle: { fontWeight: "600", color: "#4B465C" },
  headerSubTitle: { display: "flex", alignItems: "center", gap: "2px" },
  dropDowns: {
    padding: "20px 30px",
    display: "flex",
    gap: "20px",
    borderBottom: "1px solid #ccc",
  },
  gridBox: {
    flexGrow: 1,
    paddingTop: "5px",
  },
  buttonBG: {
    marginTop: "10px",
    background: "#deebf6",
    width: "125px",
    height: "28px",
    borderRadius: "3px",
    "&:hover": {
      backgroundColor: "#deebf6 !important",
    },
  },
  toolTipButtons: {
    color: "#4B465C !important",
    padding: "10px",
    "&:hover": {
      backgroundColor: "#ffffff !important",
    },
  },
  dialogPaper: {
    "& .MuiDialog-paper": {
      width: "300px !important",
      "& .MuiDialogTitle-root": {
        textAlign: "center",
      },
    },
  },
  modalInputHeadings: {
    margin: "10px 0px 3px 0px",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: 500,
  },
  delete: {
    background: "#fbe3e4 !important",
    color: "#EA5455 !important",
  },
  cancel: {
    background: "#a8aaae !important",
    color: "#ffffff !important",
  },
  valueField: {
    "& .css-19jxieg-MuiInputBase-input-MuiOutlinedInput-input": {
      height: "1.7em",
    },
  },
  errorMsg: {
    color: "#EA5455",
    height: "10px",
    fontSize: "0.8rem",
  },
  tabListInfo: {
    width: "100%",
    typography: "body1",
    "& .MuiTabs-root": {
      borderBottom: "none",
    },
    "& .MuiButtonBase-root": {
      textTransform: "none",
    },
  },
});

const GeneralSection: React.FC<Props> = ({
  autoCodeGenStatus,
  control,
  errors,
  setValue,
  clearErrors,
  getValues,
  editData,
  conversion,
  setConversion,
  switchActive,
  setSwitchActive,
  setStandardProductError,
  barCodeDuplicateError,
  setBarCodeDuplicateError,
  handleBatchOrSerialToggle,
  openSerialOrBatch,
}) => {
  const { t } = useTranslation();
  const productAdd: any =
    useSelector((state: RootState) => state.productsAdd?.data) ?? [];
  const Uom =
    useSelector((state: RootState) => state.productdropdown.UnitOfMeasures) ||
    [];
  const productDropdown: any =
    useSelector((state: RootState) => state.productdropdown) ?? [];

  const { attribute1, attribute2, attribute3, attribute4, attribute5 } =
    useSelector((state: RootState) => state.productdropdown);

  const theme = useTheme();
  const classes = useStyles();

  const [tab, setTab] = useState("1");

  const [codeInfo, setCodeInfo] = useState<any[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [wieghtModal, setWeightModal] = useState<boolean>(false);
  const [packageModal, setPackageModal] = useState<boolean>(false);

  const [updatedOptions, setUpdatedOptions] = useState([]);

  const [itemNameToAdd, setItemNameToAdd] = useState("");
  const [openCreateNewOptionModal, setOpenCreateNewOptionModal] =
    useState(false);
  const [fieldID, setFieldID] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (editData?.id) {
      let UOM: any = [];
      let codes: any = [];

      editData?.productUOM?.map((item: any) => {
        let obj = {
          fromValue: item?.fromValue,
          fromUnit: item?.fromUOM,
          toValue: item?.toValue,
          weight: {
            UOM: item?.weightUOM,
            netWeight: item?.netWeight,
            grossWeight: item?.grossWeight,
          },
          package: {
            UOM: item?.dimeUOM,
            length: item?.length,
            width: item?.width,
            height: item?.height,
          },
          sale: item?.hasSales,
        };

        UOM.push(obj);
      });

      setConversion(UOM);

      editData.productBarcodeMapping?.map((item: any) => {
        let code = {
          barcodeTypes: item?.barcodeTypes,
          barcode: item?.barcode,
          UOM: item?.UOM,
        };
        codes.push(code);
      });

      setCodeInfo([...codes]);

      if (editData?.description) {
        setTab("1");
      } else if (editData?.altDescription) {
        setTab("2");
      } else {
        setTab("1");
      }
    }
  }, [editData?.id]);

  // clear corresponding dropdowns when base UOM is changes
  useEffect(() => {
    const baseUOMInfo = getValues("baseUOM");

    const updateOptions = Uom?.filter(
      (item: any) => item?.unitClass === baseUOMInfo?.unitClass
    );
    setUpdatedOptions([...updateOptions]);

    if (
      getValues("salesUOM")?.unitClass &&
      getValues("salesUOM").unitClass != baseUOMInfo?.unitClass
    ) {
      setValue("salesUOM", null);
    }

    if (
      getValues("purchaseUOM")?.unitClass &&
      getValues("purchaseUOM").unitClass != baseUOMInfo?.unitClass
    ) {
      setValue("purchaseUOM", null);
    }

    if (conversion?.length >= 1) {
      const newConversion = conversion.map((item: any) => {
        let newItem = { ...item };
        if (
          newItem.fromUnit &&
          newItem.fromUnit?.unitClass != baseUOMInfo?.unitClass
        ) {
          newItem.fromUnit = null;
        }
        return newItem;
      });
      setConversion([...newConversion]);
    }

    if (codeInfo?.length >= 1) {
      const updatedCodeInfo = codeInfo.map((item: any) => {
        let newItem = { ...item };
        if (newItem.UOM && newItem.UOM?.unitClass != baseUOMInfo?.unitClass) {
          newItem.UOM = null;
        } else if (!newItem.UOM) {
          newItem.UOM = baseUOMInfo;
        }
        return newItem;
      });
      setCodeInfo(updatedCodeInfo);
    }
  }, [getValues("baseUOM")]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const increaseConversion = async () => {
    let error = false;

    (await conversion?.length) > 0 &&
      conversion?.map((item: any) => {
        if (!item?.fromValue || !item?.fromUnit || !item?.toValue) {
          error = true;
          setStandardProductError("fromValue", {
            type: "manual",
            message: `${"FROM_VALUE"} required`,
          });
          setStandardProductError("fromUnit", {
            type: "manual",
            message: `${"FROM_UNIT"} required`,
          });
          setStandardProductError("toValue", {
            type: "manual",
            message: `${"TO_VALUE"} required`,
          });
        }
      });

    if (!error)
      setConversion([
        ...conversion,
        {
          fromValue: null,
          fromUnit: null,
          toValue: null,
          weight: {
            UOM: "",
            netWeight: "",
            grossWeight: "",
          },
          package: {
            UOM: "",
            length: "",
            width: "",
            height: "",
          },
        },
      ]);
  };

  const handleAddMoreBtnDisable = () => {
    let isDisabled = true;
    let conversionLength = conversion.length - 1;
    if (
      conversion[conversionLength]?.fromValue?.length &&
      conversion[conversionLength]?.fromUnit?.id
    ) {
      isDisabled = false;
    }
    return isDisabled;
  };

  const handleInputChange = async (
    index: number,
    field: keyof any | any,
    value: string | any
  ) => {
    if (field === "barcode") {
      dispatch(checkBarCodeUniqueness({ barcode: value })).then((d: any) => {
        if (d?.payload?.error)
          setBarCodeDuplicateError({ visible: true, index: index });
      });

      let duplicate = codeInfo.some((item) => item?.barcode === value);
      if (duplicate) {
        setBarCodeDuplicateError({ visible: true, index: index });
      } else {
        setBarCodeDuplicateError({ visible: false, index: -1 });
      }
    }

    const lastIndex = codeInfo.length - 1;
    const updatedCodeInfo = [...codeInfo];
    updatedCodeInfo[index][field] = value;
    setCodeInfo(updatedCodeInfo);
    setValue("productBarCodeMapping", updatedCodeInfo);

    if (lastIndex === index) {
      if (field === "UOM") clearErrors("UOM");
      if (field === "barcodeTypes") clearErrors("barcodeTypes");
      if (field === "barcode") clearErrors("barcode");
    }
  };

  const removeCodeInfo = (index: number) => {
    const updatedCodeInfo = [...codeInfo];
    updatedCodeInfo.splice(index, 1);
    setCodeInfo(updatedCodeInfo);
    setValue("productBarCodeMapping", updatedCodeInfo);

    if (
      barCodeDuplicateError?.visible &&
      barCodeDuplicateError?.index === index
    )
      setBarCodeDuplicateError({ visible: false, index: -1 });
  };

  const addCodeInfo = async () => {
    let error = false;
    (await codeInfo?.length) > 0 &&
      codeInfo?.map((item: any) => {
        if (!item?.UOM?.id || !item?.barcodeTypes?.id || !item?.barcode) {
          error = true;

          setStandardProductError("UOM", {
            type: "manual",
            message: `${"UOM"} required`,
          });
          setStandardProductError("barcodeTypes", {
            type: "manual",
            message: `${"CODE_TYPE"} required`,
          });
          setStandardProductError("barcode", {
            type: "manual",
            message: `${"CODE"} required`,
          });
        }
      });

    if (!error && !barCodeDuplicateError?.visible) {
      setCodeInfo([
        ...codeInfo,
        { UOM: getValues("baseUOM"), barcodeTypes: null, barcode: null },
      ]);
    }
  };

  const handleWightModalOpen = async (e: Event, index: number) => {
    e.preventDefault();
    await setWeightModal(true);
    await setSelectedIndex(index);
  };

  const handlePackageModalOpen = async (e: Event, index: number) => {
    e.stopPropagation();
    await setPackageModal(true);
    await setSelectedIndex(index);
  };

  let baseUom = getValues()?.baseUOM;

  const handleUOMChange = (
    name: string,
    value: string | boolean,
    index: number
  ) => {
    let lastIndex = conversion.length - 1;
    const updatedCodeInfo = [...conversion];
    updatedCodeInfo[index][name] = value;
    setConversion(updatedCodeInfo);

    if (lastIndex === index) {
      if (name === "fromValue") clearErrors("fromValue");
      if (name === "fromUnit") clearErrors("fromUnit");
    }
  };

  const handleWeightModalValuesChange = (
    value: string,
    index: number = selectedIndex
  ) => {
    const updatedCodeInfo = [...conversion];
    updatedCodeInfo[index]["weight"] = value;
    setConversion(updatedCodeInfo);
    setValue("UOM", updatedCodeInfo);
  };

  const handlePackageModalValuesChange = (
    value: string,
    index: number = selectedIndex
  ) => {
    const updatedCodeInfo = [...conversion];
    updatedCodeInfo[index]["package"] = value;
    setConversion(updatedCodeInfo);
    setValue("UOM", updatedCodeInfo);
  };

  const handleDeleteUOM = (index: number) => {
    let newUOM = conversion?.filter((_: any, i: number) => i !== index);
    setConversion([...newUOM]);
    setValue("UOM", newUOM);
  };

  // update the field selection with created new drop down option
  const updateCreatedOption = (fieldID: string, updateObj: any) => {
    switch (fieldID) {
      case "TYPE":
        setValue("productType", updateObj);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Grid display={"flex"} flexDirection={"column"} gap={"12px"}>
        <Card sx={{ p: 5, boxShadow: "none" }}>
          <Typography sx={{ mb: 2 }} variant="h6">
            {t("GENERAL_DETAILS")}
          </Typography>

          <Grid container justifyContent={"space-between"}>
            <Grid item xs={2.9}>
              <CommonInput
                control={control}
                defaultValue={editData?.code ?? autoCodeGenStatus ? "Code" : ""}
                errors={errors}
                label={"Code"}
                name="code"
                required={autoCodeGenStatus ? false : true}
                disabled={autoCodeGenStatus ? true : false}
                placeholder={editData?.code ?? t("CODE")}
              />
            </Grid>
            <Grid item xs={2.9}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                customText={false}
                defaultValue={getValues("productSource")}
                disabled={false}
                errors={errors}
                func={null}
                label={"source"}
                name="productSource"
                noOptionsText={false}
                options={productAdd?.productSource ?? []}
                placeholder={t("SELECT_SOURCE")}
                required={true}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
            <Grid item xs={2.9}>
              <CommonSelect
                id={"TYPE"}
                control={control}
                clearErrors={clearErrors}
                customText={true}
                defaultValue={getValues("productType")}
                disabled={false}
                errors={errors}
                func={setItemNameToAdd}
                handleModel={() => {
                  setOpenCreateNewOptionModal(true);
                  setFieldID("TYPE");
                  setTitle("TYPE");
                }}
                label={"type"}
                name="productType"
                noOptionsText={true}
                options={productDropdown?.ProductTypes ?? []}
                placeholder={t("SELECT_TYPE")}
                required={true}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
            <Grid item xs={2.9}>
              <CommonInput
                control={control}
                defaultValue={getValues("externalReference")}
                errors={errors}
                id="code"
                label="Reference"
                name="externalReference"
                required={false}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent={"space-between"}>
            <Grid item xs={4.9}>
              <CommonInput
                control={control}
                defaultValue={getValues("shortName")}
                errors={errors}
                id="shortName"
                label="Short Name"
                name="shortName"
                required={true}
              />
            </Grid>
            <Grid item xs={6.9}>
              <CommonInput
                control={control}
                defaultValue={getValues("longName")}
                errors={errors}
                id="longName"
                label="Long Name"
                name="longName"
                required={true}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent={"space-between"}>
            <Grid item xs={4.9}>
              <CommonInput
                control={control}
                defaultValue={getValues("altShortName")}
                errors={errors}
                id="altShortName"
                label="Alternative Short Name"
                name="altShortName"
                required={false}
              />
            </Grid>
            <Grid item xs={6.9}>
              <CommonInput
                control={control}
                defaultValue={getValues("altLongName")}
                errors={errors}
                id="altLongName"
                label="Alternative Long Name"
                name="altLongName"
                required={false}
              />
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Grid item xs={4.9}>
              <CommonInput
                type="float"
                control={control}
                defaultValue={getValues("retailPrice")}
                errors={errors}
                id="retailPrice"
                label={"RETAIL_PRICE"}
                name="retailPrice"
                required={true}
              />
            </Grid>

            <Grid item xs={4.5}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={openSerialOrBatch}
                    onChange={handleBatchOrSerialToggle}
                  />
                }
                label={t(`BATCH_OR_SERIAL_TRACKING`)}
              />
              {/* <FormControlLabel
                control={
                    <Checkbox
                        checked={true}
                        // onChange={}
                    />
                }
                label={t("RETURNABLE")}
            /> */}
            </Grid>

            <Grid xs={2} item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <CommonSwitch
                  active={switchActive}
                  setActive={setSwitchActive}
                  statusChange={() => setValue("active", !switchActive)}
                />{" "}
                {switchActive ? t("ACTIVE") : t("INACTIVE")}
              </div>
            </Grid>
          </Grid>

          {/* Description */}
          <Box className={classes.tabListInfo}>
            <TabContext value={tab}>
              <Box>
                <TabList
                  onChange={handleChange}
                  aria-label="General Section Description Tabs"
                >
                  <Tab label={t("DESCRIPTION")} value="1" />
                  <Tab label={t("ALT_DESC")} value="2" />
                </TabList>
              </Box>
              <TabPanel sx={{ px: "0px !important" }} value="1">
                <LargeTextInput
                  value={editData?.description ?? getValues("description")}
                  setValue={setValue}
                  type="description"
                  editModeValue={editData?.description}
                />
              </TabPanel>
              <TabPanel sx={{ px: "0px !important" }} value="2">
                <LargeTextInput
                  value={
                    editData?.altDescription ?? getValues("altDescription")
                  }
                  setValue={setValue}
                  type="altDescription"
                  editModeValue={editData?.altDescription}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </Card>
        {/* {UOM setup} */}
        <Card sx={{ p: 5, mt: 2, boxShadow: "none" }}>
          <Typography
            sx={{ fontSize: "16px", fontWeight: "500", marginBottom: 2 }}
          >
            {t("UOM_SETUP")}
          </Typography>
          <Grid
            sx={{
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "baseline",
            }}
            container
            spacing={5}
          >
            <Grid item md={4}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                disabled={false}
                defaultValue={""}
                errors={errors}
                label={t("BASE_UOM")}
                name="baseUOM"
                noOptionsText={false}
                options={Uom}
                convertToKey={false}
                required={true}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
            <Grid item md={4}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                disabled={false}
                defaultValue={""}
                errors={errors}
                label={t("SALE_UOM")}
                name="salesUOM"
                noOptionsText={false}
                convertToKey={false}
                options={updatedOptions}
                required={true}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
            <Grid item md={4}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                disabled={false}
                defaultValue={""}
                errors={errors}
                label={t("PURCHASE_UOM")}
                name="purchaseUOM"
                convertToKey={false}
                noOptionsText={false}
                options={updatedOptions}
                required={false}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
          </Grid>
          {conversion?.map((item: any, index: number) => {
            return (
              <Grid container>
                <Grid
                  item
                  xs={4}
                  container
                  justifyContent={"flex-start"}
                  alignItems={"baseLine"}
                >
                  <Grid xs={5.5}>
                    <>
                      <label>{t("FROM_VALUE")}*</label>
                      <div>
                        <TextField
                          type="number"
                          name="fromValue"
                          value={item?.fromValue}
                          size="small"
                          className={classes.valueField}
                          error={!item?.fromValue && errors?.fromValue}
                          placeholder={t("FROM_VALUE") as string}
                          onChange={(e: any) => {
                            handleUOMChange(
                              "fromValue",
                              e?.target?.value,
                              index
                            );
                          }}
                          onKeyDown={(e) => {
                            if (!onlyNumeric(e?.key, e?.ctrlKey)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {!item?.fromValue && errors["fromValue"] && (
                          <FormHelperText
                            className={classes.errorMsg}
                            id="validation-schema-fromValue"
                          >
                            {t(Key("REQUIRED"))}
                          </FormHelperText>
                        )}
                      </div>
                    </>
                  </Grid>
                  <Grid xs={0.6}></Grid>
                  <Grid item xs={5.5}>
                    <label>{t("FROM_UNIT")}*</label>
                    <Autocomplete
                      disablePortal
                      options={updatedOptions}
                      sx={{
                        "& .MuiAutocomplete-input": {
                          height: "1.7em !important",
                        },
                      }}
                      size="small"
                      onChange={(e: any, value: any) =>
                        handleUOMChange("fromUnit", value, index)
                      }
                      getOptionLabel={(option: any) => option.name}
                      value={item?.fromUnit}
                      renderInput={(params) => (
                        <TextField
                          error={!item?.fromUnit && errors?.fromUnit}
                          className={classes.valueField}
                          placeholder={t("FROM_UNIT") as string}
                          {...params}
                        />
                      )}
                    />
                    <FormHelperText
                      className={classes.errorMsg}
                      id="validation-schema-fromUnit"
                    >
                      {!item?.fromUnit && errors["fromUnit"]
                        ? t("REQUIRED")
                        : ""}
                    </FormHelperText>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={5}
                  container
                  justifyContent={"flex-start"}
                  alignItems={"baseline"}
                >
                  <Grid xs={0.5} item alignSelf={"center"}>
                    <Icon icon={"material-symbols:equal"} />
                  </Grid>

                  <Grid xs={0.4}></Grid>

                  <Grid xs={5} item>
                    <>
                      <label>{t("TO_VALUE")}*</label>
                      <TextField
                        type="customNumber"
                        name={`toValue`}
                        value={item?.toValue}
                        size="small"
                        className={classes.valueField}
                        error={!item?.toValue && errors?.toValue}
                        placeholder={t("TO_VALUE") as string}
                        onChange={(e: any) => {
                          handleUOMChange("toValue", e?.target?.value, index);
                        }}
                        onKeyDown={(e) => {
                          if (!onlyNumeric(e?.key, e?.ctrlKey)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </>
                    <FormHelperText
                      className={classes.errorMsg}
                      id="validation-schema-toValue"
                    >
                      {!item?.toValue && errors["toValue"] ? t("REQUIRED") : ""}
                    </FormHelperText>
                  </Grid>

                  <Grid xs={0.5}></Grid>

                  <Grid item xs={5}>
                    <>
                      <label>{t("TO_UNIT_BASE_UOM")}</label>
                      <TextField
                        id="toUnit"
                        name="toUnit"
                        required={false}
                        disabled={true}
                        placeholder={t("TO_UNIT_BASE_UOM") as string}
                        value={baseUom?.name ?? ""}
                        size="small"
                        className={classes.valueField}
                      />
                    </>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={3}
                  container
                  justifyContent={"space-around"}
                  alignItems={"center"}
                >
                  <Grid xs={3} alignSelf={"baseline"}>
                    <FormControlLabel
                      value="top"
                      control={
                        <Checkbox
                          checked={item?.sale}
                          onChange={(e) =>
                            handleUOMChange("sale", e?.target?.checked, index)
                          }
                        />
                      }
                      label={t("SALES")}
                      labelPlacement="top"
                    />
                  </Grid>

                  <Grid sx={{ mt: 5 }} item xs={1}>
                    <>
                      {item?.weight?.UOM?.id && (
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={(e: any) => handleWightModalOpen(e, index)}
                        >
                          <WeighingMachineIcon
                            fill={
                              theme?.palette?.mode === "dark"
                                ? "#e4e6f4de"
                                : "#33303dde"
                            }
                          />
                        </Box>
                      )}
                    </>
                  </Grid>

                  <Grid sx={{ mt: 5 }} item xs={1}>
                    <div>
                      {item?.package?.UOM?.id && (
                        <Box sx={{ cursor: "pointer" }}>
                          <Icon
                            onClick={(e: any) =>
                              handlePackageModalOpen(e, index)
                            }
                            icon="tabler:box"
                            fontSize={25}
                          />
                        </Box>
                      )}
                    </div>
                  </Grid>

                  <Grid sx={{ mt: 5 }} item xs={1}>
                    <div>
                      <Box sx={{ cursor: "pointer" }}>
                        <Icon
                          onClick={() => handleDeleteUOM(index)}
                          icon="tabler:trash"
                          fontSize={25}
                        />
                      </Box>
                    </div>
                  </Grid>

                  <Grid sx={{ mt: 5 }} item xs={1}>
                    <LightTooltip
                      disableFocusListener
                      title={
                        <Stack alignItems={"flex-start"} spacing={2}>
                          <Button
                            onClick={() => handleDeleteUOM(index)}
                            className={classes.toolTipButtons}
                            startIcon={
                              <Icon
                                icon="tabler:trash"
                                color="#4B465C"
                                fontSize={20}
                              />
                            }
                          >
                            {t("DELETE")}
                          </Button>
                          <Button
                            onClick={(e: any) => handleWightModalOpen(e, index)}
                            className={classes.toolTipButtons}
                            startIcon={
                              <WeighingMachineIcon fill={"#33303cde"} />
                            }
                          >
                            {t("WEIGHT_SETUP")}
                          </Button>
                          <Button
                            onClick={(e: any) =>
                              handlePackageModalOpen(e, index)
                            }
                            className={classes.toolTipButtons}
                            startIcon={
                              <Icon
                                icon="tabler:box"
                                color="#4B465C"
                                fontSize={20}
                              />
                            }
                          >
                            {t("PACKAGE_SETUP")}
                          </Button>
                        </Stack>
                      }
                    >
                      <IconButton>
                        <Icon icon="tabler:dots-vertical" fontSize={25} />
                      </IconButton>
                    </LightTooltip>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
          <>
            <Button
              onClick={() => increaseConversion()}
              className={classes.buttonBG}
              size="large"
            >
              +{t("ADD_MORE")}
            </Button>
          </>
        </Card>
        {/* Barcode Setup */}
        <Card sx={{ p: 5, mt: 2, boxShadow: "none" }}>
          <Typography
            sx={{ fontSize: "16px", fontWeight: "500", marginBottom: 2 }}
          >
            {t("BARCODE_SETUP")}
          </Typography>

          <Typography sx={{ display: "flex", color: "#A8AAAE" }}>
            <Icon icon="tabler:info-circle" fontSize={20} />
            {t("BARCODE_INFO")}
          </Typography>

          <Grid container spacing={3} sx={{ marginTop: 1, marginBottom: -2 }}>
            <Grid item xs={3}>
              {codeInfo?.length > 0 && <FormLabel>{t("UOM")}*</FormLabel>}
            </Grid>
            <Grid item xs={3}>
              {codeInfo?.length > 0 && <FormLabel>{t("CODE_TYPE")}*</FormLabel>}
            </Grid>
            <Grid item xs={2.9}>
              {codeInfo?.length > 0 && <FormLabel>{t("CODE")}*</FormLabel>}
            </Grid>
          </Grid>

          {codeInfo.map((data, index) => (
            <CodeTypeForm
              data={data}
              index={index}
              key={index}
              onInputChange={handleInputChange}
              onRemoveClick={removeCodeInfo}
              options={Uom?.filter(
                (item: any) => item?.unitClass === baseUom?.unitClass
              )}
              errors={errors}
              getValues={getValues}
              barCodeDuplicateError={barCodeDuplicateError}
            />
          ))}
          <Button
            onClick={() => addCodeInfo()}
            className={classes.buttonBG}
            size="large"
          >
            +{t("ADD_MORE")}
          </Button>
        </Card>
        <Card sx={{ p: 5, mt: 2, boxShadow: "none" }}>
          <Typography
            sx={{ fontSize: "16px", fontWeight: "500", marginBottom: 2 }}
          >
            {t("ATTRIBUTES")}
          </Typography>

          <Grid container spacing={3} sx={{ marginTop: 1, marginBottom: -2 }}>
            <Grid item xs={3.9}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                disabled={false}
                defaultValue={""}
                errors={errors}
                addNew={true}
                label={t("ATTRIBUTE_ONE")}
                name="productAttributeO1"
                noOptionsText={true}
                options={attribute1}
                convertToKey={false}
                required={false}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
            <Grid item xs={3.9}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                disabled={false}
                defaultValue={""}
                errors={errors}
                addNew={true}
                label={t("ATTRIBUTE_TWO")}
                name="productAttributeO2"
                noOptionsText={true}
                options={attribute2}
                convertToKey={false}
                required={false}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
            <Grid item xs={3.9}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                disabled={false}
                defaultValue={""}
                errors={errors}
                addNew={true}
                label={t("ATTRIBUTE_THIRD")}
                name="productAttributeO3"
                noOptionsText={true}
                options={attribute3}
                convertToKey={false}
                required={false}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ marginTop: 1, marginBottom: -2 }}>
            <Grid item xs={3.9}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                disabled={false}
                defaultValue={""}
                errors={errors}
                addNew={true}
                label={t("ATTRIBUTE_FOUR")}
                name="productAttributeO4"
                noOptionsText={true}
                options={attribute4}
                convertToKey={false}
                required={false}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
            <Grid item xs={3.9}>
              <CommonSelect
                control={control}
                clearErrors={clearErrors}
                disabled={false}
                defaultValue={""}
                errors={errors}
                addNew={true}
                label={t("ATTRIBUTE_FIFTH")}
                name="productAttributeO5"
                noOptionsText={true}
                options={attribute5}
                convertToKey={false}
                required={false}
                setSelectedFieldType={""}
                setValue={setValue}
                validateForm={{}}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* modals */}
      {conversion?.length > 0 && (
        <>
          <WeightSetUp
            handleWeightModalValuesChange={handleWeightModalValuesChange}
            productAdd={Uom}
            wieghtModal={wieghtModal}
            setWeightModal={setWeightModal}
            data={conversion[selectedIndex]}
          />
          <PackageSetUp
            handlePackageModalValuesChange={handlePackageModalValuesChange}
            productAdd={Uom}
            packageModal={packageModal}
            setPackageModal={setPackageModal}
            data={conversion[selectedIndex]}
          />
        </>
      )}

      {openCreateNewOptionModal && (
        <CreateNewDropdownOption
          fieldID={fieldID}
          itemNameToAdd={itemNameToAdd}
          openCreateNewOptionModal={openCreateNewOptionModal}
          setOpenCreateNewOptionModal={setOpenCreateNewOptionModal}
          title={title}
          updateCreatedOption={updateCreatedOption}
        />
      )}
    </>
  );
};

const WeightSetUp = ({
  wieghtModal,
  setWeightModal,
  productAdd,
  handleWeightModalValuesChange,
  data: { weight: existingWeight, fromUnit },
}: {
  wieghtModal: boolean;
  setWeightModal: Function;
  productAdd: any;
  handleWeightModalValuesChange: Function;
  data: any;
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [weight, setWeight] = useState<UOMMODALS>({
    UOM: { code: "" },
    netWeight: 0,
    grossWeight: 0,
  });

  useEffect(() => {
    if (existingWeight?.UOM?.id !== weight?.UOM?.id) {
      setWeight(existingWeight);
    }
  }, [existingWeight?.UOM?.id]);

  const handleChange = (name: string, value: string | number) => {
    if (
      name === "grossWeight" &&
      weight["netWeight"] &&
      weight["netWeight"] >= +value
    ) {
      setError(true);
    } else {
      setError(false);
    }

    setWeight({
      ...weight,
      [name]: value,
    });
  };

  const handleSave = () => {
    handleWeightModalValuesChange(weight);
    setWeight({ UOM: { code: "" }, netWeight: 0, grossWeight: 0 });
    setWeightModal(false);
  };

  const handleDelete = () => {
    setWeight(resetWeightValues);
    setError(false);
    handleWeightModalValuesChange(resetWeightValues);
    setWeightModal(false);
  };

  const onClose = () => {
    // clear only first cancel
    if (!existingWeight?.UOM?.code) {
      setWeight(resetWeightValues);
    }
    setError(false);
    setWeightModal(false);
  };

  return (
    <Dialog
      className={classes.dialogPaper}
      onClose={(e) => onClose()}
      open={wieghtModal}
    >
      <DialogTitle>
        <Typography variant="h5">{t("WEIGHT_SETUP")}</Typography>
        <Typography sx={{ mt: 2 }} variant="body1">
          {t("WEIGHT_UOM_SUB_TITLE")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 1 }} variant="h6">
          {`${t("UOM_DEFAULT")}${fromUnit?.name ? ` - ${fromUnit?.name}` : ""}`}
        </Typography>
        <>
          <Typography className={classes.modalInputHeadings}>
            {t("UOM")}
          </Typography>
          <Autocomplete
            size="small"
            sx={{ width: 250 }}
            value={weight?.UOM}
            options={
              productAdd?.filter((item: any) => item?.unitClass === "MASS") ??
              []
            }
            getOptionLabel={(option: any) => option?.code ?? ""}
            onChange={(e, value) => handleChange("UOM", value)}
            renderOption={(props: any, option: any) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.code}
              </Box>
            )}
            renderInput={(params: any) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
        </>
        <div>
          <Typography className={classes.modalInputHeadings}>
            {t("NET_WEIGHT")}
          </Typography>
          <TextField
            value={weight?.netWeight}
            onChange={(e: any) => handleChange("netWeight", e?.target?.value)}
            size="small"
            sx={{ width: 250 }}
            variant="outlined"
          />
        </div>
        <div>
          <Typography className={classes.modalInputHeadings}>
            {t("GROSS_WEIGHT")}
          </Typography>
          <TextField
            value={weight?.grossWeight}
            onChange={(e: any) => handleChange("grossWeight", e?.target?.value)}
            size="small"
            error={error}
            sx={{ width: 250 }}
            variant="outlined"
          />
          {error && (
            <Typography variant="body2" color="error">
              {t("GROSS_WEIGHT_ERROR")}
            </Typography>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDelete()} className={classes.delete}>
          {t("DELETE")}
        </Button>
        <Button onClick={() => onClose()} className={classes.cancel}>
          {t("CANCEL")}
        </Button>
        <Button
          disabled={error}
          onClick={() => handleSave()}
          variant="contained"
        >
          {t("SAVE")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PackageSetUp = ({
  packageModal,
  setPackageModal,
  productAdd,
  handlePackageModalValuesChange,
  data: { package: existingPackage, fromUnit },
}: {
  packageModal: boolean;
  setPackageModal: Function;
  productAdd: any;
  handlePackageModalValuesChange: Function;
  data: any;
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [packageValue, setPackage] = useState<UOMMODALS>({
    UOM: {
      code: "",
    },
    height: 0,
    width: 0,
    length: 0,
  });

  useEffect(() => {
    if (existingPackage?.UOM?.id !== !packageValue?.UOM?.id) {
      setPackage(existingPackage);
    }
  }, [existingPackage?.UOM?.id]);

  const handleChange = (name: string, value: string | number) => {
    setPackage({
      ...packageValue,
      [name]: value,
    });
  };

  const handleSave = () => {
    handlePackageModalValuesChange(packageValue);
    setPackageModal(false);
    setPackage({
      UOM: {
        code: "",
      },
      height: 0,
      width: 0,
      length: 0,
    });
  };

  const handleDelete = () => {
    setPackage(resetPackageValues);
    handlePackageModalValuesChange(resetPackageValues);
    setPackageModal(false);
  };

  const onClose = () => {
    // clear only first cancel
    if (!existingPackage?.UOM?.code) {
      setPackage(resetPackageValues);
    }
    setPackageModal(false);
  };

  return (
    <Dialog onClose={() => onClose()} open={packageModal}>
      <DialogTitle>
        <Typography variant="h5">{t("PACKAGE_SETUP")}</Typography>
        <Typography sx={{ mt: 2 }} variant="body1">
          {t("PACKAGE_UOM_SUB_TITLE")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 1 }} variant="h6">
          {`${t("UOM_DEFAULT")}${fromUnit?.name ? ` - ${fromUnit?.name}` : ""}`}
        </Typography>
        <>
          <Typography className={classes.modalInputHeadings}>
            {t("UOM")}
          </Typography>
          <Autocomplete
            size="small"
            id="country-select-demo"
            value={packageValue?.UOM}
            sx={{ width: 250 }}
            options={
              productAdd?.filter((item: any) => item?.unitClass === "LENGTH") ??
              []
            }
            onChange={(e, value) => handleChange("UOM", value)}
            autoHighlight
            getOptionLabel={(option: any) => option?.code ?? ""}
            renderOption={(props: any, option: any) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.code}
              </Box>
            )}
            renderInput={(params: any) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
        </>
        <div>
          <Typography className={classes.modalInputHeadings}>
            {t("LENGTH")}
          </Typography>
          <TextField
            size="small"
            sx={{ width: 250 }}
            value={packageValue?.length}
            id="outlined-basic"
            variant="outlined"
            onChange={(e: any) => handleChange("length", e?.target?.value)}
          />
        </div>
        <div>
          <Typography className={classes.modalInputHeadings}>
            {t("WIDTH")}
          </Typography>
          <TextField
            size="small"
            sx={{ width: 250 }}
            value={packageValue?.width}
            id="outlined-basic"
            variant="outlined"
            onChange={(e: any) => handleChange("width", e?.target?.value)}
          />
        </div>
        <div>
          <Typography className={classes.modalInputHeadings}>
            {t("HEIGHT")}
          </Typography>
          <TextField
            size="small"
            sx={{ width: 250 }}
            id="outlined-basic"
            variant="outlined"
            value={packageValue?.height}
            onChange={(e: any) => handleChange("height", e?.target?.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDelete()} className={classes.delete}>
          {t("DELETE")}
        </Button>
        <Button onClick={() => onClose()} className={classes.cancel}>
          {t("CANCEL")}
        </Button>
        <Button onClick={() => handleSave()} variant="contained">
          {t("SAVE")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneralSection;
