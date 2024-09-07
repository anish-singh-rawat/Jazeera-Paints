import { yupResolver } from "@hookform/resolvers/yup";
import { t } from "i18next";
import { SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { axiosInstance } from "src/configs/axios";
import { RootState } from "src/store";
import { useStyles } from "src/styles/viewEdit.style";
import CommonDrawer from "../common/CommonDrawer";
import CommonDrawerHeader from "../common/CommonDrawerHeader";
import CommonFormActionButtons from "../common/CommonFormActionButtons";
import CommonInput from "../common/CommonInput";
import CommonSwitch from "../common/CommonSwitch";
import { buildAttributeUrl, schema } from "./utils";

interface AttributesFormProps {
  readonly isOpenDrawer: boolean;
  readonly handleCloseDrawer: () => void;
  readonly isEdit: boolean;
  readonly attributeValue: any;
  readonly currentAttributeDataSet: any;
  readonly setIsNewLoading: React.Dispatch<SetStateAction<boolean>>;
  readonly tabId: any;
  readonly attributeType: "Product" | "Customer";
  readonly attributeSuccessCallback: () => void;
  readonly isNewLoading: boolean;
}
export default function AttributesForm({
  handleCloseDrawer,
  isOpenDrawer,
  isEdit,
  attributeValue,
  currentAttributeDataSet,
  setIsNewLoading,
  tabId,
  attributeType,
  attributeSuccessCallback,
  isNewLoading,
}: AttributesFormProps) {
  const classes = useStyles();
  const [switchActive, setSwitchActive] = useState(true);
  const [sequenceMapData, setSequenceMapData] = useState<any>({});

  const sequenceMappingCode: any = useSelector(
    (state: RootState) => state.sequenceMappingCode
  );

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: attributeValue,
    mode: "onChange",
    resolver: yupResolver(
      schema(
        currentAttributeDataSet,
        attributeValue,
        sequenceMapData?.autoGeneration
      )
    ),
  });

  const generatePaylaod = (data: any) => {
    const payload: any = {};
    Object.keys(data).map((key: any) => {
      if ((typeof data[key] === "number" && data[key] >= 0) || data[key]) {
        payload[key] = data[key];
      }
    });
    payload["active"] = switchActive;
    if (isEdit) {
      payload["id"] = attributeValue?.id;
    }
    sequenceMapData?.autoGeneration && !payload.id && delete payload?.code;
    return payload;
  };

  const onSubmit = async (data: any) => {
    setIsNewLoading(true);
    let payload = generatePaylaod(data);

    try {
      const response = await axiosInstance[isEdit ? "patch" : "post"](
        buildAttributeUrl(attributeType, tabId),
        payload
      );
      setIsNewLoading(false);
      if (!response.data?.error) {
        attributeSuccessCallback();
        reset();
        clearErrors();
      }
    } catch (e) {
      console.log(e, "error while adding attribute");
      setIsNewLoading(false);
    }
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  useEffect(() => {
    setValue("code", attributeValue?.code);
    setValue("name", attributeValue?.name);
    setValue("altName", attributeValue?.altName);
    setValue("externalReference", attributeValue?.externalReference);
    setSwitchActive(attributeValue?.active);
  }, [
    attributeValue?.code,
    attributeValue?.active,
    attributeValue?.name,
    attributeValue?.altName,
    attributeValue?.externalReference,
  ]);

  useEffect(() => {
    setSequenceMapData(sequenceMappingCode?.data);
  }, [sequenceMappingCode]);

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  const handleToggleDrawer = () => {
    clearErrors();
    reset();
    handleCloseDrawer();
  };

  return (
    <CommonDrawer open={isOpenDrawer} toggle={handleToggleDrawer}>
      <div className={classes.drawerWrapper}>
        <CommonDrawerHeader
          title={isEdit ? t("EDIT") : t("NEW_ATTRIBUTE")}
          handleClose={handleToggleDrawer}
        />
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit, onErrors)}
          onChange={handleChange}
        >
          <div className={classes.formContent}>
            <CommonInput
              name="code"
              id="code"
              label="CODE"
              required={!sequenceMapData?.autoGeneration}
              control={control}
              errors={errors}
              disabled={sequenceMapData?.autoGeneration}
              defaultValue={attributeValue?.code}
              placeholder={
                sequenceMapData?.autoGeneration ? "Auto Generated" : ""
              }
            />
            <CommonInput
              name="name"
              id="name"
              label="NAME"
              required={true}
              control={control}
              errors={errors}
              defaultValue={attributeValue?.name}
            />

            <CommonInput
              name="altName"
              id="altName"
              label="ALTERNATE_NAME"
              required={true}
              control={control}
              errors={errors}
              defaultValue={attributeValue?.altName}
            />
            <CommonInput
              name="externalReference"
              id="externalReference"
              label="REFERENCE"
              control={control}
              errors={errors}
              defaultValue={attributeValue?.externalReference}
            />
            <div>
              <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                <CommonSwitch
                  active={switchActive}
                  setActive={setSwitchActive}
                  statusChange={() => ({})}
                />
                {switchActive ? t("ACTIVE") : t("INACTIVE")}
              </div>
            </div>
          </div>
          <CommonFormActionButtons
            handleCloseDrawer={handleToggleDrawer}
            disabled={isNewLoading}
          />
        </form>
      </div>
    </CommonDrawer>
  );
}
