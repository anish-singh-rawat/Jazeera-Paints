import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Icon from "src/@core/components/icon";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CommonSwitch from "../common/CommonSwitch";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import TableContainer from "@mui/material/TableContainer";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
} from "@mui/material";
import {
  generalHeaders,
  advanceHeaders,
  financialHeaders,
  additionalInfoHeaders,
  dropDowns,
} from "../../utils/checkItemAvailable";
import {
  customerProfiledefaultValues,
  getProfileValues,
  translation,
} from "src/types/forms/customerProfileTypes";
import CommonInput from "../common/CommonInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { customerGroupSearch } from "src/store/apps/customers/group/customer_group";
import {
  fetchCustomerTypes,
  fetchCustomerGroup,
  fetchCustomerClass,
  fetchDistributionChannel,
  fetchCustomerDivision,
  fetchParentCustomer,
  fetchSalesman,
  fetchCustomerStatus,
  fetchPaymentTerms,
  fetchPriceList,
  fetchCurrency,
  fetchTax,
  fetchBasicTaxSearch,
  fetchBasicTaxGroup,
  fetchCity,
  fetchCountry,
  fetchRegion,
  fetchDistrict,
  fetchCustomerGender,
} from "src/store/apps/customers";
import { fetchBasicTaxdropdownchannel } from "src/store/apps/customer_dropdown/customer_dropdown";
import { customerClassSearch } from "src/store/apps/customers/customers-class/customer_class";
import { customerDivisionSearch } from "src/store/apps/dimensions/customer-division/customer_division";
import { distributionChannelSearch } from "src/store/apps/dimensions/distribution-channel/distribution_channel";
import {
  customerProfilesCreate,
  customerProfilesUpdate,
} from "src/store/apps/customer-profile/customer_profile";
import AppEvent from "src/app/AppEvent";
import { customFieldsSearch } from "src/store/apps/custom-fields/custom_fields";
import { ageGroupOptions } from "src/constants/customer/customerConstants";

const useStyles = makeStyles({
  textHeading: {
    fontSize: "18px !important",
    fontWeight: 400,
  },
  headerbuttons: {
    height: "60px",
    backgroundColor: "#F2F2F2",
    borderRadius: "6px",
    marginBottom: "10px !important",
    padding: "0px 20px !important",
  },
  profileBox: {
    backgroundColor: "#F2F2F2",
  },
  Accordion: {
    margin: "10px 15px !important",
    width: "95% !important",
    "& #panel1a-header, #panel2a-header, #panel3a-header, #panel4a-header ": {
      display: "flex !important",
      alignItems: "center !important",
      justifyContent: "flex-end !important",
      flexDirection: "row-reverse !important",
      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(-90deg) !important",
        transition:
          "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important",
      },
    },
    "& .MuiAccordionSummary-content": {
      margin: "10px 10px !important",
      flexGrow: "0 !important",
    },
  },
  profileName: {
    margin: "10px",
    background: "#f2f2f2",
    borderRadius: "6px",
    width: "auto",
  },
  inputField: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    "& .MuiInputBase-input": {
      padding: "10px",
      backgroundColor: "white !important",
      borderRadius: "6px !important",
    },
  },
  accordianGroup: {
    margin: "10px",
    background: "#f2f2f2",
    width: "auto",
    borderRadius: "6px",
  },
  viewButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f2f2f2",
    margin: "10px",
    borderRadius: "6px",
  },
  heading: {
    fontWeight: "400 !important",
    fontSize: "15px !important",
    color: "#868686",
  },
  headingValue: {
    fontWeight: "600",
    fontSize: "15px important",
  },
  accordianTable: {
    "& thead": {
      background: "#eeeeee !important",
    },
    "& .MuiTableCell-root": {
      textTransform: "capitalize",
      fontWeight: "bold",
      fontSize: "12px",
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
});

interface CustomerProfileAccordianProps {
  toggle: string;
  setToggle: Function;
  selectedRow: any;
  setSelectedRecord: Function;
  isLoading: boolean;
}

interface CustomerProfileSettingsAttributes {
  customerProfileSettingsId: number;
  defaultValues: string;
  field: string;
  id: number;
  isEnable: boolean;
  isMandatory: boolean;
  isVisible: boolean;
  uuid: string;
}

interface selectOptionValuesTypes {
  altName?: string;
  code?: string;
  id?: string;
  name?: string;
  uuid?: string;
  firstName?: string;
}

const CustomerProfileAccordian = ({
  toggle,
  setToggle,
  selectedRow,
  setSelectedRecord,
  isLoading,
}: CustomerProfileAccordianProps) => {
  const [switchActive, setSwitchActive] = useState<boolean>(true);
  const additionalFields = useSelector(
    (state: RootState) => state.customFields
  );

  const changeLanguage: any = localStorage.getItem("i18nextLng");

  let fields = getProfileValues(additionalFields);

  const [profileValues, setProfileValues] = useState({
    ...fields,
    ...customerProfiledefaultValues,
  });

  const defaultValue: selectOptionValuesTypes = {
    altName: "",
    code: "",
    id: "",
    name: "",
    uuid: "",
    firstName: "",
  };

  const [selected, setSelected] = useState<any>({
    city: defaultValue,
    country: defaultValue,
    region: defaultValue,
    district: defaultValue,
    customertype: defaultValue,
    customergroup: defaultValue,
    customerclass: defaultValue,
    distributionchannel: defaultValue,
    customerdivision: defaultValue,
    parentcustomer: defaultValue,
    salesman: defaultValue,
    status: defaultValue,
    //businesstaxgroup: defaultValue,
    basictax: defaultValue,
    paymentterms: defaultValue,
    pricelist: defaultValue,
    currency: defaultValue,
    gender: defaultValue,
    ageGroup: defaultValue,
  });

  const dispatch = useDispatch<AppDispatch>();

  const store: any = useSelector((state: RootState) => state.customers);
  const customerDropdown: any = useSelector(
    (state: RootState) => state.customerdropdown
  );

  const classes = useStyles();

  const { t } = useTranslation();

  useEffect(() => {
    if (selectedRow?.id) {
      setSwitchActive(selectedRow?.active);
      let selectedProfile: any = {};
      let selectedDropdowns: any = {};

      selectedRow?.customerProfileSettingsAttributes?.map(
        (item: CustomerProfileSettingsAttributes | any) => {
          selectedProfile[`${item?.field}`] = item;
          if (dropDowns.includes(item?.field)) {
            selectedDropdowns[`${item?.field}`] = item.defaultValues;
          }
        }
      );

      setSelected({
        ...selectedDropdowns,
      });

      setProfileValues({
        ...profileValues,
        ...selectedProfile,
      });
      setValue("profileName", selectedRow?.profileName);
    }
  }, [selectedRow?.id]);

  useEffect(() => {
    dispatch(customerGroupSearch({}));
    dispatch(customerClassSearch({}));
    dispatch(customerDivisionSearch({}));
    dispatch(distributionChannelSearch({}));
    dispatch(fetchCustomerTypes({}));
    dispatch(fetchCustomerGroup());
    dispatch(fetchCustomerClass());
    dispatch(fetchDistributionChannel());
    dispatch(fetchCustomerDivision());
    dispatch(fetchParentCustomer({ searchItem: "" }));
    dispatch(fetchSalesman());
    dispatch(fetchCustomerStatus({}));
    dispatch(fetchPaymentTerms());
    dispatch(fetchPriceList());
    dispatch(fetchCurrency());
    dispatch(fetchTax());
    dispatch(fetchBasicTaxGroup());
    dispatch(fetchCountry());
    dispatch(customFieldsSearch({ entityType: "customer" }));
    dispatch(fetchCustomerGender({}));
    dispatch(fetchBasicTaxdropdownchannel());
  }, []);

  const schema = yup.object().shape({
    profileName: yup
      .string()
      .required("Profile Name is required")
      .min(2, "Profile Name be at least 2 characters")
      .max(20, "Profile Name can be at most 20 characters"),
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      profileName: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    let res: any = {};
    let payload: any = {
      profileName: data?.profileName,
      altName: "",
      active: switchActive,
      customerProfileAttributes: Object.values(profileValues)?.map(
        (item: any) => {
          return {
            ...item,
            defaultValues:
              item?.field === "agegroup"
                ? item?.defaultValues?.name
                : item?.defaultValues?.id
                ? String(item?.defaultValues?.id)
                : "",
          };
        }
      ),
    };

    if (selectedRow?.id) {
      payload = { ...payload, customerProfileSettingsId: selectedRow?.id };
      res = await dispatch(customerProfilesUpdate(payload));
    } else {
      res = await dispatch(customerProfilesCreate(payload));
    }

    setProfileValues({
      ...customerProfiledefaultValues,
    });

    setToggle("");
    setSelectedRecord({});
    reset();
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  const handleStatusChange = (header: string, field: string) => {
    const obj = {
      ...profileValues?.[header],
      [field]: !profileValues?.[header]?.[field],
    };

    setProfileValues({
      ...profileValues,
      [header]: obj,
    });
  };

  const handleSelect = (data: any | null, type: string) => {
    const obj = {
      ...profileValues?.[type],
      defaultValues: data ? data : "",
    };

    setProfileValues({
      ...profileValues,
      [type]: obj,
    });

    setSelected({
      ...selected,
      [type]: data ? data : defaultValue,
    });

    switch (type) {
      case "country": {
        data && dispatch(fetchRegion({ countryId: data?.id }));
        break;
      }
      case "region": {
        data &&
          dispatch(
            fetchCity({
              countryId: selected?.country?.id,
              regionId: data?.id,
            })
          );
        break;
      }
      case "city": {
        data &&
          dispatch(
            fetchDistrict({
              countryId: selected?.country?.id,
              regionId: selected?.region?.id,
              cityId: data.id,
            })
          );
        break;
      }
    }
  };

  const renderDropDown = (type: string, list = false, option = []) => {
    if (list) {
      return (
        <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
          <Autocomplete
            size="small"
            classes={{
              option: classes.option,
              popper: classes.popper,
            }}
            value={selected[type] ?? ""}
            disabled={toggle === "view"}
            options={option ?? []}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option ?? ""}
                </li>
              );
            }}
            onChange={(e, value) => handleSelect(value, type)}
            getOptionLabel={(option: any) => option ?? ""}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
        </FormControl>
      );
    }

    let isDropDown = dropDowns.includes(type);

    let options: any = {
      city: store?.cities ?? [],
      country: store?.countries ?? [],
      region: store?.region ?? [],
      district: store?.districts ?? [],
      customertype: store?.customerType ?? [],
      customergroup: store?.customerGroup ?? [],
      customerclass: store?.customerClass ?? [],
      distributionchannel: store?.distributionChannel ?? [],
      customerdivision: store?.customerDivision ?? [],
      parentcustomer: store?.parentCustomer ?? [],
      salesman: store?.salesman ?? [],
      status: store?.customerStatus ?? [],
      //businesstaxgroup: store?.tax ?? [],
      basictax: store?.basicTax ?? [],
      //businesstaxgroup: customerDropdown?.BasicTax ?? [],
      paymentterms: store?.paymentTerms ?? [],
      pricelist: store?.priceList ?? [],
      currency: store?.currency ?? [],
      agegroup: ageGroupOptions,
      gender: store.customerGender ?? [],
    };

    if (isDropDown || list) {
      return (
        <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
          <Autocomplete
            size="small"
            classes={{
              option: classes.option,
              popper: classes.popper,
            }}
            value={selected[type] ?? ""}
            disabled={toggle === "view"}
            options={options?.[type] ?? []}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {changeLanguage === "en-US"
                    ? option?.name ?? ""
                    : option?.altName ||
                      option?.name ||
                      option?.firstName ||
                      ""}
                </li>
              );
            }}
            onChange={(e, value) => handleSelect(value, type)}
            getOptionLabel={(option: any) =>
              changeLanguage === "en-US"
                ? option?.name ?? ""
                : option?.altName || option?.name || option?.firstName || ""
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
        </FormControl>
      );
    }

    return null;
  };

  const renderCheckBox = (header: string, check: boolean, field: string) => {
    return toggle === "view" ? (
      <Icon icon={`${check ? "tabler:check" : "tabler:x"}`} fontSize={20} />
    ) : (
      <CommonSwitch
        active={check}
        statusChange={() => handleStatusChange(header, field)}
      />
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onErrors)}>
        {(toggle === "edit" || toggle === "add") && (
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            className={classes.headerbuttons}
          >
            <Grid item xs={6}>
              <Typography className={classes.textHeading}>
                {toggle === "add"
                  ? t("NEW_CUSTOMER_PROFILE")
                  : t("EDIT_CUSTOMER_PROFILE")}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ float: "right !important" }}>
                <Button
                  sx={{ mr: 2 }}
                  variant="outlined"
                  onClick={() => {
                    setSelectedRecord({});
                    setToggle("");
                  }}
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  {t("SAVE")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
        <Card sx={{ minHeight: "450px !important" }}>
          {(toggle === "add" || toggle === "edit") && (
            <Grid
              alignItems={"center"}
              gap={3}
              className={classes.profileName}
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <>
                <Grid item xs={4}>
                  <div className={classes.inputField}>
                    <CommonInput
                      defaultValue={selectedRow?.profileName}
                      name="profileName"
                      id="profileName"
                      label={t("PROFILE_NAME") as string}
                      required={true}
                      control={control}
                      errors={errors}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className={classes.inputField}>
                    <label>{t("STATUS")}</label>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormControlLabel
                        control={
                          <CommonSwitch
                            active={switchActive}
                            statusChange={() => setSwitchActive(!switchActive)}
                          />
                        }
                        label={switchActive ? t("ACTIVE") : t("INACTIVE")}
                      />
                    </FormControl>
                  </div>
                </Grid>
              </>
            </Grid>
          )}
          {toggle === "view" && (
            <div className={classes.viewButtons}>
              <Box sx={{ p: 2, display: "flex" }}>
                <Box sx={{ m: 2 }} component="span">
                  <span className={classes.heading}>{t("NAME")}</span> <br></br>
                  <span className={classes.headingValue}>
                    {selectedRow?.profileName}
                  </span>{" "}
                  <br></br>
                </Box>
                <Box sx={{ m: 2 }} component="span">
                  <span className={classes.heading}>{t("STATUS")}</span>{" "}
                  <br></br>
                  <span className={classes.headingValue}>{"ACTIVE"}</span>{" "}
                  <br></br>
                </Box>
              </Box>
              <Button
                sx={{ mr: 5 }}
                variant="outlined"
                onClick={() => setToggle("")}
              >
                {t("BACK")}
              </Button>
            </div>
          )}
          {/* Accordians */}
          <Grid
            className={classes.accordianGroup}
            container
            direction="column"
            alignItems="flex-start"
          >
            <Accordion className={classes.Accordion}>
              <AccordionSummary
                expandIcon={<Icon icon="tabler:chevron-right" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="subtitle1">{t("GENERAL")}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.accordianTable}
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell width={200}>{t("FIELDS")}</TableCell>
                        <TableCell>{t("VISIBLE")}</TableCell>
                        <TableCell>{t("MANDATORY")}</TableCell>
                        <TableCell>{t("DEFAULT_VALUE")}</TableCell>
                        <TableCell>{t("EDITABLE")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(generalHeaders).map((header: string) => {
                        let title = t(translation?.[header]);
                        let visible = profileValues?.[header]?.["isVisible"];
                        let mandotary =
                          profileValues?.[header]?.["isMandatory"];
                        let editable = profileValues?.[header]?.["isEnable"];
                        return (
                          <TableRow
                            key={header}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>{title}</TableCell>
                            <TableCell>
                              {renderCheckBox(header, visible, "isVisible")}
                            </TableCell>
                            <TableCell>
                              {renderCheckBox(header, mandotary, "isMandatory")}
                            </TableCell>
                            <TableCell>{renderDropDown(header)}</TableCell>
                            <TableCell>
                              {renderCheckBox(header, editable, "isEnable")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.Accordion}>
              <AccordionSummary
                expandIcon={<Icon icon="tabler:chevron-right" />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography variant="subtitle1">{t("ADVANCED")}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.accordianTable}
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell width={200}>{t("FIELDS")}</TableCell>
                        <TableCell>{t("VISIBLE")}</TableCell>
                        <TableCell>{t("MANDATORY")}</TableCell>
                        <TableCell>{t("DEFAULT_VALUE")}</TableCell>
                        <TableCell>{t("EDITABLE")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(advanceHeaders).map((header: string) => {
                        let title = t(translation?.[header]);
                        let visible = profileValues?.[header]?.["isVisible"];
                        let mandotary =
                          profileValues?.[header]?.["isMandatory"];
                        let editable = profileValues?.[header]?.["isEnable"];
                        return (
                          <TableRow
                            key={header}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>{title}</TableCell>
                            <TableCell>
                              {renderCheckBox(header, visible, "isVisible")}
                            </TableCell>
                            <TableCell>
                              {renderCheckBox(header, mandotary, "isMandatory")}
                            </TableCell>
                            <TableCell>{renderDropDown(header)}</TableCell>
                            <TableCell>
                              {renderCheckBox(header, editable, "isEnable")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.Accordion}>
              <AccordionSummary
                expandIcon={<Icon icon="tabler:chevron-right" />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography variant="subtitle1">{t("FINANCIAL")}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.accordianTable}
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell width={200}>{t("FIELDS")}</TableCell>
                        <TableCell>{t("VISIBLE")}</TableCell>
                        <TableCell>{t("MANDATORY")}</TableCell>
                        <TableCell>{t("DEFAULT_VALUE")}</TableCell>
                        <TableCell>{t("EDITABLE")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(financialHeaders).map((header: string) => {
                        let title = t(translation?.[header]);
                        let visible = profileValues?.[header]?.["isVisible"];
                        let mandotary =
                          profileValues?.[header]?.["isMandatory"];
                        let editable = profileValues?.[header]?.["isEnable"];
                        return (
                          <TableRow
                            key={header}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>{title}</TableCell>
                            <TableCell>
                              {renderCheckBox(header, visible, "isVisible")}
                            </TableCell>
                            <TableCell>
                              {renderCheckBox(header, mandotary, "isMandatory")}
                            </TableCell>
                            <TableCell>{renderDropDown(header)}</TableCell>
                            <TableCell>
                              {renderCheckBox(header, editable, "isEnable")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.Accordion}>
              <AccordionSummary
                expandIcon={<Icon icon="tabler:chevron-right" />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography variant="subtitle1">
                  {t("ADDITIONAL_FIELDS")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.accordianTable}
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell width={200}>{t("FIELDS")}</TableCell>
                        <TableCell>{t("VISIBLE")}</TableCell>
                        <TableCell>{t("MANDATORY")}</TableCell>
                        <TableCell>{t("DEFAULT_VALUE")}</TableCell>
                        <TableCell>{t("EDITABLE")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {additionalFields?.data?.map((item: any) => {
                        const name = item?.name;

                        let visible = profileValues?.[name]?.["isVisible"];
                        let mandotary = profileValues?.[name]?.["isMandatory"];
                        let editable = profileValues?.[name]?.["isEnable"];
                        return (
                          <TableRow
                            key={name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>{name}</TableCell>
                            <TableCell>
                              {renderCheckBox(name, visible, "isVisible")}
                            </TableCell>
                            <TableCell>
                              {renderCheckBox(name, mandotary, "isMandatory")}
                            </TableCell>
                            <TableCell>
                              {renderDropDown(
                                name,
                                item?.fieldType === "LIST",
                                item?.listOfValues1
                              )}
                            </TableCell>
                            <TableCell>
                              {renderCheckBox(name, editable, "isEnable")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Card>
      </form>
    </>
  );
};

export default CustomerProfileAccordian;
