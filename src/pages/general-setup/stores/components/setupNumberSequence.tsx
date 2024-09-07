import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import Checkbox from '@mui/material/Checkbox';
import { AppDispatch, RootState } from "src/store";
import DialogActions from '@mui/material/DialogActions';
import { Card } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { posterminalsGetById } from 'src/store/apps/storeSettings/storeSettings';
import GridCustomExport from 'src/components/export/GridCustomExport';

const useStyles = makeStyles({
    storeHeading: {
        fontSize: "13px",
    },
    popUpSubHeader: {
        fontSize: "11px",
        fontStyle: "normal",
        fontWeight: "400",
    },
    dialogcontent: {
        display: "flex",
        "& .list": {
            width: "600px",
            minHeight: "400px",
            margin: "5px",
            border: "0px solid #DBDADE"
        }
    },
    removeContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "0px 10px"
    },
    rightSideHeading: {
        margin: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    dialog: {
        "& .MuiDialog-paper": {
            overflowY: "visible",
        }
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
        margin: "0px auto",
        position: "absolute",
        top: "50%"
    }
});

interface Props {
    isDialogOpen: boolean;
    setIsDialogOpen: Function,
}

const SetupNumberSequence = ({ 
    isDialogOpen, 
    setIsDialogOpen
}: Props) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [searchEnable, setSearchEnable] = useState<boolean>(false);
    const [searchedData, setSearchedData] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [numberSequenceData, setNumberSequenceData] = useState<any>([]);
    const [filteredData, setFilteredData] = useState(numberSequenceData);
 
    const response: any = useSelector(
        (state: RootState) => state.storeSettingsStore.posTerminlasDataById
    );

    useEffect(() => {
        if (response && response.posTerminalSequenceSetupMapping) {
          const sequenceData = response.posTerminalSequenceSetupMapping.map((item:any) => ({
            id: item.sequenceSetup.id,
            name: item.sequenceSetup.name,
            noSequence: item.sequenceSetup.name,
            formate: item.sequenceSetup.prefix,
          }));
          setNumberSequenceData(sequenceData);
        }
      }, [response]);
    
    useEffect(() => {
        setFilteredData(numberSequenceData);
    }, [numberSequenceData]);

    const columns: GridColDef[] = [
        {
          field: 'name',
          headerName: 'Name',
          width: 150,
          renderCell: (params: GridRenderCellParams) => (
            <Box display="flex" alignItems="center">
              <Typography>{params.value}</Typography>
            </Box>
          ),
        },
        {
          field: 'noSequence',
          headerName: 'No.Sequence',
          width: 150,
          renderCell: (params: GridRenderCellParams) => (
            <Box display="flex" alignItems="center">
              <Typography>{params.value}</Typography>
            </Box>
          ),
        },
        {
          field: 'formate',
          headerName: 'Formate',
          width: 200,
        },
        // Add additional columns as necessary
      ];

    const handleSearchChange = (event:any) => {
        const newInputValue = event.target.value;
        setInputValue(newInputValue);

        // Perform filtering in real-time as the user types
        if (newInputValue.trim() === '') {
            // If the input is empty, show all items
            setFilteredData(numberSequenceData);
        } else {
            // Filter items based on the input
            const filtered = numberSequenceData.filter((item:any) =>
                item.name.toLowerCase().includes(newInputValue.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleSearchClick = () => {
        if (inputValue.trim() === '') {
            // If search input is empty, reset filteredData to show all items
            setFilteredData(numberSequenceData);
        } else {
            // If there is search input, filter numberSequenceData by name
            const filtered = numberSequenceData.filter((item:any) =>
                item.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleSaveButton = () => {
        setIsDialogOpen(false);
    }

    return (
        <Dialog
            open={isDialogOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className={classes.dialog}
        >
            <DialogTitle align='center' id="alert-dialog-title">
                {t("NUMBER_SEQUENCE")}<br />
                <span className={classes.popUpSubHeader}>{t("ASSIGN_MULTIPLE_NUMBER_SEQUENCE")}</span>
            </DialogTitle>
            <Box onClick={() => setIsDialogOpen(false)} className={classes.closeIcon}>
                &times;
            </Box>
            <DialogContent>
                <DialogContentText className={classes.dialogcontent} id="alert-dialog-description">
                    <div className="list">
                        <Card>
                            <TextField
                                id="outlined-size-small"
                                defaultValue=""
                                placeholder={t("SEARCH_BY_NAME") as string}
                                onChange={handleSearchChange}
                                value={inputValue}
                                size="small"
                                sx={{ display: "flex", m: "10px" }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleSearchClick}
                                        >
                                            {<Icon icon="iconamoon:search" />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Card>
                        <Card>
                            <Box style={{ width: '100%' }}> 
                                <DataGrid
                                    autoHeight={true}
                                    rows={filteredData}
                                    columns={columns}
                                    disableSelectionOnClick
                                    pageSize={numberSequenceData.length} // to remove pagination
                                    rowsPerPageOptions={[numberSequenceData.length]}
                                    components={{
                                        Pagination: () => null,
                                    }}
                                />
                            </Box>
                        </Card>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={() => setIsDialogOpen(false)} color="secondary" autoFocus>
                    {t("CANCEL")}
                </Button>
                <Button variant='contained' onClick={handleSaveButton} autoFocus>
                    {t("SAVE")}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default SetupNumberSequence;