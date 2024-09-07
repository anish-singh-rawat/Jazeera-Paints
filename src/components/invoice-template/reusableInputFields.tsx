import React, { useState, useEffect } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';

//ColorPicker interface
interface ColorPickerProps {
  label: string;
  value:string;
  initialColor: string;
  onColorChange: (color: string) => void;
}

// FontSizePickerProps interface
interface FontSizePickerProps {
    label: string;
    initialFontSize: number;
    onFontSizeChange: (fontSize: number) => void;
  }

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  initialColor,
  onColorChange
}) => {
  const [color, setColor] = useState<string>(initialColor);

  useEffect(() => {
    // Update internal color state if the value prop changes
    setColor(value);
  }, [value]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    onColorChange(newColor);
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        label={label}
        value={color}
        onChange={handleColorChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="pick color" onClick={() => {}}>
                {/* <ColorLensIcon /> */}
              </IconButton>
              <div
                style={{
                  backgroundColor: color,
                  width: '24px',
                  height: '24px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                }}
              />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
      <input
        type="color"
        id={`color-picker-${label}`}
        style={{
          opacity: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer'
        }}
        value={color}
        onChange={handleColorChange}
      />
    </div>
  );
};

const FontSizePicker: React.FC<FontSizePickerProps> = ({
    label,
    initialFontSize,
    onFontSizeChange
  }) => {
    const [fontSize, setFontSize] = useState<number | string>(initialFontSize);
  
    const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFontSize = event.target.value;
      if (newFontSize === '') {
        // Allow the field to be empty
        setFontSize('');
      } else{
        const parsedFontSize = parseInt(newFontSize, 10);
        if (!isNaN(parsedFontSize)) {
          setFontSize(parsedFontSize);
          onFontSizeChange(parsedFontSize);
        }
      }
    };
  
    return (
      <TextField
        label={label}
        value={fontSize}
        onChange={handleFontSizeChange}
        fullWidth
        margin="normal"
        type="number"
        InputProps={{
          endAdornment: <InputAdornment position="end">px</InputAdornment>,
        }}
        variant="outlined"
      />
    );
  };

export {ColorPicker,FontSizePicker};
