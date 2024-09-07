import React, { useState, useContext } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Grid,FormControlLabel, InputLabel, Checkbox, FormLabel, TextField } from '@mui/material';
import { ColorPicker } from './reusableInputFields';
import { FontSizePicker } from './reusableInputFields';
import { TemplatePropertiesContext } from './propertiesContext';

const LabelsComponent: React.FC = () =>{

    const LabelFields = [
        { label: 'Sub Total', showProperty: 'showSubTotal', valueProperty: 'subTotal', valueArabicProperty: 'subTotalArabic' },
        { label: 'Total Discount', showProperty: 'showTotalDiscount', valueProperty: 'totalDiscount', valueArabicProperty: 'totalDiscountArabic' },
        { label: 'VAT 15%', showProperty: 'showVAT', valueProperty: 'vatPercentage', valueArabicProperty: 'vatPercentageArabic' },
        { label: 'Total Amount', showProperty: 'showTotalAmount', valueProperty: 'totalAmount', valueArabicProperty: 'totalAmountArabic' },
    ];

    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        updateTemplateProperties({ [name]: checked });
    };

    const handleFieldChange = (field: keyof TemplateProperties) => (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log(event); 
        updateTemplateProperties({ [field]: event.target.value });
    };

    return(
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            <Grid container spacing={2} sx={{mt:2}}>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <FormLabel sx={{fontWeight: 'bold', textAlign: 'center', display: 'block'}}>English</FormLabel>
                </Grid>
                <Grid item xs={4}>
                    <FormLabel sx={{fontWeight: 'bold', textAlign:'center', display: 'block'}}>Arabic</FormLabel>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                {LabelFields.map(field => (
                    <React.Fragment key={field.label}>
                        <Grid item xs={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={field.showProperty}
                                        checked={templateProperties[field.showProperty]}
                                        onChange={handleCheckboxChange}
                                        color="primary"
                                    />
                                }
                                label={field.label}
                            />
                        </Grid>
                        <Grid item xs={4} sx={{
                                pointerEvents: templateProperties[field.showProperty] ? 'auto' : 'none',
                                cursor: templateProperties[field.showProperty] ? 'auto' : 'not-allowed',
                                opacity: templateProperties[field.showProperty] ? 1 : 0.5,
                            }}>
                            <TextField
                                margin="dense"
                                id={`${field.valueProperty}-english`}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={templateProperties[field.valueProperty]}
                                onChange={handleFieldChange(field.valueProperty)}
                            />
                        </Grid>
                        <Grid item xs={4} sx={{
                                pointerEvents: templateProperties[field.showProperty] ? 'auto' : 'none',
                                cursor: templateProperties[field.showProperty] ? 'auto' : 'not-allowed',
                                opacity: templateProperties[field.showProperty] ? 1 : 0.5,
                            }}>
                            <TextField
                                margin="dense"
                                id={`${field.valueProperty}-arabic`}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={templateProperties[field.valueArabicProperty]}
                                onChange={handleFieldChange(field.valueArabicProperty)}
                            />
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    )
}

interface TotalField {
    name: string;
    showProperty: string;
    fontProperty: string;
    backgroundColor: string;
    fontColor: string;
}

const LayoutComponent: React.FC = () => {

const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);

const totalFields: TotalField[] = [
    { 
        name: 'Sub Total', 
        showProperty: 'showSubTotalBackgroundColor', 
        fontProperty: 'subTotalFontSize', 
        backgroundColor: 'subTotalBackgroundColor', 
        fontColor: 'subTotalFontColor' 
    },
    { 
        name: 'Total Amount', 
        showProperty: 'showTotalBackgroundColor', 
        fontProperty: 'totalFontSize', 
        backgroundColor: 'totalBackgroundColor', 
        fontColor: 'totalFontColor' 
    }
];

const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>, showPropertyName: string, backgroundColorPropertyName: string) => {
    if(event.target.checked){
        updateTemplateProperties({ [showPropertyName]: event.target.checked });
    }else{
        updateTemplateProperties({ [showPropertyName]: false, [backgroundColorPropertyName]: '#ffffff' });
    }
};

const handleBackgroundColorChange = (newColor: string, propertyName: string) => {
    updateTemplateProperties({ [propertyName]: newColor });
};

const handleFontSizeChange = (newFont: number, propertyName: string) => {
    updateTemplateProperties({ [propertyName]: newFont });
};

const handleFontColorChange = (newColor: string, propertyName: string) => {
    updateTemplateProperties({ [propertyName]: newColor });
};

return (
    <Box sx={{ ml: 4, mr: 4, mt: 4, mb: 4 }}>
            {totalFields.map((field) => (
                <React.Fragment key={field.name}>
                    <FormLabel sx={{ fontWeight: 'bold' }}>{field.name}</FormLabel>
                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={field.name.toLowerCase()}
                                    checked={templateProperties[field.showProperty]}
                                    onChange={(event) => handleCheckbox(event, field.showProperty, field.backgroundColor)}
                                    color="primary"
                                />
                            }
                            label="Background Color"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                pointerEvents: templateProperties[field.showProperty] ? 'auto' : 'none',
                                cursor: templateProperties[field.showProperty] ? 'auto' : 'not-allowed',
                                opacity: templateProperties[field.showProperty] ? 1 : 0.5,
                            }}
                        >
                            <ColorPicker
                                label=""
                                value={templateProperties[field.backgroundColor]}
                                initialColor={templateProperties[field.backgroundColor]}
                                onColorChange={(newColor) => handleBackgroundColorChange(newColor, field.backgroundColor)}
                            />
                        </Box>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <InputLabel htmlFor={`FontSize${field.name.replace(' ', '')}`}>Font Size</InputLabel>
                        </Grid>
                        <Grid item xs={6}>
                            <FontSizePicker
                                label=""
                                initialFontSize={templateProperties[field.fontProperty]}
                                onFontSizeChange={(newFont) => handleFontSizeChange(newFont, field.fontProperty)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <InputLabel htmlFor={`FontColorFor${field.name.replace(' ', '')}`}>Font Color</InputLabel>
                        </Grid>
                        <Grid item xs={6}>
                            <ColorPicker
                                label=""
                                initialColor={templateProperties[field.fontColor]}
                                onColorChange={(newColor) => handleFontColorChange(newColor, field.fontColor)}
                            />
                        </Grid>
                    </Grid>
         </Grid>
                </React.Fragment>
            ))}
    </Box>
);
};

const TotalProperties: React.FC = () => {
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

export default TotalProperties;

