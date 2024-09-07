import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { t } = useTranslation();
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <> {children} </>}
    </div>
  );
}

interface TabsContainerProps {
  tabLabels: string[];
  tabContents: React.ReactNode[];
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CommonHorizontalTabs({
  tabLabels,
  tabContents,
}: TabsContainerProps) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", paddingTop: "10px" }}>
      <Card>
        <Box
          sx={{
            borderBottom: "0.5px",
            borderColor: "divider",
          }}
        >
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
            {tabLabels.map((label, index) => (
              <Tab
                style={{
                  textTransform: "none",
                  fontSize: "15px",
                  height: "50px",
                }}
                key={index}
                label={t(Key(label))}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {tabContents.map((content, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {content}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
