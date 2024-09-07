import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import UserMasterDataTable from "src/components/user-master/userMasterDataTable";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CommonSwitch from "src/components/common/CommonSwitch";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "src/@core/components/mui/avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { AppDispatch, RootState } from "src/store";
import {
  createUser,
  getUserCreation,
  getUserTilesData,
  userUpdate,
} from "src/store/apps/userCreation/userCreation";
import { styled } from "@mui/material/styles";
import { fileNameAndType } from "src/utils/checkItemAvailable";
import { Imagefileuploader } from "src/store/apps/product/product-category";
import { getStoreAndTerminals } from "src/store/apps/storeAndTerminals";
import { getRoles } from "src/store/apps/role";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { countries as countryCodes } from "src/utils/countries";
import SelectStoreAndTerminals from "./SelectStoreAndTerminals";
import { onlyNumeric } from "src/constants/validation/regX";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";

const useStyles = makeStyles({
  drawerWrapper: {
    height: "100vh",
  },
  form: {
    height: "calc(100vh - 80px)",
  },
  imageHint: {
    fontSize: "11px",
    fontStyle: "normal",
    fontWeight: "400",
    padding: "5px 7px",
  },
  buttonText: {
    marginLeft: "10px",
    textTransform: "capitalize",
    width: "85px",
  },
  box: {
    marginTop: "10px",
  },
  error: {
    fontSize: "10px",
    color: "red",
  },
  resetButton: {
    marginLeft: "5px",
    width: "80px",
    textTransform: "capitalize",
    background: "rgba(168, 170, 174, 0.16) !important",
    boxShadow: "none",
    color: "#A8AAAE",
    "&:hover": {
      background: "rgba(168, 170, 174) !important",
      color: "black",
    },
  },
  store_terminal: {
    padding: "10px",
    margin: "10px 0px",
    borderRadius: "7px",
  },
  autoComplete: {
    "& .MuiInputBase-root": {
      paddingLeft: "0px !important",
    },
    "&::placeholder": {
      paddingLeft: "0px !important",
    },
  },
});

interface FormValues {
  id?: string;
  active?: boolean;
  image?: string;
  imageFile: any;
  newImageUpload: boolean;
  firstName?: string;
  lastName?: string;
  altName?: string;
  email?: string;
  mobileNumber?: string;
  isTwoFactorAuth?: boolean | any;
  role?: {
    id?: string | number;
    name?: string;
    active?: boolean;
    userType?: any;
    totalUsers?: string | number;
  };
  store?: [];
  externalReference?: string;
  usersStoreTerminalMapping?: any;
  countryCode?: string;
  isEmployee: false;
  employeeDetails: {
    id?: string;
    name?: string;
    label?: string;
    code?: string;
    phone?: string;
  };
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UserMaster = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const userData = useSelector((state: RootState) => state.userCreation);
  const stores = useSelector(
    (state: RootState) => state.storeAndTerminals.data
  );
  // console.log(stores,"stores")
  const filteredStores = stores.filter(
    (store) => store.terminals && store.terminals.length > 0
  );
  const userTilesData = useSelector((state: RootState) => state.userCreation);
  const availableRoles = useSelector((state: RootState) => state.role.data);

  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("1");
  const [roles, setRoles] = useState<any>([]);
  const [openStoreAndTerminalsDialog, setOpenStoreAndTerminalsDialog] =
    useState<boolean>(false);
  const [existingStoresAndTerminalsData, setExistingStoresAndTerminalsData] =
    useState<any>([]);
  const [assignedStoresAndTerminals, setAssignedStoresAndTerminals] =
    useState<any>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleEditUser = (row: any) => {
    console.log("row", row);
    setValue("id", row?.id);
    setValue("active", row?.active);
    setValue("firstName", row?.firstName);
    setValue("lastName", row?.lastName);
    setValue(
      "altName",
      row?.altName ? row?.altName : `${row?.firstName} ${row?.lastName}`
    );
    setValue("email", row?.email);
    setValue("countryCode", row?.countryCode);
    setValue("mobileNumber", row?.mobileNumber);
    setValue("isTwoFactorAuth", row?.isTwoFactorAuth);
    setValue("role", {
      id: row?.role?.id,
      name: row?.role?.name,
      userType: row?.userType,
    });
    setValue("image", row?.image);
    setValue("externalReference", row?.externalReference);

    const { usersStoreTerminalMapping } = row;
    let storesTerminalsInfo = [];
    for (let i = 0; i < usersStoreTerminalMapping?.length; i++) {
      const { store, terminals } = row?.usersStoreTerminalMapping[i];
      storesTerminalsInfo.push({
        storeTypes: { ...store },
        terminals: [...terminals],
      });
    }
    setExistingStoresAndTerminalsData(storesTerminalsInfo);
  };

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUserCreation({}));
    dispatch(getUserTilesData());
    if (stores?.length === 0) dispatch(getStoreAndTerminals({}));
    if (roles?.length === 0) dispatch(getRoles());
  }, []);

  useEffect(() => {
    setRoles(availableRoles);
  }, [availableRoles]);

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required(`${t("REQUIRED")}`)
      .min(
        2,
        `${t("FIRST_NAME")} ${t("MUST_BE_AT_LEAST")} 2 ${t("CHARACTERS")}`
      )
      .max(
        25,
        `${t("FIRST_NAME")} ${t("MUST_BE_AT_MOST")} 25 ${t("CHARACTERS")}`
      )
      .matches(
        /^[a-zA-Z0-9/\s]+$/,
        `${t("FIRST_NAME")} ${t("NOT_CONTAIN_SPECIAL_CHARACTERS")}`
      ),

    lastName: yup
      .string()
      .required(`${t("REQUIRED")}`)
      .min(2, `${t("LAST_NAME")} ${t("MUST_BE_AT_LEAST")} 2 ${t("CHARACTERS")}`)
      .max(
        25,
        `${t("LAST_NAME")} ${t("MUST_BE_AT_MOST")} 25 ${t("CHARACTERS")}`
      )
      .matches(
        /^[a-zA-Z0-9/\s]+$/,
        `${t("LAST_NAME")} ${t("NOT_CONTAIN_SPECIAL_CHARACTERS")}`
      ),

    mobileNumber: yup
      .string()
      .required(`${t("REQUIRED")}`)
      .min(
        6,
        `${t("MOBILE_NUMBER")} ${t("MUST_BE_AT_LEAST")} 6 ${t("CHARACTERS")}`
      )
      .max(
        15,
        `${t("MOBILE_NUMBER")} ${t("MUST_BE_AT_MOST")} 15 ${t("CHARACTERS")}`
      ),

    role: yup
      .mixed()
      .test("productFamily", "REQUIRED", (item: any) =>
        !item?.name ? false : true
      ),

    externalReference: yup
      .string()
      .max(
        25,
        `${t("EXTERNAL_REFERANCE")} ${t("MUST_BE_AT_MOST")} 25 ${t(
          "CHARACTERS"
        )}`
      ),
  });

  const {
    watch,
    reset,
    setError,
    control,
    setValue,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      id: "",
      isEmployee: false,
      image: "",
      imageFile: "",
      employeeDetails: {
        id: "",
        name: "",
        label: "",
        code: "",
        phone: "",
      },
      firstName: "",
      lastName: "",
      altName: "",
      email: "",
      mobileNumber: "",
      active: true,
      isTwoFactorAuth: false,
      role: {
        id: "",
        name: "",
      },
      store: [],
      externalReference: "",
      countryCode: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const values = watch();
  const employeeChecked = watch("isEmployee");

  const handleCloseDrawer = () => {
    setOpen(false);
    reset();
    setTab("1");
  };

  const changeImageurl = (image: string | any) => {
    let url = "";
    if (image?.includes("amazonaws")) {
      let newImage = image.split(".com/");
      url = newImage[newImage.length - 1];
    }
    return url;
  };

  const onSubmit = async (data: any, event: any) => {
    handleCloseDrawer();
    let image = await handleImageUpload();
    let res: any;

    const userType =
      values?.role?.userType?.length > 1 ? null : values?.role?.userType[0]?.id;

    const storeTerminals = assignedStoresAndTerminals?.map((store: any) => {
      return {
        storeId: store?.id,
        terminals: store?.terminals?.map((terminal: any) => {
          return {
            terminalId: terminal?.id,
          };
        }),
      };
    });

    let altName = values?.altName
      ? values?.altName
      : `${values?.firstName} ${values?.lastName}`;

    const getPOSPermissionType = values?.role?.userType?.filter((item: any) =>
      item?.name?.includes("POS")
    );

    const payload = {
      id: values?.id,
      userTypeId: userType,
      mobileNumber: values?.mobileNumber,
      email: values?.email,
      active: values?.active,
      userName: "",
      firstName: values?.firstName,
      image: image ? image : changeImageurl(values?.image),
      altName: altName,
      lastName: values?.lastName,
      roleId: values?.role?.id,
      isTwoFactorAuth: values?.isTwoFactorAuth,
      storeTerminals: getPOSPermissionType?.length > 0 ? storeTerminals : [], // Pass storeTerminals when Permission type is POS or POS|Back Office
      countryCode: values?.countryCode,
      externalReference: values?.externalReference,
    };

    if (data?.id) {
      res = await dispatch(userUpdate(payload));
    } else {
      res = await dispatch(createUser(payload));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
    // clear assigned stores and terminals
    setAssignedStoresAndTerminals([]);
  };

  const handleImageUpload = async () => {
    let imageKey: string | any = "";

    if (values?.imageFile?.name) {
      let body = await fileNameAndType(values?.imageFile?.name, ".", "users");
      const fileRes = await dispatch(Imagefileuploader(body));
      let uploadResult = await axios({
        method: "put",
        url: fileRes?.payload?.data?.signedRequest,
        headers: { "content-type": `image/${body?.fileType}` },
        data: values?.imageFile,
      });
      imageKey =
        uploadResult?.status === 200 ? fileRes?.payload?.data?.key : "";
      return imageKey;
    }
    return imageKey;
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  const handleEditPage = (type: string | undefined) => {
    setAssignedStoresAndTerminals([]);
    setOpen(true);
  };

  const handleselectImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    let maxSize = 800 * 1024;
    let allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (files?.length > 0) {
      let file = files[0];
      if (file.size > maxSize || !allowedTypes.includes(file.type)) {
        setError("image", { type: "custom", message: "errorMessage" });
        return;
      }

      clearErrors("image");

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;

        if (imageUrl) {
          setValue("image", imageUrl);
          setValue("imageFile", file);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const getPermissionsFromroles = (roles: any) => {
    let permissions = "";
    if (roles?.length) {
      roles?.forEach((type: any, i: number) => {
        permissions =
          permissions + `${type?.name} ${i + 1 !== roles.length ? "|" : ""}`;
      });
    }
    return permissions;
  };

  const handleStoreBtnClick = () => {
    setOpenStoreAndTerminalsDialog(true);
  };

  return (
    <>
      <Grid container spacing={3} xs={12}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={2} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:user"
                showDifference={false}
                stats={userTilesData?.tilesData?.totalCount}
                trendDiff={0}
                title={t("TOTAL_USERS")}
              />
            </Grid>
            <Grid item xs={12} md={2} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:device-laptop"
                title={t("BACK_OFFICE")}
                stats={userTilesData?.tilesData?.totalBackOfficeCount}
                trendDiff={0}
                // avatarColor="success"
              />
            </Grid>
            <Grid item xs={12} md={2} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:device-tablet"
                title={t("POS_USERS")}
                stats={userTilesData?.tilesData?.totalPosCount}
                trendDiff={0}
                // avatarColor="error"
              />
            </Grid>
            <Grid item xs={12} md={2} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:devices"
                title={t("MULTI_ACCESS")}
                stats={userTilesData?.tilesData?.totalPosAndBackOfficeCount}
                trendDiff={0}
                // avatarColor="error"
              />
            </Grid>
            <Grid item xs={12} md={2} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:user-check"
                title={t("ACTIVE")}
                stats={userTilesData?.tilesData?.totalActiveCount}
                trendDiff={0}
                avatarColor="success"
              />
            </Grid>
            <Grid item xs={12} md={2} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:user-off"
                title={t("INACTIVE")}
                stats={userTilesData?.tilesData?.totalInActiveCount}
                trendDiff={0}
                avatarColor="error"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <Card>
        <UserMasterDataTable
          data={userData?.data || []}
          isLoading={userData?.isLoading}
          handleEditPage={handleEditPage}
          selectedRecord={() => null}
          item={values}
          setUserItem={handleEditUser}
        />
        <CommonDrawer open={open} toggle={handleCloseDrawer}>
          <div className={classes.drawerWrapper}>
            <CommonDrawerHeader
              title={values?.id ? t("EDIT") : t("NEW")}
              handleClose={handleCloseDrawer}
              noBorder={true}
            />
            <form
              className={classes.form}
              onSubmit={handleSubmit(onSubmit, onErrors)}
            >
              <TabContext value={tab}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    sx={{
                      color:
                        errors?.firstName ||
                        errors.lastName ||
                        errors.email ||
                        errors.mobileNumber
                          ? "red !important"
                          : "",
                    }}
                    label={t("PROFILE")}
                    value="1"
                  />
                  <Tab
                    sx={{ color: errors?.role ? "red !important" : "" }}
                    label={t("ADVANCE")}
                    value="2"
                  />
                </TabList>
                <TabPanel value="1">
                  <div style={{ marginLeft: "-10px", marginTop: "-8px" }}>
                    <Checkbox
                      checked={values?.isEmployee}
                      size="small"
                      {...register("isEmployee")}
                      disabled
                    />
                    {t("IS_EMPLOYEE")}
                  </div>
                  {employeeChecked && (
                    <>
                      <div>{t("SELECT_EMPLOYEE")}</div>
                      <FormControl fullWidth>
                        <Controller
                          name="employeeDetails"
                          control={control}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <Autocomplete
                                id="employeeDetails-select"
                                options={[]}
                                autoHighlight
                                size="small"
                                fullWidth
                                // onChange={(e, value) => setValue("employeeDetails", value)}
                                defaultValue={values?.employeeDetails ?? ""}
                                getOptionLabel={(option: any) => option.label}
                                renderOption={(props, option: any) => (
                                  <Box
                                    component="li"
                                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                    {...props}
                                  >
                                    {option.name} ({option.code}) +
                                    {option.phone}
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    value={values?.employeeDetails}
                                    {...params}
                                  />
                                )}
                              />
                            );
                          }}
                        />
                      </FormControl>
                    </>
                  )}
                  <Box className={classes.box}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Avatar
                          src={values?.image}
                          sx={{ bgcolor: "#929292", height: 65, width: 65 }}
                          variant="rounded"
                        ></Avatar>
                      </Grid>
                      <Grid item xs={9}>
                        <Button
                          component="label"
                          className={classes.buttonText}
                          sx={{ mx: 1 }}
                          variant="contained"
                        >
                          {`${values.image ? t("CHANGE") : t("UPLOAD")}`}
                          <VisuallyHiddenInput
                            type="file"
                            onChange={handleselectImage}
                            ref={inputFileRef}
                          />
                        </Button>
                        <Button
                          onClick={() => {
                            setValue("image", ""), setValue("imageFile", "");
                            if (inputFileRef.current) {
                              inputFileRef.current.value = "";
                            }
                            clearErrors("image");
                          }}
                          className={classes.resetButton}
                          variant="contained"
                        >
                          {t("RESET")}
                        </Button>
                        <br />
                        <Box
                          sx={{
                            color: errors?.image?.message ? "red" : "black",
                          }}
                          className={classes.imageHint}
                        >
                          {t("IMAGE_HINT")}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={classes.box}>
                    <div>{t("FIRST_NAME")}*</div>
                    <TextField
                      {...register("firstName")}
                      fullWidth
                      size="small"
                      placeholder={t("FIRST_NAME") as string}
                      error={errors?.firstName as any}
                      helperText={errors?.firstName?.message}
                    />
                  </Box>
                  <Box className={classes.box}>
                    <div>{t("LAST_NAME")}*</div>
                    <TextField
                      {...register("lastName")}
                      fullWidth
                      size="small"
                      placeholder={t("LAST_NAME") as string}
                      error={errors?.lastName as any}
                      helperText={errors?.lastName?.message}
                    />
                  </Box>
                  <Box className={classes.box}>
                    <div>{t("ALTERNATE_NAME")}</div>
                    <TextField
                      {...register("altName")}
                      fullWidth
                      size="small"
                      placeholder={t("ALTERNATE_NAME") as string}
                      defaultValue={values.altName}
                      value={
                        values.altName
                          ? values.altName
                          : `${values?.firstName} ${values.lastName}`.trim()
                      }
                      onChange={(e) => setValue("altName", e?.target?.value)}
                    />
                  </Box>
                  <Box className={classes.box}>
                    <div>{t("EMAIL")}</div>
                    <TextField
                      {...register("email")}
                      fullWidth
                      size="small"
                      placeholder={t("EMAIL") as string}
                      error={errors?.email as any}
                      helperText={errors?.email?.message}
                    />
                  </Box>
                  <Box className={classes.box}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-around"
                      alignItems="flex-start"
                    >
                      <Grid item xs={4}>
                        <div>{t("COUNTRY")}*</div>
                        <FormControl fullWidth>
                          <Controller
                            name="countryCode"
                            control={control}
                            render={({ field: { value, onChange } }) => {
                              return (
                                <Autocomplete
                                  className={classes.autoComplete}
                                  componentsProps={{
                                    popper: { style: { width: "100px" } },
                                  }}
                                  id="country-select-demo"
                                  options={countryCodes ?? []}
                                  autoHighlight
                                  size="small"
                                  disableClearable={true}
                                  fullWidth
                                  onChange={(e, value) => {
                                    setValue("countryCode", value);
                                  }}
                                  value={
                                    values?.countryCode ??
                                    getValues("countryCode")
                                  }
                                  getOptionLabel={(option: any) => option}
                                  renderOption={(props, option: any) => (
                                    <Box
                                      sx={{ width: "auto" }}
                                      component="li"
                                      {...props}
                                    >
                                      {option}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      placeholder={t("CODE") as string}
                                      title="county code"
                                      error={
                                        !values?.countryCode &&
                                        (errors?.mobileNumber?.message as any)
                                      }
                                      helperText={
                                        !values?.countryCode &&
                                        errors?.mobileNumber?.message
                                      }
                                      value={
                                        values?.countryCode ??
                                        getValues("countryCode")
                                      }
                                      {...params}
                                    />
                                  )}
                                />
                              );
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={7}>
                        <div>{t("MOBILE_NUMBER")}*</div>
                        <TextField
                          type="number"
                          {...register("mobileNumber")}
                          onKeyDown={(e) => {
                            if (!onlyNumeric(e?.key, e?.ctrlKey)) {
                              e.preventDefault();
                            }
                          }}
                          fullWidth
                          error={errors?.mobileNumber?.message as any}
                          helperText={errors?.mobileNumber?.message}
                          size="small"
                          placeholder={t("MOBILE") as string}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={classes.box}>
                    <div style={{ marginLeft: "-10px", marginTop: "-8px" }}>
                      <Checkbox
                        checked={values?.isTwoFactorAuth}
                        size="small"
                        {...register("isTwoFactorAuth")}
                      />
                      {t("ENABLE_AUTHENTICATION")}
                    </div>
                  </Box>
                  <Box className={classes.box}>
                    <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                      <CommonSwitch
                        active={values.active}
                        // setActive={}
                        statusChange={() => setValue("active", !values.active)}
                      />
                      {values.active ? t("ACTIVE") : t("INACTIVE")}
                    </div>
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <Box className={classes.box}>
                    <div>{t("SELECT_ROLE")}*</div>
                    <FormControl fullWidth>
                      <Controller
                        name="employeeDetails"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <Autocomplete
                              id="roles-select-demo"
                              options={roles ?? []}
                              autoHighlight
                              size="small"
                              fullWidth
                              onChange={(e, value: any) => {
                                setValue("role", value);
                                clearErrors("role");
                              }}
                              defaultValue={values?.role}
                              getOptionLabel={(option: any) => option?.name}
                              renderOption={(props, option: any) => (
                                <Box
                                  component="li"
                                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                  {...props}
                                >
                                  {option.name}
                                </Box>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  placeholder={t("SELECT_ROLE") as string}
                                  error={errors?.role?.message as any}
                                  helperText={errors?.role?.message}
                                  value={values?.role?.name}
                                  {...params}
                                />
                              )}
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box className={classes.box}>
                    <div>{t("PERMISSION_TYPE")}</div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder={t("PERMISSION_TYPE") as string}
                      disabled
                      value={getPermissionsFromroles(values?.role?.userType)}
                      size="small"
                      fullWidth
                    />
                  </Box>
                  {getPermissionsFromroles(values?.role?.userType).includes(
                    "POS"
                  ) && (
                    <Box
                      sx={{
                        background:
                          theme.palette.mode === "dark" ? "#3d4156" : "#e4e4e4",
                      }}
                      className={classes.store_terminal}
                    >
                      <Typography sx={{ mb: 5 }}>
                        {t("STORE_TERMINALS")}
                      </Typography>
                      {assignedStoresAndTerminals?.length ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleStoreBtnClick}
                        >
                          {`${t("VIEW")}  ${t("STORE_TERMINALS")}`}
                        </Button>
                      ) : (
                        <>
                          {stores?.length > 0 && (
                            <Button
                              sx={{ borderColor: "#A8AAAE" }}
                              variant="outlined"
                              color="secondary"
                              onClick={handleStoreBtnClick}
                            >
                              {`${t("SELECT")}  ${t("STORE_TERMINALS")}`}
                            </Button>
                          )}
                        </>
                      )}
                    </Box>
                  )}
                  <Box className={classes.box}>
                    <div>{t("EXTERNAL_REFERENCE")}</div>
                    <TextField
                      {...register("externalReference")}
                      error={errors?.externalReference?.message as any}
                      helperText={errors?.externalReference?.message}
                      fullWidth
                      inputProps={{ maxLength: 25 }}
                      size="small"
                      placeholder={t("EXTERNAL_REFERENCE") as string}
                    />
                  </Box>
                </TabPanel>
              </TabContext>
              <CommonFormActionButtons
                disabled={userData?.isLoading}
                handleCloseDrawer={handleCloseDrawer}
              />
            </form>
          </div>
        </CommonDrawer>
        <SelectStoreAndTerminals
          assignedStoresAndTerminals={assignedStoresAndTerminals}
          existingStoresAndTerminalsData={existingStoresAndTerminalsData}
          isDialogOpen={openStoreAndTerminalsDialog}
          setAssignedStoresAndTerminals={setAssignedStoresAndTerminals}
          setIsDialogOpen={setOpenStoreAndTerminalsDialog}
          stores={filteredStores}
        />
      </Card>
    </>
  );
};

export default UserMaster;
