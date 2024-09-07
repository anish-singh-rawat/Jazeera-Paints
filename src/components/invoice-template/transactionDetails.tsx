import {useContext, useState} from 'react';
import { Box,
    FormControlLabel,
    Checkbox,
    Grid,
    InputLabel,
    FormLabel,
    TextField
} from '@mui/material';
import { ColorPicker,FontSizePicker } from './reusableInputFields';
import { auto } from '@popperjs/core';
import { Fullscreen } from '@mui/icons-material';
import { TemplatePropertiesContext } from './propertiesContext';
import { TemplateProperties } from './propertiesContext';


const OrganisationDetails : React.FC = () =>{
    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);

    const handleOrganizationLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTemplateProperties({ showLogo: event.target.checked });
    };

    const handleLogoSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTemplateProperties({ logoSize: parseInt(event.target.value, 10) });
    };

    const handleOrganizationNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTemplateProperties({ showName: event.target.checked });
    };

    const handleOrganizationAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTemplateProperties({ showAddress: event.target.checked });
    };

    const handleOrganizationFontSizeChange = (newFont : number) => {
        updateTemplateProperties({ organizationFontSize: newFont});
    };

    const handleOrganizationFontColorChange = (newColor: string) => {
        updateTemplateProperties({ organizationFontColor: newColor });
    };


    return(
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            <FormControlLabel
                control={
                <Checkbox
                    checked={templateProperties.showLogo}
                    onChange={handleOrganizationLogoChange}
                    color="primary"
                />
                }
                label="Show Organization logo"
            />
            {/* {templateProperties.showLogo && (
                <div>
                    <label htmlFor="logoSize">Logo Size</label>
                    <input
                        type="range"
                        id="logoSize"
                        name="logoSize"
                        min="1" // Set the minimum value of the range
                        max="100" // Set the maximum value of the range
                        value={templateProperties.logoSize}
                        onChange={handleLogoSizeChange}
                    />
                </div>
            )} */}
            <FormControlLabel
                control={
                <Checkbox
                    checked={templateProperties.showName}
                    onChange={handleOrganizationNameChange}
                    color="primary"
                />
                }
                label="Show Organization Name"
            />
            {templateProperties.showName && (
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ColorPicker
                            label="Font Color"
                            value={templateProperties.organizationFontColor}
                            initialColor={templateProperties.organizationFontColor}
                            onColorChange={handleOrganizationFontColorChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FontSizePicker 
                            label="Font Size"
                            initialFontSize={templateProperties.organizationFontSize}
                            onFontSizeChange={handleOrganizationFontSizeChange}
                        />
                    </Grid>
                </Grid>
            )}
            <FormControlLabel
                control={
                <Checkbox
                    checked={templateProperties.showAddress}
                    onChange={handleOrganizationAddressChange}
                    color="primary"
                />
                }
                label="Show Organization Address"
            />
        </Box>
    )
}

const CustomerDetails : React.FC = ()=>{
    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);

    const handleCustomerFontSizeChange = (newFont : number) => {
        updateTemplateProperties({ customerFontSize: newFont, customerLabelFontSize: newFont});
    };

    const handleCustomerFontColorChange = (newColor: string) => {
        updateTemplateProperties({ customerFontColor: newColor , customerLabelColor: newColor});
    };

    return(
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            <FormLabel sx={{fontWeight: 'bold'}}>Customer Name</FormLabel>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <ColorPicker
                    label="Font Color"
                    value={templateProperties.customerFontColor}
                    initialColor={templateProperties.customerFontColor}
                    onColorChange={handleCustomerFontColorChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FontSizePicker 
                    label="Font Size"
                    initialFontSize={templateProperties.customerFontSize}
                    onFontSizeChange={handleCustomerFontSizeChange}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

const DocumentDetails : React.FC = () =>{

    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);
    const [fieldsContent, setFieldsContent] = useState({
        invoiceDate: '',
        dueDate: '',
        shippingDate: '',
        cashier: ''
    });

    const handleDocumentTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTemplateProperties({ showDocumentTitle: event.target.checked });
    };

    const handleDocumentTitleFontSizeChange = (newFont : number) => {
        updateTemplateProperties({ documentTitleFontSize: newFont});
    };

    const handleDocumentTitleCOlorChange = (newColor: string) => {
        updateTemplateProperties({ documentTitleColor: newColor });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        updateTemplateProperties({ [name]: checked });
    };

    const handleFieldChange = (field: keyof TemplateProperties) => (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log(event); 
        updateTemplateProperties({ [field]: event.target.value });
    };

    const handleInvoiceNumberFontSizeChange = (newFont : number) =>{
        updateTemplateProperties({ invoiceNumberFontSize: newFont})
    }

    const handleInvoiceNumberColorChange = (newColor: string) =>{
        updateTemplateProperties({invoiceNumberColor : newColor})
    }
    
    return(
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            <Grid>
                <FormControlLabel
                    control={
                        <Checkbox
                        checked={templateProperties.showDocumentTitle}
                        onChange={handleDocumentTitleChange}
                        color="primary"
                    />
                    }
                    label="Show Document Title"
                />
            </Grid>
            {/* <TextField sx={{mb:4}} fullWidth label="Tax" variant="outlined" /> */}
            {templateProperties.showDocumentTitle && (
            <div>
                <FormLabel sx={{fontWeight: 'bold'}}>Document Title</FormLabel>
                {/* {fontsize for footer} */}
                <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel htmlFor="FontSizeForFooter">Font Size</InputLabel>
                        </Grid>
                        <Grid item xs={8}>
                            <FontSizePicker 
                                label=""
                                initialFontSize={templateProperties.documentTitleFontSize}
                                onFontSizeChange={handleDocumentTitleFontSizeChange}
                            />
                        </Grid>
                    </Grid>
                    
                    {/* {background color} */}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel htmlFor="FontColorForFooter">Font Color</InputLabel>
                        </Grid>
                        <Grid item xs={8}>
                            <ColorPicker
                                label=""
                                initialColor={templateProperties.documentTitleColor}
                                onColorChange={handleDocumentTitleCOlorChange}
                            />
                        </Grid>
                    </Grid>
                </div>
            )}
            {/* <FormControlLabel
                control={
                <Checkbox
                    // checked={isEnabled}
                    // onChange={handleCheckboxChange}
                    color="primary"
                />
                }
                label="Balance Due"
            /> */}
            <FormLabel sx={{fontWeight: 'bold'}}>Invoice Number</FormLabel>
                {/* {fontsize for footer} */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <InputLabel htmlFor="FontSizeForFooter">Font Size</InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                        <FontSizePicker 
                            label=""
                            initialFontSize={templateProperties.invoiceNumberFontSize}
                            onFontSizeChange={handleInvoiceNumberFontSizeChange}
                        />
                    </Grid>
                </Grid>
                    
                {/* {background color} */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <InputLabel htmlFor="FontColorForFooter">Font Color</InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                        <ColorPicker
                            label=""
                            initialColor={templateProperties.invoiceNumberColor}
                            onColorChange={handleInvoiceNumberColorChange}
                        />
                    </Grid>
                </Grid>
            <Grid item sx={{mt:2}}>
                <FormLabel sx={{fontWeight: 'bold'}}>Document Information</FormLabel>
            </Grid>
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
                <Grid item xs={4}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            name="showInvoiceDate"
                            checked={templateProperties.showInvoiceDate}
                            onChange={handleCheckboxChange}
                            color="primary"
                        />
                        }
                        label="Invoice Date"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="invoice-date"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateProperties.invoiceDate}
                        onChange={handleFieldChange('invoiceDate')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="invoice-date-arabic"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateProperties.invoiceDateArabic}
                        onChange={handleFieldChange('invoiceDateArabic')}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{mt:2}}>
                <Grid item xs={4}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            name="showDueDate"
                            checked={templateProperties.showDueDate}
                            onChange={handleCheckboxChange}
                            color="primary"
                        />
                        }
                        label="Due Date"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="due-date"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateProperties.dueDate}
                        onChange={handleFieldChange('dueDate')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="due-date-arabic"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateProperties.dueDateArabic}
                        onChange={handleFieldChange('dueDateArabic')}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{mt:2}}>
                <Grid item xs={4}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            name="showShippingDate"
                            checked={templateProperties.showShippingDate}
                            onChange={handleCheckboxChange}
                            color="primary"
                        />
                        }
                        label="Shipping Date"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="shipping-date"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateProperties.shippingDate}
                        onChange={handleFieldChange('shippingDate')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="shipping-date-arabic"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateProperties.shippingDateArabic}
                        onChange={handleFieldChange('shippingDateArabic')}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{mt:2}}>
                <Grid item xs={4}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            name="showCashier"
                            checked={templateProperties.showCashier}
                            onChange={handleCheckboxChange}
                            color="primary"
                        />
                        }
                        label="Cashier"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="cashier"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateProperties.cashier}
                        onChange={handleFieldChange('cashier')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="cashier-arabic"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateProperties.cashierArabic}
                        onChange={handleFieldChange('cashierArabic')}
                    />
                </Grid>
            </Grid>
            {/* <Grid container spacing={2} alignItems="center" sx={{mt:2}}>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            // checked={isEnabled}
                            // onChange={handleCheckboxChange}
                            color="primary"
                        />
                        }
                        label="Show Status Stamp"
                    />
                </Grid>
            </Grid> */}
        </Box>
    )
}
export {OrganisationDetails,CustomerDetails, DocumentDetails}