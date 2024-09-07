import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper, Button } from "@mui/material";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import { useSelector, useDispatch } from "react-redux";
import {
  posTerminalsCreate,
  posTerminalsUpdate,
  storesDelete,
  storesGetById,
  storesUpdate,
} from "src/store/apps/storeSettings/storeSettings";
import { AppDispatch, RootState } from "src/store";
import { GridCellParams } from "@mui/x-data-grid";
import CommonButton from "src/components/common/CommonButton";
import { Card, FormHelperText } from "@mui/material";
import CommonDrawer from "src/components/common/CommonDrawer";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  customerGroupCreate,
  customerGroupUpdate,
} from "src/store/apps/customers/group/customer_group";
import AppEvent from "src/app/AppEvent";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CustomerGroupDataTable from "src/components/customers/group/CustomerGroupDataTable";
import PosDataTable from "./pos-setup/PosDataTable";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import { defaultValues } from "src/types/forms/storesSettings/posTerminal";
import { useStyles } from "src/styles/viewEdit.style";
import SetupNumberSequence from "./setupNumberSequence";

const PosSetup = (props: any) => {
  //const [groupItem, setGroupItem] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const [terminalItem, setTerminalItem] = useState(defaultValues);
  const [switchActive, setSwitchActive] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState<any>([]);
  const [storeTerminals, setStoreTerminals] = useState<any>([]);
  //const [customerGroups, setCustomerGroups] = useState<any>([]);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [disabled, setDisabled] = useState(false);
  const [openNumberSequenceDialog, setOpenNumberSequenceDialog] =
    useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);

  let statusRes: any;
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const storeId: any = useSelector(
    (state: RootState) => state.storeSettingsStore.dataById?.id
  );

  const storeSettingsStore: any = useSelector(
    (state: RootState) => state.storeSettingsStore
  );

  const storeCreateResponse: any = useSelector(
    (state: RootState) => state.storeSettingsStore.res
  );

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  // useEffect(() => {
  //   setCustomerGroups(customerGroup?.data);
  // }, [customerGroup]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  useEffect(() => {
    if (storeId) {
      dispatch(storesGetById({ id: storeId }));
    }
  }, [storeId, dispatch]);

  useEffect(() => {
    // Accessing the specific part of the Redux state
    const storeDataById = storeSettingsStore.dataById;

    // Check if storeDataById has the storeTerminals data and update the state
    if (storeDataById && storeDataById.storeTerminalsMapping) {
      setStoreTerminals(storeDataById.storeTerminalsMapping);
    } else {
      setStoreTerminals([]);
    }
  }, [storeSettingsStore.dataById]);
  // if(storeSettingsStore?.dataById.storeTerminalsMapping){
  //   console.log([...storeSettingsStore.dataById.storeTerminalsMapping])
  // }
  const schema: any = yup.object().shape({
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : yup
          .string()
          .required("REQUIRED")
          .min(2, "CODE_MUST_BE_AT_LEAST_TWO_CHARACTERS")
          .max(6, "CODE_MUST_BE_AT_MOST_SIX_CHARACTERS")
          .matches(/^[a-zA-Z0-9]+$/, "CODE_MUST_BE_ALPHANUMERIC"),
    name: yup
      .string()
      .required("REQUIRED")
      .min(1, "Name must be at least 1 character")
      // .max(25, "Name can be at most 25 characters")
      .matches(/^[ A-Za-z0-9_@./#&+-]+$/, "Name must be alphanumeric only"),
  });

  const handleEditPage = async (id: string) => {
    setOpen(true);
    statusRes?.payload?.message ? setDisabled(false) : setDisabled(true);
    setValue(
      "code",
      sequenceMapData?.autoGeneration ? t("AUTO_GENERATED") : ""
    );
  };

  const selectedRecord = (data: any) => {
    setSelectedViewRecord(data);
    setViewOpen(true);
  };

  // const showErrors: any = (field: string, valueLen: number, min: number) => {
  //   if (valueLen === 0) {
  //     return `${field} field is required`;
  //   }
  //   else if (valueLen > 0 && valueLen < min) {
  //     return `${field} must be at least ${min} characters`;
  //   } else {
  //     return "";
  //   }
  // };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: storeTerminals,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue(
      "code",
      sequenceMapData?.autoGeneration && !terminalItem?.id
        ? "Auto Generated"
        : terminalItem?.code
    );
    setValue("name", terminalItem?.name);
    setValue("altName", terminalItem?.altName);
    setValue("createdBy", terminalItem?.createdBy);
    setValue("createdOn", new Date(terminalItem?.createdOn).toLocaleString());
    setValue("updatedBy", terminalItem?.updatedBy);
    setValue("updatedOn", new Date(terminalItem?.updatedOn).toLocaleString());
    setValue("id", terminalItem?.id);
    setSwitchActive(terminalItem?.active);
    setIsDisabled(terminalItem?.status === "pending");
  }, [terminalItem, setValue]);

  const handleCloseDrawer = () => {
    setOpen(false);
    reset();
    setTerminalItem(defaultValues);
    clearErrors();
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  const onSubmit = async (data: any, event: any) => {
    event.preventDefault();
    let res: any = {};

    // Get storeId from the Redux store
    let id = "";
    if (storeSettingsStore.dataById.id) {
      id = storeSettingsStore.dataById.id;
    } else {
      id = storeSettingsStore.res.id;
    }
    const storeId = id;
    let terminalPayload = { ...data };

    if (sequenceMapData?.autoGeneration) {
      delete terminalPayload.code;
    } else {
      // If code is manually entered, ensure it's included in the payload
      terminalPayload.code = data.code;
    }

    if (!data.id) {
      // Creating a new terminal
      res = await dispatch(posTerminalsCreate(terminalPayload));

      if (res?.payload?.id) {
        const newTerminal = res.payload;

        // Add the newly created terminal to the existing list
        setStoreTerminals((prevTerminals: any) => [
          ...prevTerminals,
          newTerminal,
        ]);

        // Prepare the storeTerminalsMapping for the second API call
        const updatedTerminalsMapping = [
          ...storeTerminals,
          {
            id: newTerminal.id, // This might be a new mapping ID from your backend
            storeId: storeId,
            terminalId: newTerminal.id,
            active: true,
            status: true,
          },
        ];

        // Second API call to update the store with new terminal mapping
        await dispatch(
          storesUpdate({
            id: storeId,
            posTerminals: updatedTerminalsMapping,
            code: terminalPayload.code,
          })
        );
        await dispatch(storesGetById({ id: storeId }));

        // Emit success message
        AppEvent.messageEmit({
          type: "success",
          message: "Updated successfully.",
        });
      }
    } else {
      // Updating an existing terminal
      terminalPayload.id = storeTerminals.id;
      res = await dispatch(posTerminalsUpdate(data));

      if (res?.payload) {
        // Update the existing list with the updated terminal
        const updatedTerminals = storeTerminals;
        await dispatch(
          storesUpdate({
            id: storeId,
            posTerminals: updatedTerminals,
            code: terminalPayload.code,
          })
        );
        setStoreTerminals(updatedTerminals);
        await dispatch(storesGetById({ id: storeId }));
      }
    }

    handleCloseDrawer();
  };
  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  const activationDate = new Date(terminalItem.createdOn); // Replace with actual date object

  // Format the date
  const formattedActivationDate = activationDate
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", " |");

  const handleNumberSequenceBtnClick = () => {
    setOpenNumberSequenceDialog(true);
  };

  return (
    <Card>
      <PosDataTable
        data={storeTerminals}
        //isLoading={customerGroup.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setTerminalItem={setTerminalItem}
        terminalItem={terminalItem}
        // storeId={storeId}
        // changeLanguage={changeLanguage}
      />

      {/* Edit Record inside Drawer */}
      <CommonDrawer open={open} toggle={handleCloseDrawer}>
        <div className={classes.drawerWrapper}>
          <CommonDrawerHeader
            title={terminalItem.id ? t("EDIT_POS") : t("NEW_POS")}
            handleClose={handleCloseDrawer}
          />
          <form
            className={classes.form}
            onSubmit={handleSubmit(onSubmit, onErrors)}
            onChange={handleChange}
          >
            <div className={classes.formContent}>
              {terminalItem.id && (
                <Box className={classes.pos_setup}>
                  <Box padding={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography variant="subtitle2" gutterBottom>
                          Terminal ID
                        </Typography>
                        <Typography variant="subtitle1">
                          {/* {terminalId} */}
                          {terminalItem.terminalNum}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="subtitle2" gutterBottom>
                          Activated on
                        </Typography>
                        <Typography variant="subtitle1">
                          {/* {activatedOn} */}
                          {/* {formattedActivationDate} */}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
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
                defaultValue={terminalItem.name}
              />

              <CommonInput
                name="altName"
                id="altName"
                label="Alternate Name"
                required={true}
                control={control}
                errors={errors}
                defaultValue={terminalItem.altName}
              />
              {terminalItem.id && (
                <div>
                  {/* <div style={{ marginLeft: "-12px", marginTop: "-8px" }}> */}
                  <CommonInput
                    name="device"
                    id="deviceType"
                    label="Device Type"
                    required={false}
                    control={control}
                    errors={errors}
                    defaultValue={terminalItem.deviceType}
                    disabled
                  />
                  <CommonInput
                    name="deviceos"
                    id="deviceOs"
                    label="Device OS"
                    required={false}
                    control={control}
                    errors={errors}
                    defaultValue={terminalItem.deviceOS}
                    disabled={true}
                  />
                  <CommonInput
                    name="devicebrand"
                    id="deviceBrand"
                    label="Device Brand"
                    required={false}
                    control={control}
                    errors={errors}
                    defaultValue={terminalItem.deviceBrand}
                    disabled={true}
                  />
                  <CommonInput
                    name="imei"
                    id="imei"
                    label="IMEI"
                    required={false}
                    control={control}
                    errors={errors}
                    defaultValue={terminalItem.imeiNumber}
                    disabled={true}
                  />
                  <Box className={classes.pos_setup}>
                    <Typography sx={{ mb: 5 }}>
                      {t("NUMBER_SEQUENCE")}
                    </Typography>
                    <Button
                      sx={{ borderColor: "#A8AAAE" }}
                      variant="outlined"
                      color="secondary"
                      onClick={handleNumberSequenceBtnClick}
                    >
                      {`${t("SETUP_NUMBER_SEQUENCE")}`}
                    </Button>
                  </Box>
                  <Box
                    component={"div"}
                    style={{ width: "100%" }}
                    display={"flex"}
                    flexDirection={"column"}
                  >
                    {t("STATUS")}
                    <Box>
                      <CommonSwitch
                        active={switchActive}
                        setActive={setSwitchActive}
                        statusChange={() => ({})}
                        disabled={isDisabled}
                      />
                      {switchActive ? t("ACTIVE") : t("INACTIVE")}
                    </Box>
                  </Box>
                  {/* </div> */}
                </div>
              )}
            </div>
            <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              //disabled={customerGroup.isLoading}
            />
          </form>
        </div>
      </CommonDrawer>
      <SetupNumberSequence
        // data={storeSettingsStore?.posterminalsGetById}
        isDialogOpen={openNumberSequenceDialog}
        setIsDialogOpen={setOpenNumberSequenceDialog}
      />
    </Card>
  );
};

export default PosSetup;
