// ** React Imports
import { ForwardedRef, forwardRef, useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AppStorage from "src/app/AppStorage";
// ** Custom Components
import CustomAvatar from "src/@core/components/mui/avatar";
import UserSubscriptionDialog from "src/views/apps/user/view/UserSubscriptionDialog";
import UserSuspendDialog from "src/views/apps/user/view/UserSuspendDialog";
// ** Utils Import
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Key } from "src/@core/layouts/utils";
import { makeStyles } from "@mui/styles";
import { CustomerType, defaultValues } from "src/types/forms/customerTypes";
import { AppDispatch, RootState } from "src/store";
import { useSelector } from "react-redux";
import { RevestCodeFormValidator } from "src/@core/form-validator";
import { onlyNumeric, phoneRegExp } from "src/constants/validation/regX";
import Autocomplete from "@mui/material/Autocomplete";
import { ageGroupOptions } from "src/constants/customer/customerConstants";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { TFunction } from "i18next";
import { useDispatch } from "react-redux";
import { updateUser } from "src/store/apps/customers";

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
const formatDateOfBirth = (DOB: any) => {
  const date = new Date(DOB);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() % 100;

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
};
const showErrors: any = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const CustomInput = forwardRef(
  ({ ...props }, ref: ForwardedRef<HTMLElement>) => {
    return <TextField fullWidth inputRef={ref} {...props} />;
  }
);
interface userProps{
  customerData:any;
  fetchCustomerData:(id:string)=>void;
}
const UserViewLeft = ({customerData,fetchCustomerData}:userProps) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] =
    useState<boolean>(false);
  const { t } = useTranslation();
  const classes = useStyles();
  const [isEdit,setIsEdit]=useState<boolean>(false) 
  const theme = useTheme();
  const { direction } = theme;
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
 const [selectedUser,setSelectedUser]=useState<any>(defaultValues)
  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );
  const [customFieldsElements, setCustomFieldsElements] = useState([]);
  const [customFieldError, setCustomFieldError] = useState({});
  const [validateForm, setValidateForm] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const customFields: any = useSelector(
    (state: RootState) => state.customFields
  );
  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);
 
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

  const store: any = useSelector((state: RootState) => state.customers);
  
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
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors},
    clearErrors,
    setValue,
    getValues,
    setError
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

 // Handle Edit dialog
 const handleEditClickOpen = async() =>{
  setSelectedUser(customerData)
  setValue('firstName', customerData?.firstName)
  setValue('code', customerData?.code)
  setValue('lastName', customerData?.lastName)
  setValue('mobileNumber', customerData?.mobileNumber)
  setValue('email', customerData?.email)
  setValue("street",customerData?.street)
  setValue("DOB",new Date(customerData?.DOB))
  setOpenEdit(true);
  setIsEdit(true);
}

const handleEditClose = () =>{
  setOpenEdit(false);
  setSelectedUser(defaultValues);
  clearErrors()
} 

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
  const handleGenderChange = (event: any, gender: any | null) => {
    const usr: CustomerType = { ...selectedUser, gender } as CustomerType;
    setSelectedUser(usr);
  };
  const handleAgeGroupChange = (event: any, ageGroup: any | null) => {
    const usr: CustomerType = { ...selectedUser, ageGroup } as CustomerType;
    setSelectedUser(usr);
  };

  const changeLanguage = AppStorage.getData("lang");
  const getFullDate = (date: any) => {
    let day = date?.getDate();
    let month = date?.getMonth() + 1;
    let year = date?.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const isFormValid: any = (u: any = {}): boolean => {
    return (
      (u.country?.id &&
        u.currency?.id &&
        u.distributionChannel?.id &&
        u.paymentTerms?.id &&
        u.priceList?.id &&
        u.customerGroup?.id &&
        u.selectedTaxGroup) ||
      u.selectedBusinessTaxGroup?.id ||
      u.basicTax
    );
  };
  const onErrors = (data: any) => {    
    setValidateForm(true);
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
      
    } catch (e) {
      console.log("error while setting up error");
    }
  };
  
  const onSubmit = async (data: any, event: any) => {
    if (!isFormValid(customerData)) {
      setValidateForm(true);
      onErrors(null);
      return false;
    }
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
    if (!customFieldsErrorCheck(data)) {
      setValidateForm(true);
      onErrors(null);
      return false;
    }

    const {
      code,
      DOB,
      email,
      firstName,
      lastName,
      mobileNumber,
      street,
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
      code:data?.code,
      DOB: selectedUser?.id ? new Date(DOB) : DOB,
      email:data?.email,
      firstName:data?.firstName,
      lastName:data?.lastName,
      mobileNumber:data?.mobileNumber,
      street:data?.street,
      id: selectedUser?.id ? selectedUser?.id : null,
      countryId: selectedUser?.country?.id,
      regionId: selectedUser?.region?.id,
      cityId: selectedUser?.city?.id,
      districtId: selectedUser?.district?.id,
      ageGroup: selectedUser?.ageGroup?.name,
    };
    
    let res;
    if (selectedUser?.id) {
      res = await dispatch(updateUser({ data: payload }));
    }
    if (res)
    
    setSelectedUser(defaultValues);
    setValidateForm(false);
    reset(defaultValues);
    handleEditClose()
    fetchCustomerData(customerData?.id)
  };

  const popperPlacement: ReactDatePickerProps["popperPlacement"] =
  direction === "ltr" ? "bottom-start" : "bottom-end";

  const err = new CustomerClassListErrors(validateForm, selectedUser, t);

  
  if (!customerData) {
    return null;
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ borderBottom: "5px solid #3586c7" }}>
            <CardContent
              sx={{
                pt: 13.5,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CustomAvatar
                src={"/images/avatars/1.png"}
                variant="rounded"
                alt={`${customerData?.firstName} ${customerData?.lastName}`}
                sx={{ width: 100, height: 100, mb: 4 }}
              />
              {/* <CustomAvatar
                    skin="light"
                    variant="rounded"
                    color={data.avatarColor as ThemeColor}
                    sx={{ width: 100, height: 100, mb: 4, fontSize: "3rem" }}
                  >
                    {getInitials(` ${customerData?.firstName} ${customerData?.lastName}`)}
                  </CustomAvatar> */}
              <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
                {t(`AGE_GROUP`)}: {customerData?.ageGroup}
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 3, textTransform: "capitalize" }}
              >
                {customerData?.firstName} {customerData?.lastName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {t(`CUSTOMER_CODE`)}: {customerData?.code}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {t(`STATUS`)} :{" "}
                 <span
                  style={{
                    color:
                      customerData?.status === "ACTIVE" ? "#15AA58" : "red",
                    textTransform: "capitalize",
                  }}
                >
                  {customerData?.status}
                </span>
              </Typography>
            </CardContent>
            <CardContent sx={{ pb: 4 }}>
              <Typography variant="body1" sx={{ textTransform: "capitalized" }}>
                {t("GENERAL_DETAILS")}
              </Typography>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ pt: 4 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {t(`FULL_NAME`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {customerData?.firstName} {customerData?.lastName}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {t(`EMAIL_ID`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                      }}
                    >
                      {customerData?.email}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {t(`COUNTRY`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {customerData?.country?.name}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {t(`CITY`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {customerData?.city?.name}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {t(`STREET`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {customerData?.street}
                    </span>
                  </Typography>
                </Box>
                <Box sx={{ pt: 4 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {t(`MOBILE`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                      }}
                    >
                      {customerData?.mobileNumber}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "justify",
                    }}
                  >
                    {t(`GENDER`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {customerData?.gender}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "justify",
                    }}
                  >
                    {t(`DATE_OF_BIRTH`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                      }}
                    >
                      {formatDateOfBirth(customerData?.DOB)}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "justify",
                    }}
                  >
                    {t(`REGION`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {customerData?.region?.name}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      mr: 2,
                      mb: 3,
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "justify",
                    }}
                  >
                    {t(`DISTRICT`)}
                    <span
                      style={{
                        color:
                          theme.palette.mode === "dark" ? "#CCCFDD" : "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {customerData?.district?.name}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={handleEditClickOpen}
              >
                {t(`EDIT_CUSTOMER`)}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSuspendDialogOpen(true)}
              >
                {t(`CLOSE`)}
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby="user-view-edit"
              aria-describedby="user-view-edit-description"
              sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650 } }}
            >
              <DialogTitle
                id="user-view-edit"
                sx={{
                  textAlign: "center",
                  fontSize: "1.5rem !important",
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                  pt: (theme) => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`,
                  ],
                }}
              >
                {t(`EDIT_USER_INFORMATION`)}
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: (theme) => `${theme.spacing(8)} !important`,
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                }}
              >
                <form onSubmit={handleSubmit(onSubmit, onErrors)}>
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
                            defaultValue={""}
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
                            : customerData?.gender === "FEMALE"
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
              </Box>
              <Box sx={{display:"flex",justifyContent:"center",mt:4}}>
              <Button
                  variant="contained"
                  type="submit"
                  sx={{ mr: 2 }}
                >
                  {t(`SUBMIT`)}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditClose}
                >
                  {t(`CANCEL`)}
                </Button>
              </Box>
            
                </form>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: "center",
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                  pb: (theme) => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`,
                  ],
                }}
              >
                
              </DialogActions>
            </Dialog>

            <UserSuspendDialog
              open={suspendDialogOpen}
              setOpen={setSuspendDialogOpen}
            />
            <UserSubscriptionDialog
              open={subscriptionDialogOpen}
              setOpen={setSubscriptionDialogOpen}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserViewLeft;
