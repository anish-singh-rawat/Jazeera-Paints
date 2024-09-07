import React, { useContext, useState } from 'react';
import { File, Blob } from "web-file-polyfill"

import { Box, 
        Grid, 
        FormControl, 
        InputLabel, 
        Select, 
        MenuItem, 
        Button, 
        Dialog, 
        DialogActions, 
        DialogContent, 
        DialogTitle, 
        TextField,
        FormControlLabel,
        Checkbox,
        SelectChangeEvent

    } from '@mui/material';
import { TemplatePropertiesContext } from './propertiesContext';
import { ColorPicker, FontSizePicker } from './reusableInputFields';

const HeaderProperties = () => {
    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);
    const [backgroundHeaderImage, setBackgroundHeaderImage] = useState<File | null>(null);
    const [headerContent, setHeaderContent] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    const positionOptions = [
        { value: 'top left', label: 'Top left' },
        { value: 'top center', label: 'Top center' },
        { value: 'top right', label: 'Top right' },
        { value: 'center left', label: 'Center left' },
        { value: 'center center', label: 'Center center' },
        { value: 'center right', label: 'Center right' },
        { value: 'bottom left', label: 'Bottom left' },
        { value: 'bottom center', label: 'Bottom center' },
        { value: 'bottom right', label: 'Bottom right' },
    ];

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 200, 
            },
        },
    };

    const handleHeaderImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Check if the file is a JPEG or PNG
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const fileUrl = URL.createObjectURL(file);
                // Update your context with the selected file and URL
                updateTemplateProperties({
                    backgroundHeaderImage: file,
                    backgroundHeaderImageUrl: fileUrl
                });
            } else {
                // Handle wrong file type (not JPEG or PNG)
                alert('Please select a JPEG or PNG image.');
            }
        }
    };

    const handleHeaderImagePositionChange = (event: SelectChangeEvent<string>) => {
        updateTemplateProperties({ headerImagePosition: event.target.value});
    };

    // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setIsEnabled(event.target.checked); // Update the isEnabled state based on checkbox
    //     if (!event.target.checked) {
    //       onColorChange(''); // Call onColorChange with empty string or any fallback color
    //     }
    //   };

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const handlePreview = () => {
        updateTemplateProperties({ headerContent: headerContent });
        handleClose();
      };

    return (
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            <form>
                {/* Background Image */}
                <InputLabel htmlFor="backGroundHeaderImage">Background Image</InputLabel>
                <Button
                    variant="contained"
                    component="label"
                    width="80%"
                    sx={{ mt: 2, mb:4 }}
                >
                    Choose from Desktop
                    <input
                        type="file"
                        hidden
                        accept=".jpg,.jpeg,.png"
                        onChange={handleHeaderImageChange}
                    />
                </Button>
                
                {/* Image Position */}
                <FormControl fullWidth margin="normal" sx={{ mt: 2}}>
                    <InputLabel htmlFor="imagePosition">Image Position</InputLabel>
                    <Select
                        id="headerImagePosition"
                        label="Image Position"
                        value={templateProperties.headerImagePosition}
                        onChange={handleHeaderImagePositionChange}
                        MenuProps={MenuProps}
                    >
                        {positionOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Background Color */}
                {/* <div style={{ display: 'flex'}}>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={isEnabled}
                        onChange={handleCheckboxChange}
                        color="primary"
                    />
                    }
                    label=""
                /> */}

                <ColorPicker
                    label="Background Color"
                    value={templateProperties.headerBackgroundColor}
                    initialColor={templateProperties.headerBackgroundColor}
                    onColorChange={(newColor) => updateTemplateProperties({ headerBackgroundColor: newColor })}
                />

                {/* </div> */}
                <Button variant="contained" onClick={handleOpen} fullWidth>
                    Customize your header content
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Customize Header</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="header-content"
                            label="Header Content"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={headerContent}
                            onChange={(e:any) => setHeaderContent(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handlePreview}>Preview</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </Box>
    );
};

const FooterProperties = ()=>{
    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);
    const [footerContent, setFooterContent] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    const positionOptions = [
        { value: 'top left', label: 'Top left' },
        { value: 'top center', label: 'Top center' },
        { value: 'top right', label: 'Top right' },
        { value: 'center left', label: 'Center left' },
        { value: 'center center', label: 'Center center' },
        { value: 'center right', label: 'Center right' },
        { value: 'bottom left', label: 'Bottom left' },
        { value: 'bottom center', label: 'Bottom center' },
        { value: 'bottom right', label: 'Bottom right' },
    ];

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 200, 
            },
        },
    };

    const handleFooterImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Check if the file is a JPEG or PNG
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const fileUrl = URL.createObjectURL(file);
                // Update your context with the selected file and URL
                updateTemplateProperties({
                    backgroundFooterImage: file,
                    backgroundFooterImageUrl: fileUrl
                });
            } else {
                // Handle wrong file type (not JPEG or PNG)
                alert('Please select a JPEG or PNG image.');
            }
        }
    };

    const handleFooterImagePositionChange = (event: SelectChangeEvent<string>) => {
        updateTemplateProperties({ footerImagePosition: event.target.value});
    };

    // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setIsEnabled(event.target.checked); // Update the isEnabled state based on checkbox
    //     if (!event.target.checked) {
    //       onColorChange(''); // Call onColorChange with empty string or any fallback color
    //     }
    //   };

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const handlePreview = () => {
        updateTemplateProperties({ footerContent: footerContent });
        handleClose();
      };

      const handleFontSizeChange = (newFont : number) =>{
        updateTemplateProperties({footerFontSize : newFont})
      }

    return (
        <Box sx={{ ml: 4, mr: 4, mt:4, mb:4 }}>
            {/* <form> */}
                {/* {fontsize for footer} */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <InputLabel htmlFor="FontSizeForFooter">Font Size</InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                        <FontSizePicker 
                            label=""
                            initialFontSize={templateProperties.footerFontSize}
                            onFontSizeChange={handleFontSizeChange}
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
                            label="Font Color"
                            value={templateProperties.footerFontColor}
                            initialColor={templateProperties.footerFontColor}
                            onColorChange={(newColor) => updateTemplateProperties({ footerFontColor: newColor })}
                        />
                    </Grid>
                </Grid>
                
                {/* Background Image */}
                <InputLabel htmlFor="backGroundImage">Background Image</InputLabel>
                <Button
                    variant="contained"
                    component="label"
                    width="80%"
                    sx={{ mt: 2, mb:4 }}
                >
                    Choose from Desktop
                    <input
                        type="file"
                        hidden
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFooterImageChange}
                    />
                </Button>
                
                {/* Image Position */}
                <FormControl fullWidth margin="normal" sx={{ mt: 2}}>
                    <InputLabel htmlFor="imagePosition">Image Position</InputLabel>
                    <Select
                        id="imagePosition"
                        label="Image Position"
                        value={templateProperties.footerImagePosition}
                        onChange={handleFooterImagePositionChange}
                        MenuProps={MenuProps}
                    >
                        {positionOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Background Color */}
                {/* <div style={{ display: 'flex'}}>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={isEnabled}
                        onChange={handleCheckboxChange}
                        color="primary"
                    />
                    }
                    label=""
                /> */}

                <ColorPicker
                    label="Background Color"
                    value={templateProperties.footerBackgroundColor}
                    initialColor={templateProperties.footerBackgroundColor}
                    onColorChange={(newColor) => updateTemplateProperties({ footerBackgroundColor: newColor })}
                />

                {/* {checkbox for pagenumber} */}
                {/* <FormControlLabel
                    control={
                    <Checkbox
                        // checked={isEnabled}
                        // onChange={handleCheckboxChange}
                        color="primary"
                    />
                    }
                    label="Show Page Number"
                /> */}

                {/* </div> */}
                <Button variant="contained" onClick={handleOpen} fullWidth>
                    Customize your Footer content
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Customize Footer</DialogTitle>
                    <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="header-content"
                        label="Header Content"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={footerContent}
                        onChange={(e:any) => setFooterContent(e.target.value)}
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handlePreview}>Preview</Button>
                    </DialogActions>
                </Dialog>
            {/* </form> */}
        </Box>
    );
}

export {HeaderProperties, FooterProperties};
