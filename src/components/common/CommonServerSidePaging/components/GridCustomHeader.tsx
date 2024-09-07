import { Box, Button, Grid, IconButton, Stack, TextField } from "@mui/material";
import {
  gridVisibleColumnFieldsSelector,
  gridVisibleRowCountSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
// ** Icon Imports
import Icon from "src/@core/components/icon";
import Translations from "src/layouts/components/Translations";
import { FaPlus } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/useAuth";
import { useStyles } from "src/components/price-list/price-list-style";
import { useTranslation } from "react-i18next";
import {
  getCurrentModulePermission,
  mapPermission,
} from "src/components/roles-list/utils";
import MarkDownModal from "src/components/price-list/mark-down-modal";
import CommonSwitch from "../../CommonSwitch";

interface GridCustomHeaderProps {
  handleEditPage: () => void;
  hideImport?: boolean;
  hideAddNew?: boolean;
  isSwitchBox?: boolean;
  children?: any;
  statusChange?: any;
  handleSearch: (value: string | any) => void;
  value: string;
  direction: string;
  searchText: string;
  byStore?: boolean;
  name?: string;
  selectedRowIds: number | any;
  moduleType: string;
  showAssignBtn?: boolean | any;
  disabledAssign?: boolean;
  handleAssign?: any;
}

const GridCustomHeader: React.JSXElementConstructor<GridCustomHeaderProps> = (
  props: GridCustomHeaderProps
) => {
  let {
    handleEditPage,
    handleSearch,
    value,
    direction,
    searchText,
    name,
    byStore,
    selectedRowIds,
    statusChange,
    moduleType,
    showAssignBtn = false,
    disabledAssign,
    handleAssign,
    hideImport,
    hideAddNew,
    isSwitchBox = false,
  } = props;

  const apiRef = useGridApiContext();
  const { t } = useTranslation();
  let ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState(false);
  const classes = useStyles({ direction });
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
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

  const handleClose = () => {
    setOpen(false);
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
  const isEditPermissionEnabled =
    currentModulePermission && currentModulePermission.permissionType.Edit;

  const isEditEnabledForButton = (condition: () => boolean) => {
    if (isEditPermissionEnabled) {
      return condition();
    }
    return false;
  };

  return (
    <Box>
      <Grid
        container
        className={classes.commonHeaderRoot}
        sx={{
          flexWrap: "wrap",
          flexDirection: { sm: "column", md: "row ", xs: "column" },
        }}
      >
        <Grid
          item
          container
          className={classes.search}
          sx={
            moduleType === "productsAssignModal"
              ? { justifyContent: "center" }
              : {}
          }
          sm={12}
          md={moduleType === "productsAssignModal" ? 12 : 4}
        >
          <Grid
            item
            xs={8}
            sm={10}
            md={8}
            sx={{ marginRight: "5px", display: "flex" }}
          >
            <TextField
              inputRef={ref}
              size="small"
              fullWidth
              error={error}
              onChange={(e) => {
                setInput(e.target.value);
                if (!e.target.value.length) handleSearch("");
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
              sx={{
                mr: 2,
                "& .MuiInputBase-input": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Grid>

          <Button
            variant="outlined"
            size="medium"
            className={classes.search_button}
            onClick={() => handleClick()}
            sx={{ height: "35px" }}
          >
            <Icon fontSize="1.45rem" icon="tabler:search" />
          </Button>
        </Grid>
        {moduleType !== "productsAssignModal" && (
          <Grid
            item
            sm={12}
            md={7.5}
            sx={{ display: "flex", gap: "10px" }}
            className={classes.actionBtns}
          >
            {moduleType === "priceList" && (
              <Button
                color="secondary"
                variant="outlined"
                sx={{
                  px: 4,
                  py: 2,
                  textTransform: "unset",
                  color: "#3586C7",
                  backgroundColor:
                    !isEditPermissionEnabled || selectedRowIds.length == 0
                      ? "inherit"
                      : "#DEEBF6",
                  "@media (max-width: 550px)": {
                    width: "100%",
                  },
                }}
                startIcon={
                  <LuArrowDownUp
                    color={
                      selectedRowIds.length == 0 || !isEditPermissionEnabled
                        ? "inherit"
                        : "#3586C7"
                    }
                  />
                }
                onClick={() => setOpen(true)}
                disabled={
                  !isEditEnabledForButton(() =>
                    selectedRowIds.length == 0 ? false : true
                  )
                }
              >
                {t("MARK_UP_AND_DOWN")}
              </Button>
            )}
            <Box
              sx={{
                "@media (max-width: 550px)": {
                  width: "100%",
                },
              }}
            >
              {!hideImport && (
                <Button
                  color="secondary"
                  variant="outlined"
                  sx={{
                    px: 5,
                    py: 2,
                    marginRight: "10px",
                    textTransform: "unset",
                    "@media (max-width: 650px)": {
                      width: "45%",
                    },
                  }}
                  startIcon={<Icon icon="tabler:download" />}
                  disabled={!isCreatePermissionEnabled}
                >
                  {t("IMPORT")}
                </Button>
              )}

              <Button
                color="secondary"
                variant="outlined"
                sx={
                  !showAssignBtn
                    ? {
                        px: 5,
                        py: 2,
                        textTransform: "unset",
                        "@media (max-width: 650px)": {
                          width: "45%",
                        },
                      }
                    : {
                        px: 5,
                        py: 2,
                        marginRight: "10px",
                        textTransform: "unset",
                        "@media (max-width: 650px)": {
                          width: "45%",
                        },
                      }
                }
                startIcon={<Icon icon="tabler:upload" />}
                onClick={() => handleExport()}
              >
                {t("EXPORT")}
              </Button>
              {showAssignBtn && (
                <Button
                  color="primary"
                  variant="outlined"
                  sx={{ px: 5, py: 2, textTransform: "unset" }}
                  disabled={disabledAssign || false}
                  onClick={handleAssign}
                >
                  {t("ASSIGN")}
                </Button>
              )}
            </Box>
            {props.children}
            {!hideAddNew && (
              <Button
                onClick={handleEditPage}
                disabled={!isCreatePermissionEnabled}
                variant="contained"
                className={classes.createRecordBtn}
                startIcon={<FaPlus size={"12px"} />}
                sx={{
                  px: 5,
                  py: 2,
                  textTransform: "unset",
                  "@media (max-width: 650px)": {
                    width: "100%",
                  },
                }}
              >
                <Translations text={"ADD_NEW"} />
              </Button>
            )}
            {isSwitchBox && (
              <div style={{ marginLeft: "-10px", marginTop: "-6px" }}>
                <Box>
                  <CommonSwitch statusChange={statusChange} active={byStore} />{" "}
                  {t("BY_STORE")}
                </Box>
              </div>
            )}{" "}
          </Grid>
        )}
      </Grid>
      {moduleType === "priceList" && (
        <MarkDownModal
          open={open}
          handleClose={handleClose}
          selectedRowIds={selectedRowIds}
          setOpen={setOpen}
        />
      )}
    </Box>
  );
};

export default GridCustomHeader;
