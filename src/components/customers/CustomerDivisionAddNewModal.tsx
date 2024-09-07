import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import CommonAddNewModel from "src/components/common/CommonAddNewModel";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  RevestAltNameFormValidator,
  RevestCodeFormValidator,
  RevestNameFormValidator,
} from "src/@core/form-validator";
import { customerDivisionCreate } from "src/store/apps/dimensions/customer-division/customer_division";
import { taxValidateSchema } from "../tax-configuration/business-tax-group/componentConfig";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
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

interface customerDivisionDatas {
  id: number;
  name: string;
  altName: string;
}

const CustomerDivisionAddNewModal = (props: any) => {
  const {
    setDialogView,
    customerDivisionProp,
    customerDivisionData,
    setDidvisionIds,
    save
  } = props;
  const classes = useStyles();
  const [switchActive, setSwitchActive] = useState(true);
  const [sequenceMapData, setSequenceMapData] = useState<any>([]);

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const schema = yup.object().shape({
    altName: RevestAltNameFormValidator(
      customerDivisionData,
      customerDivisionProp
    ),
    name: RevestNameFormValidator(customerDivisionData, customerDivisionProp),
    code: sequenceMapData?.autoGeneration
      ? yup.string()
      : RevestCodeFormValidator(customerDivisionData, customerDivisionProp),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: customerDivisionProp,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      sequenceMappingCodeSearch({ entityType: "CUSTOMER_DIVISION_CODE" })
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
      props.setCustomerDivisionProp(data);
      const response = await dispatch(customerDivisionCreate(data) as any);
      setDidvisionIds(response?.payload?.id);
      setDialogView(false);
      save((p:any) => ({
        ...p,
        customerDivision: {
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
        title="New Division"
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
              label="Division Code"
              required={!sequenceMapData?.autoGeneration}
              control={control}
              errors={errors}
              disabled={sequenceMapData?.autoGeneration}
              defaultValue={"Auto Generated"}
            />
            <CommonInput
              name="name"
              id="name"
              label="Division Name"
              defaultValue={props.customerDivision}
              required={true}
              control={control}
              errors={errors}
            />
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <CommonInput
              name="altName"
              id="altName"
              label="Division Alternate Name"
              required={true}
              defaultValue={props.customerDivision}
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
                props?.setCustomerDivisionProp({});
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

export default CustomerDivisionAddNewModal;
