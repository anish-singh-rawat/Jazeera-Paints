import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "src/store";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import CommonAddNewModel from "src/components/common/CommonAddNewModel";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import { useSelector } from "react-redux";
import { customerGroupCreate } from "src/store/apps/customers/group/customer_group";
import { taxValidateSchema } from "../tax-configuration/business-tax-group/componentConfig";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameFormValidator,
} from "src/@core/form-validator";
import * as yup from "yup";

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

interface customerGroupdata {
  id: number;
  name: string;
  altName: string;
}
const CustomerGroupAddNewModal = (props: any) => {
  const {
    setDialogView,
    customerGroupdata,
    customerGroupProp,
    setGroupIds,
    save,
  } = props;
  const classes = useStyles();

  const [switchActive, setSwitchActive] = useState(true);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const schema = yup.object().shape({
    altName: RevestAltNameFormValidator(customerGroupdata, customerGroupProp),
    name: RevestNameFormValidator(customerGroupdata, customerGroupProp),
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(customerGroupdata, customerGroupProp),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: customerGroupProp,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(sequenceMappingCodeSearch({ entityType: "CUSTOMER_GROUP_CODE" }));
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
      props.setCustomerGroupProp(data);
      const response = await dispatch(customerGroupCreate(data) as any);
      setGroupIds(response?.payload?.id);
      setDialogView(false);
      save((p:any) => ({
        ...p,
        customerGroup: {
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
        title="New Customer Group"
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
              label="Group Code"
              required={!sequenceMapData?.autoGeneration}
              control={control}
              errors={errors}
              disabled={sequenceMapData?.autoGeneration}
              defaultValue={"Auto Generated"}
            />
            <CommonInput
              name="name"
              id="name"
              label="Group Name"
              defaultValue={props.customerGroup}
              required={true}
              control={control}
              errors={errors}
            />
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <CommonInput
              name="altName"
              id="altName"
              required={true}
              label="Group Alternate Name"
              defaultValue={props.customerGroup}
              control={control}
              errors={errors}
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
                props.setCustomerGroupProp({});
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

export default CustomerGroupAddNewModal;
