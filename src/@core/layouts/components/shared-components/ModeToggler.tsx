// ** MUI Imports
import IconButton from "@mui/material/IconButton";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Types Import
import { Mode } from "src/@core/layouts/types";
import { Settings } from "src/@core/context/settingsContext";

interface Props {
  settings: Settings;
  saveSettings: (values: Settings) => void;
  size?: string;
}

const ModeToggler = (props: Props) => {
  // ** Props
  const { settings, saveSettings, size } = props;

  const handleModeChange = (mode: Mode) => {
    saveSettings({ ...settings, mode: mode });
  };

  const handleModeToggle = () => {
    if (settings.mode === "light") {
      handleModeChange("dark" as Mode);
    } else {
      handleModeChange("light" as Mode);
    }
  };

  return (
    <IconButton color="inherit" aria-haspopup="true" onClick={handleModeToggle}>
      <Icon
        fontSize={size ? size : "1.5rem"}
        icon={settings.mode === "dark" ? "tabler:sun" : "tabler:moon-stars"}
      />
    </IconButton>
  );
};

export default ModeToggler;
