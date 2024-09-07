import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Icon from "src/@core/components/icon";
import DialogActions from "@mui/material/DialogActions";
import { Key } from "src/@core/layouts/utils";
import CommonServerSidePaging from "./CommonServerSidePaging/CommonServerSidePaging";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { productBatchAssign } from "src/store/apps/productBatch/productBatch";

const useStyles = makeStyles({
  storeHeading: {
    fontSize: "13px",
  },
  popUpSubHeader: {
    fontSize: "13px",
    fontStyle: "normal",
    fontWeight: "400",
  },
  dialogContent: {
    display: "flex",
    width: "100%",
    "& .list": {
      width: "50%",
      maxHeight: "450px",
      overflowY: "auto",
      margin: "10px",
      border: "1px solid #DBDADE",
      "& .listMenu": {
        // height: "550px",
        // overflow: "auto",
      },
    },
    "& .MuiDataGrid-main": {
      height: "calc(450px - 151px)",
      overflowY: "auto",
    },
  },
  removeContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "0px 10px",
  },
  rightSideHeading: {
    margin: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // height: "100%",
  },
  dialog: {
    "& .MuiDialog-paper": {
      overflowY: "visible",
    },
    "& .MuiDialogContent-root": {
      padding: "0 10px !important",
    },
    "& .MuiDialogTitle-root": {
      paddingTop: "10px",
    },
  },
  closeIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "30px",
    height: "30px",
    background: "white",
    right: "-15px",
    top: "-15px",
    borderRadius: "6px",
    zIndex: "99999999",
    position: "absolute",
    boxShadow: " 0px 0px 4px 0px #898888",
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
  },
  hideHeader: {
    "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
      display: "none",
    },
    "& .MuiDataGrid-virtualScroller": {
      marginTop: "0 !important",
    },
  },
});

interface CommonAssignUnAssignModalProps {
  assignedStoresAndTerminals: any;
  existingStoresAndTerminalsData: any;
  isDialogOpen: boolean;
  setAssignedStoresAndTerminals: Function;
  setIsDialogOpen: Function;
  stores: any;
  title: String;
  subTitle: String;
  noDataMsg: String;
  maxWidth?: String | any;
  fullWidth?: boolean;
  subItemEnabled?: boolean;
  selectedBatchId?: any;
  columnsProduct?: any;
  fetchProductsListData?: any;
  searchPlaceHolder?: string;
}

const CommonAssignUnAssignModal = ({
  isDialogOpen,
  setIsDialogOpen,
  stores,
  title,
  subTitle,
  noDataMsg,
  maxWidth,
  fullWidth,
  subItemEnabled = false,
  selectedBatchId,
  fetchProductsListData,
  columnsProduct,
  searchPlaceHolder,
}: CommonAssignUnAssignModalProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [leftSideData, setLeftSideData] = useState<any>(stores || []);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [assignedItem, setAssignedItem] = useState<any[]>([]);

  const handleClearStore = (storeItem: any, event: any) => {
    event.preventDefault();
    event.stopPropagation();

    // remove it from right side
    let newData = assignedItem?.filter(
      (item: any) => item?.id !== storeItem?.id
    );
    setAssignedItem([...newData]);

    // add it back to left side
    const isStoreExist =
      leftSideData?.length &&
      leftSideData?.some((item: any) => item?.id === storeItem?.id);
    if (!isStoreExist)
      setLeftSideData(
        leftSideData?.length && [...leftSideData, { ...storeItem }]
      );
  };

  const handleClearAll = () => {
    setAssignedItem([]);
    setLeftSideData([]);
    setLeftSideData([...stores]);
  };

  const generateObjects = async (
    assignedItems: any,
    batchIds: number[]
  ): Promise<{ products: any; productBatch: any }[]> => {
    const objects: { products: any; productBatch: any }[] = [];
    assignedItems.forEach((item: any) => {
      batchIds.forEach((batchId) => {
        objects.push({
          products: { id: item?.id },
          productBatch: { id: batchId },
        });
      });
    });
    const res = await dispatch(productBatchAssign({ productBatch: objects }));

    // show Toast Msg
    if (res?.payload?.message) {
      setIsDialogOpen(false);
    }

    return objects;
  };

  const handleSaveButton = () => {
    generateObjects(assignedItem, selectedBatchId);
  };

  return (
    <Dialog
      open={isDialogOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.dialog}
      fullWidth={fullWidth || true}
      maxWidth={maxWidth || "lg"}
    >
      <DialogTitle align="center" id="alert-dialog-title">
        {t(Key(title))}
        <br />
        <span className={classes.popUpSubHeader}>{t(Key(subTitle))}</span>
      </DialogTitle>
      <Box onClick={() => setIsDialogOpen(false)} className={classes.closeIcon}>
        &times;
      </Box>
      <DialogContent style={{ overflow: "unset" }}>
        <DialogContentText
          className={classes.dialogContent}
          id="alert-dialog-description"
        >
          <div className={`list ${classes.hideHeader}`}>
            <CommonServerSidePaging
              rows={stores || []}
              rowCount={stores?.totalCount}
              columns={columnsProduct || []}
              isLoading={stores?.isLoading}
              fetchDataWithSearch={fetchProductsListData}
              // selectedItem={setSelectedProduct}
              setAssignedItem={setAssignedItem}
              moduleType={"productsAssignModal"}
              checkboxSelection={false}
              rowsPerPageOptions={[]}
              assignedItem={assignedItem}
              searchPlaceholder={searchPlaceHolder}
            />
          </div>
          <div className="list">
            <div
              className={classes.rightSideHeading}
              style={
                !assignedItem.length ? { height: "100%" } : { height: "unset" }
              }
            >
              {assignedItem.length ? (
                <>
                  <Typography sx={{ fontSize: "12px" }}>
                    {t("ASSIGNED_PRODUCTS")}
                  </Typography>
                  <Button
                    onClick={() => handleClearAll()}
                    size="small"
                    sx={{ p: 1, fontSize: "10px" }}
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
                  {t(Key(noDataMsg))}
                </Typography>
              )}
            </div>
            <div style={{ height: "calc(450px - 45px)", overflow: "auto" }}>
              {assignedItem?.map((item: any) => {
                return (
                  <Box sx={{ ml: "10px" }}>
                    <div
                      onClick={(e) => handleClearStore(item, e)}
                      className={classes.removeContainer}
                    >
                      <p>{item?.shortName}</p>
                      <Icon
                        color="red"
                        icon="tabler:square-rounded-x"
                        fontSize={20}
                      />
                    </div>
                    {/* {subItemEnabled && (
                      <Box sx={{ ml: "25px" }}>
                        {item?.terminals?.map((subItem: any) => {
                          return (
                            <>
                              <div
                                onClick={(e) =>
                                  handleClearTerminal(item, subItem, e)
                                }
                                className={classes.removeContainer}
                              >
                                <p>{subItem?.terminalNum}</p>
                                <Icon
                                  color="red"
                                  icon="tabler:square-rounded-x"
                                  fontSize={20}
                                />
                              </div>
                            </>
                          );
                        })}
                      </Box>
                    )} */}
                  </Box>
                );
              })}
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSaveButton} autoFocus>
          {t("SAVE")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonAssignUnAssignModal;
