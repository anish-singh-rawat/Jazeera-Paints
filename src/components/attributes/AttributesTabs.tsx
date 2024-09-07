import React, { Dispatch, SetStateAction } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";
import { useRouter } from "next/router";

interface TabsContainerProps {
    tabLabels: string[];
    currentTab: number;
    setSearchValue: Dispatch<SetStateAction<string>>
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function CustomerAttributesTabs({
    tabLabels,
    currentTab,
    setSearchValue
}: TabsContainerProps) {
    const { t } = useTranslation();
    const router = useRouter()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        const query = { ...router.query }
        query['tabId'] = newValue.toString()
        setSearchValue("")
        router.replace({ query: query })
    };

    return (
        <Card>
            <Box sx={{ width: "100%", paddingTop: "10px" }}>
                <Box sx={{ borderBottom: "0.5px", borderColor: "divider" }}>
                    <Tabs
                        value={currentTab - 1}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        {tabLabels.map((label, index) => (
                            <Tab
                                style={{ textTransform: "none", fontSize: "15px" }}
                                key={index}
                                label={t(Key(label))}
                                {...a11yProps(index)}
                            />
                        ))}
                    </Tabs>
                </Box>
            </Box>
        </Card>
    );
}

