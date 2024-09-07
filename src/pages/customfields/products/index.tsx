import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Box, Card, Typography } from "@mui/material";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import { makeStyles } from "@mui/styles";
import CommonInput from "src/components/common/CommonInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { defaultValues } from "src/types/forms/customFields/customFieldsTypes";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { t } from "i18next";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";
import { Tab, Tabs } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import {
  customFieldsSearch,
  customFieldsCreate,
  customFieldsUpdate,
  customFieldsDataTypes,
} from "src/store/apps/custom-fields/custom_fields";
import CustomFieldsDataTable from "src/components/custom-fields/customers/CustomFieldsDataTable";
import MuiTabList, { TabListProps } from "@mui/lab/TabList";
import { styled } from "@mui/material/styles";
import CommonSelect from "src/components/common/CommonSelect";
import text from "src/components/custom-fields/render-fields/Text";
import CustomList from "src/components/custom-fields/render-fields/List";
import toggle from "src/components/custom-fields/render-fields/Toggle";
import float from "src/components/custom-fields/render-fields/Float";
import date from "src/components/custom-fields/render-fields/Date";
import email from "src/components/custom-fields/render-fields/Email";
import longText from "src/components/custom-fields/render-fields/LongText";
import address from "src/components/custom-fields/render-fields/Address";
import phoneNumber from "src/components/custom-fields/render-fields/PhoneNumber";
import numberInput from "src/components/custom-fields/render-fields/NumberInput";
import CustomFieldsTranslationTable from "src/components/custom-fields/customers/TranslationTable";

// ** Third Party Components
import { EditorState, ContentState } from "draft-js";

const useStyles = makeStyles({
  drawerWrapper: {
    height: "100vh",
  },
  form: {
    height: "auto",
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  stylePad?: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, stylePad, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
      style={{ height: "calc(100% - 48px)" }}
    >
      {value === index && (
        <div style={{ padding: stylePad || "24px", height: "100%" }}>
          <Typography component={"span"}>{children}</Typography>
        </div>
      )}
    </div>
  );
}

const Products = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [selectedFieldType, setSelectedFieldType] = useState("");
  const [required, setRequired] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [searchable, setSearchable] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [selectedOption, setSelectedOption] = useState([]);

  const [numberOfRows, setNumberOfRows] = useState<number>(
    item?.listOfValues1 ? item?.listOfValues1.length : 1
  );

  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  let statusRes: any;
  const [tabValue, setTabValue] = useState<string>("1");

  const customFields: any = useSelector(
    (state: RootState) => state.customFields
  );

  useEffect(() => {
    dispatch(customFieldsSearch({ entityType: "product" }));
  }, []);

  const handleEditPage = () => {
    setOpen(true);
    dispatch(customFieldsDataTypes({}));
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
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

  let schema: any = (selectedType: string) => {
    let newSchema: any;
    switch (selectedType) {
      case "TEXT":
      case "FLOAT":
        newSchema = yup.object().shape({
          name: yup
            .string()
            .required()
            .min(3, (obj) => showErrors("Name", obj.value.length, obj.min)),
          fieldTypes: yup.object({
            code: yup.string().when("selectedOptions", {
              is: true,
              then: yup.string().required("code required"),
              otherwise: yup.string(),
            }),
          }),
          minLenth: yup.string().required(),
          maxLength: yup.string().required(),
        });

        return newSchema;
      case "LONG_TEXT":
        newSchema = yup.object().shape({
          name: yup
            .string()
            .required()
            .min(3, (obj) => showErrors("Name", obj.value.length, obj.min)),
          fieldTypes: yup.object({
            code: yup.string().when("selectedOptions", {
              is: true,
              then: yup.string().required("code required"),
              otherwise: yup.string(),
            }),
          }),
          minLenth: yup.string().required(),
          maxLength: yup.string().required(),
        });

        return newSchema;
      case "EMAIL":
      case "PHONE_NUMBER":
      case "NUMBER_INPUT":
      case "ADDRESS":
      case "NUMBER":
      case "TOGGLE":
      case "LIST":
      case "DATE":
        newSchema = yup.object().shape({
          name: yup
            .string()
            .required()
            .min(3, (obj) => showErrors("Name", obj.value.length, obj.min)),
          fieldTypes: yup.object({
            code: yup.string().when("selectedOptions", {
              is: true,
              then: yup.string().required("code required"),
              otherwise: yup.string(),
            }),
          }),
        });

        return newSchema;

      default:
        newSchema = yup.object().shape({
          name: yup
            .string()
            .required()
            .min(3, (obj) => showErrors("Name", obj.value.length, obj.min)),
          fieldTypes: yup.object({
            code: yup.string().required("code required"),
          }),
        });

        return newSchema;
    }
  };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    register,
    resetField,
    getValues,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: item,
    mode: "onChange",
    resolver: yupResolver(schema(selectedFieldType)),
  });

  useEffect(() => {
    setValue("code", item?.code);
    setValue("name", item?.name);
    setValue("altName", item?.altName);
    setValue("fieldTypes", item?.fieldTypes);
    setValue("id", item?.id);
    setValue("nameLang.en_US", item?.nameLang?.en_US);
    setValue("nameLang.ar_SA", item?.nameLang?.ar_SA);
    setValue("nameLang.fr_FR", item?.nameLang?.fr_FR);
    setValue("minLenth", item && item?.minLenth);
    setValue("maxLength", item && item?.maxLength);
    setValue("defaultValue", item?.defaultValue);
    setValue("regularExpression", item?.regularExpression);
    setValue("multiSelect", item?.multiSelect);
    setValue("visible", item?.visible);
    setValue("required", item?.required);
    setValue("searchable", item?.searchable);
    setSwitchActive(item?.active);
    item && setSelectedFieldType(item && item?.fieldTypes?.code);
    // const contentState = ContentState.createFromText(item?.defaultValue);
    // const newEditorState = EditorState.createWithContent(contentState);
    // newEditorState && setEditorState(newEditorState);
  }, [item, setValue]);

  // let longTextValueData = {};

  const handleCloseDrawer = () => {
    setOpen(false);
    setSelectedFieldType("");
    clearErrors();
    setItem(defaultValues);
    reset();
    setTabValue("1");
  };

  useEffect(() => {
    if (selectedFieldType?.length && !item?.id) {
      clearErrors();
      setItem(defaultValues);
      reset();
    }
  }, [selectedFieldType]);

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const changeLanguage: any = AppStorage.getData("lang");

  const onSubmit = async (data: any, event: any) => {
    handleCloseDrawer();
    let arr: any = [];
    let arrAlt: any = [];
    let arrValue: any = [];
    let arrAltValue: any = [];
    let res: any = {};

    if (data.optionValue0) {
      const fieldsMap = Object.keys(data);
      const fieldsMap1 = Object.values(data);
      function myFunction(item: any, index: any) {
        if (item.includes("optionValue")) {
          arr.push(index);
        }
      }
      function myFunction1(item: any, index: any) {
        if (arr.includes(index)) {
          item && arrValue.push(item);
        }
      }

      fieldsMap.forEach(myFunction);
      fieldsMap1.forEach(myFunction1);

      data.listOfValues1 = arrValue;
    }

    if (data.optionAltValue0) {
      const fieldsMap = Object.keys(data);
      const fieldsMap1 = Object.values(data);
      function myFunction(item: any, index: any) {
        if (item.includes("optionAltValue")) {
          arrAlt.push(index);
        }
      }
      function myFunction1(item: any, index: any) {
        if (arrAlt.includes(index)) {
          item && arrAltValue.push(item);
        }
      }

      fieldsMap.forEach(myFunction);
      fieldsMap1.forEach(myFunction1);

      data.listOfValues2 = arrAltValue;
    }

    data.active = switchActive;
    data.entityType = "product";
    data.fieldType = data?.fieldTypes?.code;
    if (selectedOption || data?.id) {
      data.fieldTypes = selectedOption;
    }

    if (!data.id) {
      res = await dispatch(customFieldsCreate(data));
    } else {
      res = await dispatch(customFieldsUpdate(data));
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

  const handleChange = useCallback(
    (event: any, newValue: any) => {
      setTabValue(newValue);
    },
    [setTabValue]
  );

  const Fields = (props: any) => {
    const {
      selectedFieldType,
      control,
      errors,
      item,
      setValue,
      setRequired,
      required,
      longTextValue,
      setLongTextValue,
      setLText,
      lText,
      editorState,
      setEditorState,
      ...other
    } = props;
    switch (selectedFieldType) {
      case "TEXT":
        return text({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
          setVisible: setVisible,
          visible: visible,
          setRequired: setRequired,
          required: required,
          setSearchable: setSearchable,
          searchable: searchable,
        });
      case "LIST":
        return (
          <CustomList
            control={control}
            errors={errors}
            item={item}
            setValue={setValue}
            numberOfRows={numberOfRows}
            setNumberOfRows={setNumberOfRows}
          />
        );
      case "TOGGLE":
        return toggle({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
        });
      case "NUMBER":
        return float({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
        });
      case "DATE":
        return date({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
        });
      case "EMAIL":
        return email({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
        });
      case "LONG_TEXT":
        return longText({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
          editorState: editorState,
          setEditorState: setEditorState,
        });
      case "ADDRESS":
        return address({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
        });
      case "PHONE_NUMBER":
        return phoneNumber({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
        });
      case "NUMBER_INPUT":
        return numberInput({
          control: control,
          errors: errors,
          item: item,
          setValue: setValue,
        });
      default:
        return null;
    }
  };

  let id: any;

  const handleFormValuesChange = (e: any) => {
    clearTimeout(id);
    if (e.target.name === "maxLength" && getValues("maxLength").length > 0) {
      id = setTimeout(() => {
        if (Number(getValues("maxLength")) < Number(getValues("minLenth"))) {
          resetField("minLenth");
          setError("minLenth", {
            type: "custom",
            message: "minLength should be  less than Maxlength",
          });
        }
      }, 2000);
    }
  };

  const CommonSelectComponent = useCallback(
    () => (
      <CommonSelect
        name="fieldTypes"
        setSelectedFieldType={setSelectedFieldType}
        options={customFields?.dataTypes}
        control={control}
        label={"Format"}
        placeholder={"select type"}
        validateForm={{}}
        required={true}
        errors={errors}
        setValue={setValue}
        defaultValue={
          item?.id
            ? item?.fieldTypes
            : selectedFieldType
            ? selectedOption
            : null
        }
        noOptionsText={false}
        clearErrors={clearErrors}
        disabled={item?.id ? true : false}
        setSelectedOption={setSelectedOption}
      />
    ),
    [
      setSelectedFieldType,
      control,
      errors,
      setValue,
      item,
      clearErrors,
      customFields,
    ]
  );

  return (
    <Card>
      <CustomFieldsDataTable
        data={searchEnabled ? filteredData : customFields.data}
        searchEnabled={searchEnabled}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        item={item}
        isLoading={customFields.isLoading}
        changeLanguage={changeLanguage}
        setSelectedOption={setSelectedOption}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer
        open={open}
        toggle={handleCloseDrawer}
        widthXS={330}
        widthSM={794}
      >
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={item.id ? t("EDIT_CUSTOM_FILED") : t("NEW_CUSTOM_FILED")}
            handleClose={handleCloseDrawer}
            noBorder={true}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={(e) => handleFormValuesChange(e)}
          >
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
                  <Tab value="1" label={t("FIELD")} />
                  <Tab value="2" label={t("TRANSLATIONS")} />
                </Tabs>
              </TabList>

              <TabPanel value={tabValue} index={"1"} stylePad={"none"}>
                <Box
                  style={{
                    display: "flex",
                    gap: "20px",
                    padding: "0 30px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ width: "50%" }}>{CommonSelectComponent()}</div>
                  <div style={{ width: "50%" }}>
                    <CommonInput
                      name="name"
                      id="name"
                      label="Name"
                      required={true}
                      control={control}
                      errors={errors}
                      defaultValue={item.name}
                    />
                  </div>
                </Box>

                <Fields
                  selectedFieldType={selectedFieldType}
                  setSelectedFieldType={setSelectedFieldType}
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  item={item}
                  setVisible={setVisible}
                  visible={visible}
                  setRequired={setRequired}
                  required={required}
                  setSearchable={setSearchable}
                  searchable={searchable}
                  editorState={editorState}
                  setEditorState={setEditorState}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={"2"} stylePad={"none"}>
                <CustomFieldsTranslationTable
                  data={item.payload}
                  control={control}
                  errors={errors}
                  searchEnabled={searchEnabled}
                  selectedRecord={selectedRecord}
                  handleEditPage={handleEditPage}
                  setItem={setItem}
                  item={item.payload}
                  isLoading={customFields.isLoading}
                  changeLanguage={changeLanguage}
                />
              </TabPanel>
            </TabContext>
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              disabled={customFields?.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>
    </Card>
  );
};

export default React.memo(Products);
