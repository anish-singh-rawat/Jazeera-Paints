import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Tab,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import sx from "mui-sx";
import Icon from "src/@core/components/icon";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DisplayAssignedIndependentServices from "./DisplayAssignedIndependentServices";
import CustomerPagination from "src/components/customers/CustomerPagination";
import {
  useAddServicesStyles,
  sxServicesDialog,
  sxDialogWidthCommon,
  sxDialogWidthSNum,
} from "src/styles/addServices.styles";

const AddIndependentServicesContainer: React.FC<any> = ({
  openServicesDialog,
  setOpenServicesDialog,
  isIndependentServicesLoading,
  isAssignedIndependentServicesLoading,
  independentCurrentTab,
  setIndependentCurrentTab,
  currentIndependentServiceProducts,
  setCurrentIndependentServiceProducts,
  selectedUnAssignedIndependentServiceProducts,
  setSelectedUnAssignedIndependentServiceProducts,
  currentAssignedIndependentServiceProducts,
  setCurrentAssignedIndependentServiceProducts,
  independentServiceProductsDeletedArr,
  setIndependentServiceProductsDeletedArr,
  selectedServiceType,
  setIsMarkAsIndependent,
  setIsMarkAsExclusive,
  independentServiceProductsTotalCount,
  independentServicesPaginationCount,
  assignedIndependentServiceProductsTotalCount,
  assignedIndependentServicesPaginationCount,
  independentPageState,
  setIndependentPageState,
  assignedIndependentPageState,
  setAssignedIndependentPageState,
  productId,
  currentIndependentServiceSearchedProducts,
  setCurrentIndependentServiceSearchedProducts,
  handleIndependentSearchProduct,
  isIndependentServicesSearchLoading,
  independentServiceSearchedProducts,
  independentServiceSearchedProductsTotalCount,
  independentServicesSearchedPaginationCount,
  independentSearchPageState,
  setIndependentSearchPageState,
  isIndependentSearchEnabled,
  setIsIndependentSearchEnabled,
  independentSearchItem,
  setIndependentSearchItem,
  isAssignedIndependentServicesSearchLoading,
  assignedIndependentServiceSearchedProducts,
  assignedIndependentServiceSearchedProductsTotalCount,
  currentAssignedIndependentServiceSearchedProducts,
  setCurrentAssignedIndependentServiceSearchedProducts,
  selectedUnAssignedIndependentServiceSearchedProducts,
  setSelectedUnAssignedIndependentServiceSearchedProducts,
  assignedIndependentServicesSearchedPaginationCount,
  assignedIndependentSearchPageState,
  setAssignedIndependentSearchPageState,
}: any) => {
  const theme = useTheme();
  const classes = useAddServicesStyles(theme);
  const { t } = useTranslation();

  const [fullpage, setFullPage] = useState<boolean>(false);

  const [
    independentServiceProductsToUpdate,
    setIndependentServiceProductsToUpdate,
  ] = useState<any>(
    JSON.parse(
      JSON.stringify(
        isIndependentSearchEnabled
          ? currentIndependentServiceSearchedProducts
          : currentIndependentServiceProducts
      )
    )
  );

  const [
    assignedIndependentServiceProductsToUpdate,
    setAssignedIndependentServiceProductsToUpdate,
  ] = useState<any>(
    JSON.parse(
      JSON.stringify(
        isIndependentSearchEnabled
          ? currentAssignedIndependentServiceSearchedProducts
          : currentAssignedIndependentServiceProducts
      )
    )
  );

  const [currentServiceProductPrice, setCurrentServiceProductPrice] =
    useState<any>(0);
  const [isPriceUpdated, setIsPriceUpdated] = useState<boolean>(false);
  const [isShowError, setIsShowError] = useState(false);

  // update when Unassigned data is fetched
  useEffect(() => {
    setIndependentServiceProductsToUpdate(
      JSON.parse(
        JSON.stringify(
          isIndependentSearchEnabled
            ? currentIndependentServiceSearchedProducts
            : currentIndependentServiceProducts
        )
      )
    );
  }, [
    currentIndependentServiceProducts,
    currentIndependentServiceSearchedProducts,
  ]);

  // update when Assigned data is fetched
  useEffect(() => {
    setAssignedIndependentServiceProductsToUpdate(
      JSON.parse(
        JSON.stringify(
          isIndependentSearchEnabled
            ? currentAssignedIndependentServiceSearchedProducts
            : currentAssignedIndependentServiceProducts
        )
      )
    );
  }, [
    currentAssignedIndependentServiceProducts,
    currentAssignedIndependentServiceSearchedProducts,
  ]);

  const showMarkAsIndependentBtn = () => {
    if (independentCurrentTab === "1") {
      const isShowBtn = independentServiceProductsToUpdate?.some(
        (item: any) => item.isModified === true || item.isSelected === true
      );
      return isShowBtn;
    } else {
      const isShowBtn = assignedIndependentServiceProductsToUpdate?.some(
        (item: any) => item.isModified === true || item.isSelected === true
      );
      return isShowBtn;
    }
  };

  const handleIndependentProductCheckChange = (
    selectedItem: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e?.currentTarget;

    if (independentCurrentTab === "1") {
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(independentServiceProductsToUpdate)
      );
      productsToUpdate.forEach((element: any, index: number) => {
        if (element?.id === selectedItem?.id) {
          productsToUpdate[index].isSelected = checked;
          productsToUpdate[index].isModified = true;
        }
      });
      setIndependentServiceProductsToUpdate([...productsToUpdate]);
    } else {
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(assignedIndependentServiceProductsToUpdate)
      );
      productsToUpdate.forEach((element: any, index: number) => {
        if (element?.id === selectedItem?.id) {
          productsToUpdate[index].isSelected = checked;
          productsToUpdate[index].isModified = true;
        }
      });
      setAssignedIndependentServiceProductsToUpdate([...productsToUpdate]);
    }
  };

  const displaySelectAllCheckedStatus = () => {
    if (independentCurrentTab === "1") {
      if (independentServiceProductsToUpdate?.length === 0) return false;

      const isAllItemsNotSelected = independentServiceProductsToUpdate?.some(
        (item: any) => item?.isSelected === false
      );
      return isAllItemsNotSelected ? false : true;
    } else {
      if (assignedIndependentServiceProductsToUpdate?.length === 0)
        return false;

      const isAllAssignedItemsNotSelected =
        assignedIndependentServiceProductsToUpdate?.some(
          (item: any) => item?.isSelected === false
        );
      return isAllAssignedItemsNotSelected ? false : true;
    }
  };

  const handleCancelBtnClick = () => {
    setIsMarkAsIndependent(false);
    setIsMarkAsExclusive(false);
    setOpenServicesDialog(false);
  };

  const handleSaveBtnClick = () => {
    if (independentCurrentTab === "1") {
      // deep copy purpose
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(independentServiceProductsToUpdate)
      );

      if (isIndependentSearchEnabled) {
        setCurrentIndependentServiceSearchedProducts(
          JSON.parse(JSON.stringify(productsToUpdate))
        );
      } else {
        setCurrentIndependentServiceProducts(
          JSON.parse(JSON.stringify(productsToUpdate))
        );
      }

      // copy the selected products for persistence
      const selectedProducts: any = independentServiceProductsToUpdate?.filter(
        (element: any) => element.isSelected === true
      );

      let existingSelectedProducts = JSON.parse(
        JSON.stringify(
          isIndependentSearchEnabled
            ? selectedUnAssignedIndependentServiceSearchedProducts
            : selectedUnAssignedIndependentServiceProducts
        )
      );

      const currentPage = isIndependentSearchEnabled
        ? independentSearchPageState.page
        : independentPageState.page;

      let getIndex = existingSelectedProducts.findIndex(
        (item: any) => item.page === currentPage
      );

      const currentPageSelectedProducts = {
        page: currentPage,
        selectedProducts: selectedProducts,
      };

      if (getIndex === -1) {
        existingSelectedProducts.push(currentPageSelectedProducts);
      } else {
        if (isIndependentSearchEnabled) {
          const mergedDetails = [
            ...existingSelectedProducts[getIndex]?.selectedProducts,
            ...currentPageSelectedProducts?.selectedProducts,
          ];
          const productsIds = mergedDetails.map(({ id }) => id);
          const uniqueProducts = mergedDetails.filter(
            ({ id }, index) => !productsIds.includes(id, index + 1)
          );

          // remove duplicate objects after merging if exists
          existingSelectedProducts[getIndex] = {
            page: currentPage,
            selectedProducts: uniqueProducts,
          };
        } else {
          existingSelectedProducts[getIndex] = currentPageSelectedProducts;
        }
      }

      if (isIndependentSearchEnabled) {
        setSelectedUnAssignedIndependentServiceSearchedProducts(
          JSON.parse(JSON.stringify(existingSelectedProducts))
        );
      } else {
        setSelectedUnAssignedIndependentServiceProducts(
          JSON.parse(JSON.stringify(existingSelectedProducts))
        );
      }
    } else {
      // deep copy purpose
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(assignedIndependentServiceProductsToUpdate)
      );

      // copy the selected products for persistence
      const selectedProducts: any = productsToUpdate?.filter(
        (element: any) => element.isSelected === true
      );

      setCurrentAssignedIndependentServiceProducts(
        JSON.parse(JSON.stringify(selectedProducts))
      );
    }

    setIndependentSearchItem("");
    setIsIndependentSearchEnabled(false);

    setIsMarkAsIndependent(true);
    setOpenServicesDialog(false);
    setIsMarkAsExclusive(false);
  };

  const handleAllProductsSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.currentTarget;
    if (independentCurrentTab === "1") {
      // deep copy purpose
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(independentServiceProductsToUpdate)
      );

      productsToUpdate.forEach((element: any, index: number) => {
        productsToUpdate[index].isSelected = checked;
        productsToUpdate[index].isModified = true;
      });
      setIndependentServiceProductsToUpdate([...productsToUpdate]);
    } else {
      // Update AssignedProduct Services
      let productsIds: any = [];
      let assignedProductsToUpdate: any = JSON.parse(
        JSON.stringify(assignedIndependentServiceProductsToUpdate)
      );

      assignedProductsToUpdate.forEach((element: any, index: number) => {
        assignedProductsToUpdate[index].isSelected = checked;
        assignedProductsToUpdate[index].isModified = true;
        productsIds.push(element?.id);
      });
      setAssignedIndependentServiceProductsToUpdate([
        ...assignedProductsToUpdate,
      ]);

      // Update Service Product DeletedArr
      if (checked) {
        setIndependentServiceProductsDeletedArr([]);
      } else {
        setIndependentServiceProductsDeletedArr([...productsIds]);
      }
    }
  };

  const updateEditPriceElementDisplay = (itemsArray: any, currentItem: any) => {
    itemsArray?.forEach((element: any, index: number) => {
      if (element.id === currentItem?.id) {
        itemsArray[index].isEditing = !currentItem?.isEditing;
      } else {
        itemsArray[index].isEditing = false;
      }
    });
    return itemsArray;
  };

  const handleIndependentServicePriceButtons = (item: any, index: number) => {
    if (independentCurrentTab === "1") {
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(independentServiceProductsToUpdate)
      );
      productsToUpdate = updateEditPriceElementDisplay(productsToUpdate, item);
      setIndependentServiceProductsToUpdate([...productsToUpdate]);
    } else {
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(assignedIndependentServiceProductsToUpdate)
      );
      productsToUpdate = updateEditPriceElementDisplay(productsToUpdate, item);
      setAssignedIndependentServiceProductsToUpdate([...productsToUpdate]);
    }
    setIsShowError(false);
  };

  const handleServicePriceSaveBtn = (item: any, index: number) => {
    let productsToUpdate: any = JSON.parse(
      JSON.stringify(independentServiceProductsToUpdate)
    );
    if (independentCurrentTab === "2") {
      productsToUpdate = JSON.parse(
        JSON.stringify(assignedIndependentServiceProductsToUpdate)
      );
    }
    const getIndex = productsToUpdate.findIndex(
      (element: any) => element.id === item?.id
    );
    if (isPriceUpdated) {
      if (currentServiceProductPrice <= 0) {
        setIsShowError(true);
      } else {
        productsToUpdate[getIndex].isEditing = !item?.isEditing;
        productsToUpdate[getIndex].isModified = true;
        if (independentCurrentTab === "1") {
          productsToUpdate[getIndex].retailPrice = currentServiceProductPrice;
        } else {
          productsToUpdate[getIndex].price = currentServiceProductPrice;
        }
        setIsPriceUpdated(false);
        setIsShowError(false);
        setCurrentServiceProductPrice(0);
      }
    } else {
      if (productsToUpdate[getIndex].retailPrice <= 0) {
        setIsShowError(true);
      } else {
        productsToUpdate[getIndex].isEditing = !item?.isEditing;
      }
    }

    if (independentCurrentTab === "1") {
      setIndependentServiceProductsToUpdate([...productsToUpdate]);
    } else {
      setAssignedIndependentServiceProductsToUpdate([...productsToUpdate]);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setIndependentCurrentTab(newValue);
  };

  const DisplayEntriesCountText = ({
    totalCount,
    currentPageState,
  }: {
    totalCount: number;
    currentPageState: any;
  }) => {
    let fromRecordsCount = currentPageState?.page,
      toRecordsCount = currentPageState?.page * currentPageState?.pageSize;

    if (currentPageState?.page >= 1) {
      fromRecordsCount =
        (currentPageState?.page - 1) * currentPageState?.pageSize + 1;
    }
    toRecordsCount = currentPageState?.page * currentPageState?.pageSize;
    if (totalCount < 100 || toRecordsCount > totalCount) {
      toRecordsCount = totalCount;
    }

    return (
      <span style={{ marginLeft: "20px" }}>
        {`Showing ${fromRecordsCount} - ${toRecordsCount} of ${totalCount} entries`}
      </span>
    );
  };

  return (
    <Dialog
      sx={sx(
        {
          condition: selectedServiceType === "serialNumber",
          sx: sxDialogWidthSNum,
        },
        {
          condition: selectedServiceType !== "serialNumber",
          sx: sxDialogWidthCommon,
        },
        {
          condition:
            selectedServiceType === "associate" ||
            selectedServiceType === "independent",
          sx: sxServicesDialog,
        }
      )}
      maxWidth="md"
      open={openServicesDialog}
      fullScreen={fullpage}
    >
      <DialogTitle variant="h5" sx={{ textAlign: "center" }}>
        {selectedServiceType === "associate"
          ? t("ASSOCIATE_SERVICES")
          : t("INDEPENDENT_SERVICES")}

        {(selectedServiceType === "associate" ||
          selectedServiceType === "independent") && (
          <Grid
            container
            justifyContent={"flex-start"}
            alignItems={"center"}
            columnSpacing={2}
          >
            <Grid item xs={6.6} sx={{ position: "sticky", mt: "15px" }}>
              <TextField
                fullWidth
                defaultValue={""}
                helperText={false}
                id="searchServiceProduct"
                name="SearchService"
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const { value } = e.target;
                  setIndependentSearchItem(value);
                  if (!value) {
                    setIsIndependentSearchEnabled(false);
                    if (independentCurrentTab === "1") {
                      setIndependentServiceProductsToUpdate([
                        ...currentIndependentServiceProducts,
                      ]);
                    } else {
                      setAssignedIndependentServiceProductsToUpdate([
                        ...currentAssignedIndependentServiceProducts,
                      ]);
                    }
                  }
                }}
                placeholder={t("SEARCH...") as string}
                required={false}
                className={`${classes.servicesSearchBar} `}
              />
            </Grid>
            <Grid item xs={2.2} sx={{ mt: "15px", ml: "15px" }}>
              <Button
                size="medium"
                color="secondary"
                variant="outlined"
                onClick={() =>
                  handleIndependentSearchProduct(independentSearchItem)
                }
                startIcon={
                  <Icon icon="tabler:search" className={classes?.btnIcons} />
                }
                className={classes?.servicesFilterBtn}
              >
                {t("SEARCH")}
              </Button>
            </Grid>
            <Grid
              item
              xs={2.9}
              sx={{
                mt: "15px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {!fullpage ? (
                <Button
                  size="medium"
                  color="secondary"
                  variant="outlined"
                  onClick={() => setFullPage(!fullpage)}
                  className={classes.servicesMinMaxBtn}
                  startIcon={
                    <Icon
                      icon="tabler:arrows-maximize"
                      className={classes?.btnIcons}
                    />
                  }
                >
                  {t("FULL_PAGE")}
                </Button>
              ) : (
                <Button
                  size="medium"
                  color="secondary"
                  variant="outlined"
                  onClick={() => setFullPage(!fullpage)}
                  className={classes.servicesMinMaxBtn}
                  startIcon={
                    <Icon
                      icon="tabler:arrows-minimize"
                      className={classes?.btnIcons}
                    />
                  }
                >
                  {t("NORMAL_PAGE")}
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormHelperText
                sx={{ color: "red", height: 20, fontSize: "0.9rem" }}
              >
                {independentSearchItem &&
                  independentSearchItem.length < 3 &&
                  t("PLEASE_ENTER_THREE_CHARACTERS")}
              </FormHelperText>
            </Grid>
            <Grid alignItems={"center"} container item xs={12}>
              <Grid alignItems={"center"} container item xs={9}>
                <Icon
                  icon="tabler:info-circle"
                  fontSize={20}
                  style={{ marginRight: "10px", width: "15px" }}
                />
                <Typography sx={{ my: 1, fontSize: "13px", fontWeight: 400 }}>
                  {selectedServiceType === "associate"
                    ? t("ASSOCIATE_SERVICES_INFO_TEXT")
                    : t("INDEPENDENT_SERVICES_INFO_TEXT")}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  className={classes.checkbox}
                  control={
                    <Checkbox
                      size="small"
                      checked={displaySelectAllCheckedStatus()}
                      onChange={(e) => handleAllProductsSelectChange(e)}
                    />
                  }
                  label={
                    <span className={classes.serviceContainerSelectText}>
                      {t("ASSO_SELECT_ALL")}
                    </span>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogTitle>

      <DialogContent>
        <Box className={classes.tablist}>
          <TabContext value={independentCurrentTab}>
            <Box>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label={t("UNASSIGNED_SERVICES")}
                  value="1"
                  style={{ fontSize: "13px" }}
                />
                <Tab
                  label={t("ASSIGNED_SERVICES")}
                  value="2"
                  style={{ fontSize: "13px" }}
                />
              </TabList>
            </Box>
            <TabPanel sx={{ px: "0px !important" }} value="1">
              <Grid
                sx={{
                  overflowX: "hidden",
                }}
              >
                <Grid
                  container
                  className={classes.colorPaperContainer}
                  spacing={{ xs: 3, md: 4 }}
                  style={{
                    marginTop: "0px auto",
                    alignSelf: "center",
                  }}
                >
                  {isIndependentServicesLoading ||
                  isIndependentServicesSearchLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "50px",
                      }}
                    >
                      <CircularProgress color="inherit" size={20} />
                      <span
                        style={{ marginLeft: "15px", fontSize: "14px" }}
                      >{` loading ${selectedServiceType} products`}</span>
                    </div>
                  ) : independentServiceProductsToUpdate?.length === 0 ? (
                    <Box className={classes.servicesNoDataText}>
                      {`No Data Found`}
                    </Box>
                  ) : (
                    <Grid
                      xs={11.9}
                      container
                      item
                      spacing={2}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "10px",
                      }}
                    >
                      {independentServiceProductsToUpdate.map(
                        (item: any, index: number) => (
                          <Card
                            style={{
                              padding: "0px",
                              marginBottom: "20px",
                            }}
                          >
                            {item?.hexCode ? (
                              <Box
                                className={classes.colorHexaCode}
                                style={{
                                  backgroundColor: item?.hexCode
                                    ? item?.hexCode
                                    : "8c856c",
                                }}
                              >
                                <Typography sx={{ fontSize: "11px" }}>
                                  {item?.hexCode}
                                </Typography>
                                <Checkbox
                                  className={classes.colorsCheckbox}
                                  checked={item?.isSelected}
                                  onChange={(e) =>
                                    handleIndependentProductCheckChange(item, e)
                                  }
                                />
                              </Box>
                            ) : (
                              <Box
                                className={classes.colorImgContainer}
                                style={{
                                  backgroundColor: item?.hexCode
                                    ? item?.hexCode
                                    : "",
                                }}
                              >
                                <Image
                                  // src={
                                  //   "https://retailprojects.s3.amazonaws.com/dev/product/11002834.png"
                                  // }
                                  src={"/images/pages/noImageDefault.png"}
                                  alt={`product ${item?.shortName} image`}
                                  width={100}
                                  height={69}
                                  className={classes.colorPaperImg}
                                />
                                <Checkbox
                                  className={classes.colorsCheckbox}
                                  checked={item?.isSelected}
                                  onChange={(e) =>
                                    handleIndependentProductCheckChange(item, e)
                                  }
                                />
                              </Box>
                            )}

                            <Box>
                              <Stack>
                                {item?.isEditing ? (
                                  <>
                                    <TextField
                                      id="outlined-basic"
                                      placeholder="Price"
                                      variant="outlined"
                                      size="small"
                                      defaultValue={item?.retailPrice ?? 0}
                                      onChange={(e) => {
                                        setIsPriceUpdated(true);
                                        setCurrentServiceProductPrice(
                                          Number(e.target.value).toFixed(2)
                                        );
                                        setIsShowError(false);
                                      }}
                                      sx={{
                                        width: "110px",
                                        margin: "5px 0px 0px 8px",
                                      }}
                                      error={isShowError}
                                    />
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        paddingBottom: "2px",
                                      }}
                                    >
                                      <IconButton
                                        sx={{ paddingTop: "10px" }}
                                        onClick={() =>
                                          handleServicePriceSaveBtn(item, index)
                                        }
                                      >
                                        <Icon
                                          icon="tabler:check"
                                          color="#00b341"
                                          width={"18px"}
                                        />
                                      </IconButton>
                                      <IconButton
                                        sx={{ paddingTop: "10px" }}
                                        onClick={() =>
                                          handleIndependentServicePriceButtons(
                                            item,
                                            index
                                          )
                                        }
                                      >
                                        <Icon
                                          icon="tabler:x"
                                          color="#ea5455"
                                          width={"18px"}
                                        />
                                      </IconButton>
                                    </Box>
                                  </>
                                ) : (
                                  <Box sx={{ width: "100px" }}>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        margin: "5px 0px 0px 12px",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: (theme: Theme) =>
                                          theme.palette.mode === "light"
                                            ? "#4B465C"
                                            : "#e4e6f4",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      {item?.shortName}
                                    </Typography>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          margin: "5px 0px 0px 12px",
                                          alignSelf: "center",
                                          fontSize: "11px",
                                          color: (theme: Theme) =>
                                            theme.palette.mode === "light"
                                              ? "#4B465C"
                                              : "#e4e6f4",
                                        }}
                                      >
                                        {t("PRICE")}{" "}
                                        {item?.retailPrice
                                          ? Number(item?.retailPrice)
                                          : 0}
                                      </Typography>
                                      <IconButton
                                        sx={{ paddingTop: "10px" }}
                                        onClick={() =>
                                          handleIndependentServicePriceButtons(
                                            item,
                                            index
                                          )
                                        }
                                      >
                                        <Icon
                                          icon="tabler:edit"
                                          width={"18px"}
                                          className={classes.servicesEditIcon}
                                        />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                )}
                              </Stack>
                            </Box>
                          </Card>
                        )
                      )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel sx={{ px: "0px !important" }} value="2">
              <Grid
                sx={{
                  overflowX: "hidden",
                }}
              >
                <Grid
                  container
                  className={classes.colorPaperContainer}
                  spacing={{ xs: 3, md: 4 }}
                  style={{
                    marginTop: "0px auto",
                    alignSelf: "center",
                  }}
                >
                  {isAssignedIndependentServicesLoading ||
                  isAssignedIndependentServicesSearchLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "50px",
                      }}
                    >
                      <CircularProgress color="inherit" size={20} />
                      <span
                        style={{ marginLeft: "15px", fontSize: "14px" }}
                      >{` loading ${selectedServiceType} products`}</span>
                    </div>
                  ) : assignedIndependentServiceProductsToUpdate?.length ===
                    0 ? (
                    <Box className={classes.servicesNoDataText}>
                      {`No Data Found`}
                    </Box>
                  ) : (
                    <Grid
                      xs={11.9}
                      container
                      item
                      spacing={2}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "10px",
                      }}
                    >
                      {assignedIndependentServiceProductsToUpdate?.length > 0 &&
                        assignedIndependentServiceProductsToUpdate.map(
                          (item: any, index: number) => (
                            <DisplayAssignedIndependentServices
                              assignedIndependentServiceProductsToUpdate={
                                assignedIndependentServiceProductsToUpdate
                              }
                              handleServicePriceSaveBtn={
                                handleServicePriceSaveBtn
                              }
                              isShowError={isShowError}
                              currentServiceProductPrice={
                                currentServiceProductPrice
                              }
                              classes={classes}
                              handleIndependentServicePriceButtons={
                                handleIndependentServicePriceButtons
                              }
                              item={item}
                              index={index}
                              setAssignedIndependentServiceProductsToUpdate={
                                setAssignedIndependentServiceProductsToUpdate
                              }
                              independentServiceProductsDeletedArr={
                                independentServiceProductsDeletedArr
                              }
                              setIndependentServiceProductsDeletedArr={
                                setIndependentServiceProductsDeletedArr
                              }
                              setCurrentServiceProductPrice={
                                setCurrentServiceProductPrice
                              }
                              isPriceUpdated={isPriceUpdated}
                              setIsPriceUpdated={setIsPriceUpdated}
                              t={t}
                            />
                          )
                        )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: "1.25rem",
          paddingBottom: 0,
        }}
      >
        <>
          <Stack>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {!productId ? (
                <>
                  {independentCurrentTab == "1" &&
                    !isIndependentSearchEnabled &&
                    independentServiceProductsTotalCount > 0 && (
                      <>
                        <CustomerPagination
                          count={independentServicesPaginationCount + 1}
                          pageState={independentPageState}
                          setPageState={setIndependentPageState}
                        />
                        <DisplayEntriesCountText
                          currentPageState={independentPageState}
                          totalCount={independentServiceProductsTotalCount}
                        />
                      </>
                    )}
                  {independentCurrentTab == "1" &&
                    isIndependentSearchEnabled &&
                    independentServiceSearchedProductsTotalCount > 0 && (
                      <>
                        <CustomerPagination
                          count={independentServicesSearchedPaginationCount + 1}
                          pageState={independentSearchPageState}
                          setPageState={setIndependentSearchPageState}
                        />
                        <DisplayEntriesCountText
                          currentPageState={independentSearchPageState}
                          totalCount={
                            independentServiceSearchedProductsTotalCount
                          }
                        />
                      </>
                    )}
                </>
              ) : (
                <>
                  {independentCurrentTab === "1" ? (
                    !isIndependentSearchEnabled &&
                    independentServiceProductsTotalCount > 0 ? (
                      <>
                        <CustomerPagination
                          count={independentServicesPaginationCount + 1}
                          pageState={independentPageState}
                          setPageState={setIndependentPageState}
                        />
                        <DisplayEntriesCountText
                          currentPageState={independentPageState}
                          totalCount={independentServiceProductsTotalCount}
                        />
                      </>
                    ) : (
                      isIndependentSearchEnabled &&
                      independentServiceSearchedProductsTotalCount > 0 && (
                        <>
                          <CustomerPagination
                            count={
                              independentServicesSearchedPaginationCount + 1
                            }
                            pageState={independentSearchPageState}
                            setPageState={setIndependentSearchPageState}
                          />
                          <DisplayEntriesCountText
                            currentPageState={independentSearchPageState}
                            totalCount={
                              independentServiceSearchedProductsTotalCount
                            }
                          />
                        </>
                      )
                    )
                  ) : !isIndependentSearchEnabled &&
                    assignedIndependentServiceProductsTotalCount > 0 ? (
                    <>
                      <CustomerPagination
                        count={assignedIndependentServicesPaginationCount + 1}
                        pageState={assignedIndependentPageState}
                        setPageState={setAssignedIndependentPageState}
                      />
                      <DisplayEntriesCountText
                        currentPageState={assignedIndependentPageState}
                        totalCount={
                          assignedIndependentServiceProductsTotalCount
                        }
                      />
                    </>
                  ) : (
                    isIndependentSearchEnabled &&
                    assignedIndependentServiceSearchedProductsTotalCount >
                      0 && (
                      <>
                        <CustomerPagination
                          count={
                            assignedIndependentServicesSearchedPaginationCount +
                            1
                          }
                          pageState={assignedIndependentSearchPageState}
                          setPageState={setAssignedIndependentSearchPageState}
                        />
                        <DisplayEntriesCountText
                          currentPageState={assignedIndependentSearchPageState}
                          totalCount={
                            assignedIndependentServiceSearchedProductsTotalCount
                          }
                        />
                      </>
                    )
                  )}
                </>
              )}
            </div>
          </Stack>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "92px" }}
              onClick={() => handleCancelBtnClick()}
            >
              {t("CANCEL")}
            </Button>
            {showMarkAsIndependentBtn() && (
              <Button
                variant="contained"
                onClick={() => handleSaveBtnClick()}
                sx={{
                  width: "92px",
                  marginLeft: "15px",
                }}
                disabled={isShowError}
              >
                {t("SAVE")}
              </Button>
            )}
          </div>
        </>
      </DialogActions>
    </Dialog>
  );
};

export default AddIndependentServicesContainer;
