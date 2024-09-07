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

import { useTranslation } from "react-i18next";
import Image from "next/image";
import sx from "mui-sx";
import Icon from "src/@core/components/icon";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DisplayAssignedAssociateServices from "./DisplayAssignedAssociateServices";
import CustomerPagination from "src/components/customers/CustomerPagination";
import {
  useAddServicesStyles,
  sxServicesDialog,
  sxDialogWidthCommon,
  sxDialogWidthSNum,
} from "src/styles/addServices.styles";

const AddAssociateServicesContainer: React.FC<any> = ({
  openServicesDialog,
  setOpenServicesDialog,
  isAssociateServicesLoading,
  isAssignedAssociateServicesLoading,
  associateCurrentTab,
  setAssociateCurrentTab,
  currentAssociateServiceProducts,
  setCurrentAssociateServiceProducts,
  selectedUnAssignedAssociateServiceProducts,
  setSelectedUnAssignedAssociateServiceProducts,
  selectedServiceType,
  setIsMarkAsAssociate,
  setIsMarkAsExclusive,
  setIsDeleteProductsOnSave,
  currentAssignedAssociateServiceProducts,
  setCurrentAssignedAssociateServiceProducts,
  associateServiceProductsDeletedArr,
  setAssociateServiceProductsDeletedArr,
  associateServiceProductsTotalCount,
  associateServicesPaginationCount,
  assignedAssociateServicesPaginationCount,
  assignedAssociateServiceProductsTotalCount,
  associatePageState,
  setAssociatePageState,
  assignedAssociatePageState,
  setAssignedAssociatePageState,
  productId,
  handleAssociateSearchProduct,
  isAssociateServicesSearchLoading,
  currentAssociateServiceSearchedProducts,
  setCurrentAssociateServiceSearchedProducts,
  associateServiceSearchedProductsTotalCount,
  associateServicesSearchedPaginationCount,
  associateSearchPageState,
  setAssociateSearchPageState,
  isAssociateSearchEnabled,
  setIsAssociateSearchEnabled,
  associateSearchItem,
  setAssociateSearchItem,
  isAssignedAssociateServicesSearchLoading,
  assignedAssociateServiceSearchedProducts,
  assignedAssociateServiceSearchedProductsTotalCount,
  currentAssignedAssociateServiceSearchedProducts,
  setCurrentAssignedAssociateServiceSearchedProducts,
  selectedUnAssignedAssociateServiceSearchedProducts,
  setSelectedUnAssignedAssociateServiceSearchedProducts,
  assignedAssociateServicesSearchedPaginationCount,
  assignedAssociateSearchPageState,
  setAssignedAssociateSearchPageState,
}: any) => {
  const theme = useTheme();
  const classes = useAddServicesStyles(theme);
  const { t } = useTranslation();

  const [fullpage, setFullPage] = useState<boolean>(false);

  const [
    associateServiceProductsToUpdate,
    setAssociateServiceProductsToUpdate,
  ] = useState<any>(
    JSON.parse(
      JSON.stringify(
        isAssociateSearchEnabled
          ? currentAssociateServiceSearchedProducts
          : currentAssociateServiceProducts
      )
    )
  );

  const [
    assignedAssociateServiceProductsToUpdate,
    setAssignedAssociateServiceProductsToUpdate,
  ] = useState<any>(
    JSON.parse(
      JSON.stringify(
        isAssociateSearchEnabled
          ? currentAssignedAssociateServiceSearchedProducts
          : currentAssignedAssociateServiceProducts
      )
    )
  );

  const [currentServiceProductPrice, setCurrentServiceProductPrice] =
    useState<any>(0);
  const [isPriceUpdated, setIsPriceUpdated] = useState<boolean>(false);
  const [isShowError, setIsShowError] = useState(false);

  // Update when Unassigned data is fetched
  useEffect(() => {
    setAssociateServiceProductsToUpdate(
      JSON.parse(
        JSON.stringify(
          isAssociateSearchEnabled
            ? currentAssociateServiceSearchedProducts
            : currentAssociateServiceProducts
        )
      )
    );
  }, [
    currentAssociateServiceProducts,
    currentAssociateServiceSearchedProducts,
  ]);

  // update when Assigned data is fetched
  useEffect(() => {
    setAssignedAssociateServiceProductsToUpdate(
      JSON.parse(
        JSON.stringify(
          isAssociateSearchEnabled
            ? currentAssignedAssociateServiceSearchedProducts
            : currentAssignedAssociateServiceProducts
        )
      )
    );
  }, [
    currentAssignedAssociateServiceProducts,
    currentAssignedAssociateServiceSearchedProducts,
  ]);

  const showMarkAsAssociateBtn = () => {
    if (associateCurrentTab === "1") {
      const isShowBtn = associateServiceProductsToUpdate?.some(
        (item: any) => item.isModified === true || item.isSelected === true
      );
      return isShowBtn;
    } else {
      const isShowBtn = assignedAssociateServiceProductsToUpdate?.some(
        (item: any) => item.isModified === true || item.isSelected === true
      );
      return isShowBtn;
    }
  };

  const handleProductCheckChange = (
    selectedItem: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e?.currentTarget;

    if (associateCurrentTab === "1") {
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(associateServiceProductsToUpdate)
      );
      productsToUpdate.forEach((element: any, index: number) => {
        if (element?.id === selectedItem?.id) {
          productsToUpdate[index].isSelected = checked;
          productsToUpdate[index].isModified = true;
        }
      });
      setAssociateServiceProductsToUpdate([...productsToUpdate]);
    } else {
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(assignedAssociateServiceProductsToUpdate)
      );
      productsToUpdate.forEach((element: any, index: number) => {
        if (element?.id === selectedItem?.id) {
          productsToUpdate[index].isSelected = checked;
          productsToUpdate[index].isModified = true;
        }
      });
      setAssignedAssociateServiceProductsToUpdate([...productsToUpdate]);
    }
  };

  const displaySelectAllCheckedStatus = () => {
    if (associateCurrentTab === "1") {
      if (associateServiceProductsToUpdate?.length === 0) return false;

      const isAllItemsNotSelected = associateServiceProductsToUpdate?.some(
        (item: any) => item?.isSelected === false
      );
      return isAllItemsNotSelected ? false : true;
    } else {
      if (assignedAssociateServiceProductsToUpdate?.length === 0) return false;

      const isAllAssignedItemsNotSelected =
        assignedAssociateServiceProductsToUpdate?.some(
          (item: any) => item?.isSelected === false
        );
      return isAllAssignedItemsNotSelected ? false : true;
    }
  };

  const handleCancelBtnClick = () => {
    setIsDeleteProductsOnSave(true);
    setIsMarkAsAssociate(false);
    setIsMarkAsExclusive(false);
    setOpenServicesDialog(false);
  };

  const handleAssociateBtnClick = () => {
    if (associateCurrentTab === "1") {
      // deep copy purpose
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(associateServiceProductsToUpdate)
      );

      if (isAssociateSearchEnabled) {
        setCurrentAssociateServiceSearchedProducts(
          JSON.parse(JSON.stringify(productsToUpdate))
        );
      } else {
        setCurrentAssociateServiceProducts(
          JSON.parse(JSON.stringify(productsToUpdate))
        );
      }

      // copy the selected products for persistence
      const selectedProducts: any = associateServiceProductsToUpdate?.filter(
        (element: any) => element.isSelected === true
      );

      let existingSelectedProducts = JSON.parse(
        JSON.stringify(
          isAssociateSearchEnabled
            ? selectedUnAssignedAssociateServiceSearchedProducts
            : selectedUnAssignedAssociateServiceProducts
        )
      );

      const currentPage = isAssociateSearchEnabled
        ? associateSearchPageState.page
        : associatePageState.page;

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
        if (isAssociateSearchEnabled) {
          const mergedDetails = [
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

      if (isAssociateSearchEnabled) {
        setSelectedUnAssignedAssociateServiceSearchedProducts(
          JSON.parse(JSON.stringify(existingSelectedProducts))
        );
      } else {
        setSelectedUnAssignedAssociateServiceProducts(
          JSON.parse(JSON.stringify(existingSelectedProducts))
        );
      }
    } else {
      // deep copy purpose
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(assignedAssociateServiceProductsToUpdate)
      );

      // copy the selected products for persistence
      const selectedProducts: any = productsToUpdate?.filter(
        (element: any) => element.isSelected === true
      );

      setCurrentAssignedAssociateServiceProducts(
        JSON.parse(JSON.stringify(selectedProducts))
      );
    }

    setAssociateSearchItem("");
    setIsAssociateSearchEnabled(false);

    setIsMarkAsAssociate(true);
    setOpenServicesDialog(false);
    setIsMarkAsExclusive(false);
  };

  const handleAllProductsSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.currentTarget;
    if (associateCurrentTab === "1") {
      // deep copy purpose
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(associateServiceProductsToUpdate)
      );

      productsToUpdate.forEach((element: any, index: number) => {
        productsToUpdate[index].isSelected = checked;
        productsToUpdate[index].isModified = true;
      });
      setAssociateServiceProductsToUpdate([...productsToUpdate]);
    } else {
      // Update AssignedProduct Services
      let productsIds: any = [];
      let assignedProductsToUpdate: any = JSON.parse(
        JSON.stringify(assignedAssociateServiceProductsToUpdate)
      );

      assignedProductsToUpdate.forEach((element: any, index: number) => {
        assignedProductsToUpdate[index].isSelected = checked;
        assignedProductsToUpdate[index].isModified = true;
        productsIds.push(element?.id);
      });
      setAssignedAssociateServiceProductsToUpdate([
        ...assignedProductsToUpdate,
      ]);

      // Update Service Product DeletedArr
      if (checked) {
        setAssociateServiceProductsDeletedArr([]);
      } else {
        setAssociateServiceProductsDeletedArr([...productsIds]);
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

  const handleServicePriceButtons = (item: any, index: number) => {
    if (associateCurrentTab === "1") {
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(associateServiceProductsToUpdate)
      );
      productsToUpdate = updateEditPriceElementDisplay(productsToUpdate, item);
      setAssociateServiceProductsToUpdate([...productsToUpdate]);
    } else {
      let productsToUpdate: any = JSON.parse(
        JSON.stringify(assignedAssociateServiceProductsToUpdate)
      );
      productsToUpdate = updateEditPriceElementDisplay(productsToUpdate, item);
      setAssignedAssociateServiceProductsToUpdate([...productsToUpdate]);
    }
    setIsShowError(false);
  };

  const handleServicePriceSaveBtn = (item: any, index: number) => {
    let productsToUpdate: any = JSON.parse(
      JSON.stringify(associateServiceProductsToUpdate)
    );
    if (associateCurrentTab === "2") {
      productsToUpdate = JSON.parse(
        JSON.stringify(assignedAssociateServiceProductsToUpdate)
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
        productsToUpdate[getIndex].isModified = true; // update modified flag

        if (associateCurrentTab === "1") {
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

    if (associateCurrentTab === "1") {
      setAssociateServiceProductsToUpdate([...productsToUpdate]);
    } else {
      setAssignedAssociateServiceProductsToUpdate([...productsToUpdate]);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setAssociateCurrentTab(newValue);
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
                  setAssociateSearchItem(value);
                  if (!value) {
                    setIsAssociateSearchEnabled(false);
                    if (associateCurrentTab === "1") {
                      setAssociateServiceProductsToUpdate([
                        ...currentAssociateServiceProducts,
                      ]);
                    } else {
                      setAssignedAssociateServiceProductsToUpdate([
                        ...currentAssignedAssociateServiceProducts,
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
                  handleAssociateSearchProduct(associateSearchItem)
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
                {associateSearchItem &&
                  associateSearchItem.length < 3 &&
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
          <TabContext value={associateCurrentTab}>
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
                  {isAssociateServicesLoading ||
                  isAssociateServicesSearchLoading ? (
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
                  ) : associateServiceProductsToUpdate?.length === 0 ? (
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
                      {associateServiceProductsToUpdate.map(
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
                                    handleProductCheckChange(item, e)
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
                                    handleProductCheckChange(item, e)
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
                                          handleServicePriceButtons(item, index)
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
                                          handleServicePriceButtons(item, index)
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
                  {isAssignedAssociateServicesLoading ||
                  isAssignedAssociateServicesSearchLoading ? (
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
                  ) : assignedAssociateServiceProductsToUpdate?.length === 0 ? (
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
                      {assignedAssociateServiceProductsToUpdate?.length > 0 &&
                        assignedAssociateServiceProductsToUpdate.map(
                          (item: any, index: number) => (
                            <DisplayAssignedAssociateServices
                              assignedAssociateServiceProductsToUpdate={
                                assignedAssociateServiceProductsToUpdate
                              }
                              handleServicePriceSaveBtn={
                                handleServicePriceSaveBtn
                              }
                              isShowError={isShowError}
                              currentServiceProductPrice={
                                currentServiceProductPrice
                              }
                              classes={classes}
                              handleServicePriceButtons={
                                handleServicePriceButtons
                              }
                              item={item}
                              index={index}
                              setAssignedAssociateServiceProductsToUpdate={
                                setAssignedAssociateServiceProductsToUpdate
                              }
                              associateServiceProductsDeletedArr={
                                associateServiceProductsDeletedArr
                              }
                              setAssociateServiceProductsDeletedArr={
                                setAssociateServiceProductsDeletedArr
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
                  {associateCurrentTab == "1" &&
                    !isAssociateSearchEnabled &&
                    associateServiceProductsTotalCount > 0 && (
                      <>
                        <CustomerPagination
                          count={associateServicesPaginationCount + 1}
                          pageState={associatePageState}
                          setPageState={setAssociatePageState}
                        />
                        <DisplayEntriesCountText
                          currentPageState={associatePageState}
                          totalCount={associateServiceProductsTotalCount}
                        />
                      </>
                    )}
                  {associateCurrentTab == "1" &&
                    isAssociateSearchEnabled &&
                    associateServiceSearchedProductsTotalCount > 0 && (
                      <>
                        <CustomerPagination
                          count={associateServicesSearchedPaginationCount + 1}
                          pageState={associateSearchPageState}
                          setPageState={setAssociateSearchPageState}
                        />
                        <DisplayEntriesCountText
                          currentPageState={associateSearchPageState}
                          totalCount={
                            associateServiceSearchedProductsTotalCount
                          }
                        />
                      </>
                    )}
                </>
              ) : (
                <>
                  {associateCurrentTab === "1" ? (
                    !isAssociateSearchEnabled &&
                    associateServiceProductsTotalCount > 0 ? (
                      <>
                        <CustomerPagination
                          count={associateServicesPaginationCount + 1}
                          pageState={associatePageState}
                          setPageState={setAssociatePageState}
                        />
                        <DisplayEntriesCountText
                          currentPageState={associatePageState}
                          totalCount={associateServiceProductsTotalCount}
                        />
                      </>
                    ) : (
                      isAssociateSearchEnabled &&
                      associateServiceSearchedProductsTotalCount > 0 && (
                        <>
                          <CustomerPagination
                            count={associateServicesSearchedPaginationCount + 1}
                            pageState={associateSearchPageState}
                            setPageState={setAssociateSearchPageState}
                          />
                          <DisplayEntriesCountText
                            currentPageState={associateSearchPageState}
                            totalCount={
                              associateServiceSearchedProductsTotalCount
                            }
                          />
                        </>
                      )
                    )
                  ) : !isAssociateSearchEnabled &&
                    assignedAssociateServiceProductsTotalCount > 0 ? (
                    <>
                      <CustomerPagination
                        count={assignedAssociateServicesPaginationCount + 1}
                        pageState={assignedAssociatePageState}
                        setPageState={setAssignedAssociatePageState}
                      />
                      <DisplayEntriesCountText
                        currentPageState={assignedAssociatePageState}
                        totalCount={assignedAssociateServiceProductsTotalCount}
                      />
                    </>
                  ) : (
                    isAssociateSearchEnabled &&
                    assignedAssociateServiceSearchedProductsTotalCount > 0 && (
                      <>
                        <CustomerPagination
                          count={
                            assignedAssociateServicesSearchedPaginationCount + 1
                          }
                          pageState={assignedAssociateSearchPageState}
                          setPageState={setAssignedAssociateSearchPageState}
                        />
                        <DisplayEntriesCountText
                          currentPageState={assignedAssociateSearchPageState}
                          totalCount={
                            assignedAssociateServiceSearchedProductsTotalCount
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
            {showMarkAsAssociateBtn() &&
              selectedServiceType === "associate" && (
                <Button
                  variant="contained"
                  onClick={() => handleAssociateBtnClick()}
                  disabled={isShowError}
                  sx={{ marginLeft: "15px" }}
                >
                  {associateCurrentTab === "1"
                    ? t("SAVE_AS_ASSOCIATE")
                    : t("SAVE")}
                </Button>
              )}
          </div>
        </>
      </DialogActions>
    </Dialog>
  );
};

export default AddAssociateServicesContainer;
