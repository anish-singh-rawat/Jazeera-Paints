import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useEffect } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonInput from "../common/CommonInput";
import CommonFormActionButtons from "../common/CommonFormActionButtons";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { invoiceEmail } from "src/store/apps/invoiceHistory/invoiceHistory";
import AppEvent from "src/app/AppEvent";
import { useTheme } from "@mui/material/styles";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<FieldValues>;
  defaultEmail: string;
  isLoading?: boolean;
  invoiceId: number;
  storeId: number;
}

const emailSchema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

const EmailInvoice: React.FC<Props> = ({
  open,
  onClose,
  defaultEmail,
  isLoading,
  invoiceId,
  storeId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  useEffect(() => {
    reset({ email: defaultEmail });
  }, [defaultEmail, reset]);

  const handleFormSubmit: SubmitHandler<FieldValues> = async (formData) => {
    let payload = {
      invoiceId,
      storeId,
      templateId: 301,
      to: ["hellosayeed@gmail.com", "sayeed@revestretail.com"],
    };

    try {
      const res = await dispatch(invoiceEmail(payload)).unwrap();
      // Handle success
      onClose(); // Close the dialog
    } catch (error: any) {
      // Handle errors
      onClose();
    }
  };

  return (
    <Dialog
      sx={{
        ".MuiDialog-paper": {
          background: theme.palette.background.paper,
          width: 350,
        },
      }}
      onClose={onClose}
      open={open}
    >
      <DialogTitle>{t("MAIL_INVOICE")}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <CommonInput
            name="email"
            label="Email"
            required={true}
            control={control}
            errors={errors}
            disabled
          />
        </DialogContent>
        <CommonFormActionButtons
          handleCloseDrawer={onClose}
          disabled={isLoading}
        />
      </form>
    </Dialog>
  );
};

export default EmailInvoice;
