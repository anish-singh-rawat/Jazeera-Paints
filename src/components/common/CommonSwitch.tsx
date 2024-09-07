import { makeStyles } from "@mui/styles";
import Switch from "@mui/material/Switch";

const useStyles = makeStyles({
  root: {
    "& .MuiSwitch-track": {
      height: "18px",
    },
    "& .MuiSwitch-thumb": {
      width: "16px",
      height: "16px",
      backgroundColor: "rgb(133,131,138)",
    },
    "& .Mui-checked .MuiSwitch-thumb": {
      backgroundColor: "white",
    },
    "& .Mui-disabled": {
      color: "rgb(133,131,138)", // Disabled color
    },
    "& .Mui-disabled .MuiSwitch-thumb": {
      backgroundColor: "#aaa", // Thumb color when disabled
    },
    "& .MuiSwitch-switchBase": {
      top: "4.5px",

      left: ({ direction }: { direction: string }) =>
        direction === "rtl" ? "15px !important" : "0px !important",
      right: ({ direction }: { direction: string }) =>
        direction === "rtl" ? "0px !important" : "15px !important",
      "& .MuiSwitch-input": {
        left: "-45%",
      },
    },
    "& .Mui-checked": {
      left: ({ direction }: { direction: string }) =>
        direction === "rtl" ? "15px !important" : "5px !important",
      right: ({ direction }: { direction: string }) =>
        direction === "rtl" ? "5px !important" : "15px !important",
    },
  },
});

type SwitchProps = {
  active?: boolean;
  statusChange?: any;
  setActive?: any;
  disabled?: boolean;
  id?: string;
};

function CommonSwitch(props: SwitchProps) {
  const {
    active = true,
    statusChange,
    setActive,
    disabled = false,
    id = "",
  } = props;
  const settings: any = window.localStorage.getItem("settings");
  const direction = JSON.parse(settings)?.direction;
  const classes = useStyles({ direction });

  const statusIsChange = () => {
    statusChange();
    setActive && setActive(!active);
  };

  return (
    <Switch
      id={id}
      disabled={disabled}
      className={classes.root}
      checked={active}
      onChange={statusIsChange}
    />
  );
}

export default CommonSwitch;
