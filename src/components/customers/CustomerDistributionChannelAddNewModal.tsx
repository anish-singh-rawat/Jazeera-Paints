import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import CommonAddNewModel from "src/components/common/CommonAddNewModel";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { distributionChannelCreate } from "src/store/apps/dimensions/distribution-channel/distribution_channel";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameFormValidator,
} from "src/@core/form-validator";
import { isValueUnique } from "src/@core/utils/check-unique";
import { taxValidateSchema } from "../tax-configuration/business-tax-group/componentConfig";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";

const useStyles = makeStyles({
  formActionSave: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
  formActionCancel: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
});

const CustomerDistributionChannelAddNewModal = (props: any) => {
  const {
    setDialogView,
    distributionChanneldata,
    customerDistributionProp,
    setDistributionIds,
    save,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const [switchActive, setSwitchActive] = useState(true);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const schema = yup.object().shape({
    altName: RevestAltNameFormValidator(
      distributionChanneldata,
      customerDistributionProp
    ),
    name: RevestNameFormValidator(
      distributionChanneldata,
      customerDistributionProp
    ),
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(
          distributionChanneldata,
          customerDistributionProp
        ),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: customerDistributionProp,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      sequenceMappingCodeSearch({ entityType: "DISTRIBUTION_CHANNEL_CODE" })
    );
  }, []);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const onSubmit = async (data: any) => {
    try {
      data.active = switchActive;
      sequenceMapData?.autoGeneration && delete data.code;
      props.setCustomerDistributionProp(data);
      const response = await dispatch(distributionChannelCreate(data) as any);
      setDistributionIds(response?.payload?.id);
      setDialogView(false);
      save((p:any) => ({
        ...p,
        distributionChannel: {
          ...data,
          id: response?.payload?.id,
        },
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") setValue("altName", e?.target?.value);
  };

  return (
    <div>
      <CommonAddNewModel
        title={t(Key("New Distribution Channel"))}
        handleDialogClose={() => setDialogView(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onErrors)}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          onChange={handleChange}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <CommonInput
              name="code"
              id="code"
              label="Distribution Channel Code"
              required={!sequenceMapData?.autoGeneration}
              control={control}
              errors={errors}
              disabled={sequenceMapData?.autoGeneration}
              defaultValue={"Auto Generated"}
            />
            <CommonInput
              name="name"
              id="name"
              label="Distribution Channel Name"
              defaultValue={props.distributionChannel}
              required={true}
              control={control}
              errors={errors}
            />
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <CommonInput
              name="altName"
              id="altName"
              label="Distribution AltName Name"
              required={true}
              control={control}
              errors={errors}
              defaultValue={props.distributionChannel}
            />
            <CommonInput
              name="externalReference"
              id="externalReference"
              label="Reference"
              control={control}
              errors={errors}
            />
          </div>

          <div>
            <div>Status</div>
            <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
              <CommonSwitch
                active={switchActive}
                setActive={setSwitchActive}
                statusChange={() => ({})}
              />{" "}
              {switchActive ? "Active" : "InActive"}
            </div>
          </div>
          {/* <CommonFormActionButtons handleCloseDrawer={() => setDialogView(false)} /> */}
          <div style={{ display: "flex", gap: "16px" }}>
            <Button
              type="submit"
              variant="contained"
              className={classes.formActionSave}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                props.setCustomerDistributionProp({});
                setDialogView(false);
              }}
              className={classes.formActionCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CommonAddNewModel>
    </div>
  );
};

export default CustomerDistributionChannelAddNewModal;
