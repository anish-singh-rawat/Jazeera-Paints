import { useContext } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl, Box, Grid, SelectChangeEvent } from '@mui/material';
import { TemplatePropertiesContext } from './propertiesContext';
import { ColorPicker, FontSizePicker } from './reusableInputFields';

const FontProperties = () =>{
    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);

    // const fontOptions = [
    //     { name: 'Public Sans', family: "'Public Sans', sans-serif" },
    //     { name: 'System UI', family: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif" },
    //     { name: 'Open Sans', family: "'Open Sans', sans-serif" },
    //     { name: 'Roboto Slab', family: "'Roboto Slab', serif" },
    //     { name: 'Ubuntu', family: "'Ubuntu', sans-serif" },
    //     // Add other fonts as needed
    //   ];

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 200, 
            },
        },
    };

    const fontOptions = [
        { name: 'Public Sans', family: "'Public Sans', sans-serif" },
        { name: "Arial", value: "Arial, sans-serif" },
        { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
        { name: "Helvetica", value: "Helvetica, sans-serif" },
        { name: "Times New Roman", value: "'Times New Roman', Times, serif" },
        { name: "Georgia", value: "Georgia, serif" },
        { name: "Garamond", value: "Garamond, serif" },
        { name: "Courier New", value: "'Courier New', Courier, monospace" },
        { name: "Lucida Console", value: "'Lucida Console', Monaco, monospace" },
        { name: "Comic Sans MS", value: "'Comic Sans MS', cursive, sans-serif" },
        { name: "Trebuchet MS", value: "'Trebuchet MS', Helvetica, sans-serif" },
        { name: "Arial Black", value: "'Arial Black', Gadget, sans-serif" },
        { name: "Impact", value: "Impact, Charcoal, sans-serif" },
        // Add more fonts as needed
    ];
    
    const handleFontChange = (event: SelectChangeEvent<string>) => {
        updateTemplateProperties({ font: event.target.value});
    };

    const handleLabelColorChange = (newColor: string) => {
        updateTemplateProperties({ 
            labelColor: newColor,
            generalLabelColor: newColor,
            customerLabelColor: newColor,
            //totalLabelColor: newColor,
            paymentLabelColor: newColor
        });
    };

    const handleFontColorChange = (newColor : string) => {
        updateTemplateProperties({ 
            fontColor: newColor, 
            paymentFontColor: newColor, 
            organizationFontColor: newColor, 
            customerFontColor: newColor  });
    }

    const handleFontSizeChange = (newFont : number) => {
        updateTemplateProperties({
            fontSize: newFont,
            organizationFontSize: newFont,
            customerFontSize: newFont,
        })
    }

    return (
        <Box sx={{ml:4, mr:4}}>
            <form>
                {/* PDF Font */}
                <FormControl fullWidth margin="normal" sx={{ mt: 2}}>
                    <InputLabel htmlFor="pdfFont">PDF Font</InputLabel>
                    <Select
                        id="pdfFont"
                        label="PDF Font"
                        value={templateProperties.font}
                        onChange={handleFontChange}
                        MenuProps={MenuProps}
                    >
                    {fontOptions.map((option) => (
                    <MenuItem
                        key={option.name}
                        value={option.name}
                        style={{ fontFamily: option.family }}
                    >
                        {option.name}
                    </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                {/* Label Color */}
                <ColorPicker
                    label="Label Color"
                    //name="fontColor"
                    value={templateProperties.labelColor}
                    initialColor={templateProperties.labelColor}
                    onColorChange={handleLabelColorChange}
                />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ColorPicker
                        label="Font Color"
                        value={templateProperties.fontColor}
                        initialColor={templateProperties.fontColor}
                        onColorChange={handleFontColorChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FontSizePicker 
                        label="Font Size"
                        initialFontSize={templateProperties.fontSize}
                        onFontSizeChange={handleFontSizeChange}
                        />
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default FontProperties;