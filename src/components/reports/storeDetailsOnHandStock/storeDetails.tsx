import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { useTranslation } from "react-i18next";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import toast, { Toaster } from "react-hot-toast";
import StoreCard from "./storeCard";
import { Controller, useForm } from "react-hook-form";
import { countries as countryCodes } from "src/utils/countries";

import {
  AppBar,
  Autocomplete,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import GridCustomHeader from "src/components/common/CommonServerSidePaging/components/GridCustomHeader";
import { useStyles } from "src/components/price-list/price-list-style";
import Icon from "src/@core/components/icon";
import { dispatch } from "rxjs/internal/observable/pairs";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useSelector } from "react-redux";
import {
  stockOnhandStoreWise,
  stockOnhandTiles,
  stockOnhandShareStoreDetails,
} from "src/store/apps/reports";
import { onlyNumeric } from "src/constants/validation/regX";

export default function StoreDetailsPopup(props: any) {
  const { t } = useTranslation();

  const settings: any = window.localStorage.getItem("settings");
  const mode = JSON.parse(settings)?.mode;
  const direction = JSON.parse(settings)?.direction;

  const classes = useStyles({ direction });

  const {
    openStoreDetails,
    setOpenStoreDetails,
    showHeaderActionBtn = true,
    storeData,
    renderStorePage,
    classification,
    formData,
    setFormData,
    handleInput,
  } = props;
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");
  const [isSelected, setIsSelected] = useState(); // Initialize selected state
  const [selectedCard, setSelectedCard] = useState({});
  const [filteredStores, setFilteredStores] = useState([]);

  const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch<AppDispatch>();
  // console.log(storeData, "-----------------======================");

  const getstockOnhandStoreWise = useCallback(
    async () => {
      try {
        // Dispatch the thunk action with the constructed object
        let response;
        if (classification === "byProduct") {
          response = await dispatch(
            stockOnhandStoreWise({
              productId: storeData?.productId,
              batchId: storeData?.batchId,
              byBatch: false,
              byProduct: true,
            })
          );
        } else {
          response = await dispatch(
            stockOnhandStoreWise({
              productId: storeData?.productId,
              batchId: storeData?.batchId,
              byBatch: true,
              byProduct: false,
            })
          );
        }
        // console.log(response.payload.data, "00000000-------");
        setFilteredStores(response.payload.data);
        // Log or use the response as needed
        // console.log(response, 'response');
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    },
    [
      dispatch,
      classification,
      storeData.productId,
      storeData.batchId,
      renderStorePage,
    ] // Include all dependencies used inside useCallback
  );

  const stockOnHandStoreData: any = useSelector(
    (state: RootState) => state?.stockOnhandSlice
  );

  useEffect(() => {
    // console.log('called................................')
    getstockOnhandStoreWise();
    // getStockOnhandDetails(classification, byStore);
  }, [storeData.id]);

  const getStockOnhandShareStoreDetails = () => {
    try {
      const phone = `${formData.countryCode}${formData.phoneNumber}`;
      // console.log(phone, "phone------------------------");
      const requestData = {
        phone,
        selectedCard /* Your storeDetails object */,
      };

      // Dispatch the thunk action with the constructed object
      dispatch(stockOnhandShareStoreDetails(requestData))
        .then((response) => {
          // Log or use the response as needed
          toast.success(response.payload.message, {
            // containerStyle={{zIndex: 99999}}
          });
        })
        .catch((error) => {
          console.error(error);
          // Handle error appropriately
        });
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  };

  const handleFullWidthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFullWidth(event.target.checked);
  };

  const totalAvailableQuantity = stockOnHandStoreData.storeWise.reduce(
    (sum, item) => sum + item.availableQuantity,
    0
  );

  const handleSelectCard = (store, index) => {
    // Toggle the selected state when clicked
    setIsSelected(index);
    setSelectedCard(store);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Perform filtering based on the search term
    const filteredProducts = stockOnHandStoreData.storeWise.filter(
      (product) => {
        // Convert all values to lowercase for case-insensitive search
        const values = Object.values(product.store).map((value) =>
          value.toString().toLowerCase()
        );
        return values.some((value) => value.includes(searchTerm.toLowerCase()));
      }
    );
    setFilteredStores(filteredProducts);
    // Handle the filtered data as needed
    // console.log(filteredProducts, "imran");
  };

  // useEffect(() => {
  //   handleSearch();
  // }, [searchTerm]);

  return (
    <React.Fragment>
      <Toaster
        toastOptions={{
          style: {
            zIndex: 99999,
            // Add any other styles you want to apply globally to toast notifications
          },
        }}
      />
      <Dialog
        fullWidth={fullWidth}
        maxWidth={"lg"}
        open={openStoreDetails}
        onClose={() => setOpenStoreDetails(false)}
        // sx={{ // Apply styles directly to the Dialog component
        //   width: "90%", // Set the desired width
        //   maxHeight: "90vh", // Set the maximum height
        // }}
        PaperProps={{
          style: {
            width: "1050px", // Fixed width of 400px
            height: "1050px", // Adjust this value to set the desired height
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "#D7E7F4",
              //  border: "2px solid #3586C7",
            }}
          >
            <AppBar
              position="static"
              sx={{ bgcolor: "transparent", height: "60px", width: "100%" }}
            >
              {/* {console.log(formData, "-=====------")} */}
              <Toolbar>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    flexGrow: 1, // To make the Typography component expand to fill available space
                    display: { xs: "none", sm: "block" },
                    color: "#3586C7",
                  }}
                >
                  {t("Available in {{count}} Stores", {
                    count: stockOnHandStoreData.storeWise.length,
                  })}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#D7E7F4",
                    "& > *": {
                      // Selects all direct child elements
                      marginRight: "8px", // Adjust the desired spacing between child elements
                    },
                  }}
                >
                  <Box>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-around"
                      alignItems="flex-start"
                    >
                      <Grid item xs={4}>
                        {/* <div>{t("COUNTRY")}*</div> */}
                        <FormControl fullWidth>
                          <Controller
                            name="countryCode"
                            control={control}
                            render={({ field: { value, onChange } }) => {
                              return (
                                <Autocomplete
                                  className={classes.autoComplete}
                                  componentsProps={{
                                    popper: { style: { width: "90px" } },
                                  }}
                                  id="country-select-demo"
                                  options={countryCodes ?? []}
                                  autoHighlight
                                  size="small"
                                  disableClearable={true}
                                  fullWidth
                                  value={formData.countryCode} // Ensure this matches your state
                                  onChange={(event, newValue) => {
                                    // Adjusted for Autocomplete: Directly set the new value for a specific form field
                                    setFormData((prevFormData) => ({
                                      ...prevFormData,
                                      countryCode: newValue,
                                    }));
                                  }}
                                  getOptionLabel={(option: any) => option}
                                  renderOption={(props, option: any) => (
                                    <Box
                                      sx={{ width: "auto" }}
                                      component="li"
                                      {...props}
                                    >
                                      {option}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name="countryCode" // This name is used for consistent form field reference
                                      placeholder={t("CODE") as string}
                                      sx={{
                                        borderRadius: "5px", // Apply borderRadius directly to the TextField
                                        // width:"120px",
                                        "& .MuiOutlinedInput-root": {
                                          "& > fieldset": {
                                            borderColor: "white",
                                          },
                                        },
                                        backgroundColor: "white",
                                        "&::placeholder": {
                                          color: "lightgray",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              );
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={7}>
                        {/* <div>{t("MOBILE_NUMBER")}*</div> */}
                        <TextField
                          type="number"
                          name="phoneNumber"
                          sx={{
                            borderRadius: "5px",
                            "& .MuiOutlinedInput-root": {
                              "& > fieldset": {
                                borderColor: "white",
                              },
                            },
                            backgroundColor: "white",
                            "&::placeholder": {
                              color: "lightgray",
                            },
                          }}
                          value={formData.phoneNumber}
                          onChange={(event) => {
                            // Adjusted for TextField of type number: Set the new value from the event
                            const newValue = event.target.value;
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              phoneNumber: newValue,
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (!onlyNumeric(e?.key, e?.ctrlKey)) {
                              e.preventDefault();
                            }
                          }}
                          fullWidth
                          size="small"
                          placeholder={t("MOBILE") as string}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{
                      py: 2.5,
                      width: "99px", // Adjust width as needed
                      height: "35px", // Adjust height as needed
                    }}
                    onClick={getStockOnhandShareStoreDetails}
                  >
                    {" "}
                    <Icon
                      icon="tabler:send"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#3586C7",
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      noWrap
                      component="div"
                      sx={{
                        flexGrow: 1,
                        ml: 2,
                        display: { xs: "none", sm: "block" },
                        color: "#3586C7",
                      }}
                    >
                      {t("Share")}
                    </Typography>
                  </Button>
                </Box>
              </Toolbar>
            </AppBar>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Toolbar>
              <Grid
                item
                container
                className={classes.search}
                sm={12}
                md={showHeaderActionBtn === false ? 12 : 6}
                sx={
                  showHeaderActionBtn === false
                    ? { justifyContent: "center", width: "100%" }
                    : {}
                }
              >
                <Grid
                  item
                  xs={8}
                  sm={10}
                  md={8}
                  sx={{ marginRight: "5px", display: "flex" }}
                >
                  <TextField
                    // inputRef={ref}
                    size="small"
                    fullWidth
                    sx={{ mr: 2 }}
                    // error={error}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // onChange={(e) => {
                    //   // setInput(e.target.value);
                    //   if (e?.target?.value === "") {
                    //     // handleClick();
                    //   }
                    // }}
                    // placeholder={searchText}
                    onKeyPress={(event: any) => {
                      if (event.key === "Enter") {
                        // handleClick();
                      }
                    }}
                    // defaultValue={name ? name : value}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          // onClick={() => handleSearch("")}
                        >
                          {/* {value?.length > 0 && <Icon icon="iconamoon:close" />} */}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Button
                  variant="outlined"
                  size="medium"
                  className={classes.search_button}
                  onClick={() => handleSearch()}
                >
                  <Icon fontSize="1.45rem" icon="tabler:search" />
                </Button>
              </Grid>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  ml: "auto", // This pushes the Typography to the right
                  color: "#1e9553",
                  fontWeight: "bold",
                  marginBottom: 1,
                }}
              >
                <span style={{ color: "#4B465C" }}>
                  {t(storeData.product?.shortName)}
                </span>
                <br />
                <span style={{ color: "#28C76F" }}>
                  {t("Available Stock {{count}} Cans", {
                    count: totalAvailableQuantity,
                  })}
                </span>
              </Typography>
            </Toolbar>
          </Box>
        </DialogTitle>
        <DialogContent
          style={{ minHeight: "550px" }} // Set the desired minimum height here
        >
          <Grid container spacing={1}>
            {filteredStores.map((storeData: any, index: any) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StoreCard
                  storeData={storeData}
                  index={index}
                  isSelected={isSelected}
                  handleSelectCard={handleSelectCard}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenStoreDetails(false)}
            variant="contained"
            sx={{
              height: "35px", // Adjust the height as needed
              width: "90px", // Adjust the width as needed
              fontSize: "1rem", // Adjust the font size as needed
            }}
          >
            {t("Close")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
