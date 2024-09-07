import React, { useEffect, useState } from "react";
import { defaultValues, BatchItem } from "src/types/forms/productsBatchTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import CommonInput from "src/components/common/CommonInput";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import { isValueUnique } from "src/@core/utils/check-unique";
import { AppDispatch, RootState } from "src/store";
import { useSelector } from "react-redux";
import { productSerialNumbersGet } from "src/store/apps/productSerialNumber/productSerialNumber";
import { useDispatch } from "react-redux";

const useStyles = makeStyles({
  formContent: {
    overflow: "auto",
    padding: "16px 24px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
});

const AddSerialNumber: React.FC<any> = (props) => {
  const {
    setOpenDialog,
    serialNumPayload,
    setSerialNumPayload,
    newSerialNumPayload,
    setNewSerialNumPayload,
  } = props;
  const [batchItem, setBatchItem] = useState<BatchItem>(defaultValues);
  const [open, setOpen] = useState<Boolean>(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [setserialNumbers, setSetserialNumbers] = useState<any>([]);

  const dispatch = useDispatch<AppDispatch>();

  const classes = useStyles();

  const addSerialNumberSchema = yup.object().shape({
    serialNumber: yup
      .string()
      .required("REQUIRED")
      .test("unique-code", "Serial Number already exists", function (value) {
        return isValueUnique(setserialNumbers, value, "serialNumber", batchItem);
      }),
  });

  const productSerialNumbersStore: any = useSelector(
    (state: RootState) => state.productSerialNumbersStore
  );
  useEffect(() => {
    setSetserialNumbers(productSerialNumbersStore?.data);
  }, [productSerialNumbersStore?.data]);

  useEffect(() => {
    dispatch(productSerialNumbersGet());
  }, []);

  const {
    reset: addSerialNumberReset,
    control: addSerialNumberControl,
    setValue: addSerialNumberSetValue,
    handleSubmit: handleSubmitAddSerialNumber,
    formState: { errors: addSerialNumberErrors },
    clearErrors: addSerialNumberClearErrors,
  } = useForm({
    defaultValues: { ...batchItem },
    mode: "onChange",
    resolver: yupResolver(addSerialNumberSchema),
  });

  useEffect(() => {
    if (batchItem?.id) {
      addSerialNumberSetValue("serialNumber", batchItem?.serialNumber);
      addSerialNumberSetValue(
        "externalReference",
        batchItem?.externalReference
      );
    }
  }, [batchItem?.id]);

  const handleEditPage = (type: string | undefined) => {
    type === "view" ? setViewOpen(true) : setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpenDialog(false);
    addSerialNumberReset();
    setBatchItem({
      ...defaultValues,
      dateOfManufacture: null,
      shelfLifeExpiryDate: null,
    });
    setOpen(false);
    addSerialNumberClearErrors();
    setBatchItem(defaultValues);
  };

  const onSubmit = async (data: any, event: any) => {
    let res: any;

    let payload: any = {
      active: true,
      serialNumber: data?.serialNumber,
      externalReference: data?.externalReference,
    };
    if (!batchItem.id) {
      setNewSerialNumPayload(payload);
      setSerialNumPayload([...serialNumPayload, payload]);
      setNewSerialNumPayload({});
      // res = await dispatch(productsBatchCreate(payload));
    } else {
      let newpayload: any = { id: batchItem.id, ...payload };
      // res = await dispatch(productBatchUpdate(newpayload));
    }

    handleCloseDrawer();
  
  };

  const onErrors = (data: any) => {
    console.log(data, "addSerialNumberErrors");
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const handleCloseViewDrawer = () => {
    setViewOpen(false);
  };

  const handleSetView = (data: any) => {
    setViewOpen(true);
  };

  return (
    <form key={4} onSubmit={handleSubmitAddSerialNumber(onSubmit, onErrors)}>
      <div className={classes.formContent}>
        <CommonInput
          name="serialNumber"
          id="serialNumber"
          label="Serial Number"
          required={true}
          control={addSerialNumberControl}
          errors={addSerialNumberErrors}
          defaultValue={batchItem.serialNumber}
        />
        <CommonInput
          name="externalReference"
          id="externalReference"
          label="Reference"
          control={addSerialNumberControl}
          errors={addSerialNumberErrors}
          defaultValue={batchItem.externalReference}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <CommonFormActionButtons handleCloseDrawer={handleCloseDrawer} />
      </div>
    </form>
  );
};

export default AddSerialNumber;
