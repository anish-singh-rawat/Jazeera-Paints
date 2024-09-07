import React, { useState, useContext } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Grid,FormControlLabel, 
    InputLabel, Checkbox, FormLabel, TextField } from '@mui/material';
import { ColorPicker } from './reusableInputFields';
import { FontSizePicker } from './reusableInputFields';
import { TemplatePropertiesContext } from './propertiesContext';
import { TemplateProperties } from './propertiesContext';

const PaymentDetails: React.FC = () =>{

    const paymentFields = [
        { 
            name: 'Payment Header', 
            showProperty: 'showPaymentHeaderBackgroundColor', 
            fontProperty: 'paymentHeaderFontSize', 
            backgroundColor: 'paymentHeaderBackgroundColor', 
            fontColor: 'paymentHeaderFontColor' 
        },
        { 
            name: 'Payment Details', 
            showProperty: 'showPaymentDetailsBackgroundColor', 
            fontProperty: 'paymentDetailsFontSize', 
            backgroundColor: 'paymentDetailsBackgroundColor', 
            fontColor: ['paymentFontColor','paymentLabelColor'],
        }
    ];

    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>, showPropertyName: string, backgroundColorPropertyName: string) => {
        if(event.target.checked){
            updateTemplateProperties({ [showPropertyName]: event.target.checked });
        }else{
            if(showPropertyName === 'showPaymentHeaderBackgroundColor'){
                updateTemplateProperties({ [showPropertyName]: false, [backgroundColorPropertyName]: '#e0e0e0' });
            }else{
                updateTemplateProperties({ [showPropertyName]: false, [backgroundColorPropertyName]: '#ffffff' });
            }
        }
    };
    
    const handleBackgroundColorChange = (newColor: string, propertyName: string) => {
        updateTemplateProperties({ [propertyName]: newColor });
    };
    
    const handleFontSizeChange = (newFont: number, propertyName: string) => {
        updateTemplateProperties({ [propertyName]: newFont });
    };
    
    // const handleFontColorChange = (newColor: string, propertyName: string) => {
    //     updateTemplateProperties({ [propertyName]: newColor });
    // };

    const handleFontColorChange = (newColor: string, propertyName: string | string[]) => {
        if (Array.isArray(propertyName)) {
            // If propertyName is an array, update all properties in the array
            const updates = propertyName.reduce((acc, prop) => ({ ...acc, [prop]: newColor }), {});
            updateTemplateProperties(updates);
        } else {
            // If propertyName is a string, update the single property
            updateTemplateProperties({ [propertyName]: newColor });
        }
    };

    return(
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            {paymentFields.map((field) => (
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
                                value={templateProperties[field.fontColor]}
                                initialColor={templateProperties[field.fontColor]}
                                onColorChange={(newColor) => handleFontColorChange(newColor, field.fontColor)}
                            />
                        </Grid>
                    </Grid>
                 </Grid>
                </React.Fragment>
            ))}
        </Box>
    )
}

const NoteDetails : React.FC = () =>{
    const noteFields = [
        { 
            name: 'Note Header', 
            showProperty: 'showNoteHeaderBackgroundColor', 
            fontProperty: 'noteHeaderFontSize', 
            backgroundColor: 'noteHeaderBackgroundColor', 
            fontColor: 'noteHeaderFontColor' 
        },
        { 
            name: 'Note Details', 
            showProperty: 'showNoteDetailsBackgroundColor', 
            fontProperty: 'noteDetailsFontSize', 
            backgroundColor: 'noteDetailsBackgroundColor', 
            fontColor: 'noteDetailsFontColor' 
        }
    ];

    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>, showPropertyName: string, backgroundColorPropertyName: string) => {
        if(event.target.checked){
            updateTemplateProperties({ [showPropertyName]: event.target.checked });
        }else{
            if(showPropertyName === 'showNoteHeaderBackgroundColor'){
                updateTemplateProperties({ [showPropertyName]: false, [backgroundColorPropertyName]: '#e0e0e0' });
            }else{
                updateTemplateProperties({ [showPropertyName]: false, [backgroundColorPropertyName]: '#ffffff' });
            }
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

    return(
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            {noteFields.map((field) => (
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
    )
}

const SignatureDetails: React.FC = () =>{
        const SignatureFields = [
            { label: 'Reception', showProperty: 'showReception', valueProperty: 'reception', valueArabicProperty: 'receptionArabic' },
            { label: 'Seller', showProperty: 'showSeller', valueProperty: 'seller', valueArabicProperty: 'sellerArabic' },
            { label: 'Company', showProperty: 'showCompany', valueProperty: 'company', valueArabicProperty: 'companyArabic' },
            { label: 'QR Details', showProperty: 'showQRDetails', valueProperty: 'qrDetails', valueArabicProperty: 'qrDetailsArabic' },
            { label: 'Thanks Message', showProperty: 'showThanksMessage', valueProperty: 'thanksMessage', valueArabicProperty: 'thanksMessageArabic' },
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

        const handleThanksMessageFontSizeChange =(newFont:number)=>{
            updateTemplateProperties({thanksMessageFontSize : newFont});
        };
    
        const handleThanksMessageFontColorChange =(newColor:string)=>{
            updateTemplateProperties({thanksMessageFontColor : newColor});
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
            <Grid container spacing={2} alignItems="center" sx={{mb:4}}>
                {SignatureFields.map(field => (
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
            <FormLabel sx={{ fontWeight: 'bold' }}>Thanks Message</FormLabel>
            <Grid container spacing={2} alignItems="center" >
                <Grid item xs={6}>
                    <InputLabel htmlFor='fontSizeForThanksMessage'>Font Size</InputLabel>
                </Grid>
                <Grid item xs={6}>
                    <FontSizePicker
                        label=""
                        initialFontSize={templateProperties.thanksMessageFontSize}
                        onFontSizeChange={handleThanksMessageFontSizeChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                    <InputLabel htmlFor='fontColorForThanksMessage'>Font Color</InputLabel>
                </Grid>
                <Grid item xs={6}>
                    <ColorPicker
                        label=""
                        initialColor={templateProperties.thanksMessageFontColor}
                        onColorChange={handleThanksMessageFontColorChange}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
export {PaymentDetails, NoteDetails, SignatureDetails};