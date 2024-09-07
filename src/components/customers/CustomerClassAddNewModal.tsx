import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import CommonAddNewModel from "src/components/common/CommonAddNewModel";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import { customerClassCreate } from "src/store/apps/customers/customers-class/customer_class";
import CircularProgress from "@mui/material/CircularProgress";
import { taxValidateSchema } from "../tax-configuration/business-tax-group/componentConfig";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameFormValidator,
} from "src/@core/form-validator";

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

const CustomerClassAddNewModal = (props: any) => {
  const {
    setDialogView,
    submitCustomerClass,
    customerClassdata,
    customerProp,
    setClassIds,
    save,
  } = props;
  const classes = useStyles();
  const [switchActive, setSwitchActive] = useState(true);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);
  const [isLoading, setIsloading] = useState(false);

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const schema = yup.object().shape({
    altName: RevestAltNameFormValidator(customerClassdata, customerProp),
    name: RevestNameFormValidator(customerClassdata, customerProp),
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(customerClassdata, customerProp),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: customerProp,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  interface customerClassdatas {
    id: number;
    name: string;
    altName: string;
  }

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(sequenceMappingCodeSearch({ entityType: "CUSTOMER_CLASS_CODE" }));
  }, []);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const onSubmit = async (data: any) => {
    try {
      data.active = switchActive;
      sequenceMapData?.autoGeneration && delete data.code;
      props.setCustomerProp(data);
      const response = await dispatch(customerClassCreate(data) as any);
      setClassIds(response?.payload?.id);
      setDialogView(false);
      save((p: any) => ({
        ...p,
        customerClass: {
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
        title="New Customer Class"
        handleDialogClose={() => setDialogView(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onErrors)}
          onChange={handleChange}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <CommonInput
              name="code"
              id="code"
              label="Class Code"
              required={!sequenceMapData?.autoGeneration}
              control={control}
              errors={errors}
              disabled={sequenceMapData?.autoGeneration}
              defaultValue={
                !sequenceMapData?.autoGeneration ? "Auto Generation" : ""
              }
            />
            <CommonInput
              name="name"
              id="name"
              label="Class Name"
              defaultValue={props.customerClass}
              required={true}
              control={control}
              errors={errors}
            />
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <CommonInput
              name="altName"
              id="altName"
              label="Class Alternate Name"
              required={true}
              control={control}
              errors={errors}
              defaultValue={props.customerClass}
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
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                props.setCustomerProp({});
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

export default CustomerClassAddNewModal;
