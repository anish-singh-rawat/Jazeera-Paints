import {useContext} from 'react'
import { TextField, RadioGroup, Radio, FormControlLabel, Box, FormLabel,InputLabel,Typography } from '@mui/material';
import { TemplatePropertiesContext } from './propertiesContext';
import { Margin } from './propertiesContext';

const TemplateProperties =()=>{
    const { templateProperties, updateTemplateProperties } = useContext(TemplatePropertiesContext);
    //console.log("sidebar",templateProperties)

    const handleMarginChange = (marginType: keyof Margin, event: React.ChangeEvent<HTMLInputElement>) => {
        //const value = parseFloat(event.target.value);
        const value = event.target.value ? parseFloat(event.target.value) : 0;
        if (!isNaN(value)) {
            updateTemplateProperties({
                margins: { ...templateProperties.margins, [marginType]: value }
            });
        }
    };
    
    const getMarginValue = (marginValue: number) => marginValue === 0 ? '' : marginValue.toString();
    
    const paperSizes = {
        A4: { width: 595, height: 842 },
        A5: { width: 420, height: 595 },
        Letter: { width: 612, height: 791 }
    };

    const handlePaperSizeChange = (paperSize: string) => {
        const size = paperSizes[paperSize as keyof typeof paperSizes];
        if (size) {
            updateTemplateProperties({ paperWidth: size.width, paperHeight: size.height });
        }
    };

    const selectedPaperSizeValue = templateProperties.paperWidth === paperSizes.A4.width ? "A4"
                                   : templateProperties.paperWidth === paperSizes.A5.width ? "A5"
                                   : "Letter";

    const orientationValue = templateProperties.orientation ?? 'portrait';

    const handleOrientationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTemplateProperties({ orientation: event.target.value as 'portrait' | 'landscape' });
    };

    const handleTemplateNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateTemplateProperties({ ...templateProperties, templateName: event.target.value });
        //console.log(templateProperties.templateName)
    };


    return (
        <Box sx={{ml:4, mr:4}}>
            <form>
                {/* Template Name */}
                {/* <Typography variant="h6">Template Name</Typography> */}
                <TextField 
                    name="templateName" 
                    fullWidth 
                    margin="normal"
                    label="Template Name"
                    value={templateProperties.templateName}
                    onChange={handleTemplateNameChange}
                />
                <FormLabel id="demo-radio-buttons-group-label">Paper Size</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        aria-label="paper-size"
                        value={selectedPaperSizeValue}
                        onChange={(e) => handlePaperSizeChange(e.target.value)}
                    >
                        {/* <FormControlLabel value="A5" control={<Radio />} label="A5" /> */}
                        <FormControlLabel value="A4" control={<Radio />} label="A4" />
                        <FormControlLabel value="Letter" control={<Radio />} label="Letter" />
                    </RadioGroup>

                {/* Orientation */}
                {/* <Typography variant="h6">Orientation</Typography> */}
                <FormLabel id="demo-radio-buttons-group-label">Orientation</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={orientationValue}
                        onChange={handleOrientationChange}
                    >
                        <FormControlLabel value="portrait" control={<Radio />} label="Portrait" />
                        <FormControlLabel value="landscape" control={<Radio />} label="Landscape" />
                    </RadioGroup>

                {/* Margins */}
                {/* <Typography variant="h6" gutterBottom>Margins <span><Typography variant="caption">(in inches)</Typography></span></Typography> */}
                <InputLabel id="demo-simple-select-label">Margins (in pixels)</InputLabel>
                <Box display="flex" gap={2}>
                    <TextField
                        name="topMargin"
                        type="number"
                        fullWidth
                        margin="normal"
                        helperText="Top"
                        onChange={(e:any) => handleMarginChange('top', e)}
                        value={getMarginValue(templateProperties.margins.top)}
                    />
                    <TextField
                        name="bottomMargin"
                        type="number"
                        fullWidth
                        margin="normal"
                        helperText="Bottom"
                        onChange={(e:any) => handleMarginChange('bottom', e)}
                        value={getMarginValue(templateProperties.margins.bottom)}
                    />
                    <TextField
                        name="leftMargin"
                        type="number"
                        fullWidth
                        margin="normal"
                        helperText="Left"
                        onChange={(e:any) => handleMarginChange('left', e)}
                        value={getMarginValue(templateProperties.margins.left)}
                    />
                    <TextField
                        name="rightMargin"
                        type="number"
                        fullWidth
                        margin="normal"
                        helperText="Right"
                        onChange={(e:any) => handleMarginChange('right', e)}
                        value={getMarginValue(templateProperties.margins.right)}
                    />
                </Box>
            </form>
       </Box>
    )
}

export default TemplateProperties;