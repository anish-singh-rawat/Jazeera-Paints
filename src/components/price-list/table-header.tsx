import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useRouter as useRxRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Icon from "src/@core/components/icon";
import {
  addProducts,
  clearPreSelectedData,
  openAddProduct,
} from "src/store/apps/product-items";
import { useStyles } from "./price-list-style";
import { priceUpdate } from "src/store/apps/price-list";
import { decryptPriceId } from "src/utils/utils";
import AppEvent from "src/app/AppEvent";
import { makeStyles } from "@mui/styles";
import { ROOT_BASE_API } from "src/store/apps";

const useModalStyles = makeStyles({
  dialog: {
    "& .MuiDialogTitle": {
      fontSize: "18px",
      color: "red",
    },

    "& .MuiDialogContent-root": {
      color: "#6f6b7d",
      fontSize: "16px",
    },

    "& .MuiPaper-elevation": {
      width: "500px",
      height: "226px",
      padding: "1rem",
    },

    "& .MuiDialogActions-root ": {
      padding: 0,
    },
  },
  formAction: {
    // padding: "0 3rem"
    gap: "1rem",
  },
  formActionSave: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    textTransform: "unset",
  },
  formActionCancel: {
    width: "100px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    textTransform: "unset",
    background: "#f1f1f2",
    color: "#6f6b7d",

    "&.MuiButton-root:hover": {
      background: "#f1f1f2",
      color: "#6f6b7d",
    },
    "&.MuiButton-root": {
      background: "#f1f1f2",
      color: "#6f6b7d",
    },
  },
});

const TableHeader = (props: any) => {
  const { t } = useTranslation();
  const [error, setError] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [pId, setPid] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const classes = useStyles();
  const modalClasses = useModalStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const route = useRxRouter();

  const fireSearch = (input: any) => {
    router.replace({
      query: { ...router.query, searchItem: input },
    });
  };
  const handleClear = () => {
    setInput("");
    props.onCancelSearch();
    fireSearch("");
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!input) {
      setError(true);
    }
    props.onChange(input.trim());
    fireSearch(input.trim());
  };
  const handleChange = (text: string) => {
    setInput(text);
    setError(false);
    if (!text.length) handleClear();
  };

  const csvHeaders = [
    { label: t("PRODUCT_ID"), key: "productId" },
    { label: t("PRODUCT_NAME"), key: "productName" },
    { label: t("ACTIVE"), key: "active" },
    { label: t("SKU"), key: "sku" },
    { label: t("UOM_ID"), key: "UOMId.name" },
    { label: t("CONVERSION"), key: "conversion" },
    { label: t("START_DATE"), key: "startDate" },
    { label: t("END_DATE"), key: "endDate" },
    { label: t("TAX_INLCUDED"), key: "isTaxesIncluded" },
    { label: t("STATUS"), key: "status" },
  ];

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query?.id) {
      setPid(router.query?.id);
    }
  }, [router.isReady]);

  const handAddProduct = () => {
    const payload = {
      id: decryptPriceId(pId),
      isCompleted: false,
    };
    dispatch(priceUpdate(payload as any));
  };

  const deleteAllProducts = async () => {
    props.deleteAllProducts();
    setIsOpenModal(false);
  };

  return (
    <>
      <Dialog open={isOpenModal} className={modalClasses.dialog}>
        <DialogTitle color="red">{t("DELETE")}</DialogTitle>
        <DialogContent>{t(`DELETE_CONFIRM`)}</DialogContent>
        <DialogActions className={modalClasses.formAction}>
          <Button
            variant="contained"
            onClick={() => setIsOpenModal(false)}
            className={modalClasses.formActionCancel}
          >
            {t("CANCEL")}
          </Button>
          <Button
            variant="contained"
            color="error"
            className={modalClasses.formActionSave}
            onClick={deleteAllProducts}
          >
            {t("DELETE")}
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          py: 7,
          px: 5,
          background: (theme) => (theme.palette.mode == "light" ? "white" : ""),
        }}
      >
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item>
            <form onSubmit={(e) => handleClick(e)}>
              <Box
                sx={{
                  display: "flex",
                  "@media (max-width: 900px)": {
                    width: "88vw",
                    marginBottom: "10px",
                  },
                }}
              >
                <TextField
                  value={input}
                  size="small"
                  fullWidth
                  sx={{
                    mr: 2,
                    "& .MuiInputBase-input": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                  error={error}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={t("SEARCH_BY_ID_CODE") as string}
                  defaultValue={""}
                  onBlur={() => setError(false)}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClear}
                      >
                        <Icon
                          icon="iconamoon:close"
                          opacity={Number(input.length > 0)}
                        />
                      </IconButton>
                    ),
                  }}
                />

                <Button type="submit" variant="outlined" size="medium">
                  <Icon fontSize="1.45rem" icon="tabler:search" />
                </Button>

                <Box
                  className={classes.filter}
                  sx={{ marginLeft: "2px", borderRadius: "4px 4px" }}
                ></Box>
                <Box
                  className={classes.filter}
                  sx={{ marginLeft: "2px", borderRadius: "4px 4px" }}
                ></Box>
                {props?.selectedRows?.length ? (
                  <Button
                    className={classes.filter}
                    sx={{ marginLeft: "2px", borderRadius: "4px 4px" }}
                    onClick={props.deleteSelectedData}
                  >
                    <Icon fontSize="1.45rem" icon="tabler:trash" color="red" />
                  </Button>
                ) : null}
              </Box>
            </form>
          </Grid>

          <Grid
            item
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{
              "@media (max-width: 950px)": {
                justifyContent: "flex-start",
              },
            }}
          >
            {!props?.selectedRows?.length ? (
              <Button
                color="secondary"
                variant="outlined"
                className={classes.importStyle}
                startIcon={<Icon icon="tabler:trash" />}
                disabled={props?.selectedRows?.length}
                onClick={() => setIsOpenModal(true)}
              >
                {t("DELETE_ALL")}
              </Button>
            ) : null}
            <Button
              color="secondary"
              variant="outlined"
              className={classes.importStyle}
              startIcon={<Icon icon="tabler:download" />}
            >
              {t("IMPORT")}
            </Button>
            <CSVLink
              filename={"price-list-products.csv"}
              data={
                props.selectedRows.length ? props.selectedRows : props.tableData
              }
              headers={csvHeaders}
            >
              <Button
                color="secondary"
                variant="outlined"
                className={classes.importStyle}
                startIcon={<Icon icon="tabler:upload" />}
              >
                {t("EXPORT")}
              </Button>
            </CSVLink>

            <Button
              className={classes.filterOne}
              startIcon={<Icon icon="tabler:plus" />}
              onClick={() => {
                dispatch(
                  addProducts(
                    props.selectedRows.length
                      ? props.selectedRows
                      : props.tableData
                  )
                );
                dispatch(clearPreSelectedData());
                handAddProduct();
                route.push(
                  `/pricelist/add-products/?id=${encodeURIComponent(
                    pId
                  )}&isEdit=true`
                );
              }}
              disabled={!pId}
            >
              {t("ADD_MORE")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TableHeader;
