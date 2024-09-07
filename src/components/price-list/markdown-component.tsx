import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import CustomizedRadios from "./custom-radio";
import { ButtonGroup } from "@mui/material";

interface MyComponentProps {
  changeTab: "Percent" | "Value";
  activeTab: "markUp" | "markDown";
  value: { [key: string]: string };
  markupvalueError: boolean;
  handleChange: (tab: "Percent" | "Value") => void;
  handleTabClick: (tab: "markUp" | "markDown") => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MarkDownComponent: React.FC<MyComponentProps> = ({
  changeTab,
  activeTab,
  value,
  markupvalueError,
  handleChange,
  handleTabClick,
  handleInputChange,
}) => {
  const { t } = useTranslation();

  const btnstyle = {
    width: "50%",
    outline: "none",
    border: "none",
    cursor: "pointer",
  };

  return (
    <Box>
      <Box>
        <Box>
          <CustomizedRadios
            handleChange={handleChange}
            label={t("PRICE_UPDATED_BY")}
          />
          <br />
          <Box sx={{ display: "flex", flexDirection: "column", my: 2 }}>
            <label htmlFor={`${activeTab}${changeTab}`}>
              {changeTab == "Percent" ? t("PERCENTAGE") : t("VALUE")}
            </label>
            <Box sx={{ display: "flex", gap: "5px" }}>
              <TextField
                value={
                  value[`${activeTab}${changeTab}`] === undefined
                    ? ""
                    : value[`${activeTab}${changeTab}`]
                }
                size="small"
                onChange={handleInputChange}
                error={markupvalueError}
                id={`${activeTab}${changeTab}`}
              />

              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
                sx={{ border: "1px solid #3586C7" }}
              >
                <Button
                  style={{
                    ...btnstyle,
                    background: activeTab === "markUp" ? "#3586C7" : "white",
                    color: activeTab === "markUp" ? "white" : "black",
                  }}
                  onClick={() => handleTabClick("markUp")}
                >
                  +
                </Button>
                <Button
                  onClick={() => handleTabClick("markDown")}
                  style={{
                    ...btnstyle,
                    background: activeTab === "markDown" ? "#3586C7" : "white",
                    color: activeTab === "markDown" ? "white" : "black",
                  }}
                >
                  -
                </Button>
              </ButtonGroup>
            </Box>
            <Typography
              color="error"
              fontSize={".8rem"}
              marginTop=".2rem"
              marginLeft=".5rem"
            >
              {markupvalueError ? t("REQUIRED") : ""}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MarkDownComponent;
