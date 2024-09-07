import React, { useCallback, useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { BlockList } from "net";

interface Option {
  id: number;
  name: string;
  shortName: string;
  code: string;
}

const useStyles = makeStyles({
  option: {
    padding: "0 8px",
    "&:hover": {
      backgroundColor: "rgba(115, 103, 240, 0.08) !important",
      color: "#3586C7",
      borderRadius: "5px",
    },
    '&[aria-selected="true"]': {
      backgroundColor: "#3586C7 !important",
      borderRadius: "5px",
      padding: "0 5px",
      "&:hover": {
        color: "#ffffff",
      },
    },
    height: "40px",
  },
  popper: {
    padding: "0 5px",
  },
  commonSelect: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
});

interface ServerSideAutocompleteProps {
  // Props definition
  getOptionLabel?: (option: Option) => string;
  dispatchFunction: any;
  defaultList?: any;
  helperText?: any;
  onChange?: any;
  error?: any;
  required?: any;
  label: string;
  convertToKey?: boolean;
  optionSelected?: any;
  setOptionSelected?: any;
  defaultValue?: any;
}

const CommonServerSelect: React.FC<ServerSideAutocompleteProps> = ({
  getOptionLabel,
  dispatchFunction,
  defaultList,
  helperText,
  onChange,
  error,
  label,
  required,
  convertToKey = true,
  optionSelected,
  setOptionSelected,
  defaultValue,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any>(defaultList || []);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const { t } = useTranslation();
  let labelKey = convertToKey
    ? t(label?.toUpperCase()?.replace(/ /g, "_") || "")
    : label;

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    setOptions([]);
    // Clear previous debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    // Set new debounce timeout
    const newTimeout = setTimeout(() => {
      setLoading(true);
      fetchData(value);
    }, 1500);
    // Update the debounce timeout
    setDebounceTimeout(newTimeout);
    setOptionSelected(false); // Reset optionSelected state when input changes
  };

  // const fetchData = async (value: string) => {
  //   try {
  //     const actionPayload = {
  //       skip: 0,
  //       limit: 200,
  //       appType: "admin",
  //       search: value,
  //     };
  //     setLoading(true);
  //     const res = await dispatch(dispatchFunction(actionPayload));
  //     setOptions(res?.payload?.data ? res?.payload?.data : []); // Assuming the response contains the options
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = useCallback(
    async (value: string) => {
      try {
        const res = await dispatch(
          dispatchFunction({
            skip: 0,
            limit: 200,
            appType: "admin",
            search: value,
          })
        );
        setOptions(res?.payload?.data ? res?.payload?.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, dispatchFunction]
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.commonSelect}>
      <label>{required ? labelKey + "*" : labelKey}</label>
      <Autocomplete
        classes={{
          option: classes.option,
          popper: classes.popper,
        }}
        size="small"
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        onInputChange={handleInputChange}
        onChange={onChange}
        getOptionLabel={getOptionLabel} // Example getOptionLabel function
        options={options}
        loading={loading}
        defaultValue={defaultValue || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            helperText={helperText}
            error={error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && !optionSelected ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default CommonServerSelect;
