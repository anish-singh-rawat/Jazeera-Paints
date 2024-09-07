// ** React Imports
import {
  ForwardedRef,
  SyntheticEvent,
  forwardRef,
  useEffect,
  useState,
} from "react";

// ** MUI Imports
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import { CircularProgress, Divider, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box, { BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import {
  fetchAttribute1,
  fetchAttribute2,
  fetchAttribute3,
  fetchAttribute4,
  fetchAttribute5,
  fetchCustomerGender,
  fetchtaxAdvanceType,
} from "src/store/apps/customers";

// ** Third Party Imports
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch } from "react-redux";
import {
  fetchBasicTaxdropdownchannel,
  fetchCustomerclassdropdown,
  fetchCustomerdivisiondropdownchannel,
  fetchCustomergroupdropdownchannel,
  fetchDistributiondropdownchannel,
  fetchPaymentpatterndropdown,
  fetchSalesmandropdown,
} from "src/store/apps/customer_dropdown/customer_dropdown";
import {
  addUser,
  debouncedSearchData,
  fetchCity,
  fetchCountry,
  fetchCurrency,
  fetchCustomerDivision,
  fetchCustomerStatus,
  fetchCustomerTypes,
  fetchDistributionChannel,
  fetchDistrict,
  fetchParentCustomer,
  fetchPriceList,
  fetchRegion,
  fetchTax,
  updateUser,
} from "src/store/apps/customers";

// ** Types Imports
import TabContext from "@mui/lab/TabContext";
import { Grid, Tab, Tabs } from "@mui/material";
import { AppDispatch, RootState } from "src/store";
import { CustomerType, defaultValues } from "src/types/forms/customerTypes";

// ** Constants
import { onlyNumeric, phoneRegExp } from "src/constants/validation/regX";

// ** Styled Component
import { useSelector } from "react-redux";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

// ** Custom Component Imports
import { makeStyles } from "@mui/styles";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { RevestCodeFormValidator } from "src/@core/form-validator";
import { Key } from "src/@core/layouts/utils";
import AppStorage from "src/app/AppStorage";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonTextArea from "src/components/common/CommonTextArea";
import MultiTagInput from "src/components/common/MultiTagInput";
import CustomerClassAddNewModal from "src/components/customers/CustomerClassAddNewModal";
import CustomerCustomFieldsAddNewModal from "src/components/customers/CustomerCustomFieldsAddNewModal";
import CustomerDistributionChannelAddNewModal from "src/components/customers/CustomerDistributionChannelAddNewModal";
import CustomerDivisionAddNewModal from "src/components/customers/CustomerDivisionAddNewModal";
import CustomerGroupAddNewModal from "src/components/customers/CustomerGroupAddNewModal";
import { ageGroupOptions } from "src/constants/customer/customerConstants";
import { customFieldsSearch } from "src/store/apps/custom-fields/custom_fields";
import { fetchbasicTaxGroupIdTypes } from "src/store/apps/customers";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import SnackbarConsecutive from "src/views/components/SnackbarConsecutive";
import { TabPanel } from "./TabPanel";
import FormField from "./customFormElements";
import AddCustomFieldsBtn from "./customFormElements/AddCustomFieldsBtn";

interface SidebarAddUserType {
  open: boolean;
  toggle: () => void;
  selectedUser: string | number | any;
  setSelectedUser: any;
  setSearchValue: any;
  searchValue: any;
  isEdit: boolean;
  customFieldsUser: any;
}

export interface SnackbarMessage {
  key: number;
  message: string;
}

const showErrors: any = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));

const customerDetail = {
  code: "",
  name: "",
  altName: "",
  active: true,
  externalReference: "",
};

const useStyles = makeStyles({
  inputField: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    "& .MuiInputBase-input": {
      padding: "10px",
    },
  },
  commonSelect: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    "& .MuiOutlinedInput-root": {
      paddingTop: "3px",
      paddingBottom: "2px",
    },
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
  errorMsg: {
    color: "#EA5455",
  },
  modal: {
    padding: "0px 0px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    justifyContent: "center",
  },
  modalText: {
    textAlign: "center",
    width: "i",
  },
});

type modalSaveOptions =
  | "distributionChannel"
  | "customerclass"
  | "customerDivision"
  | "customerGroup";

class CustomerClassListErrors {
  isError: boolean;
  from: Record<string, any>;
  t: TFunction;
  constructor(isError: boolean, from: Record<string, any>, t: TFunction) {
    this.isError = isError;
    this.from = from;
    this.t = t;
  }
  showError(key: string, message: string = "REQUIRED") {
    if (!this.isError) return "";
    if (this.isError && !this.from[key]) return this.t(message);
    return "";
  }
  checkError(key: string) {
    return this.isError && !this.from[key];
  }
}

const CustomInput = forwardRef(
  ({ ...props }, ref: ForwardedRef<HTMLElement>) => {
    return <TextField fullWidth inputRef={ref} {...props} />;
  }
);

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const {
    open,
    toggle,
    selectedUser,
    customFieldsUser,
    setSelectedUser,
    searchValue,
    setSearchValue,
    isEdit,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const { direction } = theme;

  // ** State
  const [tabValue, setTabValue] = useState<string>("1");
  const [customFieldError, setCustomFieldError] = useState({});
  const [validateForm, setValidateForm] = useState(false);
  //** SnackBar View
  const [SnackBarView, setSnackBarView] = useState(false);
  //** CustomFormDialog View
  const [dialogView, setDialogView] = useState(false);
  const [customerClassView, setCustomerClassView] = useState(false);
  const [customerGroupView, setCustomerGroupView] = useState(false);
  const [classIds, setClassIds] = useState("");
  const [groupIds, setGroupIds] = useState("");
  const [distributionIds, setDistributionIds] = useState("");
  const [divisionIds, setDidvisionIds] = useState("");
  const [customerDivisionView, setCustomerDivisionView] = useState(false);
  const [formTitle, setFormTitle] = useState("Add Master Data");
  const [progressBar, setProgressBar] = useState(true);
  const [customFieldErrors, setCustomFieldErrors] = useState({});
  // CustomerClass
  const [customerProp, setCustomerProp] = useState<any>(customerDetail);
  const [customerGroupProp, setCustomerGroupProp] =
    useState<any>(customerDetail);
  const [customerDistributionProp, setCustomerDistributionProp] =
    useState<any>(customerDetail);
  const [customerDivisionProp, setCustomerDivisionProp] =
    useState<any>(customerDetail);
  const [customFieldsElements, setCustomFieldsElements] = useState([]);
  const [customFieldView, setCustomFieldView] = useState(false);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .min(3, (obj) => showErrors("First Name", obj.value.length, obj.min))
      .required(),
    lastName: yup
      .string()
      .min(3, (obj) => showErrors("Last Name", obj.value.length, obj.min))
      .required(),
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator([], () => {}),
    mobileNumber: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid")
      .max(10, "Phone number is too long"),
    email: yup.string().email(),
  });

  const popperPlacement: ReactDatePickerProps["popperPlacement"] =
    direction === "ltr" ? "bottom-start" : "bottom-end";
  const dispatch = useDispatch<AppDispatch>();
  // tags text state
  let tags: any = selectedUser?.customerTagsMapping?.map((el: any) => {
    return el.tags.name;
  });
  const [tagOptions, setTagOptions] = useState<any>(
    tags?.length > 0 ? tags : []
  );

  const customFields: any = useSelector(
    (state: RootState) => state.customFields
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const attributes = useSelector((state: RootState) => state.customers);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isValidating, isSubmitting },
    clearErrors,
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // dispatch(customerGroupSearch({}));
    // dispatch(customerClassSearch({}));
    // dispatch(customerDivisionSearch({}));
    dispatch(fetchCustomerdivisiondropdownchannel());

    // dispatch(distributionChannelSearch({}));
    dispatch(fetchDistributiondropdownchannel());
    // dispatch(customFieldsSearch({ entityType: "customer" }));
    dispatch(fetchCustomerGender({}));
    dispatch(sequenceMappingCodeSearch({ entityType: "CUSTOMER_CODE" }));
  }, []);

  const handleChange = (event: any, newValue: string) => {
    if (newValue === "2" && store?.salesman?.length <= 0) {
      dispatch(fetchCustomerTypes({}));
      // dispatch(fetchCustomerGroup());
      dispatch(fetchCustomergroupdropdownchannel());

      // dispatch(fetchCustomerClass());
      dispatch(fetchCustomerclassdropdown());

      // dispatch(fetchDistributionChannel());
      // dispatch(fetchCustomerDivision());

      dispatch(fetchParentCustomer({ searchItem: "" }));
      // dispatch(fetchSalesman());
      dispatch(fetchSalesmandropdown());

      dispatch(fetchCustomerStatus({}));
    } else if (
      newValue === ("3" || "4") &&
      (store?.tax?.length <= 0 || customFields?.data?.length <= 0)
    ) {
      // dispatch(fetchBasicTaxSearch({}));
      dispatch(fetchBasicTaxdropdownchannel());

      // dispatch(fetchPaymentTerms());
      dispatch(fetchPaymentpatterndropdown());

      dispatch(fetchPriceList());
      dispatch(fetchCurrency());
      dispatch(fetchTax());
      dispatch(fetchbasicTaxGroupIdTypes());
      loaderTimer();
    } else if (newValue === "4") {
      dispatch(fetchAttribute1());
      dispatch(fetchAttribute2());
      dispatch(fetchAttribute3());
      dispatch(fetchAttribute4());
      dispatch(fetchAttribute5());
    } else if (newValue === "5") {
      loaderTimer();
    }
    setTabValue(newValue);
  };

  const customFieldsErrorCheck = (u: any = {}): boolean => {
    for (let keys of Object.keys(customFieldError)) {
      if (!u[keys] && !u[keys] === !undefined) {
        return false;
      }
    }
    for (const data of customFieldsElements || []) {
      if (data["required"] && data["visible"] && !data["defaultValue"]) {
        if (!u[data["name"]]) {
          console.debug(
            "NOT FOUND ",
            data["name"],
            u[data["name"]],
            data["defaultValue"]
          );
          return false;
        }
      }
    }
    return true;
  };

  const isFormValid: any = (u: any = {}): boolean => {
    return (
      u.country?.id &&
      u.currency?.id &&
      u.distributionChannel?.id &&
      u.paymentTerms?.id &&
      u.priceList?.id &&
      u.customerGroup?.id
      // && u.selectedTaxGroup
      // || u.selectedBusinessTaxGroup?.id
      // || u.basicTax
    );
  };

  const statusList = { id: 1, name: selectedUser?.status };

  const onErrors = (data: any) => {
    setValidateForm(true);
    setSnackBarView(true);
    try {
      let errors: any = {};
      for (let keys of Object.keys(customFieldError)) {
        //@ts-ignore
        if (!getValues()[keys]) {
          errors[keys as keyof typeof errors] = "show";
        } else {
          errors[keys as keyof typeof errors] = "hide";
        }
      }
      setCustomFieldError(errors);
    } catch (e) {
      console.log("error while setting up error");
    }

    setTimeout(() => {
      setSnackBarView(false);
    }, 2100);
  };

  const onSubmit = async (data: any, event: any) => {
    if (!isFormValid(selectedUser)) {
      setValidateForm(true);
      setSnackBarView(true);
      onErrors(null);
      return false;
    }

    if (!customFieldsErrorCheck(data)) {
      setValidateForm(true);
      setSnackBarView(true);
      onErrors(null);
      return false;
    }

    const {
      code,
      DOB,
      creditLimit,
      customerBalance,
      email,
      firstName,
      lastName,
      mobileNumber,
      street,
      externalReference,
      taxNumber,
      notes,
      companyName,
    } = data;

    const customKeys: any = Object.keys(data);
    let customFieldMapping = [];
    for (let item = 0; item < customKeys.length; item++) {
      const getItem: any = customFieldsElements.filter(
        (ele: any) => ele?.name === customKeys[item]
      );
      if (getItem[0]?.name === customKeys[item]) {
        const itemObj = {
          customFieldId: getItem[0]?.id,
          values: data[customKeys[item]],
        };
        const itemObjEdit = {
          id: getItem[0]?.id,
          customFieldId: getItem[0]?.id,
          values: data[customKeys[item]],
        };
        customFieldMapping.push(selectedUser?.id ? itemObjEdit : itemObj);
      }
    }

    let payload: any = {
      code,
      DOB: selectedUser?.id ? new Date(DOB) : DOB,
      creditLimit,
      customerBalance,
      email,
      firstName,
      lastName,
      mobileNumber,
      street,
      externalReference,
      taxNumber,
      notes,
      companyName,
      id: selectedUser?.id ? selectedUser?.id : null,
      status: selectedUser?.status ? selectedUser.status?.code : "ACTIVE",
      customerType: selectedUser?.customerType?.code,
      customerGroup: selectedUser?.customerGroup?.id
        ? selectedUser?.customerGroup?.id
        : groupIds,
      countryId: selectedUser?.country?.id,
      currencyId: selectedUser?.currency?.id,
      regionId: selectedUser?.region?.id,
      cityId: selectedUser?.city?.id,
      distributionChannelId: selectedUser?.distributionChannel?.id
        ? selectedUser?.distributionChannel?.id
        : distributionIds,
      customerDivision: selectedUser?.customerDivision?.id
        ? selectedUser?.customerDivision?.id
        : divisionIds,
      customerClass: selectedUser?.customerClass?.id
        ? selectedUser?.customerClass?.id
        : classIds,
      paymentTermsId: selectedUser?.paymentTerms?.id,
      parentCustomer: selectedUser?.parentCustomer?.id
        ? { id: selectedUser?.parentCustomer?.id }
        : null,
      salesmanId: selectedUser?.salesman?.id,
      priceListId: selectedUser?.priceList?.id,
      districtId: selectedUser?.district?.id,
      latitude: selectedUser?.latitude?.toString(),
      longitude: selectedUser?.longitude?.toString(),
      customerTags: tagOptions,
      customerCustomFieldsMapping: customFieldMapping,
      businessTaxGroupId: selectedUser?.advancetaxGroup?.id,
      basicTaxId: selectedUser?.basicTax?.id,
      gender: selectedUser?.gender?.code,
      ageGroup: selectedUser?.ageGroup?.name,
      customerAttributeO1: selectedUser?.customerAttributeO1?.id,
      customerAttributeO2: selectedUser?.customerAttributeO2?.id,
      customerAttributeO3: selectedUser?.customerAttributeO3?.id,
      customerAttributeO4: selectedUser?.customerAttributeO4?.id,
      customerAttributeO5: selectedUser?.customerAttributeO5?.id,
    };

    // if (selectedUser?.taxType?.code === "ADVANCE_TAX_GROUP")
    //   payload.businessTaxGroupId = selectedUser?.selectedTaxGroup?.id;
    // else payload.basicTaxGroupId = selectedUser?.selectedTaxGroup?.id;

    let res;
    sequenceMapData?.autoGeneration && !selectedUser.id && delete data.code;
    if (selectedUser?.id) {
      res = await dispatch(updateUser({ data: payload }));
    } else {
      res = await dispatch(addUser({ data: payload }));
    }
    setValidateForm(false);
    if (searchValue) {
      setSearchValue("");
    }
    if (res?.payload?.message) {
      toggle();
      reset(defaultValues);
      setSelectedUser(defaultValues);
    }
  };

  const handleClose = () => {
    toggle();
    setSelectedUser(defaultValues);
    reset(defaultValues);
  };

  const handleValidationError = () => {
    if (
      (validateForm && !Boolean(selectedUser?.paymentTerms)) ||
      (validateForm && !Boolean(selectedUser?.priceList)) ||
      (validateForm && !Boolean(selectedUser?.currency))
      // ||  (validateForm && !Boolean(selectedUser?.taxType))
    ) {
      setSnackBarView(true);
      setTimeout(() => {
        setSnackBarView(false);
      }, 2100);
    }
  };

  const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
    marginBottom: "30px",
    borderBottom: "0 !important",
    "& .MuiTabs-indicator": {
      display: "none",
    },
    "& .Mui-selected": {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
    "& .MuiTab-root": {
      textTransform: "none",
    },
  }));
  const store: any = useSelector((state: RootState) => state.customers);
  const dropdown: any = useSelector(
    (state: RootState) => state.customerdropdown
  );

  useEffect(() => {
    let index = 0;
    let usr: CustomerType = {
      ...selectedUser,
    } as CustomerType;

    if (selectedUser?.id) {
      if (selectedUser?.businessTaxGroups) index = 1;
      usr = {
        ...usr,
        selectedTaxGroup: selectedUser?.basicTax,
      } as CustomerType;
    }
    setSelectedUser(usr);
  }, [store?.tax]);

  useEffect(() => {
    if (store?.cities?.length <= 0) {
      dispatch(fetchCountry());
    }
  }, []);

  useEffect(() => {
    if (customFields?.data) {
      setCustomFieldsElements(customFields?.data);
      try {
        let cusFields: any = {};
        let errors: any = {};
        customFields?.data.forEach((d: any) => {
          cusFields[d?.name as keyof typeof cusFields] = undefined;
          if (d?.required && d?.visible)
            errors[d?.name as keyof typeof errors] = "hide";
        });
        if (!isEdit) setSelectedUser((d: any) => ({ ...d, ...cusFields }));
        setCustomFieldError(errors);
      } catch (e) {
        console.log("error in custom field", e);
      }
    }
  }, [customFields]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  useEffect(() => {
    if (selectedUser?.id) reset(selectedUser as object);
  }, [selectedUser?.id]);

  useEffect(() => {
    if (selectedUser?.country)
      dispatch(fetchRegion({ countryId: selectedUser?.country?.id }));
  }, [selectedUser?.country]);

  useEffect(() => {
    if (selectedUser?.region) {
      const payload = {
        countryId: selectedUser?.country?.id,
        regionId: selectedUser?.region?.id,
      };
      dispatch(fetchCity(payload));
    }
  }, [selectedUser?.region]);

  useEffect(() => {
    if (selectedUser?.city) {
      const payload = {
        countryId: selectedUser?.country?.id,
        regionId: selectedUser?.region?.id,
        cityId: selectedUser?.city?.id,
      };
      dispatch(fetchDistrict(payload));
    }
  }, [selectedUser?.city]);

  const loaderTimer = () => {
    const delay = 3000;
    const timer = setTimeout(() => {
      setProgressBar(false);
    }, delay);
    return () => clearTimeout(timer);
  };

  const handleLatLong = () => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        const usr: CustomerType = {
          ...selectedUser,
          latitude,
          longitude,
        } as CustomerType;
        setSelectedUser(usr);
      });
    }
  };
  const handleOnRegionChange = (event: any, region: any | null) => {
    const usr: CustomerType = {
      ...selectedUser,
      region,
      city: null,
    } as CustomerType;
    setSelectedUser(usr);
  };
  const handleOnCityChange = (event: any, city: any | null) => {
    const usr: CustomerType = {
      ...selectedUser,
      city,
      district: null,
    } as CustomerType;
    setSelectedUser(usr);
  };
  const handleOnCountryChange = (event: any, country: any | null) => {
    const usr: CustomerType = {
      ...selectedUser,
      country,
      region: null,
    } as CustomerType;
    setSelectedUser(usr);
  };
  const handleOnDistrictChange = (event: any, district: any | null) => {
    const usr: CustomerType = { ...selectedUser, district } as CustomerType;
    setSelectedUser(usr);
  };
  const handleCustomerGroupChange = (event: any, customerGroup: any | null) => {
    const usr: CustomerType = {
      ...selectedUser,
      customerGroup,
    } as CustomerType;
    setSelectedUser(usr);
    setDialogView(false);
  };
  const handleCustomerClassChange = (event: any, customerClass: any | null) => {
    const usr: CustomerType = {
      ...selectedUser,
      customerClass,
    } as CustomerType;
    setSelectedUser(usr);
    setDialogView(false);
  };
  const handleDistributionChannelChange = (
    event: any,
    distributionChannel: any | null
  ) => {
    const usr: CustomerType = {
      ...selectedUser,
      distributionChannel,
    } as CustomerType;
    setSelectedUser(usr);
    setDialogView(false);
  };
  const handleCustomerDivisionChange = (
    event: any,
    customerDivision: any | null
  ) => {
    const usr: CustomerType = {
      ...selectedUser,
      customerDivision,
    } as CustomerType;
    setSelectedUser(usr);
    setDialogView(false);
  };
  const handleParentCustomerChange = (
    event: any,
    parentCustomer: any | null
  ) => {
    const usr: CustomerType = {
      ...selectedUser,
      parentCustomer,
    } as CustomerType;
    setSelectedUser(usr);
  };
  const handleSalesmanChange = (event: any, salesman: any | null) => {
    const usr: CustomerType = { ...selectedUser, salesman } as CustomerType;
    setSelectedUser(usr);
  };
  const handleStatusChange = (event: any, status: any | null) => {
    const usr: CustomerType = {
      ...selectedUser,
      status,
    } as CustomerType;
    setSelectedUser(usr);
  };
  const handleCustomerTypeChange = (event: any, customerType: any | null) => {
    const usr: CustomerType = { ...selectedUser, customerType } as CustomerType;
    setSelectedUser(usr);
  };

  const handleTaxtypeChange = (event: any, taxType: any) => {
    const usr: CustomerType = {
      ...selectedUser,
      taxType,
      selectedTaxGroup: null,
    } as CustomerType;

    if (usr.taxType?.code === "ADVANCE_TAX_GROUP") {
      dispatch(fetchtaxAdvanceType());
    }
    if (usr.taxType?.code === "BASIC_TAX_GROUP") {
      // dispatch(fetchtaxGroupType());
      // dispatch(fetchBasicTaxSearch({}));
    }
    try {
      var el: any = document.querySelector(
        "#scrollable-auto-tabpanel-3 > div > span > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div > button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.MuiAutocomplete-clearIndicator.css-k9iim3-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-clearIndicator"
      );
      if (el) {
        el?.click();
      }
    } catch (e) {}
    setSelectedUser(usr);
  };

  const handleTaxGroup = (event: any, basicTax: any) => {
    const usr: CustomerType = {
      ...selectedUser,
      basicTax,
    } as CustomerType;
    setSelectedUser(usr);
  };

  const handlePaymentTermsChange = (event: any, paymentTerms: any | null) => {
    const usr: CustomerType = { ...selectedUser, paymentTerms } as CustomerType;

    setSelectedUser(usr);
  };
  const handlePriceListChange = (event: any, priceList: any | null) => {
    const usr: CustomerType = { ...selectedUser, priceList } as CustomerType;
    setSelectedUser(usr);
  };
  const handleAttributeChange = (
    event: any,
    attribute: any | null,
    order: string
  ) => {
    const usr: CustomerType = {
      ...selectedUser,
      [`customerAttributeO${order}`]: attribute,
    } as CustomerType;
    setSelectedUser(usr);
  };
  const handleCurrencyChange = (event: any, currency: any | null) => {
    const usr: CustomerType = { ...selectedUser, currency } as CustomerType;
    setSelectedUser(usr);
  };

  const handleCustomerClassForm = () => {
    setFormTitle("Customer Class");
    setCustomerClassView(true);
  };
  const handleCustomerGroupForm = () => {
    setFormTitle("Customer Group");
    setCustomerGroupView(true);
  };
  const handleDistributionChannelForm = () => {
    setFormTitle("Distribution Channel");
    setDialogView(true);
  };
  const handleCustomerDivisionForm = () => {
    setFormTitle("Customer Division");
    setCustomerDivisionView(true);
  };

  const handleCFPopUp = () => {
    setCustomFieldView(true);
  };

  const captureInputChange = (event: SyntheticEvent, value: string) => {
    dispatch(debouncedSearchData({ searchItem: value }, fetchParentCustomer)); // second param is function name
  };
  const handleGenderChange = (event: any, gender: any | null) => {
    const usr: CustomerType = { ...selectedUser, gender } as CustomerType;
    setSelectedUser(usr);
  };

  const handleAgeGroupChange = (event: any, ageGroup: any | null) => {
    const usr: CustomerType = { ...selectedUser, ageGroup } as CustomerType;
    setSelectedUser(usr);
  };

  const fullParentName: any = `${selectedUser?.parentCustomer?.firstName} ${selectedUser?.parentCustomer?.lastName}`;
  const changeLanguage = AppStorage.getData("lang");
  const getFullDate = (date: any) => {
    let day = date?.getDate();
    let month = date?.getMonth() + 1;
    let year = date?.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const submitCustomerClass = async (customerClassResponse: any) => {
    if (!customerClassResponse) return;

    const customerClass = { ...customerClassResponse };

    const usr: CustomerType = {
      ...selectedUser,
      customerClass,
    } as CustomerType;
    setSelectedUser(usr);
    setDialogView(false);
  };

  // const customerGroup = useSelector((state: RootState) => state?.customerGroup);

  // const customerClass = useSelector((state: RootState) => state?.customerClass);

  // const customerDivision = useSelector(
  //   (state: RootState) => state?.customerDivision
  // );

  // const distributionChannel = useSelector(
  //   (state: RootState) => state?.distributionChannel
  // );

  const handleChangeClass = (e: any) => {
    setCustomerProp({ name: e?.target?.value, altName: e?.target?.value });
  };

  const businessPlaceholder: any =
    selectedUser?.taxType?.code === "ADVANCE_TAX_GROUP"
      ? t("ADVANCE_TAX_GROUP")
      : t("BUSINESS_TAX_GROUP");

  const err = new CustomerClassListErrors(validateForm, selectedUser, t);

  const datePlaceHolder: any = t("DD/MM/YYYY");

  console.log(store?.isLoading, "isLoading");

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 600 } } }}
    >
      <Header>
        <Typography variant="h6">
          {selectedUser?.id ? t(Key("Edit Customer")) : t(Key("New Customer"))}
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            borderRadius: 1,
            color: "text.primary",
            backgroundColor: "action.selected",
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>

      <Box sx={{ p: (theme) => theme.spacing(0, 7.5, 7.5) }}>
        <form onSubmit={handleSubmit(onSubmit, onErrors)}>
          <TabContext value={tabValue}>
            <TabList
              variant="scrollable"
              scrollButtons="auto"
              onChange={handleChange}
              aria-label="forced scroll tabs example"
              sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Tabs
                value={tabValue}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs"
              >
                <Tab
                  value="1"
                  label={t("GENERAL")}
                  style={{
                    color:
                      errors.firstName ||
                      errors.lastName ||
                      errors.mobileNumber ||
                      (validateForm && !Boolean(selectedUser?.country))
                        ? "rgb(234, 84, 85)"
                        : "rgba(228, 230, 244, 0.6);",
                  }}
                />

                <Tab
                  value="2"
                  label={t("ADVANCED")}
                  style={{
                    color:
                      errors.code ||
                      (validateForm && !Boolean(selectedUser?.customerType)) ||
                      (validateForm &&
                        !Boolean(
                          selectedUser?.customerGroup ||
                            customerGroupProp.name ||
                            customerGroupProp.altName
                        )) ||
                      (validateForm &&
                        !Boolean(
                          selectedUser?.distributionChannel ||
                            customerDistributionProp.name ||
                            customerDistributionProp.altName
                        ))
                        ? "rgb(234, 84, 85)"
                        : "rgba(228, 230, 244, 0.6);",
                  }}
                />
                <Tab
                  value="3"
                  label={t("FINANCIAL")}
                  style={{
                    color:
                      (validateForm && !Boolean(selectedUser?.paymentTerms)) ||
                      (validateForm && !Boolean(selectedUser?.priceList)) ||
                      (validateForm && !Boolean(selectedUser?.currency))
                        ? "rgb(234, 84, 85)"
                        : "rgba(228, 230, 244, 0.6);",
                  }}
                />

                <Tab
                  value="4"
                  label={t("ATTRIBUTES")}
                  style={{ color: "rgba(228, 230, 244, 0.6);" }}
                />
                {/* <Tab
                  value="5"
                  label={t("ADDITIONAL_FIELDS")}
                  style={{
                    color:
                      validateForm &&
                      Object.values(customFieldError).some((d) => d === "show")
                        ? "rgb(234, 84, 85)"
                        : "rgba(228, 230, 244, 0.6);",
                  }}
                /> */}
              </Tabs>
            </TabList>

            <TabPanel value={tabValue} index={"1"} stylePad={"none"}>
              <Box
                style={{
                  display: "grid",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.inputField}>
                    <label>{t(Key("First Name"))}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            onChange={onChange}
                            placeholder={t(Key("First Name"))!}
                            defaultValue={""}
                            error={!!errors.firstName}
                            helperText={errors.firstName && t("REQUIRED")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.inputField}>
                    <label>{t(Key("Last Name"))}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            onChange={onChange}
                            placeholder={t(Key("Last Name"))!}
                            error={!!errors.lastName}
                            helperText={errors.lastName && t("REQUIRED")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.inputField}>
                    <label>{t("MOBILE")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="mobileNumber"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            type="number"
                            label=""
                            onChange={onChange}
                            onKeyDown={(e) => {
                              if (!onlyNumeric(e?.key, e?.ctrlKey)) {
                                // e.preventDefault();
                              }
                            }}
                            placeholder={t(Key("Enter Mobile Number"))!}
                            error={!!errors.mobileNumber}
                            helperText={errors.mobileNumber && t("REQUIRED")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.inputField}>
                    <label>{t("EMAIL")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            type="email"
                            value={value}
                            onChange={onChange}
                            placeholder={t("EMAIL") as string}
                            error={!!errors.email}
                            helperText={
                              errors.email && t(Key(errors.email.message))
                            }
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t("GENDER")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.customerGender || []}
                        value={
                          selectedUser?.gender === "MALE"
                            ? { id: 1, name: "Male", altName: "ذكر" }
                            : selectedUser?.gender === "FEMALE"
                            ? { id: 2, name: "Female", altName: "أنثى" }
                            : selectedUser?.gender
                        }
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name || option.code
                            : option.altName || option.code || option.name;
                        }}
                        onChange={handleGenderChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("GENDER")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t("AGE_GROUP")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={ageGroupOptions ?? []}
                        value={selectedUser?.ageGroup}
                        getOptionLabel={(option: any) =>
                          option.name ? option.name : option
                        }
                        onChange={handleAgeGroupChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("AGE_GROUP")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                ></Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.inputField}>
                    <label>{t("DOB")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <DatePickerWrapper>
                        <Grid item xs={12} sm={12} md={12}>
                          <Controller
                            name="DOB"
                            control={control}
                            rules={{ required: true }}
                            defaultValue={
                              selectedUser?.DOB
                                ? new Date(selectedUser?.DOB)
                                : new Date()
                            }
                            render={({ field: { value, onChange } }) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                }}
                                className="demo-space-x"
                              >
                                <DatePicker
                                  selected={
                                    !isEdit
                                      ? new Date(value)
                                      : getFullDate(value) !==
                                        getFullDate(new Date())
                                      ? value
                                      : ("" as any)
                                  }
                                  id="basic-input"
                                  showYearDropdown
                                  showMonthDropdown
                                  popperPlacement={popperPlacement}
                                  onChange={(e) => onChange(e)}
                                  placeholderText={
                                    t("CLICK_TO_SELECT_A_DATE") as string
                                  }
                                  scrollableYearDropdown={true}
                                  yearDropdownItemNumber={123}
                                  customInput={<CustomInput />}
                                  maxDate={new Date()}
                                  dateFormat={"dd/MM/yyyy"}
                                  // dropdownMode="select"
                                  nextYearAriaLabel="ddd"
                                />
                              </Box>
                            )}
                          />
                        </Grid>
                      </DatePickerWrapper>
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t(Key("Select Country"))}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                          popper: classes.popper,
                        }}
                        options={store.countries || []}
                        value={selectedUser?.country}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name || option.altName || ""
                            : option.altName && option.altName.length > 0
                            ? option.altName
                            : option.name || "";
                        }}
                        onChange={handleOnCountryChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t(Key("Select Country"))!}
                            error={err.checkError("country")}
                            helperText={err.showError("country")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t(Key("Select Region"))}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.region || []}
                        value={selectedUser?.region}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={handleOnRegionChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t(Key("Select Region"))!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t(Key("Select City"))}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.cities || []}
                        value={selectedUser?.city}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={handleOnCityChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t(Key("Select City"))!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t(Key("Select District"))}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="street"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Autocomplete
                            size="medium"
                            classes={{
                              option: classes.option,
                            }}
                            options={store.districts || []}
                            value={selectedUser?.district}
                            getOptionLabel={(option: any) => {
                              return changeLanguage === "en-US"
                                ? option.name
                                : option.altName || option.name || "";
                            }}
                            onChange={handleOnDistrictChange}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder={t(Key("Select District"))!}
                              />
                            )}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.inputField}>
                    <label>{t("STREET")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="street"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            type="text"
                            value={value}
                            onChange={onChange}
                            placeholder={t(Key("Enter Street address"))!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                {/*  Tag Field */}
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div
                    className={classes.commonSelect}
                    // style={{ width: "35%" }}
                  >
                    <label>{t("TAGS")}</label>
                    <FormControl
                      fullWidth
                      sx={{
                        mb: 2,
                        position: "relative",
                        // padding: "0 0 24px",
                        // width: "50%",
                      }}
                    >
                      <MultiTagInput
                        tagOptions={tagOptions}
                        setTagOptions={setTagOptions}
                      />
                    </FormControl>
                  </div>
                </Box>

                {/* Tag Field end */}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={"2"} stylePad={"none"}>
              <Box
                style={{
                  display: "grid",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.inputField}>
                    <label>
                      {t("CUSTOMER_CODE")}
                      {sequenceMapData?.autoGeneration ? "" : "*"}
                    </label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="code"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={
                              sequenceMapData?.autoGeneration &&
                              !selectedUser?.id
                                ? t("AUTO_GENERATED")
                                : value
                            }
                            onChange={onChange}
                            error={Boolean(errors.code)}
                            placeholder="123456"
                            disabled={sequenceMapData?.autoGeneration}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t("CUSTOMER_TYPE")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.customerType || []}
                        value={
                          selectedUser?.customerType === "INTERNAL"
                            ? { id: 1, name: "Internal", altName: "داخلي" }
                            : selectedUser?.customerType === "EXTERNAL"
                            ? { id: 2, name: "External", altName: "خارجي" }
                            : selectedUser?.customerType
                        }
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={handleCustomerTypeChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("CUSTOMER_TYPE")!}
                            error={err.checkError("customerType")}
                            helperText={err.showError("customerType")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>

                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t("CUSTOMER_GROUP")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={dropdown.CustomerGroup || []}
                        value={
                          selectedUser?.customerGroup
                            ? selectedUser?.customerGroup
                            : customerGroupProp
                        }
                        getOptionLabel={(option) => {
                          const label =
                            changeLanguage === "en-US"
                              ? option.name
                              : option.altName || option.name || "";
                          return label || ""; // Return an empty string if label is undefined
                        }}
                        onChange={handleCustomerGroupChange}
                        noOptionsText={
                          <div className={classes.modal}>
                            <div
                              className={classes.modalText}
                            >{`No Record Found`}</div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                onClick={handleCustomerGroupForm}
                                variant="contained"
                                fullWidth={false}
                                sx={{ textTransform: "unset", width: "99px" }}
                              >
                                {t("NEW")}
                              </Button>
                            </div>
                          </div>
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("CUSTOMER_GROUP")!}
                            onChange={(e: any) =>
                              setCustomerGroupProp({
                                name: e.target.value,
                                altName: e.target.value,
                              })
                            }
                            error={err.checkError("customerGroup")}
                            helperText={err.showError("customerGroup")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>

                  <div className={classes.commonSelect}>
                    <label>{t("CUSTOMER_CLASS")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={dropdown.customerclass || []}
                        value={
                          selectedUser?.customerClass
                            ? selectedUser?.customerClass
                            : customerProp
                        }
                        getOptionLabel={(option) => {
                          const label =
                            changeLanguage === "en-US"
                              ? option.name
                              : option.altName || option.name || "";
                          return label || ""; // Return an empty string if label is undefined
                        }}
                        onChange={handleCustomerClassChange}
                        noOptionsText={
                          <div className={classes.modal}>
                            <div
                              className={classes.modalText}
                            >{`No Record Found`}</div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                onClick={handleCustomerClassForm}
                                variant="contained"
                                fullWidth={false}
                                sx={{ textTransform: "unset", width: "99px" }}
                              >
                                {t("NEW")}
                              </Button>
                            </div>
                          </div>
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("CUSTOMER_CLASS")!}
                            onChange={handleChangeClass}
                            error={err.checkError("customerClass")}
                            helperText={err.showError("customerClass")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>

                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t("DISTRIBUTION_CHANNEL")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={dropdown.distributionchannel || []}
                        value={
                          selectedUser?.distributionChannel
                            ? selectedUser?.distributionChannel
                            : customerDistributionProp
                        }
                        getOptionLabel={(option) => {
                          const label =
                            changeLanguage === "en-US"
                              ? option.name
                              : option.altName || option.name || "";
                          return label || ""; // Return an empty string if label is undefined
                        }}
                        onChange={handleDistributionChannelChange}
                        noOptionsText={
                          <div className={classes.modal}>
                            <div
                              className={classes.modalText}
                            >{`No Record Found`}</div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                onClick={handleDistributionChannelForm}
                                variant="contained"
                                fullWidth={false}
                                sx={{ textTransform: "unset", width: "99px" }}
                              >
                                {t("NEW")}
                              </Button>
                            </div>
                          </div>
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("DISTRIBUTION_CHANNEL")!}
                            onChange={(e: any) =>
                              setCustomerDistributionProp({
                                name: e.target.value,
                                altName: e.target.value,
                              })
                            }
                            error={err.checkError("distributionChannel")}
                            helperText={err.showError("distributionChannel")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t("CUSTOMER_DIVISION")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={dropdown.customerdivision || []}
                        value={
                          selectedUser?.customerDivision
                            ? selectedUser?.customerDivision
                            : customerDivisionProp
                        }
                        getOptionLabel={(option) => {
                          const label =
                            changeLanguage === "en-US"
                              ? option.name
                              : option.altName || option.name || "";
                          return label || ""; // Return an empty string if label is undefined
                        }}
                        onChange={handleCustomerDivisionChange}
                        noOptionsText={
                          <div className={classes.modal}>
                            <div
                              className={classes.modalText}
                            >{`No Record Found`}</div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                onClick={handleCustomerDivisionForm}
                                variant="contained"
                                fullWidth={false}
                                sx={{ textTransform: "unset", width: "99px" }}
                              >
                                {t("NEW")}
                              </Button>
                            </div>
                          </div>
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("CUSTOMER_DIVISION")!}
                            onChange={(e: any) =>
                              setCustomerDivisionProp({
                                name: e.target.value,
                                altName: e.target.value,
                              })
                            }
                            error={err.checkError("customerDivision")}
                            helperText={err.showError("customerDivision")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t("PARENT_CUSTOMER")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.parentCustomer || []}
                        value={fullParentName}
                        getOptionLabel={(option: any) =>
                          option.code || option.mobileNumber
                            ? `${option.firstName} ${option.lastName}`
                            : selectedUser?.parentCustomer?.firstName ===
                              undefined
                            ? ""
                            : fullParentName
                        }
                        filterOptions={(options, state) =>
                          options.filter((opt) => opt.firstName)
                        }
                        onInputChange={captureInputChange}
                        onChange={handleParentCustomerChange}
                        renderOption={(props, option) => (
                          <>
                            <Box
                              component="li"
                              sx={{
                                "& > img": { mr: 2, flexShrink: 0 },

                                m: 0.6,
                                p: 0.6,
                              }}
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                gap: "16px",
                                textAlign: "start",
                              }}
                              {...props}
                            >
                              <>
                                <div style={{ width: "28%" }}>
                                  {option?.code}
                                </div>{" "}
                                <div
                                  style={{ width: "38%", overflowX: "hidden" }}
                                >
                                  {`${option.firstName} ${option.lastName}`}
                                </div>
                                <div style={{ width: "33%" }}>
                                  {option?.mobileNumber}
                                </div>
                              </>
                            </Box>
                            <Divider />
                          </>
                        )}
                        PaperComponent={(paperProps) => {
                          const { children, ...restPaperProps } = paperProps;
                          return (
                            <Paper {...restPaperProps}>
                              <Divider />
                              <Box
                                onMouseDown={(e) => e.preventDefault()} // prevent blur
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  padding: "16px 0 10px 18px",
                                }}
                              >
                                <div style={{ width: "28%", fontWeight: 600 }}>
                                  {t("CODE")}
                                </div>
                                <div style={{ width: "35%", fontWeight: 600 }}>
                                  {t("NAME")}
                                </div>
                                <div style={{ width: "33%", fontWeight: 600 }}>
                                  {t("PHONE")}
                                </div>
                              </Box>
                              <Divider />
                              {children}
                            </Paper>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("PARENT_CUSTOMER")!}
                            // error={err.checkError("parentCustomer")}
                            // helperText={err.showError("parentCustomer")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.inputField}>
                    <label>{t("LATITUDE_LONGITUDE")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="latitude"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={`${selectedUser?.latitude ?? ""}  ${
                              selectedUser?.longitude ?? ""
                            }`}
                            placeholder={t("LATITUDE_LONGITUDE")!}
                            InputProps={{
                              endAdornment: (
                                <div
                                  style={{
                                    color: "#28C76F",
                                    cursor: "pointer",
                                  }}
                                  onClick={handleLatLong}
                                >
                                  {t("REQUEST")}
                                </div>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t("SALESMAN")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={dropdown.salesman || []}
                        value={selectedUser?.salesman}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName;
                        }}
                        onChange={handleSalesmanChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("SALESMAN")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t("STATUS")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.customerStatus || []}
                        value={
                          selectedUser?.status === "ACTIVE"
                            ? { id: 1, name: "Active", altName: "نشيط" }
                            : selectedUser?.status === "INACTIVE"
                            ? { id: 2, name: "Inactive", altName: "غير نشط" }
                            : selectedUser?.status === "NO_INVOICE"
                            ? {
                                id: 3,
                                name: "No Invoice",
                                altName: "لا الفاتورة",
                              }
                            : selectedUser?.status === "CREDIT_BLOCKED"
                            ? {
                                id: 4,
                                name: "Credit Blocked",
                                altName: "الائتمان محظور",
                              }
                            : selectedUser?.status
                        }
                        // value={statusList}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name || ""
                            : option.altName || option.name || "";
                        }}
                        onChange={handleStatusChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("STATUS")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.inputField} style={{ width: "49%" }}>
                    <label>{t("COMPANY_NAME")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="companyName"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            onChange={onChange}
                            placeholder={t(Key("COMPANY_NAME"))!}
                            defaultValue={""}
                            inputProps={{
                              maxLength: 25,
                              minLength: 2,
                              step: "any",
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={"3"} stylePad={"none"}>
              <Box
                style={{
                  display: "grid",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.inputField}>
                    <label>{t("TAX_NUMBER")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="taxNumber"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            onChange={onChange}
                            placeholder={t("TAX_NUMBER")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>

                  <div className={classes.commonSelect}>
                    <label>{t("PAYMENT_TERMS")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={dropdown.paymentterms || []}
                        value={selectedUser?.paymentTerms}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={handlePaymentTermsChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("PAYMENT_TERMS")!}
                            error={err.checkError("paymentTerms")}
                            helperText={err.showError("paymentTerms")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  {/* For Future Use */}
                  {/* <div className={classes.commonSelect}>
                    <label>{t("TAX_TYPE")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.tax ?? []}
                        value={selectedUser?.taxType}
                        getOptionLabel={(option: any) => option.code || ""}
                        onChange={handleTaxtypeChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("TAX_TYPE")!}
                            error={err.checkError("taxType")}
                            helperText={err.showError("taxType")}
                           
                          />
                        )}
                      />
                    </FormControl>
                  </div> */}
                  <div className={classes.inputField}>
                    <label>{t("CREDIT_LIMIT")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="creditLimit"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            type="number"
                            value={value}
                            onChange={onChange}
                            placeholder={t("123456") as string}
                            onKeyDown={(e) => {
                              if (!onlyNumeric(e?.key, e?.ctrlKey)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </div>

                  {/* <div className={classes.commonSelect}>
                    <label>{t("BASIC_TAX_SETUP")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={dropdown.BasicTax || []}
                        value={selectedUser?.basicTax}
                        getOptionLabel={(option: any) => {
                          const label =
                            changeLanguage === "en-US"
                              ? option.name
                              : option.altName || option.name || "";
                          return label ?? "";
                        }}
                        onChange={handleTaxGroup}
                        // disabled={!selectedUser?.taxType}
                        id="tax-group-selebs"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("BASIC_TAX_SETUP") as any}
                            error={err.checkError("basicTax")}
                            helperText={err.showError("basicTax")}
                          />
                        )}
                      />
                    </FormControl>
                  </div> */}
                  <div className={classes.commonSelect}>
                    <label>{t("CURRENCY")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.currency || []}
                        value={selectedUser?.currency}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={handleCurrencyChange}
                        renderOption={(props, option) => {
                          return (
                            <li {...props} key={option.id}>
                              {option.name}
                            </li>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("CURRENCY")!}
                            error={err.checkError("currency")}
                            helperText={err.showError("currency")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.inputField}>
                    <label>{t("CUSTOMER_BALANCE")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="customerBalance"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            type="number"
                            value={value}
                            onChange={onChange}
                            placeholder="123456"
                            onKeyDown={(e) => {
                              if (!onlyNumeric(e?.key, e?.ctrlKey)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t("PRICE_LIST")}*</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="medium"
                        classes={{
                          option: classes.option,
                        }}
                        options={store.priceList || []}
                        value={selectedUser?.priceList}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={handlePriceListChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("PRICE_LIST")!}
                            error={err.checkError("priceList")}
                            helperText={err.showError("priceList")}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.inputField} style={{ width: "48%" }}>
                    <label>{t("REFERENCE")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="externalReference"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            onChange={onChange}
                            placeholder={t("REFERENCE")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>

                <Box>
                  <CommonTextArea
                    name="notes"
                    id="description"
                    label={"Enter a note for this customer"}
                    type={"string"}
                    control={control}
                    errors={errors}
                    defaultValue={""}
                    rows={3}
                    width={"35%"}
                  />
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={"4"} stylePad={"none"}>
              <Box
                style={{
                  display: "grid",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t("ATTRIBUTE_ONE")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="small"
                        classes={{
                          option: classes.option,
                        }}
                        options={attributes.attribute1 || []}
                        value={selectedUser?.customerAttributeO1}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={(event, value) =>
                          handleAttributeChange(event, value, "1")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("SELECT")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t("ATTRIBUTE_TWO")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="small"
                        classes={{
                          option: classes.option,
                        }}
                        options={attributes.attribute2 || []}
                        value={selectedUser?.customerAttributeO2}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={(event, value) =>
                          handleAttributeChange(event, value, "2")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("SELECT")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <div className={classes.commonSelect}>
                    <label>{t("ATTRIBUTE_THIRD")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="small"
                        classes={{
                          option: classes.option,
                        }}
                        options={attributes.attribute3 || []}
                        value={selectedUser?.customerAttributeO3}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={(event, value) =>
                          handleAttributeChange(event, value, "3")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("SELECT")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className={classes.commonSelect}>
                    <label>{t("ATTRIBUTE_FOUR")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Autocomplete
                        size="small"
                        classes={{
                          option: classes.option,
                        }}
                        options={attributes.attribute4 || []}
                        value={selectedUser?.customerAttributeO4}
                        getOptionLabel={(option: any) => {
                          return changeLanguage === "en-US"
                            ? option.name
                            : option.altName || option.name || "";
                        }}
                        onChange={(event, value) =>
                          handleAttributeChange(event, value, "4")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t("SELECT")!}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                </Box>
                <Grid container>
                  <Grid sm={6}>
                    <div className={classes.commonSelect}>
                      <label>{t("ATTRIBUTE_FIFTH")}</label>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Autocomplete
                          size="small"
                          classes={{
                            option: classes.option,
                          }}
                          options={attributes.attribute5 || []}
                          value={selectedUser?.customerAttributeO5}
                          getOptionLabel={(option: any) => {
                            return changeLanguage === "en-US"
                              ? option.name
                              : option.altName || option.name || "";
                          }}
                          onChange={(event, value) =>
                            handleAttributeChange(event, value, "5")
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder={t("SELECT")!}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* <TabPanel value={tabValue} index={"5"} stylePad={"none"}>
              <>
                <div
                  className={classes.commonSelect}
                  style={{
                    marginBottom: "16px",
                  }}
                >
                  <AddCustomFieldsBtn
                    handleClick={handleCFPopUp}
                    titleBtn={`+  ${t("ADD_FIELD")}`}
                    infoText={t("CUSTOM_FIELD_INFO_TEXT")}
                  />
                </div>
                {!customFieldsElements.length && progressBar ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress color="primary" size={"1.3rem"} />
                  </div>
                ) : !customFieldsElements.length && !progressBar ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {t("NO_FIELD")}
                  </div>
                ) : (
                  <Box
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "4px 12px",
                    }}
                  >
                    {customFieldsElements.map((i: any) => {
                      if (i?.visible) {
                        return (
                          <FormField
                            control={control}
                            errors={{}}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            selectedUser={selectedUser}
                            customFieldsUser={customFieldsUser}
                            errorMsg={
                              validateForm &&
                              !selectedUser[i?.name] &&
                              !i?.defaultValue &&
                              !getValues()?.[i?.name]
                                ? customFieldError[
                                    i?.name as keyof typeof customFieldErrors
                                  ]
                                : "hide"
                            }
                            setErrorMsg={(d: any) => {
                              setCustomFieldError((p: any) => ({
                                ...p,
                                [i?.name]: d,
                              }));
                            }}
                            {...i}
                          />
                        );
                      }
                    })}
                  </Box>
                )}
              </>
            </TabPanel> */}
          </TabContext>
          <CommonFormActionButtons
            padding={"unset"}
            height={"110px"}
            handleCloseDrawer={handleClose}
            onClickFunc={handleValidationError}
            disabled={store?.isLoading}
          />
          {SnackBarView ? (
            <SnackbarConsecutive
              message={"Please fill the mandatory fields"}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            />
          ) : null}
        </form>
      </Box>
      {dialogView ? (
        <CustomerDistributionChannelAddNewModal
          distributionChanneldata={dropdown?.distributionChannel || []}
          distributionChannel={customerDistributionProp?.name}
          setCustomerDistributionProp={setCustomerDistributionProp}
          setDialogView={setDialogView}
          customerDistributionProp={customerDistributionProp}
          setDistributionIds={setDistributionIds}
          save={setSelectedUser}
        />
      ) : null}
      {customerClassView ? (
        <CustomerClassAddNewModal
          customerClassdata={dropdown?.customerclass || []}
          customerClass={customerProp?.name}
          customerClassAltName={customerProp?.altName}
          setCustomerProp={setCustomerProp}
          setDialogView={setCustomerClassView}
          submitCustomerClass={submitCustomerClass}
          customerProp={customerProp}
          setClassIds={setClassIds}
          save={setSelectedUser}
        />
      ) : null}
      {customerDivisionView ? (
        <CustomerDivisionAddNewModal
          customerDivisionData={dropdown?.customerdivision || []}
          customerDivision={customerDivisionProp?.name}
          setCustomerDivisionProp={setCustomerDivisionProp}
          setDialogView={setCustomerDivisionView}
          customerDivisionProp={customerDivisionProp}
          setDidvisionIds={setDidvisionIds}
          save={setSelectedUser}
        />
      ) : null}
      {customerGroupView ? (
        <CustomerGroupAddNewModal
          customerGroupdata={dropdown?.CustomerGroup || []}
          customerGroups={customerGroupProp}
          customerGroup={customerGroupProp?.name}
          setCustomerGroupProp={setCustomerGroupProp}
          setDialogView={setCustomerGroupView}
          customerGroupProp={customerGroupProp}
          setGroupIds={setGroupIds}
          save={setSelectedUser}
        />
      ) : null}
      {customFieldView ? (
        <>
          <CustomerCustomFieldsAddNewModal setDialogView={setCustomFieldView} />
        </>
      ) : null}
    </Drawer>
  );
};

export default SidebarAddUser;
