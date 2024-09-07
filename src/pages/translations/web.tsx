import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Card,
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Key } from "src/@core/layouts/utils";
import { hours12 } from "src/@core/utils/format";
import AppStorage from "src/app/AppStorage";
import CommonButton from "src/components/common/CommonButton";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonInputUnderScore from "src/components/common/CommonInputUnderScore";
import TranslationsDataTable from "src/components/translations/TranslationsDataTable";
import { AppDispatch, RootState } from "src/store";
import {
  translationCreate,
  translationUpdate,
  translationsSearch,
} from "src/store/apps/translations/translations";
import { defaultValues } from "src/types/forms/translationAddType";
import * as yup from "yup";

//Styles
import { useStyles } from "src/styles/translation.style";

const web = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [addMoreForm, setAddMoreForm] = useState("close");
  const [errorMsg, setErrorMsg] = useState("hide");
  const [webData, setWebData] = useState([]);

  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { direction } = theme;
  const schema = yup.object().shape({
    nameLang: yup.object().shape({
      en_US: yup.string().required("Field NameLang is Required"),
    }),
    name: yup
      .string()
      .required("Field Name is Required")
      .matches(/^[A-Z][A-Z_]*$/, {
        message:
          "Field Name must contain only uppercase letters and underscores",
        excludeEmptyString: true, // This prevents empty string from triggering the error
        transform: (value: any) => value.replace(/\s/g, "_"), // Replace spaces with underscores
      }),
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
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
    setValue("id", item?.id);
    // setValue("code", item?.code);
    setValue("name", item?.name);
    setValue("nameLang.en_US", item?.nameLang?.en_US);
    setValue("nameLang.ar_SA", item?.nameLang?.ar_SA);
    setValue("nameLang.fr_FR", item?.nameLang?.fr_FR);
  }, [item, setValue]);

  const translationList: any = useSelector(
    (state: RootState) => state.translationsList
  );

  useEffect(() => {
    dispatch(translationsSearch({}));
  }, []);

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
    setWebData(translationList?.data);
  }, [translationList]);

  const handleEditPage = () => {
    setOpen(true);
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };

  const handleCloseDrawer = () => {
    reset();
    setItem(defaultValues);
    clearErrors();
    if (addMoreForm === "close") {
      setOpen(false);
    }
    setAddMoreForm("close");
    setErrorMsg("hide");
  };

  const handleCloseDrawerCancel = () => {
    reset();
    setItem(defaultValues);
    clearErrors();
    setOpen(false);
  };

  const onErrors = (data: any) => {
    console.log(data, "errors...");
    if (data?.nameLang?.en_US) {
      setErrorMsg("show");
    }
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.appType = "web";
    if (!data?.id) {
      res = await dispatch(translationCreate(data));
    } else {
      res = await dispatch(translationUpdate(data));
    }
    handleCloseDrawer();
  
    if (res?.payload?.message) {
      setTimeout(() => {
        AppStorage.removeData("trans-list");
        window.location.reload();
      }, 1800);
    }
  };

  return (
    <Card>
      <TranslationsDataTable
        data={webData}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        isLoading={translationList?.isLoading}
        setItem={setItem}
        item={item}
      />
      <CommonDrawer
        open={open}
        toggle={handleCloseDrawer}
        handleCloseDrawerCancel={handleCloseDrawerCancel}
        widthXS={650}
        addMoreBtn={true}
        widthSM={584}
      >
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={item.id ? t("EDIT_TRANSLATION") : t("NEW_TRANSLATION")}
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            autoComplete="off"
          >
            <div className={classes.formContent}>
              <div>
                {/* <CommonInput
                  name="code"
                  id="code"
                  label="Code"
                  required={true}
                  control={control}
                  errors={errors}
                  defaultValue={item.code}
                /> */}
                <Grid maxWidth={250} xs={6} md={6} lg={6}>
                  <CommonInputUnderScore
                    name="name"
                    id="name"
                    label="Label Name"
                    required={true}
                    control={control}
                    errors={errors}
                    defaultValue={item.name}
                  />
                </Grid>
              </div>
              <Card className={classes.formContent_card}>
                <Card className={classes.formContent_cardContent}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar
                      alt="us-flag"
                      sx={{ width: 38, height: 38, p: 2 }}
                      src="/icons/us.svg"
                    />
                    <Typography variant="body1" style={{ fontSize: "15px" }}>
                      English*
                    </Typography>
                  </Stack>
                  <CommonInput
                    name="nameLang.en_US"
                    id="nameLang.en_US"
                    label="Translation"
                    required={true}
                    control={control}
                    errors={errors}
                    errorMsg={errorMsg}
                    setErrorMsg={setErrorMsg}
                    defaultValue={item?.nameLang?.en_US}
                  />
                  {errorMsg === "show" && (
                    <FormHelperText
                      className={classes.errorMsg}
                      id="validation-schema-first-name"
                    >
                      {t(Key("Field Translation is required"))}
                    </FormHelperText>
                  )}
                </Card>
                <Card className={classes.formContent_cardContent}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar
                      alt="us-flag"
                      sx={{ width: 38, height: 38, p: 2 }}
                      src="/icons/ar.svg"
                    />
                    <Typography variant="body1" style={{ fontSize: "15px" }}>
                      Arabic
                    </Typography>
                  </Stack>
                  <CommonInput
                    name="nameLang.ar_SA"
                    id="nameLang.ar_SA"
                    label="Translation"
                    // required={true}
                    control={control}
                    errors={errors}
                    defaultValue={item.nameLang?.ar_SA}
                  />
                </Card>
                <Card className={classes.formContent_cardContent}>
                  <Stack direction="row" alignItems="center">
                    <Avatar
                      alt="us-flag"
                      sx={{ width: 38, height: 38, p: 2 }}
                      src="/icons/fr.svg"
                    />
                    <Typography variant="body1" style={{ fontSize: "15px" }}>
                      French
                    </Typography>
                  </Stack>
                  <CommonInput
                    name="nameLang.fr_FR"
                    id="nameLang.fr_FR"
                    label="Translation"
                    // required={true}
                    control={control}
                    errors={errors}
                    defaultValue={item.nameLang?.fr_FR}
                  />
                </Card>
              </Card>
            </div>
            {open && (
              <CommonFormActionButtons
                addMoreBtn={false}
                handleCloseDrawer={handleCloseDrawer}
                handleCloseDrawerCancel={handleCloseDrawerCancel}
                setAddMoreForm={setAddMoreForm}
                disabled={translationList?.isLoading}
              />
            )}
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {/* <div className="">
                  <div className={classes.viewContent_label}>{t("CODE")}</div>
                  <div className={classes.viewContent_value}>
                    {selectedViewRecord.code}
                  </div>
                </div> */}
                <div className="">
                  <div className={classes.viewContent_label}>
                    {t("LABEL_NAME")}
                  </div>
                  <div className={classes.viewContent_value}>
                    {selectedViewRecord.name}
                  </div>
                </div>
              </div>

              <div className="">
                <div className={classes.viewContent_label}>{t("ENGLISH")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.nameLang?.en_US}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("ARABIC")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.nameLang?.ar_SA}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>{t("FRANCE")}</div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.nameLang?.fr_FR}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                }}
              >
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
                      selectedViewRecord?.createdByUser?.firstName
                        ? selectedViewRecord?.createdByUser?.firstName
                        : "-"
                    } ${
                      selectedViewRecord?.createdByUser?.lastName
                        ? selectedViewRecord?.createdByUser?.lastName
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
                    {` | ${hours12(selectedViewRecord.createdOn)}`}
                  </div>
                </div>
                <div className="">
                  <div className={classes.viewContent_label}>
                    {t("MODIFIED_BY")}
                  </div>
                  <div className={classes.viewContent_value}>
                    {`${
                      selectedViewRecord?.updatedByUser?.firstName
                        ? selectedViewRecord.updatedByUser?.firstName
                        : "-"
                    } ${
                      selectedViewRecord?.updatedByUser?.lastName
                        ? selectedViewRecord?.updatedByUser?.lastName
                        : ""
                    }`}
                  </div>
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

export default web;
