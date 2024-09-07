import React, { useState } from "react";
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
} from "@mui/material";
import Icon from "src/@core/components/icon";
import { t } from "i18next";
import { makeStyles } from "@mui/styles";
import { Key } from "src/@core/layouts/utils";
import AccordionWithData from "./AccordianListView";
import AppEvent from "src/app/AppEvent";

interface ReusableCardDialogProps {
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

const ReusableCardDialog: React.FC<ReusableCardDialogProps> = ({
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

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const openViewDialog = () => setIsViewDialogOpen(true);
  const closeViewDialog = () => setIsViewDialogOpen(false);

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

  const handleAddToRightList = (item: any) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemoveFromRightList = (item: any) => {
    const updatedList = selectedItems.filter(
      (selectedItem) => selectedItem !== item
    );
    setSelectedItems(updatedList);
  };

  const handleClearAll = () => {
    setSelectedItems([]);
  };

  return (
    <>
      <Card>
        <CardHeader className={classes.cardHeader} title={cardHeaderTitle} />
        <div className={classes.btnDiv}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={item?.id ? openViewDialog : openDialog}
            size="medium"
          >
            {item?.id ? t(Key(viewButtonTitle)) : t(Key(buttonTitle))}
          </Button>
        </div>
      </Card>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth={fullWidth || true}
        maxWidth={maxWidth || "lg"}
      >
        <DialogTitle textAlign={"center"}>
          {t(Key(dialogTitle))}

          <br />
          <span className={classes.popUpSubHeader}>{t(Key(subTitle))}</span>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={0} gap={4} justifyContent={"center"}>
            <Grid className={classes.leftGrid} item xs={5.5}>
              <div className={classes.accordion}>
                {/* <AccordionWithData data={leftListItems} /> */}
                <AccordionWithData
                  data={leftListItems.filter(
                    (item) => !selectedItems.includes(item)
                  )}
                  onItemSelect={handleAddToRightList}
                />
              </div>
            </Grid>
            <Grid className={classes.rightGrid} item xs={5.5}>
              <div
                className={
                  selectedItems.length
                    ? classes.rightSideHeading
                    : classes.centerContent
                }
              >
                {selectedItems.length ? (
                  <>
                    <Typography sx={{ fontSize: "14px", fontWeight: "500" }}>
                      {`${selectedItems.length} ${t("COMBINATION_SELECTED")}`}
                    </Typography>
                    <Button
                      onClick={() => handleClearAll()}
                      size="small"
                      sx={{ p: 1, fontSize: "12px" }}
                      color="error"
                      variant="text"
                    >
                      {t("CLEAR_ALL")}
                    </Button>
                  </>
                ) : (
                  <Typography
                    className={classes.no_terminal_text}
                    sx={{ fontSize: "12px" }}
                  >
                    {t(Key("NO_DATA_MSG"))}
                  </Typography>
                )}
              </div>
              {selectedItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item.name} />
                  <IconButton onClick={() => handleRemoveFromRightList(item)}>
                    <Icon
                      color="red"
                      icon="tabler:square-rounded-x"
                      fontSize={20}
                    />
                  </IconButton>
                </ListItem>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSaveButton} autoFocus>
            {t("SAVE")}
          </Button>
          <Button variant="outlined" onClick={closeDialog} autoFocus>
            {t("CANCEL")}
          </Button>
        </DialogActions>
      </Dialog>

      {/** View dialog */}
      <Dialog
        open={isViewDialogOpen}
        onClose={closeViewDialog}
        fullWidth={fullWidth || true}
        maxWidth={maxWidth || "xs"}
      >
        <DialogTitle textAlign={"center"}>
          {t(Key(dialogViewTitle))}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={0} gap={4} justifyContent={"center"}>
            <Grid item xs={12} className={classes.rightGrid}>
              <div
                style={{
                  fontWeight: "500",
                  padding: "12px 16px",
                }}
              >
                {`${item?.promotionHeaderColumnsMapping?.length} COMBINATIONS_ASSIGNED`}
              </div>
              {item?.promotionHeaderColumnsMapping?.map(
                (i: any, index: any) => (
                  <ListItem
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "#f0f0f0" : "transparent",
                      padding: "4px 16px", // Adjust padding as needed
                    }}
                  >
                    <ListItemText primary={i.promotionHeaderColumns.name} />
                  </ListItem>
                )
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeViewDialog} autoFocus>
            {t("CLOSE")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReusableCardDialog;
