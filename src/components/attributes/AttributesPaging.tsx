import { DataGrid, gridVisibleColumnFieldsSelector, gridVisibleRowCountSelector, useGridApiContext } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Stack, TextField, Button, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import Icon from "src/@core/components/icon";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/useAuth";
import { usePathname } from "next/navigation";
import { getCurrentModulePermission, mapPermission } from "src/components/roles-list/utils";
import Translations from "src/layouts/components/Translations";
import { FaPlus } from "react-icons/fa6";

interface StyleTypes {
    newPage?: number;
    direction?: string;
}

const useStyles = makeStyles(() => ({
    grid: {
        fontSize: "1rem",

        "& .MuiPaginationItem-previousNext": {
            background: "rgba(75, 70, 92, 0.08)",
        },
        "& .MuiPaginationItem-previousNext .MuiButtonBase-root": {
            textTransform: "capitalize",
        },
        "& .MuiDataGrid-selectedRowCount": {
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            // color: "#A5A3AE",
        },
        "& .MuiDataGrid-main": {
            borderRight: "1px solid #9994",
            borderLeft: "1px solid #9994",
            fontSize: "1rem",
            // color: "color: rgba(51, 48, 60, 0.6)",
        },
        "& .MuiDataGrid-overlay": {
            height: "100px !important",
        },
        "& .MuiDataGrid-columnHeaders": {
            // background: "#f6f6f7",
            borderRadius: 0,
            maxHeight: "168px !important",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "1px",
            whiteSpace: "normal",
            lineHeight: "normal",
        },
        "& .MuiDataGrid-cell--textLeft": {
            // color: "rgba(51, 48, 60, 0.6)",
            fontSize: "1rem",
        },
        "& .MuiDataGrid-footerContainer": {
            display: "flex",
            flexDirection: "row-reverse",
            paddingTop: "20px",
            paddingBottom: "6px",
            "& .MuiTablePagination-root": {
                width: "100%",
                "& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular.MuiTablePagination-toolbar ":
                {
                    display: "flex",
                    float: ({ direction }: StyleTypes) =>
                        direction === "rtl" ? "right" : "left",
                },
            },
            "& .MuiPaginationItem-rounded.Mui-selected": {
                backgroundColor: "#f0f0f0",
                color: "#000",
            },
        },
        "& .MuiTablePagination-select.MuiSelect-standard": {
            border: "1px solid #DBDADE",
            padding: "4px 26px 4px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            width: "80px",
            height: "34px",
            boxSizing: "border-box",
        },
        "& .MuiSvgIcon-root": {
            right: "12px",
        },
        "& .MuiTablePagination-actions": {
            display: "none",
        },
        "& .MuiTablePagination-displayedRows": {
            //   width: "900px",
            position: "relative",
            // color: "#A5A3AE",
            "&::before": {
                content: `"Showing"`,
                padding: "0 4px",
            },

            "&::after": {
                content: `"entries"`,
                padding: "0 4px",
            },
        },
        "& .MuiTablePagination-selectLabel": {
            display: "none",
        },
    },
    arrowBtn: {
        width: "32px",
        height: "32px",
        display: "flex",
        margin: "0 4px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        outline: "none",
        // border: "none",
        border: "1px solid rgba(51, 48, 60, 0.22)",
        cursor: "pointer",
        color: "rgba(51, 48, 60, 0.87)",
        background: "white",
        "&:disabled": {
            background: "#d7d7d7a3",
            cursor: "no-drop",
        },
    },
    customPagination: {
        position: "absolute",
        "& .MuiPaginationItem-ellipsis": {
            display: "none",
        },
    },
    commonHeaderRoot: {
        padding: "16px 24px",
        border: "1px solid rgba(75, 70, 92, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        borderBottom: "none",
    },
    search: {
        gap: "16px",
    },
    search_button: {
        textTransform: "capitalize",
    },
    actionBtns: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "16px",
    },
    createRecordBtn: {
        textTransform: "unset",
        fontSize: "12.5px",
        width: "100px",
    },
    redSearch: {
        "& input": {
            border: "1px solid red",
        },
    },
    buttonbox: {
        border: "1px solid #3586C7",
        borderRadius: "5px",
        "& li": {
            fontSize: "0.875rem !important",
            color: "#3586C7",
            borderColor: "#3586C7",
            fontWeight: "600",
            margin: "2px 5px",
            "&:hover": {
                background: "none !important",
            },
        },
    },
    pagination: {
        gap: "12px",
        justifyContent: "end",
        float: "right",
    },
    input: {
        minWidth: "30px",
        width: ({ newPage }: StyleTypes) =>
            String(newPage).length > 2 ? "65px" : "32px",
        height: "32px",
        borderRadius: "6px",
        maxWidth: "65px",
        outline: "none",
        border: "1px solid rgba(51, 48, 60, 0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "white",
        margin: "0 4px",
        cursor: "pointer",
        "&:disabled": {
            cursor: "no-drop",
            background: "#d7d7d7a3",
            color: "#000000",
        },
    },
    text: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "24px",
        height: "30px",
        fontSize: "15px",
        lineHeight: "22px",
        color: "rgba(51, 48, 60, 0.87)",
    },
    countBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        outline: "none",
        border: "1px solid #D9D9D9",
        cursor: "pointer",
        padding: "0 10px",
    },

    stack: {
        position: "absolute",
        bottom: "18px",
        right: ({ direction }) => (direction === "ltr" ? "24px" : "none"),
        left: ({ direction }) => (direction === "rtl" ? "24px" : "none"),
        direction: "ltr",
    },
    buttons: {
        display: "flex",
        direction: "ltr",
        flexDirection: ({ direction }) =>
            direction === "rtl" ? "row-reverse" : "row",

        "& .iconify": {
            transform: ({ direction }) =>
                direction === "rtl" ? "rotate(180deg)" : "rotate(0deg)",
        },
    },
}));

const GridCustomHeader: React.JSXElementConstructor<any> = (props: any) => {
    let { handleSearch, value, direction, searchText, name, handleOpenNewAttribute,
    } =
        props;
    const apiRef = useGridApiContext();
    const router = useRouter();
    const auth = useAuth();
    const { t } = useTranslation();
    let ref = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const classes = useStyles({ direction });
    const pathname = usePathname();

    const handleClick = () => {
        let inputVal = ref?.current?.value;
        if (inputVal === "") {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 3000);
        }
        handleSearch(inputVal);
    };

    const getFileName = () => {
        const path = pathname?.replace(/.$/, "");
        const index = path?.lastIndexOf("/") ?? 0;
        return path?.substring(index + 1);
    };

    const handleExport = () => {
        const hasRowsToExport = gridVisibleRowCountSelector(apiRef.current.state);
        const getVisisbleColumns = gridVisibleColumnFieldsSelector(
            apiRef.current.state
        )
            .filter((item) => item && item !== "__check__")
            .filter((item) => item !== "id");
        if (hasRowsToExport !== 0) {
            apiRef.current.exportDataAsCsv({
                utf8WithBom: true,
                fields: ["id", ...getVisisbleColumns],
                fileName: getFileName(),
            });
        }
    };

    const currentModuleName = router.route.substring(1).split("/")[0];

    const gettingPermission = auth?.user?.role.rolePermissions;
    const permission = mapPermission(gettingPermission);

    const currentModulePermission = getCurrentModulePermission(
        permission,
        currentModuleName
    );

    const isCreatePermissionEnabled =
        currentModulePermission && currentModulePermission.permissionType.Create;

    return (
        <Grid container className={classes.commonHeaderRoot}>
            <Grid item container className={classes.search} sm={12} md={6}>
                <Grid item sm={12} md={6}>
                    <TextField
                        inputRef={ref}
                        size="small"
                        fullWidth
                        sx={{ mr: 2 }}
                        error={error}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if (e?.target?.value === "") {
                                handleClick();
                            }
                        }}
                        placeholder={searchText}
                        onKeyPress={(event: any) => {
                            if (event.key === "Enter") {
                                handleClick();
                            }
                        }}
                        defaultValue={name ? name : value}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => handleSearch("")}
                                >
                                    {value?.length > 0 && <Icon icon="iconamoon:close" />}
                                </IconButton>
                            ),
                        }}
                    />
                </Grid>
                <Button
                    variant="outlined"
                    size="medium"
                    className={classes.search_button}
                    onClick={() => handleClick()}
                >
                    <Icon fontSize="1.45rem" icon="tabler:search" />
                </Button>
            </Grid>
            <Grid item sm={12} md={5} className={classes.actionBtns}>
                <Button
                    color="primary"
                    variant="outlined"
                    sx={{ px: 5, py: 2, textTransform: "unset" }}
                    startIcon={<Icon icon="tabler:upload" />}
                    onClick={() => handleExport()}
                    disabled={gridVisibleRowCountSelector(apiRef.current.state) === 0}
                >
                    {t("EXPORT")}
                </Button>
                <Button
                    onClick={handleOpenNewAttribute}
                    variant="contained"
                    disabled={!isCreatePermissionEnabled}
                    className={classes.createRecordBtn}
                    startIcon={<FaPlus size={"12px"} />}
                    sx={{
                        width: "auto !important",
                        "@media (max-width: 600px)": {
                            width: "7rem",
                        },
                    }}
                >
                    <Translations text={"NEW_ATTRIBUTE"} />
                </Button>
            </Grid>
        </Grid>
    );
};

const CustomerAttributesPaging = (props: any) => {
    const {
        data,
        columns,
        isLoading,
        handleOpenNewAttribute,
        page,
        setPage,
        newPage,
        setNewPage,
        searchValue,
        setSearchValue,
    } = props;

    const settings: any = window.localStorage.getItem("settings");
    const mode = JSON.parse(settings)?.mode;
    const direction = JSON.parse(settings)?.direction;
    const { t } = useTranslation();

    let searchText: string = t("CUSTOMER_ATTRIBUTE_SEARCH");
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        let pages = data?.length ?? 0;
        setTotalPages(Math.ceil(pages / pageSize));
    }, [data]);

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
    };

    useEffect(() => {
        let pages = data?.length ?? 0;
        setTotalPages(Math.ceil(pages / pageSize));
    }, [pageSize]);

    useEffect(() => {
        if (newPage === 0) setPage(1);
        setPage(newPage - 1);
    }, [newPage]);

    const classes = useStyles({ direction, newPage });

    const handleSearch = (value: string) => {
        setSearchValue(value)
    };

    const firstPage = () => {
        if (page > 0) setPage(0);
        setNewPage(1);
    };

    const lastPage = () => {
        if (page < totalPages) setPage(totalPages - 1);
        setNewPage(Math.ceil(data?.length / pageSize));
    };

    const nextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
            setNewPage(newPage + 1);
        }
    };

    const previousPage = () => {
        if (page > 0) {
            setPage(page - 1);
            setNewPage(newPage - 1);
        }
    };

    const pageNumberChange = (value: any) => {
        if (value > totalPages) return;
        setNewPage(Number(value));
    };
    return (
        <Box className={classes.grid}>
            <div style={{ position: "relative" }}>
                <DataGrid
                    autoHeight
                    rowHeight={56}
                    rows={data}
                    columns={columns || []}
                    loading={isLoading}
                    rowsPerPageOptions={[10, 30, 50, 70, 100]}
                    disableSelectionOnClick
                    getRowId={(row: any) => row?.id}
                    page={page}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
                    checkboxSelection={true}
                    components={{
                        Toolbar() {
                            return (
                                <GridCustomHeader
                                    direction={direction}
                                    value={searchValue}
                                    handleSearch={handleSearch}
                                    searchText={searchText}
                                    handleOpenNewAttribute={handleOpenNewAttribute}
                                />
                            );
                        },
                    }}
                    localeText={{ noRowsLabel: t("NO_RECORDS_ADDED") as string }}
                />
                <Stack
                    sx={{
                        position: "absolute",
                        bottom: "18px",
                        right: "24px",
                        direction: "ltr !important",
                    }}
                >
                    <Box className={classes.buttons}>
                        <button
                            disabled={page === 0}
                            onClick={firstPage}
                            className={classes.arrowBtn}
                        >
                            <Icon icon="tabler:chevrons-left" />
                        </button>
                        <button
                            disabled={page === 0}
                            onClick={previousPage}
                            className={classes.arrowBtn}
                        >
                            <Icon icon="tabler:chevron-left" />
                        </button>
                        <input
                            disabled={newPage === totalPages}
                            className={classes.input}
                            type="text"
                            value={newPage || ""}
                            onChange={(e) => pageNumberChange(e.target.value)}
                        />
                        <span
                            className={classes.text}
                            style={
                                mode === "dark"
                                    ? { color: "rgba(228, 230, 244, 0.87)" }
                                    : { color: "rgba(51, 48, 60, 0.87)" }
                            }
                        >
                            of
                        </span>
                        <button className={classes.arrowBtn} onClick={lastPage}>
                            {totalPages}
                        </button>
                        <button
                            disabled={page + 1 === totalPages}
                            onClick={nextPage}
                            className={classes.arrowBtn}
                        >
                            <Icon icon="tabler:chevron-right" />
                        </button>
                        <button
                            disabled={page + 1 === totalPages}
                            onClick={lastPage}
                            className={classes.arrowBtn}
                        >
                            <Icon icon="tabler:chevrons-right" />
                        </button>
                    </Box>
                </Stack>
            </div>
        </Box>
    )
}

export default CustomerAttributesPaging