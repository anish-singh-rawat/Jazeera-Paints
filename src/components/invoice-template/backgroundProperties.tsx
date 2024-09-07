import React, { useContext, useState } from 'react';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Button, Typography, Checkbox, FormControlLabel, SelectChangeEvent } from '@mui/material';
import { TemplatePropertiesContext } from './propertiesContext';
import { ColorPicker, FontSizePicker } from './reusableInputFields';
import { File, Blob } from "web-file-polyfill"

const BackgroundProperties = () => {
    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);
    
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
    const [isEnabled, setIsEnabled] = useState<boolean>(true);

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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Check if the file is a JPEG or PNG
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                const fileUrl = URL.createObjectURL(file);
                // Update your context with the selected file and URL
                updateTemplateProperties({
                    backgroundImage: file,
                    backgroundImageUrl: fileUrl
                });
            } else {
                // Handle wrong file type (not JPEG or PNG)
                alert('Please select a JPEG or PNG image.');
            }
        }
    };

    const handleImagePositionChange = (event: SelectChangeEvent<string>) => {
        updateTemplateProperties({ imagePosition: event.target.value});
    };


    const handleBackgroundColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            updateTemplateProperties({ 
                showBackgroundColor: true,
                //tableHeaderBackgroundColor : templateProperties.tableHeaderBackgroundColor
            });
        } else {
            updateTemplateProperties({
                showBackgroundColor: false,
                backgroundColor: '#ffffff',
                documentTitleBackgroundColor : '#e0e0e0',
                tableHeaderBackgroundColor : "#e0e0e0",
                tableRowBackgroundColor : '#ffffff',
                subTotalBackgroundColor: '#ffffff',
                totalBackgroundColor: '#ffffff',
                paymentHeaderBackgroundColor : '#e0e0e0',
                paymentDetailsBackgroundColor: '#ffffff',
                noteHeaderBackgroundColor : '#e0e0e0',
                noteDetailsBackgroundColor: '#ffffff',
            });
        }
    };

    const handleBackgroundColorChange = (newColor : string) =>{
        updateTemplateProperties({
            backgroundColor : newColor,
            documentTitleBackgroundColor : newColor,
            tableHeaderBackgroundColor : newColor,
            tableRowBackgroundColor : newColor,
            subTotalBackgroundColor: newColor,
            totalBackgroundColor: newColor,
            paymentHeaderBackgroundColor : newColor,
            paymentDetailsBackgroundColor: newColor,
            noteHeaderBackgroundColor : newColor,
            noteDetailsBackgroundColor: newColor,
        })
    }

    return (
        <Box sx={{ ml: 4, mr: 4, mt:4 }}>
            <form>
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
                        onChange={handleImageChange}
                    />
                </Button>
                
                {/* Image Position */}
                <FormControl fullWidth margin="normal" sx={{ mt: 2}}>
                    <InputLabel htmlFor="imagePosition">Image Position</InputLabel>
                    <Select
                        id="imagePosition"
                        label="Image Position"
                        value={templateProperties.imagePosition}
                        onChange={handleImagePositionChange}
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
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                            <Checkbox
                                name="showBackgroundColor"
                                checked={templateProperties.showBackgroundColor}
                                onChange={handleBackgroundColor}
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
                                    pointerEvents: templateProperties.showBackgroundColor ? 'auto' : 'none',
                                    cursor: templateProperties.showBackgroundColor ? 'auto' : 'not-allowed',
                                    opacity: templateProperties.showBackgroundColor ? 1 : 0.5
                                }}
                                >
                                <ColorPicker
                                    label=""
                                    value={templateProperties.backgroundColor}
                                    initialColor={templateProperties.backgroundColor}
                                    onColorChange={handleBackgroundColorChange}
                                />
                            </div>
                        </Grid>
                    {/* )} */}
                     </Grid>

                {/* </div> */}
                {/* Other form controls remain the same */}
                
            </form>
        </Box>
    );
};

export default BackgroundProperties;
