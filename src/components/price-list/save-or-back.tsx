import { Box, Button } from "@mui/material";
import { t } from "i18next";
import router from "next/router";
import { SetStateAction } from "react";

interface SaveOrBackButtonProps {
  rows: any[];
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  onSubmit: () => void;
  isdisable: boolean;
}

export default function SaveOrBackButton({
  rows,
  setIsOpen,
  onSubmit,
  isdisable,
}: SaveOrBackButtonProps) {
  return (
    <Box display={"flex"} gap={5}>
      <Button
        variant="outlined"
        size="large"
        onClick={() => {
          if (router.query?.editFocus) {
            setIsOpen(true);
          } else {
            router.push("/pricelist/price-list/");
          }
        }}
      >
        {t("BACK")}
      </Button>
      <Button
        sx={{
          marginRight: "20px",
          "&:disabled": {
            cursor: "no-drop",
            background: "#808080",
            color: "#000000",
          },
        }}
        type="submit"
        variant="contained"
        onClick={onSubmit}
        disabled={isdisable || !router.query?.editFocus}
        size="large"
      >
        {t("SAVE")}
      </Button>
    </Box>
  );
}
