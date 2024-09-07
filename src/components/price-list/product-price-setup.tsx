import { Icon } from "@iconify/react";
import { Box, Button, styled, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { encryptPriceId } from "src/utils/utils";
import productIcon from "../../../public/product-icon.png";
import { useStyles } from "./price-list-style";

const BoxDetails = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "",
  width: "100%",
  height: "80%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "15px",
}));

const BoxStyle = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "",
  width: "95%",
  height: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "15px",
  margin: "30px",
}));

interface ProductPriceprop {
  isCardDisable: boolean;
  priceListId: string | number;
  isFirstTimeEdit: boolean;
}

const ProductPriceSetUp = ({
  isCardDisable,
  priceListId,
  isFirstTimeEdit,
}: ProductPriceprop) => {
  const { t } = useTranslation();
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const [isdisable, setIsDisable] = useState(true);

  const handleClick = () => {
    let redirectUrl = `/pricelist/add-products/?id=${priceListId}&isEdit=true`
    if (isFirstTimeEdit) {
      redirectUrl += '&isFirstEdit=true'
    }
    router.push(
      redirectUrl,
      {
        forceOptimisticNavigation: true,
      }
    );
  };

  return (
    <>
      <BoxDetails>
        <BoxStyle
          sx={{
            opacity: !isCardDisable ? "0.4" : "1",
            cursor: !isCardDisable ? "not-clickable" : "pointer",
          }}
        >
          <Image src={productIcon} alt={""} height={40} width={40} />
          <Typography>{t("NO_PRODUCTS_YET")}</Typography>
          <Typography>{t("PRODUCT_ADD_HEADING")}</Typography>
          <Typography>{t("PRODUCT_ADD_SUB_HEADING")}</Typography>
          <Button className={classes.buttonStyle} disabled>
            {t("DOWNLOAD_SAMPLE_TEMPLATE")}
          </Button>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              className={classes.importButtonStyle}
              startIcon={<Icon icon="tabler:download" />}
              disabled
            >
              {t("IMPORT")}
            </Button>
            <Button
              className={classes.addButtonStyle}
              onClick={handleClick}
              startIcon={<FaPlus size={"12px"} />}
              disabled={!isCardDisable}
            >
              {t("ADD_PRODUCTS")}
            </Button>
          </div>
        </BoxStyle>
      </BoxDetails>
    </>
  );
};

export default ProductPriceSetUp;
