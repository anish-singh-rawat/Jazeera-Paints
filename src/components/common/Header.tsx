import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Icon from "src/@core/components/icon";
import Translations from "src/layouts/components/Translations";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  commonHeaderRoot: {
    padding: "16px 24px",
    border: "1px solid rgba(75, 70, 92, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "none",
  },
  search: {
    gap: "16px",
  },
  search_button: {
    textTransform: "capitalize",
  },
  actionBtns: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "16px",
  },
  createRecordBtn: {
    textTransform: "unset",
    fontSize: "12.5px",
    width: "100px",
  },
  redSearch: {
    "& input": {
      border: "1px solid red",
    },
  },
});

const Header = (props: any) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    placeholder,
    createNew,
    setSearchValue,
    searchButtonHandleClick,
    searchValue,
    disabled,
  } = props;
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsSearchClicked(false);
    }, 2000);
  }, [isSearchClicked]);

  const handleSearchClick = () => {
    searchButtonHandleClick();
    setIsSearchClicked(true);
  };

  return (
    <Grid container className={classes.commonHeaderRoot}>
      <Grid item container className={classes.search} sm={12} md={6}>
        <Grid item sm={12} md={6}>
          
          <TextField
            size="small"
            fullWidth
            sx={{ mr: 2 }}
            error={isSearchClicked && searchValue === ""}
            placeholder={placeholder}
            onChange={(e: any) => setSearchValue(e.target.value)}
            onKeyPress={(event: any) => {
              if (event.key === "Enter") {
                searchButtonHandleClick();
              }
            }}
          />
        </Grid>
        <Button
          variant="outlined"
          size="medium"
          className={classes.search_button}
          onClick={() => handleSearchClick()}
        >
          <Icon fontSize="1.45rem" icon="tabler:search" />
        </Button>
      </Grid>
      <Grid item sm={12} md={5} className={classes.actionBtns}>
        <Button
          color="secondary"
          variant="outlined"
          sx={{ px: 5, py: 2, textTransform: "unset" }}
          startIcon={<Icon icon="tabler:download" />}
        >
          {t("IMPORT")}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          sx={{ px: 5, py: 2, textTransform: "unset" }}
          startIcon={<Icon icon="tabler:upload" />}
        >
          {`${t("EXPORT")}`}
        </Button>
        <Button
          onClick={createNew}
          variant="contained"
          className={classes.createRecordBtn}
          disabled={disabled || false}
          sx={{width:"8rem", '@media (max-width: 600px)': {
            width:"7rem"}}}
        >
          <Translations text={"NEW"} />
        </Button>
      </Grid>
    </Grid>
  );
};

export default Header;
