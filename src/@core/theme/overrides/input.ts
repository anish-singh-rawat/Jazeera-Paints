// ** MUI Imports
import { Theme } from "@mui/material/styles";

const input = (theme: Theme) => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&:before": {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.22)`,
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.32)`,
          },
          "&.Mui-disabled:before": {
            borderBottomStyle: "solid",
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: `rgba(${theme.palette.customColors.main}, 0.04)`,
          "&:hover:not(.Mui-disabled)": {
            backgroundColor: `rgba(${theme.palette.customColors.main}, 0.08)`,
          },
          "&:before": {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.22)`,
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.32)`,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline":
            {
              borderColor: `rgba(${theme.palette.customColors.main}, 0.32)`,
            },
          "&:hover.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.error.main,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: `rgba(${theme.palette.customColors.main}, 0.22)`,
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.disabled,
          },
          "&.Mui-focused": {
            boxShadow: `0 2px 3px 0 rgba(${theme.palette.customColors.main}, 0.1)`,
          },
        },
      },
    },
  };
};

export default input;
