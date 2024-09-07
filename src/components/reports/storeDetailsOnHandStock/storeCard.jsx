import React, { useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const StoreCard = ({ storeData, handleSelectCard, index, isSelected }) => {
  const { store } = storeData;
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        marginBottom: 2,
        "& > .MuiCardContent-root": { flexGrow: 4 },
        "& > .BottomSection": {},
        border: isSelected === index ? "2px solid #3586C7" : "none",
        width: "225px", // Adjust the width as needed
        height: "240px", // Adjust the height as needed
        display: "flex",
        flexDirection: "column",
        boxShadow: 9, // Applying a predefined shadow level
      }}
      onClick={() => handleSelectCard(store, index)} // Attach the onClick event handler to the Card component
    >
      <CardContent sx={{ paddingY: 2, paddingX: 4 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ color: "#3586C7", fontWeight: "bold", fontSize: "15px" }}
        >
          {t(store.name)}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ fontSize: "13px"}}>
          {t("code {{count}}", { count: store.code })}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ fontSize: "13px"}}>
          {t("Address {{count}}", { count: store.address })}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ fontSize: "13px"}}>
          {t("Distance {{count}} Kms", { count: store.distance })}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ fontSize: "13px"}}>
          {t("Phone {{count}}", { count: store.mobileNumber })}
        </Typography>
      </CardContent>
      {/* Apply background color to the bottom section */}
      <CardContent
        className="BottomSection"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingY: 1,
          position: "fixed-end",
          backgroundColor: "#D4F4E2",
          // flexGrow: 3, // Prevents it from growing
          // flexShrink: 3, // Prevents it from shrinking, not strictly necessary but can be included for completeness
          height: "5px", // Adjust the height as needed
          width: "100%", // Make it take the full width of the card
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ color: "#1e9553", fontWeight: "bold", marginBottom: -3, paddingBottom: 3, }}
        >
          {t("Available Stock {{count}} Cans", {
            count: storeData.availableQuantity,
          })}
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          sx={{ color: "#1e9553", marginBottom: -3 }}
        >
          {t("Batch Number {{count}}", { count: storeData.batchId })}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
