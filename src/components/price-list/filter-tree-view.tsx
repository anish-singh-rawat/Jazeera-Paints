import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { AccordionSummaryProps, Box, Typography, styled } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { t } from "i18next";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { activeMap } from "src/utils/utils";
import { productFilter } from "./filtered-Item";
import { useStyles } from "./price-list-style";
import AppStorage from "src/app/AppStorage";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  boxShadow: "none",
  "&.Mui-expanded": {
    boxShadow: "none !important",
    top: 0,
  },
  background: "transparent",
  margin:0,
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
    marginRight: theme.spacing(1),
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  boxShadow: "none",
}));
const changeLanguage: any = AppStorage.getData("lang");

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "rgb(48,52,70)" : "#FFF",
  boxShadow: "none",
}));

interface FilterTreeViewProps {
  handleChange: (
    checked: boolean,
    item: Record<string, any>,
    type: productFilter
  ) => void;
  selectedItems: [];
  checkedItem: [];
  expanded: string | false;
  setExpanded: React.Dispatch<React.SetStateAction<string | false>>;
  handleChangeAccordion: (
    panel: string
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
}

const FilterTreeView: React.FC<FilterTreeViewProps> = ({
  handleChange,
  checkedItem,
  selectedItems,
  expanded,
  handleChangeAccordion,
  setExpanded,
}) => {
  const productDivision = useSelector(
    (state: RootState) => state.productDivision.data
  );

  const pricelistAddProduct = useSelector(
    (state: RootState) => state.AddProductPricelist
  );

  const productBrands = useSelector(
    (state: RootState) => state.productBrands.data
  );
  const productSubCateory = useSelector(
    (state: RootState) => state.productSubCategory.data
  );

  const productCategory = useSelector(
    (state: RootState) => state.productCategory.data
  );

  const productFamily = useSelector(
    (state: RootState) => state.productFamily.data
  );
  const productGroup = useSelector(
    (state: RootState) => state.productGroup.data
  );
  const productList = useSelector(
    (state: RootState) => state.productGroup.data
  );

  const ProductTypes = useSelector(
    (state: RootState) => state.ProductTypes.data
  );
  const classes = useStyles();

  const getChecked = (type: productFilter, id: string | number) =>
    checkedItem[type]?.[id] || false;

  return (
    <>
      <Typography color={"secondary"} className={classes.treeLabel}>
        <strong style={{ paddingLeft: 23 }}>{t("FILTER_BY")}</strong>
      </Typography>
      <Accordion
        expanded={expanded === "panel7"}
        onChange={handleChangeAccordion("panel7")}
      >
        <AccordionSummary aria-controls="panel7d-content" id="panel7d-header">
          <Typography>{t("PRODUCT_TYPES")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.boxContainer} sx={{ marginLeft: "25px" }}>
            {pricelistAddProduct.addProducttypes.length === 0 ? (
              <Typography variant="body2">{"NO_PRODUCT_AVAILABLE"}</Typography>
            ) : (
              activeMap(pricelistAddProduct.addProducttypes).map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      size="small"
                      value={item.code}
                      onChange={(_, checked) =>
                        handleChange(checked, item, productFilter.productTypeId)
                      }
                      checked={getChecked(productFilter.productTypeId, item.id)}
                    />
                  }
                  label={
                    changeLanguage === "en-US" ? item?.name : item?.altName
                  }
                />
              ))
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel6"}
        onChange={handleChangeAccordion("panel6")}
      >
        <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
          <Typography>{t("GROUP")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.boxContainer} sx={{ marginLeft: "25px" }}>
            {pricelistAddProduct.addProductgroups.length === 0 ? (
              <Typography variant="body2">{"NO_PRODUCT_AVAILABLE"}</Typography>
            ) : (
              activeMap(pricelistAddProduct.addProductgroups).map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      size="small"
                      value={item.code} // You can use any unique identifier here
                      onChange={(_, checked) =>
                        handleChange(
                          checked,
                          item,
                          productFilter.productGroupId
                        )
                      }
                      checked={getChecked(
                        productFilter.productGroupId,
                        item.id
                      )}
                    />
                  }
                  label={
                    changeLanguage === "en-US" ? item?.name : item?.altName
                  }
                />
              ))
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChangeAccordion("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>{t("CATEGORY")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.boxContainer} sx={{ marginLeft: "25px" }}>
            {pricelistAddProduct.addProductcategory.length === 0 ? (
              <Typography variant="body2">{"NO_PRODUCT_AVAILABLE"}</Typography>
            ) : (
              activeMap(pricelistAddProduct.addProductcategory).map(
                (item: any) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        size="small"
                        value={item.code} // You can use any unique identifier here
                        onChange={(_, checked) =>
                          handleChange(
                            checked,
                            item,
                            productFilter.productCategoryId
                          )
                        }
                        checked={getChecked(
                          productFilter.productCategoryId,
                          item.id
                        )}
                      />
                    }
                    label={
                      changeLanguage === "en-US" ? item?.name : item?.altName
                    }
                  />
                )
              )
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChangeAccordion("panel4")}
      >
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography>{t("SUB_CATOGARY")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.boxContainer} sx={{ marginLeft: "25px" }}>
            {pricelistAddProduct.addProductsubcategory.length === 0 ? (
              <Typography variant="body2">{"NO_PRODUCT_AVAILABLE"}</Typography>
            ) : (
              activeMap(pricelistAddProduct.addProductsubcategory).map(
                (item) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        size="small"
                        value={item.code} // You can use any unique identifier here
                        onChange={(_, checked) =>
                          handleChange(
                            checked,
                            item,
                            productFilter.productSubCategoryId
                          )
                        }
                        checked={getChecked(
                          productFilter.productSubCategoryId,
                          item.id
                        )}
                      />
                    }
                    label={
                      changeLanguage === "en-US" ? item?.name : item?.altName
                    }
                  />
                )
              )
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel5"}
        onChange={handleChangeAccordion("panel5")}
      >
        <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
          <Typography>{t("FAMILY")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.boxContainer} sx={{ marginLeft: "25px" }}>
            {pricelistAddProduct.addProductfamily.length === 0 ? (
              <Typography variant="body2">{"NO_PRODUCT_AVAILABLE"}</Typography>
            ) : (
              activeMap(pricelistAddProduct.addProductfamily).map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      size="small"
                      value={item.code} // You can use any unique identifier here
                      onChange={(_, checked) =>
                        handleChange(
                          checked,
                          item,
                          productFilter.productFamilyId
                        )
                      }
                      checked={getChecked(
                        productFilter.productFamilyId,
                        item.id
                      )}
                    />
                  }
                  label={
                    changeLanguage === "en-US" ? item?.name : item?.altName
                  }
                />
              ))
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChangeAccordion("panel2")}
      >
        <AccordionSummary aria-controls="panel12d-content" id="panel2d-header">
          <Typography>{t("BRAND")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.boxContainer} sx={{ marginLeft: "25px" }}>
            {pricelistAddProduct.addProductbrands.length === 0 ? (
              <Typography variant="body2">{"NO_PRODUCT_AVAILABLE"}</Typography>
            ) : (
              activeMap(pricelistAddProduct.addProductbrands).map(
                (item: any) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        key={item.id}
                        size="small"
                        value={item.code} // You can use any unique identifier here
                        onChange={(_, checked) =>
                          handleChange(
                            checked,
                            item,
                            productFilter.productBrandId
                          )
                        }
                        checked={getChecked(
                          productFilter.productBrandId,
                          item.id
                        )}
                      />
                    }
                    label={
                      changeLanguage === "en-US" ? item?.name : item?.altName
                    }
                  />
                )
              )
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChangeAccordion("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{t("DIVISION")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.boxContainer} sx={{ marginLeft: "25px" }}>
            {pricelistAddProduct.addProductdivisions.length === 0 ? (
              <Typography variant="body2">{"NO_PRODUCT_AVAILABLE"}</Typography>
            ) : (
              activeMap(pricelistAddProduct.addProductdivisions).map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      size="small"
                      onChange={(_, checked) =>
                        handleChange(
                          checked,
                          item,
                          productFilter.productDivisionId
                        )
                      }
                      key={item.id}
                      checked={getChecked(
                        productFilter.productDivisionId,
                        item.id
                      )}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label={
                    changeLanguage === "en-US" ? item?.name : item?.altName
                  }
                />
              ))
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default FilterTreeView;
