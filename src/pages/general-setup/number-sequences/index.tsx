import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import { makeStyles } from "@mui/styles";
import CommonInput from "src/components/common/CommonInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { defaultValues } from "src/types/forms/productDivisionTypes";
import CommonSwitch from "src/components/common/CommonSwitch";
import CommonButton from "src/components/common/CommonButton";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { hours12 } from "src/@core/utils/format";
import { useTranslation } from "react-i18next";

// Styles
import { useStyles } from "src/styles/viewEdit.style";
import { getDate } from "src/utils/validationsMethods";
import { RevestCodeFormValidator } from "src/@core/form-validator";
import NumberSequencesDataTable from "src/components/generalSetup/numberSequences/NumberSequencesDataTable";
import NumberSequencesCardDialog from "src/components/generalSetup/numberSequences/DialogboxWithButtonNs";
import { getSequenceSetup, numberSequenceUpdate, sequenceSetupCreate } from "src/store/apps/general-setup/numberSequence";
import { numberSequencefaultValues } from "src/types/forms/legalentity/numberSequences/numberSequencedefaultValues";

const NumberSequences = () => {
  const [groupItem, setGroupItem] = useState(numberSequencefaultValues);
  const [open, setOpen] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState('format'); // Default selected value
  const [numberSequences, setNumberSequence] = useState<any>([]);


  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const numberSequence = useSelector(
    (state: RootState) =>state.numberSequence
    );

    useEffect(() => {
      setNumberSequence(numberSequence?.data);
    }, [numberSequence]);

  const handleRadioChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  useEffect(() => {
    dispatch(getSequenceSetup({}));
    // dispatch(
    //   sequenceMappingCodeSearch({ entityType: "PRODUCT_DIVISION_CODE" })
    // );
  }, []);

  // useEffect(() => {
  //   setProductDivisions(productDivision?.data);
  // }, [productDivision]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const handleEditPage = () => {
    setOpen(true);
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
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

  const schema = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(numberSequence.data, groupItem),
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isNameUnique(numberSequence.data, value);
      }),

    altName: yup
      .string()
      .required()
      .test("unique-altName", "Alt Name already exists", function (value) {
        return isAltNameUnique(numberSequence.data, value);
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

  useEffect(() => {
    setValue("code", groupItem?.code);
    setValue("name", groupItem?.name);
    setValue("altName", groupItem?.altName);
    setValue("largestNum", groupItem?.largestNum);
    setValue("smallestNum", groupItem?.smallestNum);
    setValue("nextSequence", groupItem?.nextSequence);
    setValue("id", groupItem?.id);
    setSwitchActive(groupItem?.active);
  }, [groupItem, setValue]);

  const handleCloseDrawer = () => {
    reset();
    setGroupItem(numberSequencefaultValues);
    setOpen(false);
    clearErrors();
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any;
    data.active = switchActive;

    console.log(data, "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
    

    const payload: Record<string, any> = {
      code: data?.code,
      name: data?.name,
      altName: data?.altName,
      largestNum: data?.largestNum,
      smallestNum: data?.smallestNum,
      nextSequence: data?.nextSequence,
    }

    console.log(payload, "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")

    sequenceMapData?.autoGeneration && !data.id && delete data.code;
    if (!data.id) {
      res = await dispatch(sequenceSetupCreate(payload));
    } else {
      res = await dispatch(numberSequenceUpdate(payload));
    }
    if (res?.payload?.message) {
      handleCloseDrawer();
    }
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  return (
    <Card>
      <NumberSequencesDataTable
        data={numberSequences}
        isLoading={numberSequence.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setGroupItem={setGroupItem}
        groupItem={groupItem}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={
              groupItem.id
                ? t("EDIT_NUMBER_SEQUENCE")
                : t("NEW_NUMBER_SEQUENCE")
            }
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={handleChange}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "70%",
                paddingTop: "15px",
              }}
            >
              <FormControl>
                {t("Select")}
                <RadioGroup row value={selectedValue} onChange={handleRadioChange}>
                  <FormControlLabel
                    value="format"
                    control={<Radio />}
                    label="Format"
                  />
                  <FormControlLabel
                    value="range"
                    control={<Radio />}
                    label="Range"
                  />
                </RadioGroup>
              </FormControl>
            </div>
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
                name="smallestNum"
                id="smallestNum"
                label="Smallest Number"
                required={true}
                control={control}
                errors={errors}
                defaultValue={groupItem.smallestNum}
              />
              <CommonInput
                name="largestNum"
                id="largestNum"
                label="Large Number"
                required={true}
                control={control}
                errors={errors}
                defaultValue={groupItem.largestNum}
              />
              <CommonInput
                name="nextSequence"
                id="nextsequence"
                label="Next Sequence"
                control={control}
                errors={errors}
                defaultValue={groupItem.nextSequence}
              />
              {selectedValue === 'format' && (
              <div>
                <NumberSequencesCardDialog
                  cardHeaderTitle="Format"
                  dialogTitle={t("Attributes")}
                  subTitle={
                    "Assign multiple attributes to the particular header"
                  }
                  //leftListItems={externalPromotionColumn?.data}
                  buttonTitle={"SELECT_PARAMETER"}
                  viewButtonTitle={"VIEW_PARAMETER"}
                  //setDialogData={setDialogData}
                  //item={item}
                  dialogViewTitle={"ASSIGNED_ATTRIBUTES"}
                />
              </div>
              )}
              {selectedValue === 'range' && (
              <div className={classes.radioContainer}>
                <Controller
                  control={control}
                  name={`internalCustomer`}
                  defaultValue={true}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      label={t(`Sequence with zero`)}
                      control={<Checkbox checked={value} onChange={onChange} />}
                    />
                    )}
                    />
                    </div>
              )}

              <div>
                <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
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
              disabled={numberSequence.isLoading}
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
        </div>
      </CommonDrawer>
    </Card>
  );
};

export default NumberSequences;
