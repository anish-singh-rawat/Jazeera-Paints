import React from "react";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 480,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 6,
};

interface EditModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditPricelistModal({ isOpen, setIsOpen }: EditModalProps) {
  const { t } = useTranslation();

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Box sx={style}>
            <Typography
              sx={{
                textAlign: "center",
                mb: "2px",
                color: "rgb(234,84,85)",
              }}
            >
              {t("EDIT_PRODUCT_LEAVING_HEAD")}
            </Typography>

            <br></br>
            <Typography sx={{ wordBreak: "break-all" }}>
              {t(
                "BODY_TEXT"
              )}
            </Typography>
            <br></br>
            <Typography>{t("SAVE_BEFORE_YOU_GO")}</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-End",
                  marginTop: "20px",
                }}
              >
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outlined"
                  sx={{
                    marginRight: "8px",
                  }}
                >
                  {t("STAY")}
                </Button>
                <Link href={"price-list"}>
                  <Button
                    sx={{ backgroundColor: "rgb(234,84,85)", color: "#fff" }}
                  >
                    {t("LEAVE")}
                  </Button>
                </Link>
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
export default EditPricelistModal;
