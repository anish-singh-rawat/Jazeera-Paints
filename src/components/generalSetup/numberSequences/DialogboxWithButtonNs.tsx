import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
  Box,
  Container,
  CssBaseline,
  Stack,
  Avatar,
  DialogContentText,
  Divider,
  Chip,
  TextField,
} from "@mui/material";
import Icon from "src/@core/components/icon";
import { t } from "i18next";
import { makeStyles, styled } from "@mui/styles";
import { Key } from "src/@core/layouts/utils";
// import AccordionWithData from "./AccordianListView";
import AppEvent from "src/app/AppEvent";
import paper from "src/@core/theme/overrides/paper";

interface NumberSequencesCardDialogProps {
  cardHeaderTitle?: string;
  dialogTitle: string;
  leftListItems: any[];
  rightListItems?: any[];
  buttonTitle: string;
  subTitle: string;
  fullWidth?: boolean;
  maxWidth?: any;
  setDialogData?: any;
  viewButtonTitle: string;
  item: any;
  dialogViewTitle: string;
}

const useStyles = makeStyles({
  popUpSubHeader: {
    fontSize: "13px",
    fontStyle: "normal",
    fontWeight: "400",
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontSize: "14px",
    },
  },
  btnDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "24px",
  },
  leftGrid: { border: "1px solid #ccc", borderRadius: "5px" },
  rightGrid: { border: "1px solid #ccc", borderRadius: "5px" },
  gridContainer: {
    display: "flex",
    gap: "5px",
  },
  accordion: {
    padding: "8px 12px",
  },
  // old
  rightSideHeading: {
    padding: "24px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // height: "100%",
  },
  no_terminal_text: {
    padding: "10px",
    fontWeight: "700",
    fontSize: "13px",
    color: "#A8AAAE",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: "0, auto",
    height: "inherit",
  },
  centerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
});

const NumberSequencesCardDialog: React.FC<NumberSequencesCardDialogProps> = ({
  cardHeaderTitle,
  dialogTitle,
  leftListItems,
  rightListItems,
  buttonTitle,
  subTitle,
  fullWidth,
  maxWidth,
  setDialogData,
  viewButtonTitle,
  item,
  dialogViewTitle,
}) => {
  const classes = useStyles();

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [numericValue, setNumericValue] = useState('')

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const year = new Date().getFullYear();
  const month = new Date().toLocaleString("en-US", { month: "long" });
  const storeCode = "S001";
  const companyCode = "CC1";
  const openViewDialog = () => setIsViewDialogOpen(true);
  const closeViewDialog = () => setIsViewDialogOpen(false);
  const [formatValue, setFormatValue] = useState("");
  const [draggedPrefixChip, setDraggedPrefixChip] = useState([]);
  const [draggedSuffixChip, setDraggedSuffixChip] = useState([]);

  const handleSaveButton = () => {
    const mappedItems = selectedItems.map((item) => ({
      promotionHeaderColumns: { id: item.id },
    }));
    setDialogData(mappedItems);
    mappedItems.length
      ? setIsDialogOpen(false)
      : AppEvent.messageEmit({
          type: "error",
          message: "PLEASE_SELECT_ATTRIBUTE",
        });
  };
  // State declarations...

  // Function declarations...

  // Function to concatenate prefix, numeric, and suffix and set the value in the format text field
  const updateFormatText = () => {
    const prefixValue = draggedPrefixChip.join(" "); // Concatenate prefix chips
    const suffixValue = draggedSuffixChip.join(" "); // Concatenate suffix chips
    // Concatenate prefix, numeric, and suffix with a space in between
    const newValue = `${prefixValue} ${numericValue} ${suffixValue}`;
    console.log(newValue, "newValue");

    // Set the concatenated value in the format text field
    setFormatValue(newValue);
  };

  useEffect(() => {
    // Update format text whenever draggedPrefixChip or draggedSuffixChip changes
    updateFormatText();
  }, [draggedPrefixChip, draggedSuffixChip, numericValue]);

  // const updateFormatText = () => {
  //   const prefixValue = draggedPrefixChip.join(" "); // Concatenate prefix chips
  //   const suffixValue = draggedSuffixChip.join(" "); // Concatenate suffix chips
  //   // Concatenate prefix, numeric, and suffix with a space in between
  //   const newValue = `${prefixValue} ${formatValue} ${suffixValue}`;
  //   // Set the concatenated value in the format text field
  //   setFormatValue(newValue);
  // };

  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleString("en-US", { month: "long" });
  };

  // const handleSaveButton = () => {
  //   const mappedItems = selectedItems.map((item) => ({
  //     promotionHeaderColumns: { id: item.id },
  //   }));
  //   setDialogData(mappedItems);
  //   mappedItems.length
  //     ? setIsDialogOpen(false)
  //     : AppEvent.messageEmit({
  //         type: "error",
  //         message: "PLEASE_SELECT_ATTRIBUTE",
  //       });
  // };

  // const handleAddToRightList = (item: any) => {
  //   setSelectedItems([...selectedItems, item]);
  // };

  // const handleRemoveFromRightList = (item: any) => {
  //   const updatedList = selectedItems.filter(
  //     (selectedItem) => selectedItem !== item
  //   );
  //   setSelectedItems(updatedList);
  // };

  // const handleClearAll = () => {
  //   setSelectedItems([]);
  // };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    // Add height and width here
    height: "100px", // Example height
    width: "100px", // Example width
  }));

  const handleDrag = (e) => {
    // e.dataTransfer.setData("text", e.target.innerText);
  };

  const handleDragStart = (event) => {
    // Set the data to be transferred during the drag operation
    console.log(event.target, "event");

    const text = event.currentTarget.querySelector(".MuiChip-label").innerText;
    // Set the data to be transferred during the drag operation
    event.dataTransfer.setData("text", text);
  };

  const handleDrop = (event, targetBox) => {
    event.preventDefault();

    // Retrieve the data from the drag event
    const data = event.dataTransfer.getData("text");
    console.log(data, targetBox, "data");
    // Update the content of the target box based on the dropped data
    switch (targetBox) {
      case "prefix":
        // Update the content of the prefix box
        console.log("Dropped chip in prefix box:", data);
        setDraggedPrefixChip((prevChips) => [...prevChips, data]);
        break;
      case "suffix":
        // Update the content of the suffix box
        console.log("Dropped chip in suffix box:", data);
        setDraggedSuffixChip((prevChips) => [...prevChips, data]);
        break;
      default:
        break;
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = (data, targetBox) => {
    switch (targetBox) {
      case "prefix":
        const updatedPrefixChips = draggedPrefixChip.filter(
          (chip) => chip !== data
        );
        setDraggedPrefixChip(updatedPrefixChips);
        break;
      case "suffix":
        const updatedSuffixChips = draggedSuffixChip.filter(
          (chip) => chip !== data
        );
        setDraggedSuffixChip(updatedSuffixChips);
        break;
      default:
      // Do nothing for other cases
    }
  };

  return (
    <>
      <Card style={{ backgroundColor: "#F8F8F8" }}>
        <CardHeader className={classes.cardHeader} title={cardHeaderTitle} />
        <div className={classes.btnDiv}>
          {/* <Button
            variant="outlined"
            color="secondary"
            onClick={item?.id ? openViewDialog : openDialog}
            size="medium"
          >
            {item?.id ? t(Key(viewButtonTitle)) : t(Key(buttonTitle))}
          </Button> */}
        </div>
      </Card>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth={fullWidth || true}
        maxWidth={maxWidth || "lg"}
      >
        {/* <Box
      minHeight="90vh"
    > */}
        <DialogTitle
          id="scroll-dialog-title"
          style={{ textAlign: "center" }} // Correct way to center text
        >
          Parameters
        </DialogTitle>
        <Divider />
        <DialogContent style={{ backgroundColor: "#F8F8F8" }}>
          <DialogContentText>
            <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3 }}>
              <Typography sx={{ my: 3 }}>
                Drag and Drop parameters into Prefix & Suffix to setup the
                format
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  draggable
                  onDragStart={(e) => handleDragStart(e)}
                  label={getCurrentYear()}
                  component="a"
                  href="#basic-chip"
                  clickable
                />
                <Chip
                  draggable
                  onDragStart={(e) => handleDragStart(e)}
                  label={getCurrentMonth()}
                  component="a"
                  href="#basic-chip"
                  clickable
                />
                <Chip
                  draggable
                  onDragStart={(e) => handleDragStart(e)}
                  label="Clickable Link3"
                  component="a"
                  href="#basic-chip"
                  clickable
                />
              </Stack>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs>
                  <Typography my={2}>Prefix</Typography>
                  <Box
                    height={150}
                    display="flex"
                    alignItems="center"
                    gap={4}
                    p={2}
                    onDrop={(e) => handleDrop(e, "prefix")}
                    onDragOver={handleDragOver}
                    sx={{
                      border: "1px solid #DBDADE",
                      borderRadius: "8px",
                    }}
                  >
                    {draggedPrefixChip &&
                      draggedPrefixChip.map((prefix) => (
                        <Chip
                          label={prefix}
                          style={{ cursor: "pointer" }}
                          onDelete={() => handleDelete(prefix, "prefix")}
                        />
                      ))}
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Typography my={2} mx={4}>
                    Numeric
                  </Typography>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-input": {
                        padding: "12px", // Adjust the padding to increase height
                        height: "125px", // Adjust the height directly
                      },
                      border: "1px solid #DBDADE",
                      borderRadius: "8px",
                      backgroundColor: "#F8F8F8",
                    }}
                    value={numericValue}
                    onChange={(e) => setNumericValue(e.target.value)}
                  />
                </Grid>
                <Grid item xs>
                  <Typography my={2}>Suffix</Typography>
                  <Box
                    height={150}
                    display="flex"
                    alignItems="center"
                    gap={4}
                    p={2}
                    onDrop={(e) => handleDrop(e, "suffix")}
                    onDragOver={handleDragOver}
                    sx={{
                      border: "1px solid #DBDADE",
                      borderRadius: "8px",
                    }}
                  >
                    {draggedSuffixChip &&
                      draggedSuffixChip.map((suffix) => (
                        <Chip
                          label={suffix}
                          style={{ cursor: "pointer" }}
                          onDelete={() => handleDelete(suffix, "suffix")}
                        />
                      ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContentText>
        </DialogContent>

        <Box
          sx={{
            flexGrow: 1,
            px: 6,
            py: 4,
            overflow: "hidden",
            width: 520,
            maxWidth: "100%",
          }}
        >
          <TextField
            fullWidth
            label="Format"
            id="Format"
            multiline
            value={formatValue} // Bind formatValue state to the value of the text field
            onChange={(e) => setFormatValue(e.target.value)} // Update formatValue state when the text field value changes
            sx={{ backgroundColor: "#F8F8F8" }}
          />
        </Box>

        <Box
          height={150}
          sx={{
            flexGrow: 1,
            px: 6,
            py: 2,
            overflow: "hidden",
            width: 520,
            maxWidth: "100%",
          }}
        >
          <TextField
            fullWidth
            label="Preview"
            id="Preview"
            multiline
            sx={{ backgroundColor: "#F8F8F8" }}
          />
        </Box>

        <DialogActions style={{ backgroundColor: "#F8F8F8" }}>
          <Button variant="contained" onClick={handleSaveButton} autoFocus>
            {t("SAVE")}
          </Button>
        </DialogActions>
      </Dialog>

      {/** View dialog */}
      <Dialog
        open={isViewDialogOpen}
        onClose={closeViewDialog}
        fullWidth={fullWidth || true}
        maxWidth={maxWidth || "xs"}
      ></Dialog>
    </>
  );
};

export default NumberSequencesCardDialog;
