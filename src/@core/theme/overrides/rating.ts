// ** MUI Imports
import { Theme } from "@mui/material/styles";

const Rating = (theme: Theme) => {
  return {
    MuiRating: {
      styleOverrides: {
        root: {
          color: theme.palette.warning.main,
          "& svg": {
            flexShrink: 0,
          },
        },
      },
    },
  };
};

export default Rating;
