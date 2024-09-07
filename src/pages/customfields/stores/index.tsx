import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Card } from "@mui/material";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import { makeStyles } from "@mui/styles";
import CommonInput from "src/components/common/CommonInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { defaultValues } from "src/types/forms/customFields/customFieldsTypes";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonButton from "src/components/common/CommonButton";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { hours12 } from "src/@core/utils/format";
import { t } from "i18next";
import AppEvent from "src/app/AppEvent";
import AppStorage from "src/app/AppStorage";
import {
  customFieldsSearch,
  customFieldsCreate,
  customFieldsUpdate,
} from "src/store/apps/custom-fields/custom_fields";
import CustomFieldsDataTable from "src/components/custom-fields/customers/CustomFieldsDataTable";
import CustomFieldsHeader from "src/components/custom-fields/customers/CustomFieldsHeader";

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

const Stores = () => {
  const [item, setItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);

  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  let statusRes: any;

  const customFields: any = useSelector(
    (state: RootState) => state.customFields
  );

  useEffect(() => {
    dispatch(customFieldsSearch({ entityType: "stores" }));
  }, []);

  const searchCustomFieldsData = (searchValue: string) => {
    let filterData: any = customFields?.data?.filter((ele: any) => {
      if (
        ele["name"]?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        ele["altName"]?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        ele["code"]?.toLowerCase()?.includes(searchValue?.toLowerCase())
      ) {
        return ele;
      }
    });
    if (searchValue) {
      setSearchEnabled(true);
    } else setSearchEnabled(false);
    setFilteredData(filterData);
  };

  const handleEditPage = () => {
    setOpen(true);
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
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

  const schema = yup.object().shape({
    name: yup.string().required(),
    // .min(3, (obj) => showErrors("Name", obj.value.length, obj.min)),
    altName: yup.string().required(),
    // .min(3, (obj) => showErrors("Last Name", obj.value.length, obj.min))
    code: yup.string().required(),
    // .min(6, (obj) => showErrors("Customer Code", obj.value.length, obj.min))
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

  useEffect(() => {
    setValue("code", item?.code);
    setValue("name", item?.name);
    setValue("altName", item?.altName);
    setValue("externalReference", item?.externalReference);
    setValue("createdBy", item?.createdBy);
    setValue("createdOn", new Date(item?.createdOn).toLocaleString());
    setValue("updatedBy", item?.updatedBy);
    setValue("updatedOn", new Date(item?.updatedOn).toLocaleString());
    setValue("id", item?.id);
    setSwitchActive(item?.active);
  }, [item, setValue]);

  const handleCloseDrawer = () => {
    reset();
    setItem(defaultValues);
    setOpen(false);
    clearErrors();
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  // function for Date formate
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

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const changeLanguage: any =
    AppStorage.getData("lang") || localStorage.getItem("i18nextLng");

  const onSubmit = async (data: any, event: any) => {
    let res: any = {};
    data.active = switchActive;
    if (!data.id) {
      res = await dispatch(customFieldsCreate(data));
    } else {
      res = await dispatch(customFieldsUpdate(data));
    }
    handleCloseDrawer();
  };
  return (
    <Card>
      <CustomFieldsHeader
        data={customFields}
        searchCustomFieldsData={searchCustomFieldsData}
        handleEditPage={handleEditPage}
        disabled={true}
      />
      <CustomFieldsDataTable
        data={searchEnabled ? filteredData : customFields.data}
        searchEnabled={searchEnabled}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setItem={setItem}
        item={item}
        isLoading={customFields.isLoading}
        changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={item.id ? t("EDIT_CUSTOMER_DIVISION") : t("NEW_DIVISION")}
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
          >
            <div className={classes.formContent}>
              <CommonInput
                name="code"
                id="code"
                label="Code"
                required={true}
                control={control}
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
              {/* {!item.id && (
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
              )} */}
              {item.id && (
                <>
                  {/* <div>
                   
                    <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                      <CommonSwitch
                        active={switchActive}
                        // setActive={
                        //   statusRes?.payload?.error?.message ? "" : setSwitchActive
                        // }
                        // checkSuccess={true}
                        statusChange={async () => {
                          const data = {
                            id: item?.id,
                          };
                          statusRes = await dispatch(
                            customerDivisionToggle(data)
                          );
                          AppEvent.messageEmit({
                            type: statusRes?.payload?.message
                              ? "success"
                              : "error",
                            message: statusRes?.payload?.message
                              ? statusRes?.payload?.message
                              : statusRes?.payload?.error?.message,
                          });
                          setSwitchActive(
                            statusRes?.payload?.message ? !switchActive : true
                          );
                        }}
                      />
                      {switchActive ? t("ACTIVE") : t("INACTIVE")}
                    </div>
                  </div> */}
                  <CommonInput
                    name="createdOn"
                    id="createdOn"
                    label="Created date time"
                    control={control}
                    errors={errors}
                    defaultValue={new Date(item.createdOn).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="createdBy"
                    id="createdBy"
                    label="Created By"
                    control={control}
                    errors={errors}
                    defaultValue={item.createdBy}
                    disabled={true}
                  />

                  <CommonInput
                    name="updatedOn"
                    id="updatedOn"
                    label="Modified date time"
                    control={control}
                    errors={errors}
                    defaultValue={new Date(item.updatedOn).toUTCString()}
                    disabled={true}
                  />
                  <CommonInput
                    name="updatedBy"
                    id="updatedBy"
                    label="Modified By"
                    control={control}
                    errors={errors}
                    defaultValue={item.updatedBy}
                    disabled={true}
                  />
                </>
              )}
            </div>
            <CommonFormActionButtons handleCloseDrawer={handleCloseDrawer} />
          </form>
        </div>
      </CommonDrawer>

      <CommonDrawer
        open={viewOpen}
        toggle={viewToggle}
        // styles={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 500 } } }}
      >
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
              <div className={classes.viewContent_label}>{t("REFERENCE")}</div>
              <div className={classes.viewContent_value}>
                {selectedViewRecord.externalReference}
              </div>
            </div>
            <div className="">
              <div className={classes.viewContent_label}>{t("CREATED_ON")}</div>
              <div className={classes.viewContent_value}>
                {getDate(selectedViewRecord.createdOn)}
                {` | ${hours12(selectedViewRecord.createdOn)}`}
              </div>
            </div>
            <div className="">
              <div className={classes.viewContent_label}>{t("CREATED_BY")}</div>
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
                {" "}
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
      </CommonDrawer>
    </Card>
  );
};

export default Stores;
