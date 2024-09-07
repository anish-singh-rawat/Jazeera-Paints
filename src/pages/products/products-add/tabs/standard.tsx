import React, { useEffect, useState } from "react";
import CommonCardWithHeader from "src/components/common/CommonCardWithHeader";
import GeneralSection from "../components/GeneralSection";
import CategoriesSection from "../components/CategoriesSection";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import sx from "mui-sx";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  Grid,
  FormControlLabel,
  FormGroup,
  Typography,
  useTheme,
  Card,
  OutlinedInput,
  IconButton,
  FormControl,
  RadioGroup,
  Radio,
  DialogContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  checkProductManualCodeUniqueness,
  clearProductInformation,
  getAssignedServicesOfProductsByServiceType,
  getProductsByServiceType,
  getSearchAssignedServicesOfProductsByServiceType,
  getSearchProductsByServiceType,
  productsCreate,
  productsUpdate,
} from "src/store/apps/products/products-add/productsAdd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useRouter } from "next/router";
import CommonImageUpload from "src/components/common/CommonImageUpload";
import { fileNameAndType } from "src/utils/checkItemAvailable";
import { Imagefileuploader } from "src/store/apps/product/product-category";
import axios from "axios";
import { validateDropdownItem } from "src/utils/validationsMethods";
import Icon from "src/@core/components/icon";
import Popover from "@mui/material/Popover";
import InputAdornment from "@mui/material/InputAdornment";
import Chrome from "@uiw/react-color-chrome";
import AddSerialNumber from "../components/AddSerialNumber";
import AddBatch from "../components/AddBatch";
import RowOptions from "src/components/common/RowOptions";
import moment from "moment";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { allowedTypes, decryptPriceId } from "src/utils/utils";
import AddAssociateServicesContainer from "../components/AddAssociateServicesContainer";
import AddIndependentServicesContainer from "../components/AddIndependentServicesContainer";

import {
  useStandardTabStyles,
  sxServicesDialog,
  sxDialogWidthCommon,
  sxDialogWidthSNum,
} from "src/styles/standardTab.styles";
import ViewBatchDialog from "../components/ViewBatchDialog";
import ViewSerialNumberDialog from "../components/ViewSerialNumberDialog";

interface Props {
  editData: any;
  setIsStandardProductUpdated: Function;
  setStandardProductCurrentUpdatedDetails: Function;
  standardProductUpdatedDefaultValues: any;
}

const StandardTab: React.FC<Props> = ({
  editData,
  setIsStandardProductUpdated,
  setStandardProductCurrentUpdatedDetails,
  standardProductUpdatedDefaultValues,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Associate Service Selectors
  const isAssociateServicesLoading: any =
    useSelector(
      (state: RootState) => state?.productsAdd.isAssociateServicesLoading
    ) ?? false;

  const associateServiceProducts: any =
    useSelector(
      (state: RootState) => state?.productsAdd.data?.associateServiceProducts
    ) ?? [];

  const associateServiceProductsTotalCount: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.associateServiceProductsTotalCount
    ) ?? [];

  const isAssociateServicesSearchLoading: any =
    useSelector(
      (state: RootState) => state?.productsAdd.isAssociateServicesSearchLoading
    ) ?? false;

  const associateServiceSearchedProducts: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.associateServiceSearchedProducts
    ) ?? [];

  const associateServiceSearchedProductsTotalCount: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.associateServiceSearchedProductsTotalCount
    ) ?? [];

  const isAssignedAssociateServicesLoading: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd?.isAssignedAssociateServicesLoading
    ) ?? [];

  const assignedAssociateServiceProducts: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.assignedAssociateServiceProducts
    ) ?? [];

  const assignedAssociateServiceProductsTotalCount: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd?.data?.assignedAssociateServiceProductsTotalCount
    ) ?? [];

  const isAssignedAssociateServicesSearchLoading: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.isAssignedAssociateServicesSearchLoading
    ) ?? false;

  const assignedAssociateServiceSearchedProducts: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.assignedAssociateServiceSearchedProducts
    ) ?? [];

  const assignedAssociateServiceSearchedProductsTotalCount: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data
          ?.assignedAssociateServiceSearchedProductsTotalCount
    ) ?? [];

  // Independent Service Selectors
  const isIndependentServicesLoading: any =
    useSelector(
      (state: RootState) => state?.productsAdd.isIndependentServicesLoading
    ) ?? false;

  const independentServiceProducts: any =
    useSelector(
      (state: RootState) => state?.productsAdd.data?.independentServiceProducts
    ) ?? [];

  const independentServiceProductsTotalCount: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.independentServiceProductsTotalCount
    ) ?? [];

  const isIndependentServicesSearchLoading: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.isIndependentServicesSearchLoading
    ) ?? false;

  const independentServiceSearchedProducts: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.independentServiceSearchedProducts
    ) ?? [];

  const independentServiceSearchedProductsTotalCount: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.independentServiceSearchedProductsTotalCount
    ) ?? [];

  const isAssignedIndependentServicesLoading: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.isAssignedIndependentServicesLoading
    ) ?? false;

  const assignedIndependentServiceProducts: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.assignedIndependentServiceProducts
    ) ?? [];

  const assignedIndependentServiceProductsTotalCount: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd?.data?.assignedIndependentServiceProductsTotalCount
    ) ?? [];

  const isAssignedIndependentServicesSearchLoading: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.isIndependentServicesSearchLoading
    ) ?? false;

  const assignedIndependentServiceSearchedProducts: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data?.assignedIndependentServiceSearchedProducts
    ) ?? [];

  const assignedIndependentServiceSearchedProductsTotalCount: any =
    useSelector(
      (state: RootState) =>
        state?.productsAdd.data
          ?.assignedIndependentServiceSearchedProductsTotalCount
    ) ?? [];

  // local state
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  const [tag, setTag] = useState<string[]>([]);

  const [isMarkAsAssociate, setIsMarkAsAssociate] = useState<boolean>(false);
  const [isDeleteProductsOnSave, setIsDeleteProductsOnSave] =
    useState<boolean>(false);
  const [isMarkAsExclusive, setIsMarkAsExclusive] = useState<boolean>(false);

  const [isMarkAsIndependent, setIsMarkAsIndependent] =
    useState<boolean>(false);

  const [isProductSaveInProgress, setIsProductSaveInProgress] =
    useState<boolean>(false);

  const [isAPIReqInProgress, setIsAPIReqInProgress] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);

  //Batch Payload
  const [batchPayload, setBatchPayload] = useState<any[]>([]);
  const [newBatchPayload, setNewBatchPayload] = useState<any[]>([]);

  //Serial Number payload
  const [serialNumPayload, setSerialNumPayload] = useState<any[]>([]);
  const [newSerialNumPayload, setNewSerialNumPayload] = useState<any[]>([]);

  // Image and Hex code
  const [upload, setUpload] = useState<any>({
    image: "",
    file: {},
  });

  const [openSerialOrBatch, setOpenSerialOrBatch] = useState<boolean>(false);
  const initialCheckboxState =
    editData?.hasBatchNumber || editData?.hasSerialNumber;

  useEffect(() => {
    setOpenSerialOrBatch(initialCheckboxState);
  }, [editData?.hasBatchNumber || editData?.hasSerialNumber]);
  const handleBatchOrSerialToggle = () => {
    setOpenSerialOrBatch((prevState) => !prevState);
  };

  const [imageError, setImageError] = useState(false);
  const [toggleHexCode, setToggleHexCode] = useState<boolean>(true);
  const [hex, setHex] = useState("#3586c7");
  const [colors, setColors] = useState<string[]>([]);
  const [productId, setProductId] = useState(null);
  const [productCode, setProductCode] = useState("");

  const [autoCodeGenStatus, setAutoCodeGenStatus] = useState<boolean>(false);

  const [conversion, setConversion] = useState<any>([]);

  const [sellOnPos, setSellOnPos] = useState(true);
  const [sellOnline, setSellOnline] = useState(false);

  const [barCodeDuplicateError, setBarCodeDuplicateError] = useState({
    visible: false,
    index: -1,
  });

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [fileTypeError, setFileTypeError] = useState(false);
  const [isNewImageSelected, setIsNewImageSelected] = useState(false);

  const [associateCurrentTab, setAssociateCurrentTab] = useState("1");
  const [isAssociateSearchEnabled, setIsAssociateSearchEnabled] =
    useState(false);
  const [associateSearchItem, setAssociateSearchItem] = useState("");

  const [independentCurrentTab, setIndependentCurrentTab] = useState("1");
  const [isIndependentSearchEnabled, setIsIndependentSearchEnabled] =
    useState(false);
  const [independentSearchItem, setIndependentSearchItem] = useState("");

  const [currentAssociateServiceProducts, setCurrentAssociateServiceProducts] =
    useState<any>([]);

  const [
    currentAssociateServiceSearchedProducts,
    setCurrentAssociateServiceSearchedProducts,
  ] = useState<any>([]);

  const [
    currentIndependentServiceSearchedProducts,
    setCurrentIndependentServiceSearchedProducts,
  ] = useState<any>([]);

  const [
    selectedUnAssignedIndependentServiceSearchedProducts,
    setSelectedUnAssignedIndependentServiceSearchedProducts,
  ] = useState<any>([]);

  const [
    assignedIndependentServicesSearchedPaginationCount,
    setAssignedIndependentServicesSearchedPaginationCount,
  ] = useState<number>(0);

  const [
    associateServicesPaginationCount,
    setAssociateServicesPaginationCount,
  ] = useState<number>(0);

  const [
    selectedUnAssignedAssociateServiceProducts,
    setSelectedUnAssignedAssociateServiceProducts,
  ] = useState<any>([]);

  const [
    selectedUnAssignedAssociateServiceSearchedProducts,
    setSelectedUnAssignedAssociateServiceSearchedProducts,
  ] = useState<any>([]);

  const [
    associateServicesSearchedPaginationCount,
    setAssociateServicesSearchedPaginationCount,
  ] = useState<number>(0);

  const [
    independentServicesSearchedPaginationCount,
    setIndependentServicesSearchedPaginationCount,
  ] = useState<number>(0);

  const [
    assignedAssociateServicesPaginationCount,
    setAssignedAssociateServicesPaginationCount,
  ] = useState<number>(0);

  const [
    assignedAssociateServicesSearchedPaginationCount,
    setAssignedAssociateServicesSearchedPaginationCount,
  ] = useState<number>(0);

  const [
    independentServicesPaginationCount,
    setIndependentServicesPaginationCount,
  ] = useState<number>(0);

  const [
    assignedIndependentServicesPaginationCount,
    setAssignedIndependentServicesPaginationCount,
  ] = useState<number>(0);

  const [
    selectedUnAssignedIndependentServiceProducts,
    setSelectedUnAssignedIndependentServiceProducts,
  ] = useState<any>([]);

  const [associatePageState, setAssociatePageState] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 100,
  });

  const [associateSearchPageState, setAssociateSearchPageState] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 100,
  });

  const [independentSearchPageState, setIndependentSearchPageState] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 100,
  });

  const [assignedAssociatePageState, setAssignedAssociatePageState] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 100,
  });

  const [
    assignedAssociateSearchPageState,
    setAssignedAssociateSearchPageState,
  ] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 100,
  });

  const [
    assignedIndependentSearchPageState,
    setAssignedIndependentSearchPageState,
  ] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 100,
  });

  const [independentPageState, setIndependentPageState] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 1,
    pageSize: 100,
  });

  const [assignedIndependentPageState, setAssignedIndependentPageState] =
    useState({
      isLoading: true,
      data: [],
      total: 0,
      page: 1,
      pageSize: 100,
    });

  const [
    currentAssignedAssociateServiceProducts,
    setCurrentAssignedAssociateServiceProducts,
  ] = useState<any>(
    JSON.parse(JSON.stringify(assignedAssociateServiceProducts))
  );

  const [
    currentAssignedAssociateServiceSearchedProducts,
    setCurrentAssignedAssociateServiceSearchedProducts,
  ] = useState<any>(
    JSON.parse(JSON.stringify(assignedAssociateServiceSearchedProducts))
  );

  const [
    currentAssignedIndependentServiceSearchedProducts,
    setCurrentAssignedIndependentServiceSearchedProducts,
  ] = useState<any>(
    JSON.parse(JSON.stringify(assignedIndependentServiceSearchedProducts))
  );

  const [
    associateServiceProductsDeletedArr,
    setAssociateServiceProductsDeletedArr,
  ] = useState<any>([]);

  const [
    currentIndependentServiceProducts,
    setCurrentIndependentServiceProducts,
  ] = useState<any>([]);

  const [
    currentAssignedIndependentServiceProducts,
    setCurrentAssignedIndependentServiceProducts,
  ] = useState<any>(
    JSON.parse(JSON.stringify(assignedIndependentServiceProducts))
  );

  const [
    independentServiceProductsDeletedArr,
    setIndependentServiceProductsDeletedArr,
  ] = useState<any>([]);

  const [openBatchDialog, setOpenBatchDialog] = useState(false);
  const [openSerialNumDialog, setOpenSerialNumDialog] = useState(false);

  const theme = useTheme();
  const classes = useStandardTabStyles(theme);

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

  const standardTabSchema: any = yup.object().shape(
    {
      baseUOM: yup
        .mixed()
        .test("productDivision", "REQUIRED", (item: any) =>
          validateDropdownItem(item)
        ),
      code: yup.string().when("code", (val, schema) => {
        if (!autoCodeGenStatus) {
          return yup
            .string()
            .required("REQUIRED")
            .min(2, "CODE_MUST_BE_AT_LEAST_TWO_CHARACTERS")
            .max(6, "CODE_MUST_BE_AT_MOST_SIX_CHARACTERS")
            .matches(/^[a-zA-Z0-9]+$/, "CODE_MUST_BE_ALPHANUMERIC")
            .test("unique-code", "Code already exists", function (value) {
              if (
                value?.length &&
                value?.length > 1 &&
                value?.length <= 6 &&
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
      longName: yup.string().required("REQUIRED"),
      productSource: yup
        .mixed()
        .test("productSource", "REQUIRED", (item: any) =>
          validateDropdownItem(item)
        ),
      productType: yup
        .mixed()
        .test("productType", "REQUIRED", (item: any) =>
          validateDropdownItem(item)
        ),
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
      retailPrice: yup
        .string()
        .required("REQUIRED")
        .matches(
          /^\d+(\.\d{1,2})?$/,
          "Must be a number with up to two decimal places"
        ),
      salesUOM: yup
        .mixed()
        .test("productDivision", "REQUIRED", (item: any) =>
          validateDropdownItem(item)
        ),
      shortName: yup.string().required("REQUIRED"),
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
    control: standardProductControl,
    clearErrors: standardProductClearErrors,
    formState: { errors: standardProductErrors, isDirty, dirtyFields },
    getValues: standardProductGetValues,
    handleSubmit: handleStandardProductSubmit,
    reset: standardProductReset,
    setValue: standardProductSetValue,
    watch: standardProductWatch,
    setError: setStandardProductError,
  } = useForm({
    defaultValues: {
      active: true,
      altDescription: standardProductUpdatedDefaultValues?.altDescription ?? "",
      altLongName: standardProductUpdatedDefaultValues?.altLongName ?? "",
      altShortName: standardProductUpdatedDefaultValues?.altShortName ?? "",
      batchNumber: false,
      baseUOM: null,
      code: "",
      description: standardProductUpdatedDefaultValues?.description ?? "",
      externalReference:
        standardProductUpdatedDefaultValues?.externalReference ?? "",
      isAssociate: false,
      image: "",
      longName: standardProductUpdatedDefaultValues?.longName ?? "",
      shortName: standardProductUpdatedDefaultValues?.shortName ?? "",
      salesUOM: null,
      sellOnPos: true,
      sellOnline: true,
      serialNumber: false,
      productBarCodeMapping: [],
      productBrand: standardProductUpdatedDefaultValues?.productBrand ?? "",
      productCategory:
        standardProductUpdatedDefaultValues?.productCategory ?? "",
      productDivision:
        standardProductUpdatedDefaultValues?.productDivision ?? "",
      productFamily: standardProductUpdatedDefaultValues?.productFamily ?? "",
      productGroup: standardProductUpdatedDefaultValues?.productGroup ?? "",
      productSource: standardProductUpdatedDefaultValues?.productSource ?? "",
      productSubCategory:
        standardProductUpdatedDefaultValues?.productSubCategory ?? "",
      productType: standardProductUpdatedDefaultValues?.productType ?? "",
      purchaseUOM: null,
      retailPrice: standardProductUpdatedDefaultValues?.retailPrice ?? 0,
      fromValue: null,
      fromUnit: null,
      toValue: null,
      UOM: null,
      barcodeTypes: null,
      barcode: null,
      productAttributeO1: null,
      productAttributeO2: null,
      productAttributeO3: null,
      productAttributeO4: null,
      productAttributeO5: null,
      serialOrBatch: "",
    },
    mode: "onChange",
    resolver: yupResolver(standardTabSchema),
  });

  let storedFormDetails: any = {};

  useEffect(() => {
    const subscription = standardProductWatch((value: any, { name, type }) => {
      if (name) {
        const currentUpdatedObj: any = { [name]: value[name] };
        storedFormDetails = {
          ...storedFormDetails,
          ...currentUpdatedObj,
        };
        setStandardProductCurrentUpdatedDetails({ ...storedFormDetails });
        setIsStandardProductUpdated(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [standardProductWatch]);

  const isFloat = (n:any) => {
    return Number(n) === n && n % 1 !== 0;
  }
  useEffect(() => {
    if (
      editData?.id &&
      editData?.productClassification === "STANDARD_PRODUCT"
    ) {
      setProductId(editData?.id);
      setProductCode(editData?.code);
      standardProductSetValue("code", editData?.code);
      setSwitchActive(editData?.active);
      standardProductSetValue("shortName", editData?.shortName);
      standardProductSetValue("longName", editData?.longName);
      standardProductSetValue("altDescription", editData?.altDescription);
      standardProductSetValue("altLongName", editData?.altLongName);
      standardProductSetValue("altShortName", editData?.altShortName);
      standardProductSetValue("description", editData?.description);
      standardProductSetValue("externalReference", editData?.externalReference);
      // standardProductSetValue("hasBatchNumber", editData?.hasBatchNumber);
      // standardProductSetValue("hasSerialNumber", editData?.hasSerialNumber);
      if (editData?.hasBatchNumber)
        standardProductSetValue("serialOrBatch", "hasBatchNumber");
      if (editData?.hasSerialNumber)
        standardProductSetValue("serialOrBatch", "hasSerialNumber");
      standardProductSetValue("isAssociate", editData?.isAssociate);
      standardProductSetValue("productBrand", editData?.productBrand);
      standardProductSetValue("productCategory", editData?.productCategory);
      standardProductSetValue("productDivision", editData?.productDivision);
      standardProductSetValue("productFamily", editData?.productFamily);
      standardProductSetValue("productGroup", editData?.productGroup);
      standardProductSetValue(
        "productSubCategory",
        editData?.productSubCategory
      );
      standardProductSetValue("productSource", editData?.productSources);
      standardProductSetValue("productType", editData?.productType);
      standardProductSetValue("retailPrice", isFloat(editData?.retailPrice) ? editData?.retailPrice?.toFixed(2) : editData?.retailPrice ?? 0);
      standardProductSetValue("baseUOM", editData?.baseUOM);
      standardProductSetValue("salesUOM", editData?.salesUOM);
      standardProductSetValue("purchaseUOM", editData?.purchaseUOM);
      standardProductSetValue(
        "productAttributeO1",
        editData?.productAttributeO1
      );
      standardProductSetValue(
        "productAttributeO2",
        editData?.productAttributeO2
      );
      standardProductSetValue(
        "productAttributeO3",
        editData?.productAttributeO3
      );
      standardProductSetValue(
        "productAttributeO4",
        editData?.productAttributeO4
      );
      standardProductSetValue(
        "productAttributeO5",
        editData?.productAttributeO5
      );
      setSellOnPos(editData?.sellOnPos);
      setSellOnline(editData?.sellOnline);
      if (editData?.productTagsMapping?.length)
        setTag(
          editData?.productTagsMapping?.map(
            (item: any) => item?.productTags?.name
          ) ?? []
        );
      if (editData?.image) {
        setToggleHexCode(false);
        standardProductSetValue(
          "image",
          `https://retailprojects.s3.amazonaws.com/${editData?.image}`
        );
        setUpload({
          image: `https://retailprojects.s3.amazonaws.com/${editData?.image}`,
          file: {},
        });
        setHex("#151313");
      } else {
        setToggleHexCode(true);
        setHex(editData?.hexCode);
        standardProductSetValue("image", editData?.hexCode);
      }
    }
  }, [editData?.id]);

  useEffect(() => {
    if (associateServiceProductsTotalCount > 100) {
      const pageCount = Math.floor(associateServiceProductsTotalCount / 100);
      setAssociateServicesPaginationCount(pageCount);
    } else {
      setAssociateServicesPaginationCount(0);
    }
  }, [associateServiceProductsTotalCount]);

  useEffect(() => {
    if (associateServiceSearchedProductsTotalCount > 100) {
      const pageCount = Math.floor(
        associateServiceSearchedProductsTotalCount / 100
      );
      setAssociateServicesSearchedPaginationCount(pageCount);
    } else {
      setAssociateServicesSearchedPaginationCount(0);
    }
  }, [associateServiceSearchedProductsTotalCount]);

  useEffect(() => {
    if (independentServiceSearchedProductsTotalCount > 100) {
      const pageCount = Math.floor(
        independentServiceSearchedProductsTotalCount / 100
      );
      setIndependentServicesSearchedPaginationCount(pageCount);
    } else {
      setIndependentServicesSearchedPaginationCount(0);
    }
  }, [independentServiceSearchedProductsTotalCount]);

  useEffect(() => {
    if (assignedAssociateServiceProductsTotalCount > 100) {
      const pageCount = Math.floor(
        assignedAssociateServiceProductsTotalCount / 100
      );
      setAssignedAssociateServicesPaginationCount(pageCount);
    } else {
      setAssignedAssociateServicesPaginationCount(0);
    }
  }, [assignedAssociateServiceProductsTotalCount]);

  useEffect(() => {
    if (assignedAssociateServiceSearchedProductsTotalCount > 100) {
      const pageCount = Math.floor(
        assignedAssociateServiceSearchedProductsTotalCount / 100
      );
      setAssignedAssociateServicesSearchedPaginationCount(pageCount);
    } else {
      setAssignedAssociateServicesSearchedPaginationCount(0);
    }
  }, [assignedAssociateServiceSearchedProductsTotalCount]);

  useEffect(() => {
    if (assignedIndependentServiceSearchedProductsTotalCount > 100) {
      const pageCount = Math.floor(
        assignedIndependentServiceSearchedProductsTotalCount / 100
      );
      setAssignedIndependentServicesSearchedPaginationCount(pageCount);
    } else {
      setAssignedIndependentServicesSearchedPaginationCount(0);
    }
  }, [assignedIndependentServiceSearchedProductsTotalCount]);

  useEffect(() => {
    if (independentServiceProductsTotalCount > 100) {
      const pageCount = Math.floor(independentServiceProductsTotalCount / 100);
      setIndependentServicesPaginationCount(pageCount);
    } else {
      setIndependentServicesPaginationCount(0);
    }
  }, [independentServiceProductsTotalCount]);

  useEffect(() => {
    if (assignedAssociateServiceProductsTotalCount > 100) {
      const pageCount = Math.floor(
        assignedAssociateServiceProductsTotalCount / 100
      );
      setAssignedIndependentServicesPaginationCount(pageCount);
    } else {
      setAssignedIndependentServicesPaginationCount(0);
    }
  }, [assignedAssociateServiceProductsTotalCount]);

  let getAssociateServiceQueryParams = {
    isAssociate: selectedServiceType == "associate",
    limit: associatePageState?.pageSize,
    skip:
      associatePageState?.page === 1
        ? 0
        : associatePageState?.page === 0
          ? associatePageState?.page
          : associatePageState?.page - 1,
    id: productId,
  };

  let getAssociateServiceSearchQueryParams = {
    isAssociate: selectedServiceType == "associate",
    limit: associateSearchPageState?.pageSize,
    skip:
      associateSearchPageState?.page === 1
        ? 0
        : associateSearchPageState?.page === 0
          ? associateSearchPageState?.page
          : associateSearchPageState?.page - 1,
    searchItem: "",
    id: productId,
  };

  let getIndependentServiceSearchQueryParams = {
    isAssociate: selectedServiceType == "associate",
    limit: independentSearchPageState?.pageSize,
    skip:
      independentSearchPageState?.page === 1
        ? 0
        : independentSearchPageState?.page === 0
          ? independentSearchPageState?.page
          : independentSearchPageState?.page - 1,
    searchItem: "",
    id: productId,
  };

  let getAssignedAssociateServiceQueryParams = {
    isAssociate: selectedServiceType == "associate",
    limit: assignedAssociatePageState?.pageSize,
    skip:
      assignedAssociatePageState?.page === 1
        ? 0
        : assignedAssociatePageState?.page === 0
          ? assignedAssociatePageState?.page
          : assignedAssociatePageState?.page - 1,
    id: productId,
  };

  let getAssignedAssociateServiceSearchQueryParams = {
    isAssociate: selectedServiceType == "associate",
    limit: assignedAssociateSearchPageState?.pageSize,
    skip:
      assignedAssociateSearchPageState?.page === 1
        ? 0
        : assignedAssociateSearchPageState?.page === 0
          ? assignedAssociateSearchPageState?.page
          : assignedAssociateSearchPageState?.page - 1,
    id: productId,
    searchItem: "",
  };

  let getAssignedIndependentServiceSearchQueryParams = {
    isAssociate: selectedServiceType == "associate",
    limit: assignedIndependentSearchPageState?.pageSize,
    skip:
      assignedIndependentSearchPageState?.page === 1
        ? 0
        : assignedIndependentSearchPageState?.page === 0
          ? assignedIndependentSearchPageState?.page
          : assignedIndependentSearchPageState?.page - 1,
    id: productId,
    searchItem: "",
  };

  let getIndependentServiceQueryParams = {
    isAssociate: selectedServiceType == "associate",
    limit: independentPageState?.pageSize,
    skip:
      independentPageState?.page === 1
        ? 0
        : independentPageState?.page === 0
          ? independentPageState?.page
          : independentPageState?.page - 1,
    id: productId,
  };

  let getAssignedIndependentServiceQueryParams = {
    isAssociate: selectedServiceType == "associate",
    limit: assignedIndependentPageState?.pageSize,
    skip:
      assignedIndependentPageState?.page === 1
        ? 0
        : assignedIndependentPageState?.page === 0
          ? assignedIndependentPageState?.page
          : assignedIndependentPageState?.page - 1,
    id: productId,
  };

  // To get if there are any assigned services in Edit Product mode
  useEffect(() => {
    getAssignedAssociateServiceQueryParams.isAssociate = true;
    if (getAssignedAssociateServiceQueryParams?.id) {
      dispatch(
        getAssignedServicesOfProductsByServiceType(
          getAssignedAssociateServiceQueryParams
        )
      );
    }

    getAssignedIndependentServiceQueryParams.isAssociate = false;
    if (getAssignedIndependentServiceQueryParams?.id) {
      dispatch(
        getAssignedServicesOfProductsByServiceType(
          getAssignedIndependentServiceQueryParams
        )
      );
    }
  }, [productId]);

  useEffect(() => {
    if (associatePageState.page) {
      dispatch(getProductsByServiceType(getAssociateServiceQueryParams));
    }
  }, [dispatch, associatePageState, associatePageState?.page]);

  useEffect(() => {
    if (assignedAssociatePageState.page && productId) {
      getAssignedAssociateServiceQueryParams.id = productId;
      dispatch(
        getAssignedServicesOfProductsByServiceType(
          getAssignedAssociateServiceQueryParams
        )
      );
    }
  }, [dispatch, assignedAssociatePageState?.page]);

  useEffect(() => {
    if (associateSearchPageState.page && associateSearchItem?.length > 2) {
      getAssociateServiceSearchQueryParams.searchItem = associateSearchItem;
      dispatch(
        getSearchProductsByServiceType(getAssociateServiceSearchQueryParams)
      );
    }
  }, [dispatch, associateSearchPageState, associateSearchPageState?.page]);

  useEffect(() => {
    if (independentSearchPageState.page && independentSearchItem?.length > 2) {
      getIndependentServiceSearchQueryParams.searchItem = independentSearchItem;
      dispatch(
        getSearchProductsByServiceType(getIndependentServiceSearchQueryParams)
      );
    }
  }, [dispatch, independentSearchPageState, independentSearchPageState?.page]);

  useEffect(() => {
    if (independentPageState.page) {
      dispatch(getProductsByServiceType(getIndependentServiceQueryParams));
    }
  }, [dispatch, independentPageState, independentPageState?.page]);

  useEffect(() => {
    if (assignedIndependentPageState.page && productId) {
      getAssignedIndependentServiceQueryParams.id = productId;
      dispatch(
        getAssignedServicesOfProductsByServiceType(
          getAssignedIndependentServiceQueryParams
        )
      );
    }
  }, [dispatch, assignedIndependentPageState?.page]);

  // associate services tab change
  useEffect(() => {
    if (productId) {
      if (associateCurrentTab === "1") {
        dispatch(getProductsByServiceType(getAssociateServiceQueryParams));
      } else {
        if (associateSearchItem?.length > 2) {
          getAssignedAssociateServiceSearchQueryParams.id = productId;
          getAssignedAssociateServiceSearchQueryParams.searchItem =
            associateSearchItem;
          dispatch(
            getSearchAssignedServicesOfProductsByServiceType(
              getAssignedAssociateServiceSearchQueryParams
            )
          );
        } else {
          getAssignedAssociateServiceQueryParams.id = productId;
          dispatch(
            getAssignedServicesOfProductsByServiceType(
              getAssignedAssociateServiceQueryParams
            )
          );
        }
      }
    }
  }, [associateCurrentTab.length]);

  // Unassigned associate Service Products
  useEffect(() => {
    if (associateServiceProducts?.length > 0 && !isAssociateServicesLoading) {
      let modifiedProducts: any = associateServiceProducts?.map((item: any) => {
        let newItem = { ...item };
        newItem.isEditing = false;
        newItem.isSelected = false;
        return newItem;
      });
      // Persist previous selection of products and price updates
      if (selectedUnAssignedAssociateServiceProducts?.length > 0) {
        const getIndex = selectedUnAssignedAssociateServiceProducts.findIndex(
          (item: any) => item.page === associatePageState.page
        );

        if (getIndex >= 0) {
          const selectedProductsDetails =
            selectedUnAssignedAssociateServiceProducts[getIndex]
              ?.selectedProducts;

          selectedProductsDetails.forEach((element: any) => {
            const getIndex = modifiedProducts?.findIndex(
              (item: any) => item?.id === element?.id
            );
            if (getIndex !== -1) {
              modifiedProducts[getIndex].isSelected = element?.isSelected;
              modifiedProducts[getIndex].retailPrice = element?.retailPrice;
            }
          });
        }
      }
      setCurrentAssociateServiceProducts(structuredClone(modifiedProducts));
    }
  }, [associateServiceProducts.length, isAssociateServicesLoading]);

  // Unassigned associate Service Searched Products
  useEffect(() => {
    if (
      associateServiceSearchedProducts?.length > 0 &&
      !isAssociateServicesSearchLoading
    ) {
      let modifiedProducts: any = associateServiceSearchedProducts?.map(
        (item: any) => {
          let newItem = { ...item };
          newItem.isEditing = false;
          newItem.isSelected = false;
          return newItem;
        }
      );
      // Persist previous selection of products and price updates
      if (selectedUnAssignedAssociateServiceSearchedProducts?.length > 0) {
        const getIndex =
          selectedUnAssignedAssociateServiceSearchedProducts.findIndex(
            (item: any) => item.page === associateSearchPageState.page
          );

        if (getIndex >= 0) {
          const selectedProductsDetails =
            selectedUnAssignedAssociateServiceSearchedProducts[getIndex]
              ?.selectedProducts;

          selectedProductsDetails.forEach((element: any) => {
            const getIndex = modifiedProducts?.findIndex(
              (item: any) => item?.id === element?.id
            );
            if (getIndex !== -1) {
              modifiedProducts[getIndex].isSelected = element?.isSelected;
              modifiedProducts[getIndex].retailPrice = element?.retailPrice;
            }
          });
        }
      }
      setCurrentAssociateServiceSearchedProducts(
        structuredClone(modifiedProducts)
      );
    }
  }, [
    associateServiceSearchedProducts.length,
    isAssociateServicesSearchLoading,
  ]);

  // Assigned associate Service Products
  useEffect(() => {
    if (
      assignedAssociateServiceProducts?.length > 0 &&
      !isAssignedAssociateServicesLoading
    ) {
      let modifiedProducts: any = assignedAssociateServiceProducts?.map(
        (item: any) => {
          let newItem = { ...item };
          newItem.isEditing = false;
          newItem.isSelected = !associateServiceProductsDeletedArr.includes(
            item?.id
          );
          return newItem;
        }
      );

      setCurrentAssignedAssociateServiceProducts(
        JSON.parse(JSON.stringify(modifiedProducts))
      );
    } else {
      setCurrentAssignedAssociateServiceProducts([]);
    }
  }, [
    assignedAssociateServiceProducts.length,
    isAssignedAssociateServicesLoading,
  ]);

  // Assigned associate Service Searched Products
  useEffect(() => {
    if (
      assignedAssociateServiceSearchedProducts?.length > 0 &&
      !isAssignedAssociateServicesSearchLoading
    ) {
      let modifiedProducts: any = assignedAssociateServiceSearchedProducts?.map(
        (item: any) => {
          let newItem = { ...item };
          newItem.isEditing = false;
          newItem.isSelected = true;
          return newItem;
        }
      );
      setCurrentAssignedAssociateServiceSearchedProducts(
        JSON.parse(JSON.stringify(modifiedProducts))
      );
    } else {
      setCurrentAssignedAssociateServiceSearchedProducts([]);
    }
  }, [
    assignedAssociateServiceSearchedProducts.length,
    isAssignedAssociateServicesSearchLoading,
  ]);

  // independent services tab change
  useEffect(() => {
    if (productId) {
      if (independentCurrentTab === "1") {
        dispatch(getProductsByServiceType(getIndependentServiceQueryParams));
      } else {
        if (independentSearchItem?.length > 2) {
          getAssignedIndependentServiceSearchQueryParams.id = productId;
          getAssignedIndependentServiceSearchQueryParams.searchItem =
            independentSearchItem;
          dispatch(
            getSearchAssignedServicesOfProductsByServiceType(
              getAssignedIndependentServiceSearchQueryParams
            )
          );
        } else {
          getAssignedIndependentServiceQueryParams.id = productId;
          dispatch(
            getAssignedServicesOfProductsByServiceType(
              getAssignedIndependentServiceQueryParams
            )
          );
        }
      }
    }
  }, [independentCurrentTab.length]);

  // Unassigned independent Service Products
  useEffect(() => {
    if (
      independentServiceProducts?.length > 0 &&
      !isIndependentServicesLoading
    ) {
      let modifiedProducts: any = independentServiceProducts?.map(
        (item: any) => {
          let newItem = { ...item };
          newItem.isEditing = false;
          newItem.isSelected = false;
          return newItem;
        }
      );
      // Persist previous selection of products and price updates
      if (selectedUnAssignedIndependentServiceProducts?.length > 0) {
        const getIndex = selectedUnAssignedIndependentServiceProducts.findIndex(
          (item: any) => item.page === independentPageState.page
        );

        if (getIndex >= 0) {
          const selectedProductsDetails =
            selectedUnAssignedIndependentServiceProducts[getIndex]
              ?.selectedProducts;

          selectedProductsDetails.forEach((element: any) => {
            const getIndex = modifiedProducts?.findIndex(
              (item: any) => item?.id === element?.id
            );
            if (getIndex !== -1) {
              modifiedProducts[getIndex].isSelected = element?.isSelected;
              modifiedProducts[getIndex].retailPrice = element?.retailPrice;
            }
          });
        }
      }
      setCurrentIndependentServiceProducts(structuredClone(modifiedProducts));
    }
  }, [independentServiceProducts.length, isIndependentServicesLoading]);

  // Unassigned independent Service Searched Products
  useEffect(() => {
    if (
      independentServiceSearchedProducts?.length > 0 &&
      !isIndependentServicesSearchLoading
    ) {
      let modifiedProducts: any = independentServiceSearchedProducts?.map(
        (item: any) => {
          let newItem = { ...item };
          newItem.isEditing = false;
          newItem.isSelected = false;
          return newItem;
        }
      );
      // Persist previous selection of products and price updates
      if (selectedUnAssignedIndependentServiceSearchedProducts?.length > 0) {
        const getIndex =
          selectedUnAssignedIndependentServiceSearchedProducts.findIndex(
            (item: any) => item.page === associateSearchPageState.page
          );

        if (getIndex >= 0) {
          const selectedProductsDetails =
            selectedUnAssignedIndependentServiceSearchedProducts[getIndex]
              ?.selectedProducts;

          selectedProductsDetails.forEach((element: any) => {
            const getIndex = modifiedProducts?.findIndex(
              (item: any) => item?.id === element?.id
            );
            if (getIndex !== -1) {
              modifiedProducts[getIndex].isSelected = element?.isSelected;
              modifiedProducts[getIndex].retailPrice = element?.retailPrice;
            }
          });
        }
      }
      setCurrentIndependentServiceSearchedProducts(
        structuredClone(modifiedProducts)
      );
    }
  }, [
    independentServiceSearchedProducts.length,
    isIndependentServicesSearchLoading,
  ]);

  // Assigned independent Service Products
  useEffect(() => {
    if (
      assignedIndependentServiceProducts?.length > 0 &&
      !isAssignedIndependentServicesLoading
    ) {
      let modifiedProducts: any = assignedIndependentServiceProducts?.map(
        (item: any) => {
          let newItem = { ...item };
          newItem.isEditing = false;
          newItem.isSelected = true;
          newItem.isModified = false;
          return newItem;
        }
      );

      modifiedProducts = modifiedProducts.filter(
        (item: any) => !independentServiceProductsDeletedArr.includes(item?.id)
      );
      setCurrentAssignedIndependentServiceProducts(
        JSON.parse(JSON.stringify(modifiedProducts))
      );
    } else {
      setCurrentAssignedIndependentServiceProducts([]);
    }
  }, [
    assignedIndependentServiceProducts.length,
    isAssignedIndependentServicesLoading,
  ]);

  // Assigned independent Service Searched Products
  useEffect(() => {
    if (
      assignedIndependentServiceSearchedProducts?.length > 0 &&
      !isAssignedIndependentServicesSearchLoading
    ) {
      let modifiedProducts: any =
        assignedIndependentServiceSearchedProducts?.map((item: any) => {
          let newItem = { ...item };
          newItem.isEditing = false;
          newItem.isSelected = true;
          return newItem;
        });
      setCurrentAssignedIndependentServiceSearchedProducts(
        JSON.parse(JSON.stringify(modifiedProducts))
      );
    } else {
      setCurrentAssignedIndependentServiceSearchedProducts([]);
    }
  }, [
    assignedIndependentServiceSearchedProducts.length,
    isAssignedIndependentServicesSearchLoading,
  ]);

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

  const ViewAssociateServicesButtonDisplay = () => {
    let productsInAssociateServiceProducts = 0;
    let productsInAssociateServiceSearchedProducts = 0;

    for (
      let i = 0;
      i < selectedUnAssignedAssociateServiceProducts?.length;
      i++
    ) {
      productsInAssociateServiceProducts +=
        selectedUnAssignedAssociateServiceProducts[i]?.selectedProducts
          ?.length || 0;
    }

    for (
      let i = 0;
      i < selectedUnAssignedAssociateServiceSearchedProducts?.length;
      i++
    ) {
      productsInAssociateServiceSearchedProducts +=
        selectedUnAssignedAssociateServiceSearchedProducts[i]?.selectedProducts
          ?.length || 0;
    }

    // Edit Product Mode
    let areServicesSelected =
      productsInAssociateServiceProducts > 0 ||
      productsInAssociateServiceSearchedProducts > 0;

    if (productId) {
      if (areServicesSelected) {
        return true;
      } else {
        return currentAssignedAssociateServiceProducts?.length > 0;
      }
    } else {
      // Add Product Mode
      return areServicesSelected;
    }
  };

  const ViewIndependentServicesButtonDisplay = () => {
    let productsInIndependentServiceProducts = 0;
    let productsInIndependentServiceSearchedProducts = 0;

    for (
      let i = 0;
      i < selectedUnAssignedIndependentServiceProducts?.length;
      i++
    ) {
      productsInIndependentServiceProducts +=
        selectedUnAssignedIndependentServiceProducts[i]?.selectedProducts
          ?.length || 0;
    }

    for (
      let i = 0;
      i < selectedUnAssignedIndependentServiceSearchedProducts?.length;
      i++
    ) {
      productsInIndependentServiceSearchedProducts +=
        selectedUnAssignedIndependentServiceSearchedProducts[i]
          ?.selectedProducts?.length || 0;
    }

    // Edit Product Mode
    let areServicesSelected =
      productsInIndependentServiceProducts > 0 ||
      productsInIndependentServiceSearchedProducts > 0;

    if (productId) {
      if (areServicesSelected) {
        return true;
      } else {
        return currentAssignedIndependentServiceProducts?.length > 0;
      }
    } else {
      // Add Product Mode
      return areServicesSelected;
    }
  };

  const handleAssociateSearchProduct = (searchItem: string) => {
    if (searchItem?.length > 2) {
      setIsAssociateSearchEnabled(true);

      // Un Assigned Tab Search for Add Product and Edit Product
      if (associateCurrentTab === "1") {
        getAssociateServiceSearchQueryParams.searchItem = searchItem;
        dispatch(
          getSearchProductsByServiceType(getAssociateServiceSearchQueryParams)
        );
      }
      // Assigned Tab Search for Edit Product
      if (productId && associateCurrentTab === "2") {
        getAssignedAssociateServiceSearchQueryParams.searchItem = searchItem;
        getAssignedAssociateServiceSearchQueryParams.id = productId;
        dispatch(
          getSearchAssignedServicesOfProductsByServiceType(
            getAssignedAssociateServiceSearchQueryParams
          )
        );
      }
    } else {
      setIsAssociateSearchEnabled(false);
    }
  };

  const handleIndependentSearchProduct = (searchItem: string) => {
    if (searchItem?.length > 2) {
      setIsIndependentSearchEnabled(true);

      // Un Assigned Tab Search for Add Product and Edit Product
      if (independentCurrentTab === "1") {
        getIndependentServiceSearchQueryParams.searchItem = searchItem;
        dispatch(
          getSearchProductsByServiceType(getIndependentServiceSearchQueryParams)
        );
      }
      // Assigned Tab Search for Edit Product
      if (productId && independentCurrentTab === "2") {
        getAssignedIndependentServiceSearchQueryParams.searchItem = searchItem;
        getAssignedIndependentServiceSearchQueryParams.id = productId;
        dispatch(
          getSearchAssignedServicesOfProductsByServiceType(
            getAssignedIndependentServiceSearchQueryParams
          )
        );
      }
    } else {
      setIsIndependentSearchEnabled(false);
    }
  };

  const onSubmit = async (data: any, event: any) => {
    let error = false;

    await conversion?.map((item: any) => {
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

    (await data?.productBarCodeMapping?.length) > 0 &&
      data?.productBarCodeMapping?.map((item: any) => {
        if (!item?.UOM || !item?.barcodeTypes || !item?.barcode) {
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
      setIsProductSaveInProgress(true);

      let newUploadedImageKey = "";
      if (isNewImageSelected) {
        newUploadedImageKey = await uploadImagetoAWS();
      }

      let modifiedProductAssociateServices: {}[] = [];

      if (
        selectedUnAssignedAssociateServiceProducts?.length > 0 &&
        isMarkAsAssociate
      ) {
        selectedUnAssignedAssociateServiceProducts.forEach((element: any) => {
          const selectedProducts = element?.selectedProducts;
          if (selectedProducts?.length > 0) {
            selectedProducts.forEach((item: any) => {
              if (item.isSelected && Number(item?.retailPrice) > 0) {
                const selectedObj = {
                  serviceProducts: {
                    id: item?.id,
                  },
                  isAssociate: isMarkAsAssociate,
                  isExclusive: isMarkAsExclusive,
                  price: item?.retailPrice,
                };
                modifiedProductAssociateServices.push(selectedObj);
              }
            });
          }
        });
      }

      if (
        selectedUnAssignedAssociateServiceSearchedProducts?.length > 0 &&
        isMarkAsAssociate
      ) {
        selectedUnAssignedAssociateServiceSearchedProducts.forEach(
          (element: any) => {
            const selectedProducts = element?.selectedProducts;
            if (selectedProducts?.length > 0) {
              selectedProducts.forEach((item: any) => {
                if (item.isSelected && Number(item?.retailPrice) > 0) {
                  const selectedObj = {
                    serviceProducts: {
                      id: item?.id,
                    },
                    isAssociate: isMarkAsAssociate,
                    isExclusive: isMarkAsExclusive,
                    price: item?.retailPrice,
                  };
                  modifiedProductAssociateServices.push(selectedObj);
                }
              });
            }
          }
        );
      }

      let modifiedProductIndependentServices: {}[] = [];

      if (
        selectedUnAssignedIndependentServiceProducts?.length > 0 &&
        isMarkAsIndependent
      ) {
        selectedUnAssignedIndependentServiceProducts.forEach((element: any) => {
          const selectedProducts = element?.selectedProducts;
          if (selectedProducts?.length > 0) {
            selectedProducts.forEach((item: any) => {
              if (item.isSelected && Number(item?.retailPrice) > 0) {
                const selectedObj = {
                  serviceProducts: {
                    id: item?.id,
                  },
                  isAssociate: isMarkAsIndependent,
                  isExclusive: isMarkAsExclusive,
                  price: item?.retailPrice,
                };
                modifiedProductIndependentServices.push(selectedObj);
              }
            });
          }
        });
      }

      if (
        selectedUnAssignedIndependentServiceSearchedProducts?.length > 0 &&
        isMarkAsIndependent
      ) {
        selectedUnAssignedIndependentServiceSearchedProducts.forEach(
          (element: any) => {
            const selectedProducts = element?.selectedProducts;
            if (selectedProducts?.length > 0) {
              selectedProducts.forEach((item: any) => {
                if (item.isSelected && Number(item?.retailPrice) > 0) {
                  const selectedObj = {
                    serviceProducts: {
                      id: item?.id,
                    },
                    isAssociate: isMarkAsIndependent,
                    isExclusive: isMarkAsExclusive,
                    price: item?.retailPrice,
                  };
                  modifiedProductAssociateServices.push(selectedObj);
                }
              });
            }
          }
        );
      }

      let barCodeMapping = [];
      if (data?.productBarCodeMapping?.length) {
        for (let i = 0; i < data?.productBarCodeMapping.length; i++) {
          const codeObj = {
            barcode: data?.productBarCodeMapping[i]?.barcode,
            barcodeTypes: {
              id: data?.productBarCodeMapping[i]?.barcodeTypes?.id,
            },
            UOM: {
              id: data?.productBarCodeMapping[i]?.UOM?.id,
            },
          };
          barCodeMapping.push(codeObj);
        }
      }

      // re check this part of code
      let productUOM = [];
      if (conversion?.length) {
        for (var i = 0; i < conversion.length; i++) {
          let productUOMObj: any = {
            fromValue: conversion[i]?.fromValue,
            toUOM: data?.baseUOM?.id ? { id: data?.baseUOM?.id } : undefined,
            toValue: conversion[i]?.toValue,
            hasSales: conversion[i]?.sale ?? false,
            grossWeight: conversion[i]?.weight?.grossWeight,
            netWeight: conversion[i]?.weight?.netWeight,
            length: conversion[i]?.package?.length,
            width: conversion[i]?.package?.width,
            height: conversion[i]?.package?.height,
          };
          if (conversion[i]?.fromUnit?.id) {
            productUOMObj.fromUOM = { id: conversion[i]?.fromUnit?.id };
          }
          if (conversion[i]?.weight?.UOM?.id) {
            productUOMObj.weightUOM = { id: conversion[i]?.weight?.UOM?.id };
          }
          if (conversion[i]?.package?.UOM?.id) {
            productUOMObj.dimeUOM = { id: conversion[i]?.package?.UOM?.id };
          }
          productUOM.push(productUOMObj);
        }
      }

      const body: any = {
        altDescription: data?.altDescription || "",
        altLongName: data?.altLongName,
        altShortName: data?.altShortName,
        baseUOM: { id: data?.baseUOM?.id ?? "" },
        description: data?.description,
        externalReference: data?.externalReference,
        hasBatchNumber: data?.serialOrBatch === "hasBatchNumber",
        hasSerialNumber: data?.serialOrBatch === "hasSerialNumber",
        isAssociate: selectedServiceType === "associate",
        longName: data?.longName,
        markup: +data?.markup || 0,
        productServices: [
          ...modifiedProductAssociateServices,
          ...modifiedProductIndependentServices,
        ],
        productBarcodeMapping: barCodeMapping,
        productBatch: batchPayload,
        productBrand: { id: data?.productBrand?.id ?? "" },
        productCategory: { id: data?.productCategory?.id ?? "" },
        productClassification: "STANDARD_PRODUCT",
        productDivision: { id: data?.productDivision?.id ?? "" },
        productFamily: { id: data?.productFamily?.id ?? "" },
        productGroup: { id: data?.productGroup?.id ?? "" },
        productSerialNumbers: serialNumPayload,
        productSubCategory: { id: data?.productSubCategory?.id ?? "" },
        productSource: data?.productSource?.code,
        productTags: tag,
        productType: { id: data?.productType?.id ?? "" },
        productTaxGroupId: data?.taxGroup?.id,
        productUOM: productUOM,
        purchaseUOM: { id: data?.purchaseUOM?.id ?? "" },
        retailPrice: +data?.retailPrice,
        salesUOM: { id: data?.salesUOM?.id ?? "" },
        shortName: data.shortName,
        weightUOM: { id: data?.weightUOM?.id ?? "" },
        sellOnPos: sellOnPos,
        sellOnline: sellOnline,
        active: switchActive,
        productAttributeO1: data?.productAttributeO1
          ? { id: data?.productAttributeO1?.id?.toString() }
          : null,
        productAttributeO2: data?.productAttributeO2
          ? { id: data?.productAttributeO2?.id?.toString() }
          : null,
        productAttributeO3: data?.productAttributeO3
          ? { id: data?.productAttributeO3?.id?.toString() }
          : null,
        productAttributeO4: data?.productAttributeO4
          ? { id: data?.productAttributeO4?.id?.toString() }
          : null,
        productAttributeO5: data?.productAttributeO5
          ? { id: data?.productAttributeO5?.id?.toString() }
          : null,
      };

      // Send Id If the product is in Edit Mode
      if (productId) {
        body.id = productId;
        body.serviceProductDeletedArr = [];

        if (isMarkAsAssociate || isDeleteProductsOnSave) {
          // update assigned service product DeletedArr
          if (associateServiceProductsDeletedArr?.length > 0) {
            body.serviceProductDeletedArr = associateServiceProductsDeletedArr;
          }
          // updated edited assigned services
          const modifiedAssignedServices =
            currentAssignedAssociateServiceProducts?.filter(
              (item: any) =>
                item?.isSelected === true && item?.isModified === true
            );
          let modifiedAssignedProductServices: any = [];
          if (modifiedAssignedServices?.length > 0) {
            for (let i = 0; i < modifiedAssignedServices.length; i++) {
              if (Number(modifiedAssignedServices[i]?.price) > 0) {
                const selectedObj = {
                  isAssociate: isMarkAsAssociate,
                  isExclusive: isMarkAsExclusive,
                  id: modifiedAssignedServices[i]?.id,
                  price: modifiedAssignedServices[i]?.price,
                  serviceProducts: {
                    id: modifiedAssignedServices[i]?.serviceProducts?.id,
                  },
                };
                modifiedAssignedProductServices.push(selectedObj);
              }
            }
            body.productServices = [
              ...body?.productServices,
              ...modifiedAssignedProductServices,
            ];
          }
        }

        if (isMarkAsIndependent) {
          // update assigned independent service product DeletedArr
          if (independentServiceProductsDeletedArr?.length > 0) {
            body.serviceProductDeletedArr = [
              ...body?.serviceProductDeletedArr,
              independentServiceProductsDeletedArr,
            ];
          }

          // updated edited assigned independent services
          const modifiedAssignedServices =
            currentAssignedIndependentServiceProducts?.filter(
              (item: any) =>
                item?.isSelected === true && item?.isModified === true
            );

          let modifiedAssignedProductServices: any = [];
          if (modifiedAssignedServices?.length > 0) {
            for (let i = 0; i < modifiedAssignedServices.length; i++) {
              const selectedObj = {
                isAssociate: false,
                isExclusive: isMarkAsExclusive,
                id: modifiedAssignedServices[i]?.id,
                price: modifiedAssignedServices[i]?.price,
                serviceProducts: {
                  id: modifiedAssignedServices[i]?.serviceProducts?.id,
                },
              };
              modifiedAssignedProductServices.push(selectedObj);
            }
            body.productServices = [
              ...body?.productServices,
              ...modifiedAssignedProductServices,
            ];
          }
        }
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
            productClassification: "STANDARD_PRODUCT",
            ...body,
          },
        ],
      };

      // Save the product
      try {
        setIsProductSaveInProgress(true);
        let createOrUpdateFunction;
  
        if (productId) {
          // Edit Product
           createOrUpdateFunction = productsUpdate(reqBody);
           } else {
          // Create Product
           createOrUpdateFunction = productsCreate(reqBody);
          }
        const res: any = await dispatch(createOrUpdateFunction);
        setIsProductSaveInProgress(false);


        // clean up the stored data
        if (productId) setProductId(null);

        setCurrentAssociateServiceProducts([]);
        setCurrentAssociateServiceSearchedProducts([]);
        setCurrentAssociateServiceSearchedProducts([]);
        setCurrentAssignedAssociateServiceSearchedProducts([]);

        setCurrentIndependentServiceProducts([]);
        setCurrentIndependentServiceSearchedProducts([]);
        setCurrentIndependentServiceSearchedProducts([]);
        setCurrentAssignedIndependentServiceSearchedProducts([]);

        // navigate to product list
        if (res?.payload?.message) router.push("/products/products-list");
      } catch (error) {
        setIsProductSaveInProgress(false);
      }
    }
  };

  const onErrors = (errors: any, e: any) => {
    setStandardProductError("fromValue", {
      type: "manual",
      message: `${"FROM_VALUE"} required`,
    });
    setStandardProductError("fromUnit", {
      type: "manual",
      message: `${"FROM_UNIT"} required`,
    });
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
    setStandardProductError("toValue", {
      type: "manual",
      message: `${"TO_VALUE"} required`,
    });
    console.log(errors, e);
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

      return imageKey;
    }
    return imageKey;
  };

  const handleUploadImage = async (image: any, file: any) => {
    if (!allowedTypes.includes(file.type)) {
      standardProductClearErrors("image");
      setFileTypeError(true);
      return null;
    }

    if (image?.length > 0) {
      if (file?.size > 5 * 1024 * 1024) {
        setImageError(true);
      } else {
        standardProductSetValue("image", "uploaded");
        standardProductClearErrors("image");
        setImageError(false);
        setFileTypeError(false);
        setUpload({
          image: image,
          file: file,
        });
      }
      setIsNewImageSelected(true);
    }
  };

  const getServiceProductsByType = async (serice_type: string) => {
    if (serice_type == "associate") {
      if (associateCurrentTab === "1") {
        getAssociateServiceQueryParams.isAssociate = serice_type == "associate";
        dispatch(getProductsByServiceType(getAssociateServiceQueryParams));
      } else if (productId) {
        getAssignedAssociateServiceQueryParams.id = productId;
        dispatch(
          getAssignedServicesOfProductsByServiceType(
            getAssignedAssociateServiceQueryParams
          )
        );
      }
    } else {
      if (independentCurrentTab === "1") {
        getIndependentServiceQueryParams.isAssociate =
          serice_type == "associate";
        dispatch(getProductsByServiceType(getIndependentServiceQueryParams));
      } else if (productId) {
        getAssignedIndependentServiceQueryParams.id = productId;
        dispatch(
          getAssignedServicesOfProductsByServiceType(
            getAssignedIndependentServiceQueryParams
          )
        );
      }
    }
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openServicesDialog, setOpenServicesDialog] = React.useState(false);

  const addServicesOpen = (val: string) => {
    setOpenDialog(true);
    setSelectedServiceType(val);
  };

  const handleAddServicesBtn = (val: string) => {
    setOpenServicesDialog(true);
    setSelectedServiceType(val);
    // dispatch action and get latest services
    getServiceProductsByType(val);
  };

  const addColors = () => {
    let filteredColors = colors?.filter((item: string) => item !== hex);
    setColors([...filteredColors, hex]);
  };

  const deleteBatchRecord = (index: number) => {
    const updatedBatchPayload = [...batchPayload];
    updatedBatchPayload.splice(index, 1);
    setBatchPayload(updatedBatchPayload);
  };

  const deleteSerialNumberRecord = (index: number) => {
    const updatedSerialNumberPayload = [...serialNumPayload];
    updatedSerialNumberPayload.splice(index, 1);
    setSerialNumPayload(updatedSerialNumberPayload);
  };

  const watchBatchNumber =
    standardProductWatch("serialOrBatch", "") === "hasBatchNumber";
  const watchSerialNumber =
    standardProductWatch("serialOrBatch", "") === "hasSerialNumber";

  const updateLastUpdatedTime = (updateDateTime: Date) => {
    if (updateDateTime) {
      const todayDateTime = moment(new Date()); // todays date
      const updatedDateTime = moment(updateDateTime); // updated date
      const duration = moment.duration(todayDateTime.diff(updatedDateTime));
      const getMinutes: any = Number(duration.asMinutes().toFixed());
      if (getMinutes >= 60) {
        const getHours = Number(duration.asHours().toFixed());
        return `Last update ${getHours} hour ${getHours > 1 ? "s" : ""} ago`;
      } else {
        return `Last update ${getMinutes}min ago`;
      }
    }
  };

  const disableSerial: boolean =
    (batchPayload?.length ?? 0) > 0 ||
    (editData?.batchAnalytics?.totalCount ?? 0) >= 1;
  const disableBatch: boolean =
    (serialNumPayload?.length ?? 0) > 0 ||
    (editData?.serialNumberAnalytics?.totalCount ?? 0) >= 1;


  return (
    <form key={1}>
      <Grid
        sx={{
          px: 0,
          flexGrow: 1,
          justifyContent: "flex-start",
          backgroundColor: "#F8F7FA",
          boxShadow: "none",
        }}
        className={classes.generalSecContainer}
        container
        spacing={5}
      >
        <Grid sx={{ paddingLeft: "0px !important" }} item md={9}>
          <GeneralSection
            autoCodeGenStatus={autoCodeGenStatus}
            control={standardProductControl}
            clearErrors={standardProductClearErrors}
            errors={standardProductErrors}
            setValue={standardProductSetValue}
            getValues={standardProductGetValues}
            editData={editData}
            conversion={conversion}
            setConversion={setConversion}
            switchActive={switchActive}
            setSwitchActive={setSwitchActive}
            setStandardProductError={setStandardProductError}
            barCodeDuplicateError={barCodeDuplicateError}
            setBarCodeDuplicateError={setBarCodeDuplicateError}
            openSerialOrBatch={openSerialOrBatch}
            handleBatchOrSerialToggle={handleBatchOrSerialToggle}
          />
        </Grid>
        <Grid item md={3}>
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
              onClick={handleStandardProductSubmit(
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
          {/* Category section */}
          <Card sx={{ mt: "26px", ml: "0px", padding: "20px 20px 0px 20px" }}>
            <Box>
              <Typography variant="h6">{t("SELECT_CATEGORY")}</Typography>
              <div>
                <CategoriesSection
                  control={standardProductControl}
                  clearErrors={standardProductClearErrors}
                  errors={standardProductErrors}
                  setValue={standardProductSetValue}
                  setTag={setTag}
                  tag={tag}
                  custom={12}
                  getValues={standardProductGetValues}
                />
              </div>
            </Box>
          </Card>
          {/* {Radio buttons for Img & Hexa} */}
          <Card sx={{ p: "20px", mt: "26px" }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
              >
                <FormControlLabel
                  control={
                    <Radio
                      name="imageOrHexCode"
                      onChange={() => setToggleHexCode(false)}
                      value="image"
                      checked={toggleHexCode === false}
                    />
                  }
                  label={t("PRODUCT_IMAGE")}
                  className={classes.imageText}
                />
                <FormControlLabel
                  control={
                    <Radio
                      name="imageOrHexCode"
                      onChange={() => {
                        standardProductClearErrors("image");
                        setFileTypeError(false);
                        setImageError(false);
                        setToggleHexCode(true);
                      }}
                      value={"hexColorCode"}
                      checked={toggleHexCode === true}
                    />
                  }
                  label={t("HEX_CODE")}
                  className={classes.imageText}
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
                            setUpload({ image: "", file: {} });
                            standardProductSetValue("image", "");
                            standardProductClearErrors("image");
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
                            setHex(color.hex);
                            standardProductSetValue("image", "uploaded");
                            standardProductClearErrors("image");
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
              {t(standardProductErrors?.image?.message as any)}
            </Typography>
          </Card>
          {openSerialOrBatch && (
            <>
              <Card className={classes.associateSec}>
                <div>
                  <Controller
                    control={standardProductControl}
                    name="serialOrBatch"
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        sx={{ display: "flex", flexDirection: "row" }}
                      >
                        <FormControlLabel
                          value="hasBatchNumber"
                          control={<Radio />}
                          label={t("BATCHES")}
                          disabled={disableBatch}
                        />
                        <FormControlLabel
                          value="hasSerialNumber"
                          control={<Radio />}
                          label={t("SERIAL_NUMBER")}
                          disabled={disableSerial}
                        />
                      </RadioGroup>
                    )}
                  />
                </div>
                {editData?.batchAnalytics?.totalCount >= 1 ? (
                  <>
                    <Box className={classes.batchesListContainer}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <h6 className={classes.associateText}>
                          {t("BATCHES")}
                        </h6>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setOpenBatchDialog(true);
                            setOpenSerialNumDialog(false);
                          }}
                          className={classes.batchManageBtn}
                        >
                          {t("VIEW_ALL")}
                        </Button>
                      </div>
                      {/* <Icon icon="tabler:dots-vertical" /> */}
                      <RowOptions
                        addServicesOpen={addServicesOpen}
                        modalName={"batches"}
                      />
                    </Box>
                    <Box className={classes.batchesDetailsContainer}>
                      <Box
                        className={classes.batchesListBox}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box>
                          <Typography
                            style={{
                              fontSize: "11px",
                              fontWeight: "400px",
                              borderRadius: "5px",
                            }}
                          >
                            {t("TOTAL_BATCHES")}
                          </Typography>
                          <span className={classes.batchesListNumber}>
                            {editData?.batchAnalytics?.totalCount}
                          </span>
                        </Box>

                        <Box>
                          <Typography
                            style={{ fontSize: "11px", fontWeight: "400px" }}
                          >
                            {t("NEAR_EXPIRY")}
                          </Typography>
                          <span className={classes.batchesListNumber}>
                            {editData?.batchAnalytics?.totalNearExpiry}
                          </span>
                        </Box>

                        <Box sx={{ width: "70px" }}>
                          <Typography
                            style={{ fontSize: "11px", fontWeight: "400px" }}
                          >
                            {t("EXPIRED")}
                          </Typography>
                          <span className={classes.batchesListNumber}>
                            {editData?.batchAnalytics?.totalExpired}
                          </span>
                        </Box>
                      </Box>
                    </Box>
                    {editData?.updatedOn && (
                      <Box className={classes.batchesUpdateInfo}>
                        <span>
                          {updateLastUpdatedTime(editData?.updatedOn)}
                        </span>
                        <Icon icon="tabler:refresh" />
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    {/* Batch Information */}
                    {watchBatchNumber && (
                      <>
                        {!batchPayload.length ? (
                          <Box>
                            <div style={{ textAlign: "center" }}>
                              <Button
                                className={classes.associateBtn}
                                variant="contained"
                                onClick={() => addServicesOpen("batches")}
                              >
                                {t("ADD_BATCHES")}
                              </Button>
                            </div>
                          </Box>
                        ) : (
                          <Card className={classes.outerCardBatchList}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <h6 className={classes.associateText}>
                                  {t("BATCHES")}
                                </h6>
                              </div>
                              <div>
                                <RowOptions
                                  addServicesOpen={addServicesOpen}
                                  modalName={"batches"}
                                />
                              </div>
                            </div>
                            <div className={classes.batchListOuterContainer}>
                              <div className={classes.batchListContainer}>
                                {batchPayload.map(
                                  (item: any, index: number) => {
                                    return (
                                      <div className={classes.batchList}>
                                        <div className={classes.batchCode}>
                                          <div>{t("BATCH_CODE")}</div>
                                          <div>
                                            {item?.code ? item?.code : "code"}
                                          </div>
                                        </div>
                                        <div className={classes.batchExpiry}>
                                          <div>{t("EXPIRY_DATE")}</div>
                                          <div>
                                            {moment(
                                              item?.shelfLifeExpiryDate
                                            ).format("DD-MM-YYYY")}
                                          </div>
                                        </div>
                                        <div className={classes.batchDelete}>
                                          <Button
                                            onClick={() =>
                                              deleteBatchRecord(index)
                                            }
                                          >
                                            <Icon
                                              icon="tabler:trash"
                                              fontSize={20}
                                              color="#EA5455"
                                            />
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </Card>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* Serial Number */}

                {editData?.serialNumberAnalytics?.totalCount >= 1 ? (
                  <>
                    <Box className={classes.batchesListContainer}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <h6 className={classes.associateText}>
                          {t("SERIAL_NUMBERS")}
                        </h6>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setOpenSerialNumDialog(true);
                            setOpenBatchDialog(false);
                          }}
                          className={classes.batchManageBtn}
                        >
                          {t("VIEW_ALL")}
                        </Button>
                      </div>
                      {/* <Icon icon="tabler:dots-vertical" /> */}
                      <RowOptions
                        modalName={"serialNumber"}
                        addServicesOpen={addServicesOpen}
                      />
                    </Box>
                    <Box className={classes.totalSerialNumContainer}>
                      <Typography
                        style={{
                          fontSize: "13px",
                          fontWeight: "400px",
                          borderRadius: "5px",
                        }}
                      >
                        {t("TOTAL_SERIAL_NUMBER")}
                      </Typography>
                      <span className={classes.batchesListNumber}>
                        {editData?.serialNumberAnalytics?.totalCount}
                      </span>
                    </Box>
                    {editData?.updatedOn && (
                      <Box className={classes.batchesUpdateInfo}>
                        <span>
                          {updateLastUpdatedTime(editData?.updatedOn)}
                        </span>
                        <Icon icon="tabler:refresh" />
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    {watchSerialNumber && (
                      <>
                        {!serialNumPayload.length && watchSerialNumber ? (
                          <Box>
                            <div style={{ textAlign: "center" }}>
                              <Button
                                className={classes.associateBtn}
                                variant="contained"
                                onClick={() => addServicesOpen("serialNumber")}
                              >
                                {t("ADD_SERIAL_NUMBER")}
                              </Button>
                            </div>
                          </Box>
                        ) : (
                          <Card className={classes.outerCardBatchList}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <h6 className={classes.associateText}>
                                  {t("SERIAL_NUMBER")}
                                </h6>
                              </div>
                              <div>
                                <RowOptions
                                  modalName={"serialNumber"}
                                  addServicesOpen={addServicesOpen}
                                />
                              </div>
                            </div>
                            <div className={classes.batchListOuterContainer}>
                              <div className={classes.batchListContainer}>
                                {serialNumPayload.map(
                                  (item: any, index: number) => {
                                    return (
                                      <div className={classes.batchList}>
                                        <div className={classes.batchCode}>
                                          <div>{t("SERIAL_NUMBER")}</div>
                                          <div>
                                            {item?.serialNumber
                                              ? item?.serialNumber
                                              : "code"}
                                          </div>
                                        </div>

                                        <div className={classes.batchDelete}>
                                          <Button
                                            onClick={() =>
                                              deleteSerialNumberRecord(index)
                                            }
                                          >
                                            <Icon
                                              icon="tabler:trash"
                                              fontSize={20}
                                              color="#EA5455"
                                            />
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </Card>
                        )}
                      </>
                    )}
                  </>
                )}
              </Card>
            </>
          )}

          {/* Settings */}
          <Box className={classes.settingsSec}>
            <div>
              <Typography style={{ fontSize: "15px", fontWeight: "600px" }}>
                {" "}
                {t("SETTINGS")}
              </Typography>
            </div>
            <FormGroup>
              <FormControlLabel
                sx={{ mt: "20px" }}
                control={
                  <Checkbox
                    onChange={(e) => setSellOnPos(e?.target?.checked)}
                    checked={sellOnPos}
                  />
                }
                label={t("SELL_ON_POS")}
              />
              <FormControlLabel
                sx={{ mt: "20px" }}
                control={
                  <Checkbox
                    checked={sellOnline}
                    style={{ borderColor: "black" }}
                    onChange={(e) => setSellOnline(e?.target?.checked)}
                  />
                }
                label={t("SELL_ON_ECOMMERCE")}
              />
            </FormGroup>
          </Box>

          {/* Sevices Section */}
          <Box className={classes.associateSec}>
            <h6 className={classes.associateText}>{t("ASSOCIATE_SERVICES")}</h6>
            <div style={{ textAlign: "center" }}>
              <Button
                className={`${ViewAssociateServicesButtonDisplay()
                    ? classes.viewServicesBtn
                    : classes.associateBtn
                  }`}
                variant="contained"
                onClick={() => handleAddServicesBtn("associate")}
              >
                {ViewAssociateServicesButtonDisplay()
                  ? t("VIEW_SERVICES")
                  : t("ADD_SERVICES")}
              </Button>
            </div>
          </Box>
          <Box className={classes.associateSec}>
            <h6 className={classes.associateText}>
              {t("INDEPENDENT_SERVICES")}
            </h6>
            <div style={{ textAlign: "center" }}>
              <Button
                className={`${ViewIndependentServicesButtonDisplay()
                    ? classes.viewServicesBtn
                    : classes.associateBtn
                  }`}
                variant="contained"
                onClick={() => handleAddServicesBtn("independent")}
              >
                {ViewIndependentServicesButtonDisplay()
                  ? t("VIEW_SERVICES")
                  : t("ADD_SERVICES")}
              </Button>
            </div>
          </Box>
        </Grid>

        {openDialog && (
          <Dialog
            sx={sx(
              {
                condition: selectedServiceType === "serialNumber",
                sx: sxDialogWidthSNum,
              },
              {
                condition: selectedServiceType !== "serialNumber",
                sx: sxDialogWidthCommon,
              },
              {
                condition:
                  selectedServiceType === "associate" ||
                  selectedServiceType === "independent",
                sx: sxServicesDialog,
              }
            )}
            maxWidth="md"
            open={openDialog}
            fullScreen={false}
          >
            <DialogTitle variant="h5" sx={{ textAlign: "center" }}>
              {selectedServiceType === "batches"
                ? t("BATCH_INFO")
                : selectedServiceType === "serialNumber"
                  ? t("SERIAL_NUMBER")
                  : ""}
            </DialogTitle>

            {selectedServiceType === "batches" && (
              <DialogContent>
                <AddBatch
                  setOpenDialog={setOpenDialog}
                  setBatchPayload={setBatchPayload}
                  setNewBatchPayload={setNewBatchPayload}
                  newBatchPayload={newBatchPayload}
                  batchPayload={batchPayload}
                />
              </DialogContent>
            )}

            {selectedServiceType === "serialNumber" && (
              <Grid
                container
                className={classes.colorPaperContainer}
                spacing={{ xs: 3, md: 3, sm: 3 }}
              >
                <AddSerialNumber
                  setOpenDialog={setOpenDialog}
                  serialNumPayload={serialNumPayload}
                  setSerialNumPayload={setSerialNumPayload}
                  newSerialNumPayload={newSerialNumPayload}
                  setNewSerialNumPayload={setNewSerialNumPayload}
                />
              </Grid>
            )}
          </Dialog>
        )}

        {openServicesDialog && selectedServiceType === "associate" && (
          <AddAssociateServicesContainer
            openServicesDialog={openServicesDialog}
            setOpenServicesDialog={setOpenServicesDialog}
            isAssociateServicesLoading={isAssociateServicesLoading}
            isAssignedAssociateServicesLoading={
              isAssignedAssociateServicesLoading
            }
            associateCurrentTab={associateCurrentTab}
            setAssociateCurrentTab={setAssociateCurrentTab}
            currentAssociateServiceProducts={currentAssociateServiceProducts}
            setCurrentAssociateServiceProducts={
              setCurrentAssociateServiceProducts
            }
            currentAssociateServiceSearchedProducts={
              currentAssociateServiceSearchedProducts
            }
            setCurrentAssociateServiceSearchedProducts={
              setCurrentAssociateServiceSearchedProducts
            }
            selectedUnAssignedAssociateServiceProducts={
              selectedUnAssignedAssociateServiceProducts
            }
            setSelectedUnAssignedAssociateServiceProducts={
              setSelectedUnAssignedAssociateServiceProducts
            }
            currentAssignedAssociateServiceProducts={
              currentAssignedAssociateServiceProducts
            }
            setCurrentAssignedAssociateServiceProducts={
              setCurrentAssignedAssociateServiceProducts
            }
            associateServiceProductsDeletedArr={
              associateServiceProductsDeletedArr
            }
            setAssociateServiceProductsDeletedArr={
              setAssociateServiceProductsDeletedArr
            }
            selectedServiceType={selectedServiceType}
            setIsMarkAsAssociate={setIsMarkAsAssociate}
            setIsMarkAsExclusive={setIsMarkAsExclusive}
            setIsDeleteProductsOnSave={setIsDeleteProductsOnSave}
            associateServiceProductsTotalCount={
              associateServiceProductsTotalCount
            }
            associateServicesPaginationCount={associateServicesPaginationCount}
            assignedAssociateServiceProductsTotalCount={
              assignedAssociateServiceProductsTotalCount
            }
            assignedAssociateServicesPaginationCount={
              assignedAssociateServicesPaginationCount
            }
            associatePageState={associatePageState}
            setAssociatePageState={setAssociatePageState}
            assignedAssociatePageState={assignedAssociatePageState}
            setAssignedAssociatePageState={setAssignedAssociatePageState}
            productId={productId}
            handleAssociateSearchProduct={handleAssociateSearchProduct}
            isAssociateServicesSearchLoading={isAssociateServicesSearchLoading}
            associateServiceSearchedProducts={associateServiceSearchedProducts}
            associateServiceSearchedProductsTotalCount={
              associateServiceSearchedProductsTotalCount
            }
            associateServicesSearchedPaginationCount={
              associateServicesSearchedPaginationCount
            }
            associateSearchPageState={associateSearchPageState}
            setAssociateSearchPageState={setAssociateSearchPageState}
            isAssociateSearchEnabled={isAssociateSearchEnabled}
            setIsAssociateSearchEnabled={setIsAssociateSearchEnabled}
            associateSearchItem={associateSearchItem}
            setAssociateSearchItem={setAssociateSearchItem}
            isAssignedAssociateServicesSearchLoading={
              isAssignedAssociateServicesSearchLoading
            }
            assignedAssociateServiceSearchedProducts={
              assignedAssociateServiceSearchedProducts
            }
            assignedAssociateServiceSearchedProductsTotalCount={
              assignedAssociateServiceSearchedProductsTotalCount
            }
            currentAssignedAssociateServiceSearchedProducts={
              currentAssignedAssociateServiceSearchedProducts
            }
            setCurrentAssignedAssociateServiceSearchedProducts={
              setCurrentAssignedAssociateServiceSearchedProducts
            }
            selectedUnAssignedAssociateServiceSearchedProducts={
              selectedUnAssignedAssociateServiceSearchedProducts
            }
            setSelectedUnAssignedAssociateServiceSearchedProducts={
              setSelectedUnAssignedAssociateServiceSearchedProducts
            }
            assignedAssociateServicesSearchedPaginationCount={
              assignedAssociateServicesSearchedPaginationCount
            }
            assignedAssociateSearchPageState={assignedAssociateSearchPageState}
            setAssignedAssociateSearchPageState={
              setAssignedAssociateSearchPageState
            }
          />
        )}

        {openServicesDialog && selectedServiceType === "independent" && (
          <AddIndependentServicesContainer
            openServicesDialog={openServicesDialog}
            setOpenServicesDialog={setOpenServicesDialog}
            isIndependentServicesLoading={isIndependentServicesLoading}
            isAssignedIndependentServicesLoading={
              isAssignedIndependentServicesLoading
            }
            independentCurrentTab={independentCurrentTab}
            setIndependentCurrentTab={setIndependentCurrentTab}
            currentIndependentServiceProducts={
              currentIndependentServiceProducts
            }
            setCurrentIndependentServiceProducts={
              setCurrentIndependentServiceProducts
            }
            selectedUnAssignedIndependentServiceProducts={
              selectedUnAssignedIndependentServiceProducts
            }
            setSelectedUnAssignedIndependentServiceProducts={
              setSelectedUnAssignedIndependentServiceProducts
            }
            currentAssignedIndependentServiceProducts={
              currentAssignedIndependentServiceProducts
            }
            setCurrentAssignedIndependentServiceProducts={
              setCurrentAssignedIndependentServiceProducts
            }
            independentServiceProductsDeletedArr={
              independentServiceProductsDeletedArr
            }
            setIndependentServiceProductsDeletedArr={
              setIndependentServiceProductsDeletedArr
            }
            selectedServiceType={selectedServiceType}
            setIsMarkAsIndependent={setIsMarkAsIndependent}
            setIsMarkAsExclusive={setIsMarkAsExclusive}
            independentServiceProductsTotalCount={
              independentServiceProductsTotalCount
            }
            independentServicesPaginationCount={
              independentServicesPaginationCount
            }
            assignedIndependentServiceProductsTotalCount={
              assignedIndependentServiceProductsTotalCount
            }
            assignedIndependentServicesPaginationCount={
              assignedIndependentServicesPaginationCount
            }
            independentPageState={independentPageState}
            setIndependentPageState={setIndependentPageState}
            assignedIndependentPageState={assignedIndependentPageState}
            setAssignedIndependentPageState={setAssignedIndependentPageState}
            productId={productId}
            currentIndependentServiceSearchedProducts={
              currentIndependentServiceSearchedProducts
            }
            setCurrentIndependentServiceSearchedProducts={
              setCurrentIndependentServiceSearchedProducts
            }
            handleIndependentSearchProduct={handleIndependentSearchProduct}
            isIndependentServicesSearchLoading={
              isIndependentServicesSearchLoading
            }
            independentServiceSearchedProducts={
              independentServiceSearchedProducts
            }
            independentServiceSearchedProductsTotalCount={
              independentServiceSearchedProductsTotalCount
            }
            independentServicesSearchedPaginationCount={
              independentServicesSearchedPaginationCount
            }
            independentSearchPageState={independentSearchPageState}
            setIndependentSearchPageState={setIndependentSearchPageState}
            isIndependentSearchEnabled={isIndependentSearchEnabled}
            setIsIndependentSearchEnabled={setIsIndependentSearchEnabled}
            independentSearchItem={independentSearchItem}
            setIndependentSearchItem={setIndependentSearchItem}
            isAssignedIndependentServicesSearchLoading={
              isAssignedIndependentServicesSearchLoading
            }
            assignedIndependentServiceSearchedProducts={
              assignedIndependentServiceSearchedProducts
            }
            assignedIndependentServiceSearchedProductsTotalCount={
              assignedIndependentServiceSearchedProductsTotalCount
            }
            currentAssignedIndependentServiceSearchedProducts={
              currentAssignedIndependentServiceSearchedProducts
            }
            setCurrentAssignedIndependentServiceSearchedProducts={
              setCurrentAssignedIndependentServiceSearchedProducts
            }
            selectedUnAssignedIndependentServiceSearchedProducts={
              selectedUnAssignedIndependentServiceSearchedProducts
            }
            setSelectedUnAssignedIndependentServiceSearchedProducts={
              setSelectedUnAssignedIndependentServiceSearchedProducts
            }
            assignedIndependentServicesSearchedPaginationCount={
              assignedIndependentServicesSearchedPaginationCount
            }
            assignedIndependentSearchPageState={
              assignedIndependentSearchPageState
            }
            setAssignedIndependentSearchPageState={
              setAssignedIndependentSearchPageState
            }
          />
        )}
        {openBatchDialog && (
          <ViewBatchDialog
            data={editData?.productBatch || []}
            openBatchDialog={openBatchDialog}
            setOpenBatchDialog={setOpenBatchDialog}
            dialogBoxTitle={"BATCH_VIEW"}
            showActionBtn={false}
            maxWidth={"xl"}
            sx={{ justifyContent: "center", display: "flex" }}
          />
        )}
        {openSerialNumDialog && (
          <ViewSerialNumberDialog
            data={editData?.productSerialNumbers || []}
            openBatchDialog={openSerialNumDialog}
            setOpenBatchDialog={setOpenSerialNumDialog}
            dialogBoxTitle={"SERIALNUMBER_VIEW"}
            showActionBtn={false}
            maxWidth={"xl"}
            sx={{ justifyContent: "center", display: "flex" }}
          />
        )}
      </Grid>
    </form>
  );
};

export default StandardTab;
