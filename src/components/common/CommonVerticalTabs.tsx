import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Key } from "src/@core/layouts/utils";
import { t } from "i18next";
import { useRouter } from "next/router";
import { Card } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "100%", overflowX: "auto" }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 5 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface Tab {
  icon: React.ReactNode;
  label: string;
  subLabel: string;
  content: React.ReactNode;
  disabled?: boolean;
  id?: string | any;
}

interface VerticalTabsProps {
  tabs: Tab[];
  modTabVal?: number;
  setModTabVal?: number | any;
}

const CommonVerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  modTabVal,
  setModTabVal,
}) => {
  const [value, setValue] = React.useState<any>(0);
  const router = useRouter();
  React.useEffect(() => {
    setValue(modTabVal);
  }, [modTabVal]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (tabs[newValue].id === "back-button") {
      // Perform the navigation without changing tabs
      router.push("/general-setup/stores");
    } else {
      // Normal tab selection behavior
      setValue(newValue);
      if (setModTabVal) {
        setModTabVal(newValue);
      }
    }
  };

  //console.log(modTabVal, value, "-------");

  return (
    <Box
      sx={{
        flexGrow: 1,
        //bgcolor: "background.paper",
        display: "flex",
        height: "80vh",
      }}
    >
      <Card>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={modTabVal ? modTabVal : value}
          onChange={handleChange}
          aria-label="Vertical tabs"
          sx={{
            borderColor: "divider",
            width: "360px",
            display: "flex",
            padding: "10px 0px",
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    width: "100%",
                    margin: "4px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: value === index ? "#3586C7" : "#F1F1F2",
                      color: value === index ? "#fff" : "#6f6b7d",
                      borderRadius: "4px",
                      padding: "8px",
                    }}
                  >
                    {tab.icon}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        color: value === index ? "#3586C7" : "#5d586c",
                        textTransform: "capitalize",
                      }}
                    >
                      {/* {t(Key(tab.label))} */}
                      {tab.id === "back-button" ? tab.label : t(Key(tab.label))}
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#a5a3ae",
                        textTransform: "capitalize",
                      }}
                    >
                      {/* {t(Key(tab.subLabel))} */}
                      {tab.id === "back-button"
                        ? tab.subLabel
                        : t(Key(tab.subLabel))}
                    </div>
                  </div>
                </div>
              }
              disabled={tab.disabled}
              style={{
                opacity: tab.disabled ? 0.5 : 1,
                filter: tab.disabled ? "blur(0.5px)" : "none",
              }}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Card>
      {tabs.map((tab, index) => (
        <TabPanel
          key={index}
          value={modTabVal ? modTabVal : value}
          index={index}
        >
          <div
            style={{
              filter: tab.disabled ? "blur(0.5px)" : "none",
              pointerEvents: tab.disabled ? "none" : "auto",
            }}
          >
            {tab.id !== "back-button" && <div>{tab.content}</div>}
          </div>
        </TabPanel>
      ))}
    </Box>
  );
};

export default CommonVerticalTabs;
