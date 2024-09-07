import { makeStyles } from "@mui/styles";
import {
    Theme,
} from "@mui/material";

export const useAddServicesStyles = makeStyles({
    checkbox: {
        float: ({ direction }: { direction: string }) =>
            direction === "ltr" ? "right" : "left",
        height: "18px",
        padding: "2px",
    },
    generalSecContainer: {
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? "#F7F8FA" : "rgb(37, 41, 60)",
    },
    associateSec: {
        borderRadius: 5,
        marginTop: "26px",
        padding: "20px",
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? "rgb(255, 255, 255)" : "rgb(47,51,73)",
    },
    associateText: {
        fontSize: "15px",
        margin: 0,
    },
    associateBtn: {
        marginTop: "20px",
        backgroundColor:
            "var(--light-opacity-color-extra-dark-16, rgba(75, 75, 75, 0.16))",
        textTransform: "none",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "0.43px",
        padding: "6px 14px",
        color: (theme: Theme) =>
            theme.palette.mode === "light"
                ? "var(--Light-Solid-Color-Extra-Dark, #4B4B4B)"
                : "#ffff",
        "&:hover": {
            backgroundColor: "rgba(75, 75, 75, 0.16) !important",
        },
    },
    hexaCodeContainer: {
        marginTop: "26px",
        padding: "20px",
        height: "139px",
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? "#ffff" : "rgb(47,51,73)",
    },
    colorPaperContainer: {
        marginLeft: "0px !important",
        marginTop: 10,
        paddingRight: "9px",
    },
    colorHexaCode: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: 4,
        position: "relative",
        padding: "8px 10px 34px 10px",
    },
    colorImgContainer: {
        width: "100%",
        borderRadius: 4,
        position: "relative",
    },
    colorsCheckbox: {
        width: "20px",
        padding: "2px",
        gap: 10,
        position: "absolute",
        top: "3px",
        right: "5px",
        "& svg": {
            stroke: (theme: Theme) =>
                theme.palette.mode === "light" ? "#414a4c" : "#3586c7",
            fill: "#ffffff",
        },
    },
    categorieButtonSec: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? "#ffff" : "rgb(47,51,73)",
        height: "65px",
        borderRadius: "6px",
    },
    buttonContainer: {
        "&.MuiButton-outlined": {
            height: "30px",
            textTransform: "none",
            padding: "10px 20px",
            fontSize: "13px",
            width: "96px",
            "@media (max-width:1250px)": {
                width: "40px",
            },
        },
    },
    discardBtn: {
        "&.MuiButton-outlined": {
            border: "1px solid rgba(168, 170, 174, 1)",
            textTransform: "none",
        },
    },
    publishBtn: {
        "&.MuiButton-outlined": {
            color: "rgba(255, 255, 255, 1)",
            backgroundColor: "rgba(53, 134, 199, 1)",
            "&:hover": {
                backgroundColor: "rgba(53, 134, 199, 1)",
            },
            marginLeft: "20px",
        },
    },
    settingsSec: {
        borderRadius: 5,
        padding: "20px",
        marginTop: "20px",
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? "rgb(255, 255, 255)" : "rgb(47,51,73)",
    },
    colorPicker: {
        "& .w-color-swatch": {
            boxShadow: "none !important",
            border: "none !important",
        },
    },
    servicesSearchBar: {
        "& #searchServiceProduct": {
            padding: "7px 14px",
            height: "26px",
            borderRadius: "2px",
        },
    },
    btnIcons: {
        width: "18px",
        height: "18px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    servicesFullPageBtn: {
        textTransform: "none",
        border: "none",
        padding: "10px",
        height: "38px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "15px",
        fontWeight: 500,
        "&:hover": {
            border: "none",
        },
    },
    servicesFilterBtn: {
        textTransform: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        height: "38px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "15px",
        fontWeight: 500,
        width: "104px",
    },
    servicesNoDataText: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "13px",
        height: "200px",
        width: "100%",
    },
    servicesMinMaxBtn: {
        textTransform: "none",
        border: "none",
        fontSize: "15px",
        color: "#A8AAAE",
    },
    serviceContainerSelectText: {
        fontSize: "13px",
        fontWeight: 400,
        color: (theme: Theme) =>
            theme.palette.mode === "light" ? "#4B465C" : "#e4e6f4",
    },
    servicesEditIcon: {
        color: (theme: Theme) =>
            theme.palette.mode === "light" ? "#4B465C" : "#e4e6f4",
    },
    colorPaperImg: {
        marginTop: "-11px",
        verticalAlign: "text-top",
    },
    imageText: {
        "& .css-1rn8rdh-MuiTypography-root": {
            fontSize: "14px",
            "@media (max-width:1250px)": {
                fontSize: "12px",
            },
        },
    },
    batchesListContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    batchManageBtn: {
        "&.MuiButton-outlined": {
            border: "none",
            borderRadius: "4px",
            backgroundColor:
                "var(--light-opacity-color-primary-primary-16, rgba(53, 134, 199, 0.16))",
            color: (theme: Theme) =>
                theme.palette.mode === "light" ? "#3586C7" : "#FFFF",
        },
    },
    batchesDetailsContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
    },
    batchesListBox: {
        padding: "7px",
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? "#F1F1F1" : "#25293C",
    },
    batchesListNumber: {
        fontSize: "13px",
    },
    batchesUpdateInfo: {
        display: "flex",
        marginTop: "20px",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "10px",
    },
    totalSerialNumContainer: {
        marginTop: "20px",
        padding: "10px",
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? "#F1F1F1" : "#25293C",
    },
    outerCardBatchList: {
        padding: "15px",
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light" ? "rgba(255, 255, 255, 1)" : "#25293C",
        borderRadius: "5px",
        marginTop: "20px",
    },
    batchListOuterContainer: {
        height: "240px",
        overflowY: "auto",
    },
    batchListContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    batchList: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        alignItems: "center",
        borderRadius: "5px",
        backgroundColor: (theme: Theme) =>
            theme.palette.mode === "light"
                ? "rgba(250, 250, 250, 1)"
                : "rgb(47,51,73)",
    },
    batchCode: {},
    batchExpiry: {},
    batchDelete: {},
    tablist: {
        width: "100%",
        typography: "body1",
        "& .MuiTabs-root": {
            borderBottom: "none",
        },
        "& .MuiButtonBase-root": {
            textTransform: "none",
        },
    },
});

export const sxServicesDialog = {
    ".MuiPaper-root": {
        minWidth: "124px",
        padding: 5,
        scrollbarGutter: "inherit",
        overflowY: "hidden",
    },
};

export const sxDialogWidthCommon = {
    ".MuiPaper-root": {
        maxWidth: 700,
        width: 650,
        padding: 5,
        scrollbarGutter: "inherit",
        overflowX: "hidden",
    },
};

export const sxDialogWidthSNum = {
    ".MuiPaper-root": {
        maxWidth: 700,
        padding: 5,
        scrollbarGutter: "inherit",
        overflowX: "hidden",
    },
};
