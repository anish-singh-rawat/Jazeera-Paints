import { Typography } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  stylePad?: any;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, stylePad, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
      style={{ height: "calc(100% - 48px)" }}
    >
      {value === index && (
        <div style={{ padding: stylePad || "24px", height: "100%" }}>
          <Typography component={"span"}>{children}</Typography>
        </div>
      )}
    </div>
  );
}
