import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CommonInput from "../common/CommonInput";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseButton from "../../../public/images/icons/project-icons/CloseButton.png";
import Image from "next/image";

import { useSelector } from "react-redux";
import { getRoleData } from "src/store/apps/get-roles";
import { useDispatch } from "react-redux";
import { RootState } from "src/store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 12,
};

interface CopyCodeProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onSubmit: (roleName: string) => void;
}

export default function CopyCode({
  open,
  setOpen,
  onClose,
  onSubmit,
}: CopyCodeProps) {
  const { t } = useTranslation();
  const [roleName, setRoleName] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);
  const [duplicateError, setDuplicateError] = React.useState<boolean>(false);
  const getRoles = useSelector((state: RootState) => state.getRoles?.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoleData());
  }, []);
  const checkDuplicateRole = (name: any) => {
    return getRoles.some((role: any) => role.name === name);
  };
  const clickHandler = () => {
    if (!roleName) {
      setError(true);
      setDuplicateError(false);
      return;
    }

    if (checkDuplicateRole(roleName)) {
      setError(false);
      setDuplicateError(true);
      return;
    }

    setError(false);
    setDuplicateError(false);
    onSubmit(roleName);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Button
            sx={{
              position: "fixed",
              top: "30%",
              right: "35%",
              zIndex: 1,
            }}
            onClick={onClose}
          >
            <Image alt="" src={CloseButton} height={40} width={40} />
          </Button>
          <Box sx={style}>
            <Typography
              sx={{
                textAlign: "center",
                mb: "25px",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              {t("COPY_ROLE")}
            </Typography>
            <label>{t("ROLE_NAME")}*</label>
            <br></br>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              <TextField
                size="small"
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  error && setError(false);
                  duplicateError && setDuplicateError(false);
                }}
                error={error || duplicateError}
                helperText={
                  error
                    ? t("REQUIRED")
                    : duplicateError
                    ? t("DUPLICATE_ROLE")
                    : ""
                }
              />

              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  onClick={() => setOpen(false)}
                  color="secondary"
                  variant="contained"
                >
                  {t("CANCEL")}
                </Button>
                <Button variant="contained" onClick={clickHandler}>
                  {t("SAVE")}
                </Button>
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
