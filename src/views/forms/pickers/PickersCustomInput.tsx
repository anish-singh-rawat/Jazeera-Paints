// ** React Imports
import { forwardRef } from "react";

// ** MUI Imports
import TextField from "@mui/material/TextField";

interface PickerProps {
  label?: string;
  readOnly?: boolean;
  callBack?: any;
  error?: any;
}

const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
  // ** Props
  const { label, readOnly, callBack, error } = props;
  return (
    <TextField
      inputRef={ref}
      {...props}
      fullWidth
      label={label || ""}
      onChange={callBack}
      error={error}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  );
});

export default PickersComponent;
