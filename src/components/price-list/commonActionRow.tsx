import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Tooltip } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Icon from "src/@core/components/icon";
import * as yup from "yup";
import ResponsiveDialog from "../common/CommonDialog";
import EditaddProductModal from "./editaddProductModal";

export const dateConvert = (str: string) => {
  if (!String(str).includes("/")) return str;
  const date = str.split("/");
  return new Date(date[2], parseInt(date[1]) - 1, date[0]);
};

const CommonActionRow = ({
  row,
  data,
  onDelete,
  setEditedProducts,
  setData,
  updateOneRow,
}: any) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { t } = useTranslation();
  const [switchActive, setSwitchActive] = useState<boolean>(row?.active);
  const [conversion, setConversion] = useState<boolean>(row?.conversion);

  const schema = yup.object().shape({
    price: yup
      .number()
      .required("Price is required")
      .min(
        yup.ref("minimumPrice"),
        "Price must be greater than or equal to Minimum Price"
      ),
    minimumPrice: yup
      .number()
      .required("Minimum Price is required")
      .max(
        yup.ref("price"),
        "Minimum Price must be less than or equal to Price"
      ),
    startDate: yup.date().required("Start Date is required"),
    endDate: yup.date().required().typeError("please enter a valid date"),
  });
  const {
    reset,
    control,
    setValue,
    formState: { errors },
    clearErrors,
    getValues,
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      minimumPrice: row?.minimumPrice,
      price: row?.price,
      startDate: moment(row?.startDate).format("DD/MM/YYYY"),
      endDate: moment(row?.endDate).format("DD/MM/YYYY"),
    },
    mode: "all",
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const handleSubmits = (id: any) => {
    let eDate: any = getValues()["endDate"] ?? row.endDate;
    let sDate: any = getValues()["startDate"] ?? row.startDate;
    const price = getValues()["price"] ?? row?.price;
    const minimumPrice = getValues("minimumPrice") ?? row.minimumPrice;

    if (Object.keys(errors).length) return;

    if (!(eDate instanceof Date)) eDate = dateConvert(eDate);

    if (!(sDate instanceof Date)) sDate = dateConvert(sDate);

    setData((data: any) =>
      data.map((val: any) => {
        if (id == val?.id || id == val?.productId) {
          return {
            ...val,
            endDate: eDate,
            startDate: sDate,
            active: switchActive,
            conversion,
            price: Number(price),
            minimumPrice: Number(minimumPrice),
          };
        } else {
          return val;
        }
      })
    );
    setEditedProducts((prev: (string | number)[]) => [...prev, id]);
    setIsOpenModal(false);
    updateOneRow({
      ...row,
      endDate: eDate,
      startDate: sDate,
      active: switchActive,
      conversion,
      price: Number(price),
      minimumPrice: Number(minimumPrice),
    });
  };

  return (
    <div style={{ cursor: "pointer" }}>
      <Tooltip title={t("EDIT")}>
        <Button color="secondary">
          <Icon
            icon="tabler:edit"
            fontSize={20}
            onClick={() => {
              setIsOpenModal(true);
            }}
          />
        </Button>
      </Tooltip>
      <ResponsiveDialog
        loadingState={false}
        open={isOpenModal}
        setOpen={setIsOpenModal}
        dialogBoxTitle={t("EDIT_ADD_PRODUCTS")}
        handleSubmit={() => {
          handleSubmits(row.id);
        }}
        clearPrevState={() => {
          reset();
        }}
        // loadingState={}
        dialogComponent={() => (
          <EditaddProductModal
            row={row}
            reset={reset}
            control={control}
            setValue={setValue}
            errors={errors}
            clearErrors={clearErrors}
            getValues={getValues}
            conversion={conversion}
            setConversion={setConversion}
            switchActive={switchActive}
            setSwitchActive={setSwitchActive}
            setError={setError}
          />
        )}
      />
    </div>
  );
};

export default CommonActionRow;
