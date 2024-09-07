import {
  Box,
  Card,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Typography,
  Theme,
} from "@mui/material";
import Image from "next/image";
import Icon from "src/@core/components/icon";

const DisplayAssignedAssociateServices: React.FC<any> = ({
  assignedAssociateServiceProductsToUpdate,
  setAssignedAssociateServiceProductsToUpdate,
  handleServicePriceSaveBtn,
  isShowError,
  currentServiceProductPrice,
  setCurrentServiceProductPrice,
  classes,
  handleServicePriceButtons,
  item,
  index,
  associateServiceProductsDeletedArr,
  setAssociateServiceProductsDeletedArr,
  isPriceUpdated,
  setIsPriceUpdated,
  t,
}: any) => {
  const handleAssignedProductCheckChange = (
    selectedItem: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e?.currentTarget;

    // If User is Unassigning the product
    if (!checked) {
      // Update Service Product DeletedArr
      const serviceProductDeletedDetails: any = [
        ...associateServiceProductsDeletedArr,
      ];
      const { id } = selectedItem;
      const getIndex = serviceProductDeletedDetails.indexOf(id);
      if (getIndex === -1 && !checked) {
        serviceProductDeletedDetails.push(id);
      } else {
        serviceProductDeletedDetails.splice(getIndex, 1);
      }
      setAssociateServiceProductsDeletedArr([...serviceProductDeletedDetails]);
    }
    if (checked) {
      const filteredDeletedArrList = associateServiceProductsDeletedArr?.filter(
        (id: number) => id !== item?.id
      );
      setAssociateServiceProductsDeletedArr(filteredDeletedArrList);
    }
    // Update Assigned Product Services status in UI
    const productsToUpdate: any = [...assignedAssociateServiceProductsToUpdate];
    productsToUpdate.forEach((element: any, index: number) => {
      if (element?.id === selectedItem?.id) {
        productsToUpdate[index].isSelected = checked;
        productsToUpdate[index].isModified = true;
      }
    });
    setAssignedAssociateServiceProductsToUpdate([...productsToUpdate]);
  };

  return (
    <>
      <Card
        style={{
          padding: "0px",
          marginBottom: "20px",
        }}
      >
        {item?.serviceProducts?.hexCode ? (
          <Box
            className={classes.colorHexaCode}
            style={{
              backgroundColor: item?.serviceProducts?.hexCode
                ? item?.serviceProducts?.hexCode
                : "8c856c",
            }}
          >
            <Typography sx={{ fontSize: "11px" }}>
              {item?.serviceProducts?.hexCode}
            </Typography>
            <Checkbox
              className={classes.colorsCheckbox}
              checked={item?.isSelected}
              onChange={(e) => handleAssignedProductCheckChange(item, e)}
            />
          </Box>
        ) : (
          <Box
            className={classes.colorImgContainer}
            style={{
              backgroundColor: item?.serviceProducts?.hexCode
                ? item?.serviceProducts?.hexCode
                : "",
            }}
          >
            <Image
              // src={
              //   "https://retailprojects.s3.amazonaws.com/dev/product/11002834.png"
              // }
              src={"/images/pages/noImageDefault.png"}
              alt={`product ${item?.serviceProducts?.shortName} image`}
              width={100}
              height={69}
              className={classes.colorPaperImg}
            />
            <Checkbox
              className={classes.colorsCheckbox}
              checked={item?.isSelected}
              onChange={(e) => handleAssignedProductCheckChange(item, e)}
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
                  defaultValue={item?.price ?? 0}
                  onChange={(e) => {
                    setIsPriceUpdated(true);
                    setCurrentServiceProductPrice(
                      Number(e.target.value).toFixed(2)
                    );
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
                  }}
                >
                  <IconButton
                    sx={{ paddingTop: "10px" }}
                    onClick={() => handleServicePriceSaveBtn(item, index)}
                  >
                    <Icon icon="tabler:check" color="#00b341" width={"20px"} />
                  </IconButton>
                  <IconButton
                    sx={{ paddingTop: "10px" }}
                    onClick={() => handleServicePriceButtons(item, index)}
                  >
                    <Icon icon="tabler:x" color="#ea5455" width={"20px"} />
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
                    color: (theme: Theme) =>
                      theme.palette.mode === "light" ? "#4B465C" : "#e4e6f4",
                    wordWrap: "break-word",
                  }}
                >
                  {item?.serviceProducts?.shortName}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  {Number(item?.price) > 0 && (
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
                      {t("PRICE")} {item?.price ? Number(item?.price) : 0}
                    </Typography>
                  )}
                  <IconButton
                    sx={{ paddingTop: "10px" }}
                    onClick={() => handleServicePriceButtons(item, index)}
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
    </>
  );
};

export default DisplayAssignedAssociateServices;
