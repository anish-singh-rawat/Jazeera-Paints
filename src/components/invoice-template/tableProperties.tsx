import React, { useState, useContext } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Grid,FormControlLabel, InputLabel, Checkbox, FormLabel, TextField } from '@mui/material';
import { ColorPicker } from './reusableInputFields';
import { FontSizePicker } from './reusableInputFields';
import { TemplatePropertiesContext } from './propertiesContext';
import { TemplateProperties } from './propertiesContext';

const LabelsComponent: React.FC = () =>{

    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);
    const fields = [
        { name: 'Description', widthProperty: 'descriptionWidth', showProperty: 'showDescriptionColumn' },
        { name: 'Service', widthProperty: 'serviceWidth', showProperty: 'showServiceColumn' },
        { name: 'Quantity', widthProperty: 'quantityWidth', showProperty: 'showQuantityColumn' },
        { name: 'Price', widthProperty: 'priceWidth', showProperty: 'showPriceColumn' },
        { name: 'Total', widthProperty: 'totalWidth', showProperty: 'showTotalColumn' },
        { name: 'Discount', widthProperty: 'discountWidth', showProperty: 'showDiscountColumn' },
        { name: 'Vat', widthProperty: 'vatWidth', showProperty: 'showVatColumn' },
        { name: 'Net Amount', widthProperty: 'netAmountWidth', showProperty: 'showNetAmountColumn' },
    ];

    const handleTableColumn = (event: React.ChangeEvent<HTMLInputElement>) =>{
        updateTemplateProperties({showTableColumn : event.target.checked})
    }

    const toggleColumn = (event, propertyName) => {
        // Update the specific property based on the checkbox state
        updateTemplateProperties({ [propertyName]: event.target.checked });
    };

    const handleWidthChange = (event, propertyName) => {
        const newWidth = parseFloat(event.target.value);
        if (!isNaN(newWidth) && newWidth >= 0) {
            updateTemplateProperties({ [propertyName]: newWidth });
        }
    };

    return(
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            <Grid container spacing={2} sx={{mt:2}}>
                <Grid item xs={6}>
                    <FormLabel sx={{fontWeight: 'bold', textAlign: 'center', display: 'block'}}>Field</FormLabel>
                </Grid>
                <Grid item xs={6}>
                    <FormLabel sx={{fontWeight: 'bold', textAlign: 'center', display: 'block'}}>Width(%)</FormLabel>
                </Grid>
                {/* <Grid item xs={5}>
                    <FormLabel sx={{fontWeight: 'bold', textAlign:'center', display: 'block'}}>Label</FormLabel>
                </Grid> */}
            </Grid>
            <Grid container spacing={2} alignItems="center">
                {fields.map(field => (
                    <React.Fragment key={field.name}>
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={field.name.toLowerCase()}
                                        checked={templateProperties[field.showProperty]}
                                        onChange={(event) => toggleColumn(event, field.showProperty)}
                                        color="primary"
                                    />
                                }
                                label={field.name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                id={`${field.name.toLowerCase()}-width`}
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={templateProperties[field.widthProperty]}
                                onChange={(event) => handleWidthChange(event, field.widthProperty)}
                            />
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    )
  }

  const LayoutComponent: React.FC = () =>{

    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);

    const handleTableHeaderBackgroundColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            updateTemplateProperties({ 
                showTableHeaderBackgrondColor: true,
                //tableHeaderBackgroundColor : templateProperties.tableHeaderBackgroundColor
            });
        } else {
            updateTemplateProperties({
                showTableHeaderBackgrondColor: false,
                tableHeaderBackgroundColor: '#e0e0e0'
            });
        }
    };
    // console.log(`headerColor:${tableHeaderBackgroundColor}`)

    const handleTableHeaderFontSizeChange = (newFont : number) => {
        updateTemplateProperties({ tableHeaderFontSize: newFont});
    };

    const handleTableHeaderBackgroundColorChange = (newColor: string) => {
        updateTemplateProperties({ tableHeaderBackgroundColor: newColor });
    };

    const handletableHeaderFontColorChange = (newColor : string) =>{
        updateTemplateProperties({tableHeaderFontColor : newColor})
    }

    const handleTableRowBackgroundColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // If the checkbox is checked, maintain the current background color
            updateTemplateProperties({ showTableRowBackgrondColor: true });
        } else {
            // If the checkbox is unchecked, set the background color to #000000
            updateTemplateProperties({
                showTableRowBackgrondColor: false,
                tableRowBackgroundColor: '#ffffff'
            });
        }
    };

    const handleTableRowFontSizeChange = (newFont : number) => {
        updateTemplateProperties({ tableRowFontSize: newFont});
    };

    const handleTableRowBackgroundColorChange = (newColor: string) => {
        updateTemplateProperties({ tableRowBackgroundColor: newColor });
    };

    const handleTableRowFontColorChange = (newColor : string) =>{
        updateTemplateProperties({tableRowFontColor : newColor})
    }

    const handleTableBorder = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const borderValue = event.target.checked ? 0.5 : 0;
        updateTemplateProperties({showTableBorder : borderValue})
    }

    const handleTableBorderColorChange = (newColor : string) =>{
        updateTemplateProperties({tableBorderColor : newColor})
    }

    return(
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            name="showTableBorder"
                            checked={templateProperties.showTableBorder}
                            onChange={handleTableBorder}
                            color="primary"
                        />
                        }
                        label="Table Border"
                    />
                </Grid>
                <Grid item xs={6}>
                    <ColorPicker
                        label=""
                        initialColor={templateProperties.tableBorderColor}
                        onColorChange={handleTableBorderColorChange}
                    />
                </Grid>
            </Grid>
            <FormLabel sx={{fontWeight: 'bold'}}>Table Header</FormLabel>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            name="showTableHeaderBackgroundCOlor"
                            checked={templateProperties.showTableHeaderBackgrondColor}
                            onChange={handleTableHeaderBackgroundColor}
                            color="primary"
                        />
                        }
                        label="Background Color"
                    />
                </Grid>
                {/* {templateProperties.showTableHeaderBackgrondColor && ( */}
                    <Grid item xs={6}>
                        <div 
                            style={{
                                pointerEvents: templateProperties.showTableHeaderBackgrondColor ? 'auto' : 'none',
                                cursor: templateProperties.showTableHeaderBackgrondColor ? 'auto' : 'not-allowed',
                                opacity: templateProperties.showTableHeaderBackgrondColor ? 1 : 0.5
                            }}
                            >
                            <ColorPicker
                                label=""
                                value={templateProperties.tableHeaderBackgroundColor}
                                initialColor={templateProperties.tableHeaderBackgroundColor}
                                onColorChange={handleTableHeaderBackgroundColorChange}
                            />
                        </div>
                    </Grid>
                {/* )} */}
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <InputLabel htmlFor="FontSizeForTableHeader">Font Size</InputLabel>
                </Grid>
                <Grid item xs={6}>
                    <FontSizePicker 
                        label=""
                        initialFontSize={templateProperties.tableHeaderFontSize}
                        onFontSizeChange={handleTableHeaderFontSizeChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <InputLabel htmlFor="FontColorForBackgroundColor">Font Color</InputLabel>
                </Grid>
                <Grid item xs={6}>
                    <ColorPicker
                        label=""
                        initialColor={templateProperties.tableHeaderFontColor}
                        onColorChange={handletableHeaderFontColorChange}
                    />
                </Grid>
            </Grid>
            <FormLabel sx={{fontWeight: 'bold'}}>Item Row</FormLabel>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            name="tableRowBackgroundColor"
                            checked={templateProperties.showTableRowBackgrondColor}
                            onChange={handleTableRowBackgroundColor}
                            color="primary"
                        />
                        }
                        label="Background Color"
                    />
                </Grid>
                <Grid item xs={6}>
                    <div 
                    style={{
                        pointerEvents: templateProperties.showTableRowBackgrondColor ? 'auto' : 'none',
                        cursor: templateProperties.showTableRowBackgrondColor ? 'auto' : 'not-allowed',
                        opacity: templateProperties.showTableRowBackgrondColor ? 1 : 0.5
                    }}
                    >
                    {/* {templateProperties.showTableRowBackgrondColor && ( */}
                        <ColorPicker
                            label=""
                            value={templateProperties.tableRowBackgroundColor}
                            initialColor={templateProperties.tableRowBackgroundColor}
                            onColorChange={handleTableRowBackgroundColorChange}
                            //disabled={!templateProperties.showTableRowBackgrondColor}
                        />
                    {/* )} */}
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <InputLabel htmlFor="FontSizeForTableRow">Font Size</InputLabel>
                </Grid>
                <Grid item xs={6}>
                    <FontSizePicker 
                        label=""
                        initialFontSize={templateProperties.tableRowFontSize}
                        onFontSizeChange={handleTableRowFontSizeChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <InputLabel htmlFor="FontSizeForFooter">Font Color</InputLabel>
                </Grid>
                <Grid item xs={6}>
                    <ColorPicker
                        label=""
                        initialColor={templateProperties.tableRowFontColor}
                        onColorChange={handleTableRowFontColorChange}
                    />
                </Grid>
            </Grid>
        </Box>
    )
  }

const TableProperties: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'labels' | 'layout'>('labels');

  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newTab: 'labels' | 'layout'
  ) => {
    if (newTab !== null) {
      setSelectedTab(newTab);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
        <Grid container justifyContent="center" sx={{mt:4}}>
            <ToggleButtonGroup
            value={selectedTab}
            exclusive
            onChange={handleTabChange}
            aria-label="text alignment"
        >
            <ToggleButton value="labels" aria-label="left aligned">
            Labels
            </ToggleButton>
            <ToggleButton value="layout" aria-label="centered">
            Layout
            </ToggleButton>
            </ToggleButtonGroup>
        </Grid>
        <Grid sx ={{mt:4}}>
            {selectedTab === 'labels' && <LabelsComponent />}
            {selectedTab === 'layout' && <LayoutComponent />}
        </Grid>
      
    </Box>
  );
};

export default TableProperties;

