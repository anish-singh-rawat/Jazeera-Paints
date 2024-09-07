import { yupResolver } from "@hookform/resolvers/yup";
import { analyseSVGStructure } from "@iconify/tools";
import {
  Box,
  Card,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RevestCodeFormValidator } from "src/@core/form-validator";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSelect from "src/components/common/CommonSelect";
import CommonSwitch from "src/components/common/CommonSwitch";
import CataloguesMasterDataTable from "src/components/products/cataloguesMaster/CataloguesMasterDataTable";
import { RootState } from "src/store";
import { useStyles } from "src/styles/viewEdit.style";
import { defaultValues } from "src/types/forms/productDivisionTypes";
import * as yup from "yup";

const CataloguesMaster = () => {
  const [groupItem, setGroupItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [productDivisions, setProductDivisions] = useState<any>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [switchActive, setSwitchActive] = useState(true);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const classes = useStyles();
  const { t } = useTranslation();

  const handleCloseDrawer = () => {
    // reset();
    setGroupItem(defaultValues);
    setOpen(false);
    // clearErrors();
  };

  const productDivision: any = useSelector(
    (state: RootState) => state.productDivision
  );

  const handleEditPage = () => {
    setOpen(true);
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
  };

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(productDivision.data, groupItem),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isNameUnique(productDivision.data, value);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isAltNameUnique(productDivision.data, value);
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
    defaultValues: groupItem,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const showErrors: any = (field: string, valueLen: number, min: number) => {
    if (valueLen === 0) {
      return `${field} field is required`;
    }
    // else if (valueLen > 0 && valueLen < min) {
    //   return `${field} must be at least ${min} characters`;
    // } else {
    //   return "";
    // }
  };

  const isNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item
    if (!groupItem.id) {
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      let unique = data.some((item: any) => {
        const lowercaseItemName = item.name.toLowerCase();
        const uppercaseItemName = item.name.toUpperCase();
        return (
          lowercaseItemName === lowercaseValue ||
          uppercaseItemName === uppercaseValue
        );
      });
      return !unique;
    }
    // When editing an existing item, check for uniqueness among other records
    const currentItem = data.find((record: any) => record.id === groupItem.id);
    if (!currentItem) {
      return true; // The current item doesn't exist in the data, so it's effectively unique.
    }
    const matchingItem = data.find((record: any) => {
      const lowercaseItemName = record.name.toLowerCase();
      const uppercaseItemName = record.name.toUpperCase();
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      return (
        (lowercaseItemName === lowercaseValue ||
          uppercaseItemName === uppercaseValue) &&
        record.id !== groupItem.id
      );
    });
    return !matchingItem;
  };

  const isAltNameUnique = (data: any, value: any) => {
    // Check for uniqueness only when creating a new item

    if (!groupItem.id) {
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      let unique = data.some((item: any) => {
        const lowercaseItemAltName = item?.altName?.toLowerCase();
        const uppercaseItemAltName = item?.altName?.toUpperCase();
        return (
          lowercaseItemAltName === lowercaseValue ||
          uppercaseItemAltName === uppercaseValue
        );
      });
      return !unique;
    }
    // When editing an existing item, check for uniqueness among other records
    const currentItem = data.find((record: any) => record.id === groupItem.id);
    if (!currentItem) {
      return true; // The current item doesn't exist in the data, so it's effectively unique.
    }
    const matchingItem = data.find((record: any) => {
      const lowercaseItemAltName = record?.altName?.toLowerCase();
      const uppercaseItemAltName = record?.altName?.toUpperCase();
      const lowercaseValue = value.toLowerCase();
      const uppercaseValue = value.toUpperCase();
      return (
        (lowercaseItemAltName === lowercaseValue ||
          uppercaseItemAltName === uppercaseValue) &&
        record.id !== groupItem.id
      );
    });
    return !matchingItem;
  };

  const isCodeUnique = (data: any, value: any) => {
    // When editing an existing item
    if (groupItem.id) {
      // Check if there's another record with the same code and a different ID
      const matchingItem = data.find((record: any) => {
        return record.code === value && record.id !== groupItem.id;
      });
      // If a matching item is found, it's not unique
      return !matchingItem;
    }

    // When creating a new item, check if the code is unique among all records
    return !data.some((record: any) => record.code === value);
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  // const onSubmit = async (data: any, event: any) => {
  //   let res: any;
  //   data.active = switchActive;
  //   sequenceMapData?.autoGeneration && !data.id && delete data.code;
  //   if (!data.id) {
  //     res = await dispatch(productDivisionCreate(data));
  //   } else {
  //     res = await dispatch(productDivisionUpdate(data));
  //   }
  //   if (res?.payload?.message) {
  //     handleCloseDrawer();
  //   }
  //   AppEvent.messageEmit({
  //     type: res?.payload?.message ? "success" : "error",
  //     message: res?.payload?.message
  //       ? res?.payload?.message
  //       : res?.payload?.error?.message,
  //   });
  // };

  return (
    <Card>
      <CataloguesMasterDataTable
        data={productDivisions}
        // isLoading={productDivision.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        //setGroupItem={setGroupItem}
        //groupItem={groupItem}
      />
      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              groupItem.id
                ? t("EDIT_PRODUCT_CATALOGUES")
                : t("NEW_PRODUCT_CATALOGUES")
            }
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            // onSubmit={handleSubmit(onSubmit, onErrors)}
            // onChange={handleChange}
          >
            <div className={classes.formContent}>
              <CommonInput
                name="code"
                id="code"
                label="Code"
                required={!sequenceMapData?.autoGeneration}
                control={control}
                errors={errors}
                disabled={sequenceMapData?.autoGeneration}
                defaultValue={"Auto Generated"}
              />
              <CommonInput
                name="name"
                id="name"
                label="Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={groupItem.name}
              />

              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={groupItem.altName}
              />

              <Grid item md={6}>
                <CommonSelect
                  id={"SERVICE_TYPE"}
                  control={control}
                  required={true}
                  customText={true}
                  clearErrors={clearErrors}
                  disabled={false}
                  defaultValue={""}
                  errors={errors}
                  //func={setItemNameToAdd}
                  // handleModel={() => {
                  //   setOpenCreateNewOptionModal(true);
                  //   setFieldID("BRAND");
                  //   setTitle("BRAND");
                  // }}
                  label={"Service type"}
                  name="Service type"
                  noOptionsText={true}
                  options={["Independent", "Associate"]}
                  //options={productDropdown.productbrands ?? []}
                  placeholder={t("ASSOCIATE")}
                  validateForm={{}}
                  setSelectedFieldType={""}
                  setValue={setValue}
                  sx={{ width: 300 }}
                />
              </Grid>

              <CommonInput
                name="externalReference"
                id="externalReference"
                label="Reference"
                control={control}
                errors={errors}
                defaultValue={groupItem.externalReference}
              />

              <div>
                <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                  {/* <span style={{ marginRight: 8 }}>Status:</span> Label added here */}
                  {groupItem?.id ? (
                    <CommonSwitch
                      active={switchActive}
                      setActive={setSwitchActive}
                      statusChange={() => setSwitchActive(!switchActive)}
                    />
                  ) : (
                    <CommonSwitch
                      active={switchActive}
                      setActive={setSwitchActive}
                      statusChange={() => {}}
                    />
                  )}
                  {switchActive ? t("ACTIVE") : t("INACTIVE")}
                </div>
              </div>
            </div>

            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              // disabled={productDivision.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>

      <CommonDrawer
        open={viewOpen}
        toggle={viewToggle}
        // styles={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
      >
        <div className={classes.drawerWrapper}>
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
                <div className={classes.viewContent_label}>
                  {t("REFERENCE")}
                </div>
                <div className={classes.viewContent_value}>
                  {selectedViewRecord.externalReference}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("CREATED_ON")}
                </div>
                <div className={classes.viewContent_value}>
                  {/* {getDate(selectedViewRecord.createdOn)}
                  {` | ${hours12(selectedViewRecord.createdOn)}`} */}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
                  {t("CREATED_BY")}
                </div>
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
                  {/* {getDate(selectedViewRecord.updatedOn)}
                  {` | ${hours12(selectedViewRecord.updatedOn)}`} */}
                </div>
              </div>
              <div className="">
                <div className={classes.viewContent_label}>
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
              {/* <CommonButton
                variant="contained"
                label={t("DOWNLOAD")}
                handleButton={() => {}}
              /> */}
            </div>
          </div>
        </div>
      </CommonDrawer>
    </Card>
  );
};

export default CataloguesMaster;
