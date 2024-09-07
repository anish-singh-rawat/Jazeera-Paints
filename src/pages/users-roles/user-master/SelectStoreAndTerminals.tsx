import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Icon from "src/@core/components/icon";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";
import { useTheme } from "@mui/material";

const useStyles = makeStyles({
  storeHeading: {
    fontSize: "13px",
  },
  popUpSubHeader: {
    fontSize: "13px",
    fontStyle: "normal",
    fontWeight: "400",
  },
  dialogcontent: {
    display: "flex",
    "& .list": {
      width: "450px",
      minHeight: "400px",
      margin: "10px",
      border: "1px solid #DBDADE",
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialog: {
    "& .MuiDialog-paper": {
      overflowY: "visible",
    },
  },
  closeIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "30px",
    height: "30px",
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
    margin: "0px auto",
    position: "absolute",
    top: "50%",
  },
});

interface Props {
  assignedStoresAndTerminals: any;
  existingStoresAndTerminalsData: any;
  isDialogOpen: boolean;
  setAssignedStoresAndTerminals: Function;
  setIsDialogOpen: Function;
  stores: any;
}

const SelectStoreAndTerminals = ({
  isDialogOpen,
  setIsDialogOpen,
  stores,
  assignedStoresAndTerminals,
  existingStoresAndTerminalsData,
  setAssignedStoresAndTerminals,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme=useTheme()
  const [leftSideData, setLeftSideData] = useState(stores);

  const [searchEnable, setSearchEnable] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState<any>([]);

  // set leftside initial data
  useEffect(() => {
    if(assignedStoresAndTerminals.length === 0){
      stores && setLeftSideData([...stores]);
    }
  }, [stores]);

  // Set leftside data if already existing StoresAndTerminals are available
  const updateLeftSideData = () => {
    let details = [];
    for (let i = 0; i < existingStoresAndTerminalsData?.length; i++) {
      const { storeTypes, terminals } = existingStoresAndTerminalsData[i];
      details.push({
        ...storeTypes,
        terminals: [...terminals],
      });
    }
    // update assiged terminals (right side Data)
    setAssignedStoresAndTerminals([...details]);

    // remove assigned items from left side data
    let newDetails = [...stores];
    for (let i = 0; i < existingStoresAndTerminalsData?.length; i++) {
      const { storeTypes: storeItem, terminals: assignedTerminals } =
        existingStoresAndTerminalsData[i];

      const isStoreExist = newDetails?.some(
        (item: any) => item?.id === storeItem?.id
      );
      if (isStoreExist) {
        let isAllTerminalsAssigned = false;
        const newUpdatedDetails = newDetails?.map((item: any) => {
          if (item?.id === storeItem.id) {
            let storeTerminals: [] = item?.terminals;
            // compare two arrays which are having array of objects and get required data
            const results: any =
              storeTerminals?.filter(
                ({ terminalNum: id1 }) =>
                  !assignedTerminals?.some(
                    ({ terminalNum: id2 }) => id2 === id1
                  )
              ) ?? [];
            // check if entire
            if (results?.length === 0) {
              isAllTerminalsAssigned = true;
            } else {
              return {
                ...item,
                terminals: [...results],
              };
            }
          } else {
            return item;
          }
        });

        if (isAllTerminalsAssigned) {
          // remove complete store from left side if all the terminals are assigned
          const newData = newDetails?.filter(
            (item: any) => item?.id !== storeItem?.id
          );
          newDetails = [...newData];
        } else {
          newDetails = [...newUpdatedDetails];
        }
      }
    }

    // update unassigned store and terminals (Left side Data)
    setLeftSideData([...newDetails]);
  };

  useEffect(() => {
    if (
      existingStoresAndTerminalsData?.length > 0 &&
      assignedStoresAndTerminals?.length === 0
    ) {
      updateLeftSideData();
    }
  }, [existingStoresAndTerminalsData]);

  const updateLeftSideDataAfterSearchAndSelect = () => {
    // remove assigned items from left side data
    let newDetails = [...stores];
    for (let i = 0; i < assignedStoresAndTerminals?.length; i++) {
      const { id: storeItemId, terminals: assignedTerminals } =
        assignedStoresAndTerminals[i];

      const isStoreExist = newDetails?.some(
        (item: any) => item?.id === storeItemId
      );
      if (isStoreExist) {
        let isAllTerminalsAssigned = false;
        const newUpdatedDetails = newDetails?.map((item: any) => {
          if (item?.id === storeItemId) {
            let storeTerminals: [] = item?.terminals || [];
            // compare two arrays which are having array of objects and get required data
            const results: any = storeTerminals?.filter(
              ({ terminalNum: id1 }) =>
                !assignedTerminals.some(({ terminalNum: id2 }) => id2 === id1)
            );
            // check if entire
            if (results?.length === 0) {
              isAllTerminalsAssigned = true;
            } else {
              return {
                ...item,
                terminals: [...results],
              };
            }
          } else {
            return item;
          }
        });

        if (isAllTerminalsAssigned) {
          // remove complete store from left side if all the terminals are assigned
          const newData = newDetails?.filter(
            (item: any) => item?.id !== storeItemId
          );
          newDetails = [...newData];
        } else {
          newDetails = [...newUpdatedDetails];
        }
      }
    }

    // update unassigned store and terminals (Left side Data)
    setLeftSideData([...newDetails]);
  };

  const handleSearch = (e: any) => {
    const currentSearchValue = e?.target?.value?.toLowerCase();
    if (currentSearchValue?.length === 0) {
      setSearchEnable(false);
      if (assignedStoresAndTerminals?.length)
        updateLeftSideDataAfterSearchAndSelect();
    } else {
      setSearchEnable(true);

      let filteredData = [...leftSideData];
      // filter the terminals first
      for (let i = 0; i < filteredData?.length; i++) {
        if (filteredData[i]?.terminals?.length) {
          let item = { ...filteredData[i] };
          const terminalsWithSearchValue = item?.terminals?.filter(
            (treminalObj: any) =>
              treminalObj?.terminalNum?.toLowerCase()?.includes(currentSearchValue)
          );
          item.terminals =
            terminalsWithSearchValue?.length > 0
              ? terminalsWithSearchValue
              : [];
          filteredData[i] = item;
        }
      }
      // apply the filter by name on filteredData
      const newFilteredData = filteredData?.filter(
        (item: any) =>
          item?.name?.toLowerCase()?.includes(currentSearchValue) || item.terminals?.length > 0
      );
      setSearchedData([...newFilteredData]);
    }
  };

  const handleStoreSelect = (storeItem: any, event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const isExist = assignedStoresAndTerminals?.some(
      (item: any) => storeItem?.id === item?.id
    );

    // add item to right side data
    if (isExist) {
      const updatedStoresAndTerminals = assignedStoresAndTerminals?.map(
        (store: any) => {
          if (store?.id === storeItem?.id) {
            let terminals = [...storeItem?.terminals, ...store?.terminals];
            return {
              ...store,
              terminals: [...terminals],
            };
          } else {
            return store;
          }
        }
      );
      setAssignedStoresAndTerminals([...updatedStoresAndTerminals]);
    } else {
      if (searchEnable) {
        // We might get emplty terminals on searching with text and user is selecting entire store
        const getCompleteStore = leftSideData?.filter(
          (item: any) => item?.name === storeItem?.name
        );
        setAssignedStoresAndTerminals([
          ...assignedStoresAndTerminals,
          getCompleteStore[0],
        ]);
      } else {
        setAssignedStoresAndTerminals([
          ...assignedStoresAndTerminals,
          storeItem,
        ]);
      }
    }

    // remove it from left side data
    if (searchEnable) {
      const updatedSearchData = searchedData?.filter(
        (item: any) => item?.name !== storeItem?.name
      );
      setSearchedData([...updatedSearchData]);
    } else {
      const updatedItems = leftSideData?.filter(
        (item: any) => item?.name !== storeItem?.name
      );
      setLeftSideData([...updatedItems]);
    }
  };

  const handleTerminalsSelect = (
    storeItem: any,
    terminalItem: any,
    event?: any
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    const isStoreExist = assignedStoresAndTerminals?.some(
      (item: any) => item?.id === storeItem?.id
    );
    // add item to right side data
    if (isStoreExist) {
      let updatedStoresAndTerminals = assignedStoresAndTerminals?.map(
        (item: any) => {
          if (item?.id === storeItem.id) {
            let newTerminals =
              item?.terminals?.filter(
                (ter: any) => ter?.id !== terminalItem?.id
              ) ?? [];
            return {
              ...item,
              terminals: [...newTerminals, terminalItem],
            };
          } else {
            return item;
          }
        }
      );
      setAssignedStoresAndTerminals([...updatedStoresAndTerminals]);
    } else {
      setAssignedStoresAndTerminals([
        ...assignedStoresAndTerminals,
        {
          ...storeItem,
          terminals: [terminalItem],
        },
      ]);
    }

    // remove this terminal from left side
    if (searchEnable) {
      let updatedSearchItems: any = [];
      searchedData?.forEach((item: any) => {
        if (item?.id === storeItem?.id) {
          const terminalsList = item?.terminals?.filter(
            (termItem: any) => termItem?.id !== terminalItem?.id
          );
          if (terminalsList?.length) {
            const itemToPush = {
              ...item,
              terminals: [...terminalsList],
            };
            updatedSearchItems.push(itemToPush);
          }
        } else {
          updatedSearchItems.push(item);
        }
      });
      setSearchedData([...updatedSearchItems]);
    } else {
      let updatedLeftItems: any = [];
      leftSideData?.forEach((item: any) => {
        if (item?.id === storeItem?.id) {
          const terminalsList = item?.terminals?.filter(
            (termItem: any) => termItem?.id !== terminalItem?.id
          );
          if (terminalsList?.length) {
            const itemToPush = {
              ...item,
              terminals: [...terminalsList],
            };
            updatedLeftItems.push(itemToPush);
          }
        } else {
          updatedLeftItems.push(item);
        }
      });
      setLeftSideData([...updatedLeftItems]);
    }
  };

  const handleClearStore = (storeItem: any, event: any) => {
    event.preventDefault();
    event.stopPropagation();

    // remove it from right side
    let newData = assignedStoresAndTerminals?.filter(
      (item: any) => item?.id !== storeItem?.id
    );
    setAssignedStoresAndTerminals([...newData]);

    // add it back to left side
    const isStoreExist = leftSideData?.some(
      (item: any) => item?.id === storeItem?.id
    );
    if (!isStoreExist) setLeftSideData([...leftSideData, { ...storeItem }]);
  };

  const handleClearTerminal = (
    storeItem: any,
    terminalItem: any,
    event: any
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // remove the terminal from right side
    let updatedItems: any = [];
    assignedStoresAndTerminals?.forEach((item: any) => {
      if (item?.id === storeItem?.id) {
        const terminalsList = item?.terminals?.filter(
          (termItem: any) => termItem?.id !== terminalItem?.id
        );
        if (terminalsList?.length) {
          const itemToPush = {
            ...item,
            terminals: [...terminalsList],
          };
          updatedItems.push(itemToPush);
        }
      } else {
        updatedItems.push(item);
      }
    });
    setAssignedStoresAndTerminals([...updatedItems]);

    // add item to left side data
    const isStoreExist = leftSideData?.some(
      (item: any) => item?.id === storeItem?.id
    );
    if (isStoreExist) {
      let updatedDetails = leftSideData?.map((item: any) => {
        if (item?.id === storeItem.id) {
          let newTerminals =
            item?.terminals?.filter(
              (ter: any) => ter?.id !== terminalItem?.id
            ) ?? [];
          return {
            ...item,
            terminals: [...newTerminals, terminalItem],
          };
        } else {
          return item;
        }
      });
      setLeftSideData([...updatedDetails]);
    } else {
      setLeftSideData([
        ...leftSideData,
        {
          ...storeItem,
          terminals: [terminalItem],
        },
      ]);
    }
  };

  const handleClearAll = () => {
    setAssignedStoresAndTerminals([]);

    setLeftSideData([]);
    setLeftSideData([...stores]);
  };

  const handleSaveButton = () => {
    setIsDialogOpen(false);
  };

  let displayData: [] = searchEnable ? searchedData : leftSideData;

  return (
    <Dialog
      open={isDialogOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.dialog}
    >
      <DialogTitle align="center" id="alert-dialog-title">
        {t("STORE_TERMINALS")}
        <br />
        <span className={classes.popUpSubHeader}>
          {t("STORE_AND_TERMINAL_TEXT")}
        </span>
      </DialogTitle>
      <Box sx={{background:theme.palette.mode==="dark"?"#3d4156":"white",}} onClick={() => setIsDialogOpen(false)} className={classes.closeIcon}>
        &times;
      </Box>
      <DialogContent>
        <DialogContentText
          className={classes.dialogcontent}
          id="alert-dialog-description"
        >
          <div className="list">
            <div>
              <TextField
                id="outlined-size-small"
                defaultValue=""
                placeholder={t("SEARCH_BY_STORE") as string}
                onChange={handleSearch}
                size="small"
                sx={{ display: "flex", m: "10px" }}
                InputProps={{
                  endAdornment: (
                    <IconButton aria-label="toggle password visibility">
                      {<Icon icon="iconamoon:search" />}
                    </IconButton>
                  ),
                }}
              />
              {displayData &&
                displayData?.length > 0 &&
                displayData?.map((item: any) => {
                  return (
                    <Box sx={{ ml: "10px" }}>
                      <FormControlLabel
                        onClick={(e) => handleStoreSelect(item, e)}
                        control={<Checkbox checked={false} />}
                        label={item?.name}
                      />
                      <Box sx={{ ml: "25px" }}>
                        {item?.terminals?.map((subItem: any) => {
                          return (
                            <>
                              <FormControlLabel
                                onClick={(e) =>
                                  handleTerminalsSelect(item, subItem, e)
                                }
                                control={<Checkbox checked={false} />}
                                label={subItem?.terminalNum}
                              />
                              <br />
                            </>
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })}
            </div>
          </div>
          <div className="list">
            <div className={classes.rightSideHeading}>
              {assignedStoresAndTerminals.length ? (
                <>
                  <Typography sx={{ fontSize: "12px" }}>
                    {t("ASSIGN_STORE_AND_TERMINALS")}
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
                  {t("NO_STORE_TERMINALS")}
                </Typography>
              )}
            </div>
            <div>
              {assignedStoresAndTerminals?.map((item: any) => {
                return (
                  <Box sx={{ ml: "10px" }}>
                    <div
                      onClick={(e) => handleClearStore(item, e)}
                      className={classes.removeContainer}
                    >
                      <p>{item?.name}</p>
                      <Icon
                        color="red"
                        icon="tabler:square-rounded-x"
                        fontSize={20}
                      />
                    </div>
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

export default SelectStoreAndTerminals;
