import React, { useState, useEffect } from "react";
import CommonCardWithHeader from "src/components/common/CommonCardWithHeader";
import { useTranslation } from "react-i18next";
import Card from "@mui/material/Card";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonImageUpload from "src/components/common/CommonImageUpload";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import {
  Button,
  useTheme,
  Theme,
  Popover,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { EditorState } from "draft-js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { AppDispatch, RootState } from "src/store";
import { useSelector } from "react-redux";
import { fileNameAndType } from "src/utils/checkItemAvailable";
import { Imagefileuploader } from "src/store/apps/product/product-category";
import axios from "axios";
import {
  checkProductManualCodeUniqueness,
  clearProductInformation,
  productsCreate,
  productsUpdate,
} from "src/store/apps/products/products-add/productsAdd";
import { useRouter } from "next/router";
import LargeTextInput from "../components/largeTextInput";
import { validateDropdownItem } from "src/utils/validationsMethods";
import Icon from "src/@core/components/icon";
import Chrome from "@uiw/react-color-chrome";
import CategoriesSection from "../components/CategoriesSection";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import CreateNewDropdownOption from "../components/CreateNewDropdownOption";
import { allowedTypes } from "src/utils/utils";

const useStyles = makeStyles({
  radioLabel: {
    fontSize: "15px",
    fontWeight: 600,
    color: "rgba(51, 48, 60, 0.87) !important",
  },
  card: {
    padding: "20px",
    gap: "25px 20px",
    borderRadius: "6px",
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === "light" ? "#F7F7F7" : "rgb(47, 51, 73)",
    boxShadow: "none",
  },
  tablist: {
    width: "100%",
    typography: "body1",
    "& .MuiTabs-root": {
      borderBottom: "none",
    },
    "& .MuiButtonBase-root": {
      textTransform: "none",
    },
  },
  colorPicker: {
    "& .w-color-swatch": {
      boxShadow: "none !important",
      border: "none !important",
    },
  },
  categorieButtonSec: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === "light" ? "#ffff" : "rgb(47,51,73)",
    height: "65px",
    borderRadius: "6px",
  },
  buttonContainer: {
    "&.MuiButton-outlined": {
      height: "30px",
      textTransform: "none",
      padding: "10px 20px",
      fontSize: "13px",
      width: "96px",
      "@media (max-width:1250px)": {
        width: "40px",
      },
    },
  },
  discardBtn: {
    "&.MuiButton-outlined": {
      border: "1px solid rgba(168, 170, 174, 1)",
      textTransform: "none",
    },
  },
  publishBtn: {
    "&.MuiButton-outlined": {
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(53, 134, 199, 1)",
      "&:hover": {
        backgroundColor: "rgba(53, 134, 199, 1)",
      },
      marginLeft: "20px",
    },
  },
});

const ServicesTab: React.FC<{
  editData: any;
  setIsServiceProductUpdated: Function;
  setServiceProductCurrentUpdatedDetails: Function;
  serviceProductUpdatedDefaultValues: any;
}> = ({
  editData,
  setIsServiceProductUpdated,
  setServiceProductCurrentUpdatedDetails,
  serviceProductUpdatedDefaultValues,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const classes = useStyles(theme);

  const [tab, setTab] = React.useState<string>("1");
  const [editorState, setEditorState] = useState<any>({
    description: EditorState.createEmpty(),
    altDescription: EditorState.createEmpty(),
  });

  const productAdd: any =
    useSelector((state: RootState) => state.productsAdd?.data) ?? [];
  const priceList: any =
    useSelector((state: RootState) => state.MarketPlace?.data) ?? [];
  const productDropdown: any =
    useSelector((state: RootState) => state.productdropdown) ?? [];

  const [active, setActive] = useState<boolean>(true);
  const [upload, setUpload] = useState<any>({
    image: "",
    file: {},
  });
  const [imageError, setImageError] = useState(false);

  const [hex, setHex] = useState("#3586c7");
  const [colors, setColors] = useState<string[]>([]);
  const [tag, setTag] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState<string>("associative");
  const [uploadedImageKey, setUploadedImageKey] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [pricing, setPricing] = useState(false);
  const [toggleHexCode, setToggleHexCode] = useState<boolean>(true);
  const [productId, setProductId] = useState<number | any>(null);
  const [isProductSaveInProgress, setIsProductSaveInProgress] =
    useState<boolean>(false);
  const [autoCodeGenStatus, setAutoCodeGenStatus] = useState<boolean>(false);
  const [productCode, setProductCode] = useState<boolean>(false);
  const [isAPIReqInProgress, setIsAPIReqInProgress] = useState(false);

  const [itemNameToAdd, setItemNameToAdd] = useState("");
  const [openCreateNewOptionModal, setOpenCreateNewOptionModal] =
    useState(false);
  const [fieldID, setFieldID] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [fileTypeError, setFileTypeError] = useState(false);
  const [isNewImageSelected, setIsNewImageSelected] = useState(false);

  let contentStateJSON = "";

  const isCodeUnique = async (data: any, value: any) => {
    try {
      const res: any = await dispatch(
        checkProductManualCodeUniqueness({ code: data })
      );
      return res?.payload?.message ? true : res?.payload?.error ? false : true;
    } catch (error) {
      return true;
    }
  };

  let serviceTabSchema = yup.object().shape(
    {
      code: yup.string().when("code", (val, schema) => {
        if (!autoCodeGenStatus && !productCode) {
          return yup
            .string()
            .required("REQUIRED")
            .min(2, "CODE_MUST_BE_AT_LEAST_TWO_CHARACTERS")
            .max(6, "CODE_MUST_BE_AT_MOST_SIX_CHARACTERS")
            .matches(/^[a-zA-Z0-9]+$/, "CODE_MUST_BE_ALPHANUMERIC")
            .test("unique-code", "Code already exists", function (value) {
              if (
                value?.length &&
                value.length > 1 &&
                value.length <= 6 &&
                !productId
              ) {
                return isCodeUnique(value, "code");
              } else {
                if (!productId) {
                  return false;
                } else {
                  return true;
                }
              }
            });
        } else {
          return yup.string().notRequired();
        }
      }),
      productSource: yup
        .mixed()
        .test("productType", "REQUIRED", (item: any) =>
          validateDropdownItem(item)
        ),
      productType: yup
        .mixed()
        .test("productType", "REQUIRED", (item: any) =>
          validateDropdownItem(item)
        ),
      shortName: yup.string().required("REQUIRED"),
      longName: yup.string().required("REQUIRED"),
      productCategory: yup
        .mixed()
        .test("productCategory", "REQUIRED", (item: any) =>
          validateDropdownItem(item)
        ),
      productSubCategory: yup
        .mixed()
        .test("productSubCategory", "REQUIRED", (item: any) =>
          validateDropdownItem(item)
        ),
      image: yup.string().when("toggleHexCode", (val, schema) => {
        if (!toggleHexCode) {
          return yup.string().required("REQUIRED");
        } else {
          return yup.string().notRequired();
        }
      }),
    },
    [
      ["altShortName", "altShortName"],
      ["altLongName", "altLongName"],
      ["code", "code"],
    ]
  );

  const {
    getValues,
    watch: serviceTabWatch,
    control: serviceTabControl,
    clearErrors: serviceTabClearErrors,
    formState: { errors: serviceProductErrors },
    handleSubmit: handleServiceProductSubmit,
    register: serviceTabRegister,
    setValue: serviceTabSetValue,
  } = useForm({
    defaultValues: {
      active: true,
      altDescription: serviceProductUpdatedDefaultValues?.altDescription ?? "",
      altLongName: serviceProductUpdatedDefaultValues?.altLongName ?? "",
      altShortName: serviceProductUpdatedDefaultValues?.altShortName ?? "",
      code: "",
      description: serviceProductUpdatedDefaultValues?.description ?? "",
      externalReference:
        serviceProductUpdatedDefaultValues?.externalReference ?? "",
      image: "",
      isAssociate: "associative",
      longName: serviceProductUpdatedDefaultValues?.longName ?? "",
      productBrand: serviceProductUpdatedDefaultValues?.productBrand ?? "",
      productCategory:
        serviceProductUpdatedDefaultValues?.productCategory ?? "",
      productClassification: "SERVICE_PRODUCT",
      productDivision:
        serviceProductUpdatedDefaultValues?.productDivision ?? "",
      productFamily: serviceProductUpdatedDefaultValues?.productFamily ?? "",
      productGroup: serviceProductUpdatedDefaultValues?.productGroup ?? "",
      productSource: serviceProductUpdatedDefaultValues?.productSource ?? "",
      productSubCategory:
        serviceProductUpdatedDefaultValues?.productSubCategory ?? "",
      productTags: [],
      productType: serviceProductUpdatedDefaultValues?.productType ?? "",
      retailPrice: serviceProductUpdatedDefaultValues?.retailPrice ?? 0,
      shortName: serviceProductUpdatedDefaultValues?.shortName ?? "",
      hex: serviceProductUpdatedDefaultValues?.hex ?? "",
      getFrom: "",
    },
    mode: "onChange",
    resolver: yupResolver(serviceTabSchema),
  });

  let storedFormDetails: any = {};

  useEffect(() => {
    const subscription = serviceTabWatch((value: any, { name, type }) => {
      if (name) {
        const currentUpdatedObj: any = { [name]: value[name] };
        storedFormDetails = {
          ...storedFormDetails,
          ...currentUpdatedObj,
        };
        setServiceProductCurrentUpdatedDetails({ ...storedFormDetails });
        setIsServiceProductUpdated(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [serviceTabWatch]);

  const isFloat = (n: any) => {
    return Number(n) === n && n % 1 !== 0;
  };
  useEffect(() => {
    if (editData?.id && editData?.productClassification === "SERVICE_PRODUCT") {
      setProductId(editData?.id);
      setActive(editData?.active);
      serviceTabSetValue("altDescription", editData?.altDescription);
      serviceTabSetValue("altLongName", editData?.altLongName);
      serviceTabSetValue("altShortName", editData?.altShortName);
      serviceTabSetValue("code", editData?.code);
      if (editData?.code) setProductCode(editData?.code);
      serviceTabSetValue("description", editData?.description);
      serviceTabSetValue("externalReference", editData?.externalReference);
      serviceTabSetValue("longName", editData?.longName);
      serviceTabSetValue("productBrand", editData?.productBrand);
      serviceTabSetValue("productCategory", editData?.productCategory);
      serviceTabSetValue("productDivision", editData?.productDivision);
      serviceTabSetValue("productFamily", editData?.productFamily);
      serviceTabSetValue("productGroup", editData?.productGroup);
      serviceTabSetValue("productSubCategory", editData?.productSubCategory);
      serviceTabSetValue("productSource", editData?.productSources);
      serviceTabSetValue("productType", editData?.productType);
      serviceTabSetValue(
        "retailPrice",
        isFloat(editData?.retailPrice)
          ? editData?.retailPrice?.toFixed(2)
          : editData?.retailPrice
      );
      serviceTabSetValue("shortName", editData?.shortName);

      if (editData?.serviceType === "ASSOCIATE_SERVICE") {
        setServiceType("associative");
      } else {
        setServiceType("independent");
      }

      if (editData?.productTagsMapping?.length)
        setTag(
          editData?.productTagsMapping?.map(
            (item: any) => item?.productTags?.name
          ) ?? []
        );
      if (editData?.image) {
        setToggleHexCode(false);
        serviceTabSetValue(
          "image",
          `https://retailprojects.s3.amazonaws.com/${editData?.image}`
        );
        setUpload({
          image: `https://retailprojects.s3.amazonaws.com/${editData?.image}`,
          file: {},
        });
        setUploadedImageKey(editData?.image);
        setHex("#151313");
      } else {
        setToggleHexCode(true);
        setHex(editData?.hexCode);
        serviceTabSetValue("image", editData?.hexCode);
      }

      if (editData?.description) {
        setTab("1");
      } else if (editData?.altDescription) {
        setTab("2");
      } else {
        setTab("1");
      }
    }
  }, [editData.id]);

  const getAutoGeneratedCodeStatus = async () => {
    setIsAPIReqInProgress(true);
    try {
      const response = await dispatch(
        sequenceMappingCodeSearch({ entityType: "PRODUCT_CODE" })
      );
      setIsAPIReqInProgress(false);
      setAutoCodeGenStatus(response?.payload?.autoGeneration);
    } catch (error) {
      setIsAPIReqInProgress(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAutoGeneratedCodeStatus();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleUploadImage = async (image: any, file: any) => {
    if (!allowedTypes.includes(file.type)) {
      setFileTypeError(true);
      return null;
    }

    if (image?.length > 0) {
      if (file?.size > 5 * 1024 * 1024) {
        serviceTabClearErrors("image");
        setImageError(true);
      } else {
        setImageError(false);
        setFileTypeError(false);
        serviceTabSetValue("image", "uploaded");
        serviceTabClearErrors("image");
        setUpload({
          image: image,
          file: file,
        });
        setIsNewImageSelected(true);
      }
    }
  };

  const uploadImagetoAWS = async () => {
    let imageKey: string = "";
    if (upload?.image?.length > 0) {
      let body = await fileNameAndType(upload?.file?.name, ".", "products");
      const fileRes = await dispatch(Imagefileuploader(body));

      let uploadResult = await axios({
        method: "put",
        url: fileRes?.payload?.data?.signedRequest,
        headers: { "content-type": `image/${body?.fileType}` },
        data: upload?.file,
      });

      imageKey =
        uploadResult?.status === 200 ? fileRes?.payload?.data?.key : "";
      setUploadedImageKey(imageKey);

      return imageKey;
    }
    return imageKey;
  };

  const onSubmit = async (data: any, e: any) => {
    try {
      setIsProductSaveInProgress(true);

      let newUploadedImageKey = "";
      if (isNewImageSelected) {
        newUploadedImageKey = await uploadImagetoAWS();
      }

      let body: any = {
        altDescription: data?.altDescription ?? "",
        altShortName: data?.altShortName ?? "",
        altLongName: data?.altLongName ?? "",
        description: data?.description ?? "",
        externalReference: data?.externalReference ?? "",
        serviceType:
          serviceType === "associative"
            ? "ASSOCIATE_SERVICE"
            : "INDEPENDENT_SERVICE",
        longName: data?.longName ?? "",
        marketPlace: { id: data?.getFrom?.id ?? "" },
        productBrand: { id: data?.productBrand?.id ?? "" },
        productCategory: { id: data?.productCategory?.id ?? "" },
        productClassification: "SERVICE_PRODUCT",
        productDivision: { id: data?.productDivision?.id ?? "" },
        productFamily: { id: data?.productFamily?.id ?? "" },
        productGroup: { id: data?.productGroup?.id ?? "" },
        productSource: data?.productSource?.code,
        productSubCategory: { id: data?.productSubCategory?.id ?? "" },
        productTags: tag,
        productType: { id: data?.productType?.id ?? "" },
        retailPrice: data?.retailPrice ?? 0,
        shortName: data?.shortName ?? "",
        active: active,
      };

      // Send Id If the product is in Edit Mode
      if (productId) {
        body.id = productId;
      }
      // Send Code If the product is in Edit Mode
      if (productCode || !autoCodeGenStatus) {
        body.code = data?.code;
      }

      // updated based on image type selection
      if (toggleHexCode) {
        body.hexCode = hex ?? "#3586C7";
        body.image = "";
      } else {
        body.image = isNewImageSelected ? newUploadedImageKey : "";
        body.hexCode = "";
      }

      const reqBody = {
        products: [
          {
            ...body,
          },
        ],
      };

      // Save the product
      try {
        setIsProductSaveInProgress(true);
        let createOrUpdateFunction = productsCreate(reqBody);
        if (productId) {
          // Edit Product
          createOrUpdateFunction = productsUpdate(reqBody);
        }
        const res = await dispatch(createOrUpdateFunction);

        if (productId) setProductId(null);

        // navigate to product list
        router.push("/products/products-list");
      } catch (error) {
        setIsProductSaveInProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onErrors = (errors: any, e: any) => console.log(errors, e);

  const addColors = () => {
    let filteredColors = colors?.filter((item: string) => item !== hex);
    setColors([...filteredColors, hex]);
  };

  // update the field selection with created new drop down option
  const updateCreatedOption = (fieldID: string, updateObj: any) => {
    switch (fieldID) {
      case "TYPE":
        serviceTabSetValue("productType", updateObj);
        break;
      default:
        break;
    }
  };

  return (
    <form key={8}>
      <Grid container alignContent={"baseline"} spacing={5}>
        <Grid item xs={12} md={9} sx={{ paddingLeft: "0px !important" }}>
          <Card sx={{ p: 5, boxShadow: "none" }}>
            <Typography sx={{ mb: 2 }} variant="h6">
              {t("GENERAL_DETAILS")}
            </Typography>
            <FormControl>
              <FormLabel
                className={classes.radioLabel}
                id="demo-row-radio-buttons-group-label"
              >
                {t("SERVICES")}
              </FormLabel>
              <RadioGroup
                {...serviceTabRegister("isAssociate")}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                defaultValue={"associative"}
              >
                <FormControlLabel
                  control={
                    <Radio
                      name="isAssociate"
                      onChange={() => setServiceType("associative")}
                      value="associative"
                      checked={serviceType === "associative"}
                      disabled={
                        editData?.id &&
                        editData?.serviceType === "INDEPENDENT_SERVICE"
                      }
                    />
                  }
                  label={t("ASSOCIATE_SERVICES")}
                />
                <FormControlLabel
                  control={
                    <Radio
                      name="isAssociate"
                      onChange={() => setServiceType("independent")}
                      value="independent"
                      checked={serviceType === "independent"}
                      disabled={
                        editData?.id &&
                        editData?.serviceType === "ASSOCIATE_SERVICE"
                      }
                    />
                  }
                  label={t("INDEPENDENT_SERVICE")}
                />
              </RadioGroup>
            </FormControl>

            <Grid sx={{ mt: 1 }} container spacing={2}>
              <Grid justifyContent="center" item xs={3.9}>
                <CommonInput
                  control={serviceTabControl}
                  defaultValue={editData?.code ?? "Code"}
                  errors={serviceProductErrors}
                  id="code"
                  label="Code"
                  name="code"
                  required={autoCodeGenStatus ? false : true}
                  disabled={autoCodeGenStatus ? true : false}
                  placeholder={editData?.code ?? t("CODE")}
                />
              </Grid>
              <Grid item xs={3.9}>
                <CommonSelect
                  control={serviceTabControl}
                  clearErrors={serviceTabClearErrors}
                  defaultValue={getValues("productSource")}
                  disabled={false}
                  errors={serviceProductErrors}
                  label={t("SOURCE")}
                  id="productSource"
                  name="productSource"
                  noOptionsText={false}
                  options={productAdd?.productSource ?? []}
                  placeholder={""}
                  required={true}
                  setSelectedFieldType={null}
                  setValue={serviceTabSetValue}
                  validateForm={{}}
                />
              </Grid>
              <Grid item xs={3.9}>
                <CommonSelect
                  id={"TYPE"}
                  control={serviceTabControl}
                  clearErrors={serviceTabClearErrors}
                  customText={true}
                  disabled={false}
                  defaultValue={getValues("productType")}
                  errors={serviceProductErrors}
                  func={setItemNameToAdd}
                  handleModel={() => {
                    setOpenCreateNewOptionModal(true);
                    setFieldID("TYPE");
                    setTitle("TYPE");
                  }}
                  label={t("TYPE")}
                  name="productType"
                  noOptionsText={true}
                  options={productDropdown?.ProductTypes ?? []}
                  placeholder={t("SELECT_TYPE")}
                  required={true}
                  setSelectedFieldType={null}
                  setValue={serviceTabSetValue}
                  validateForm={{}}
                />
              </Grid>
              <Grid item xs={6}>
                <CommonInput
                  control={serviceTabControl}
                  defaultValue={""}
                  errors={serviceProductErrors}
                  id="shortName"
                  label={t("SHORT_NAME") as string}
                  name="shortName"
                  required={true}
                />
              </Grid>
              <Grid item xs={6}>
                <CommonInput
                  control={serviceTabControl}
                  defaultValue={""}
                  errors={serviceProductErrors}
                  id="longName"
                  label={t("LONG_NAME") as string}
                  name="longName"
                  required={true}
                />
              </Grid>
              <Grid item xs={6}>
                <CommonInput
                  control={serviceTabControl}
                  defaultValue={""}
                  errors={serviceProductErrors}
                  id="altShortName"
                  label={"ALTERNATIVE_SHORT_NAME"}
                  name="altShortName"
                  required={false}
                />
              </Grid>
              <Grid item xs={6}>
                <CommonInput
                  control={serviceTabControl}
                  defaultValue={""}
                  errors={serviceProductErrors}
                  id="altLongName"
                  label={"ALTERNATIVE_LONG_NAME"}
                  name="altLongName"
                  required={false}
                />
              </Grid>
              <Grid item xs={5.9}>
                <CommonInput
                  control={serviceTabControl}
                  defaultValue={""}
                  errors={serviceProductErrors}
                  id="exterRef"
                  label={t("EXTERNAL_REFERENCE") as string}
                  name="externalReference"
                  required={false}
                />
              </Grid>
              <Grid item xs={5.9}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  <CommonSwitch
                    active={active}
                    setActive={setActive}
                    statusChange={() => serviceTabSetValue("active", !active)}
                  />
                  {active ? t("ACTIVE") : t("INACTIVE")}
                </div>
              </Grid>
            </Grid>
            <Box className={classes.tablist}>
              <TabContext value={tab}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label={t("DESCRIPTION")} value="1" />
                    <Tab label={t("ALT_DESC")} value="2" />
                  </TabList>
                </Box>
                <TabPanel sx={{ px: "0px !important" }} value="1">
                  <LargeTextInput
                    value={editData?.description ?? getValues("description")}
                    setValue={serviceTabSetValue}
                    type="description"
                    editModeValue={editData?.description}
                  />
                </TabPanel>
                <TabPanel sx={{ px: "0px !important" }} value="2">
                  <LargeTextInput
                    value={
                      editData?.altDescription ?? getValues("altDescription")
                    }
                    setValue={serviceTabSetValue}
                    type="altDescription"
                    editModeValue={editData?.altDescription}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container className={classes.categorieButtonSec}>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              className={`${classes.buttonContainer} ${classes.discardBtn}`}
              onClick={() => {
                dispatch(clearProductInformation());
                router.push("/products/products-list");
              }}
            >
              {t("CANCEL")}
            </Button>
            <Button
              type="submit"
              variant="outlined"
              size="small"
              className={`${classes.buttonContainer} ${classes.publishBtn}`}
              onClick={handleServiceProductSubmit(
                (data: Object, e: any) => {
                  e?.preventDefault(), e?.stopPropagation(), onSubmit(data, e);
                },
                (errors: Object, e?: any) => onErrors(errors, e)
              )}
              disabled={isProductSaveInProgress}
            >
              {t("SAVE")}
            </Button>
          </Grid>
          <Card sx={{ p: "20px", mt: "26px" }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
              >
                <FormControlLabel
                  control={
                    <Radio
                      name="isImageOrHexCode"
                      onChange={() => setToggleHexCode(false)}
                      value="image"
                      checked={toggleHexCode === false}
                    />
                  }
                  label={t("PRODUCT_IMAGE")}
                />
                <FormControlLabel
                  control={
                    <Radio
                      name="isImageOrHexCode"
                      onChange={() => {
                        serviceTabClearErrors("image");
                        setFileTypeError(false);
                        setImageError(false);
                        setToggleHexCode(true);
                      }}
                      value={"hexColorCode"}
                      checked={toggleHexCode === true}
                    />
                  }
                  label={t("HEX_CODE")}
                />
              </RadioGroup>
            </FormControl>
            {/* image upload */}
            {!toggleHexCode ? (
              <>
                {upload?.image === "" && (
                  <>
                    <CommonImageUpload
                      custom={true}
                      cb={(image, file) => handleUploadImage(image, file)}
                    />
                    {imageError && (
                      <Typography color={"red"}>
                        {t("MAXIMUM_FILE_SIZE")} 5MB
                      </Typography>
                    )}
                    {fileTypeError && (
                      <Typography color={"red"}>
                        {t("PRODUCT_IMAGE_HINT")}
                      </Typography>
                    )}
                  </>
                )}
                {upload?.image && (
                  <CommonCardWithHeader
                    header={"Uploaded Product Image"}
                    component={
                      <div style={{ display: "flex" }}>
                        <Image
                          src={upload?.image}
                          alt="uploaded image"
                          width={100}
                          height={100}
                        />
                        <Button
                          sx={{ fontSize: "30px", height: "24px" }}
                          onClick={() => {
                            serviceTabSetValue("image", "");
                            setUpload({ image: "", file: {} });
                            serviceTabClearErrors("image");
                            setFileTypeError(false);
                            setImageError(false);
                          }}
                        >
                          &times;
                        </Button>
                      </div>
                    }
                  />
                )}
              </>
            ) : (
              <>
                {/* color picker */}
                {upload?.image?.length === 0 && (
                  <Card sx={{ p: 5, my: 5 }}>
                    <Typography variant="body1">{t("HEX_CODE")}</Typography>
                    <Typography sx={{ mt: "5px" }} variant="body2">{`${t(
                      "HEX_CODE"
                    )} (${t("COLOR_CODE")})`}</Typography>

                    <OutlinedInput
                      fullWidth
                      id="outlined-adornment-password"
                      type={"text"}
                      size="small"
                      value={hex}
                      inputProps={{ readOnly: true }}
                      onClick={(e: any) => setAnchorEl(e.currentTarget)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            edge="end"
                          >
                            <Icon icon="tabler:brush" fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <Popover
                      className={classes.colorPicker}
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                    >
                      <Card
                        sx={{
                          background: "white",
                          width: 250,
                          padding: "5px 10px 25px 5px",
                        }}
                      >
                        <Chrome
                          color={hex}
                          style={{ float: "left" }}
                          onChange={(color: any) => {
                            setHex(color.hexa);
                            serviceTabSetValue("image", "uploaded");
                            serviceTabClearErrors("image");
                          }}
                        />
                        <Box>
                          <Grid
                            container
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Grid>
                              <Typography sx={{ color: "black" }}>
                                {t("SAVED_COLORS")}:
                              </Typography>
                            </Grid>
                            <Grid>
                              <Button
                                onClick={() => addColors()}
                                sx={{ color: "black" }}
                              >
                                +{t("ADD")}
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <>
                              {colors?.map((item: string) => {
                                return (
                                  <Grid xs={2}>
                                    <Box
                                      onClick={() => setHex(item)}
                                      sx={{
                                        height: "25px",
                                        width: "25px",
                                        borderRadius: "100%",
                                        background: item,
                                        outline:
                                          hex === item
                                            ? "2px solid #9e9e9e"
                                            : "",
                                        outlineOffset: "2px",
                                        marginBottom: "12px",
                                      }}
                                    ></Box>
                                  </Grid>
                                );
                              })}
                            </>
                          </Grid>
                        </Box>
                      </Card>
                    </Popover>
                  </Card>
                )}
              </>
            )}
            <Typography variant="subtitle2" color="error">
              {t(serviceProductErrors?.image?.message as any)}
            </Typography>
          </Card>

          {/* category */}
          <Card sx={{ p: 5, mb: 5, mt: "26px" }}>
            <Box>
              <Typography variant="h6">{t("SELECT_CATEGORY")}</Typography>
              <div>
                <CategoriesSection
                  control={serviceTabControl}
                  clearErrors={serviceTabClearErrors}
                  errors={serviceProductErrors}
                  setValue={serviceTabSetValue}
                  setTag={setTag}
                  tag={tag}
                  custom={12}
                  getValues={getValues}
                />
              </div>
            </Box>
          </Card>

          {/* pricing */}
          <Card sx={{ p: 5 }}>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"baseline"}
            >
              <Grid item xs={7}>
                <Typography variant="body1">{t("PRICING")}</Typography>
              </Grid>
              <Grid item xs={5}>
                <CommonSwitch
                  active={pricing}
                  statusChange={(e: any) => setPricing(!pricing)}
                  id="pricing_switch"
                />
                {t("AUTO")}
              </Grid>
            </Grid>
            {
              <Grid item xs={12} md={12}>
                {pricing ? (
                  <CommonSelect
                    control={serviceTabControl}
                    clearErrors={serviceTabClearErrors}
                    disabled={false}
                    defaultValue={null}
                    errors={serviceProductErrors}
                    label={t("GET_FROM")}
                    name="getFrom"
                    id="getFromPriceList"
                    noOptionsText={false}
                    options={priceList}
                    required={false}
                    // setSelectedFieldType={null}
                    setValue={serviceTabSetValue}
                    validateForm={{}}
                    convertToKey={false}
                  />
                ) : (
                  <CommonInput
                    type="float"
                    convertToKey={false}
                    control={serviceTabControl}
                    defaultValue={""}
                    errors={serviceProductErrors}
                    id="retailPrice"
                    label={t("RETAIL_PRICE_EXCLUDING_TAX") as string}
                    name="retailPrice"
                    required={false}
                  />
                )}
              </Grid>
            }
          </Card>
        </Grid>
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
      </Grid>
    </form>
  );
};

export default React.memo(ServicesTab);
