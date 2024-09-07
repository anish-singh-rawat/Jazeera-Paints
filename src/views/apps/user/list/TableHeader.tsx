// ** MUI Imports
import {
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Switch,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa6";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** i18n Imports
import { useTranslation } from "react-i18next";
import CommonSwitch from "src/components/common/CommonSwitch";

interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
  handleSearch: any;
  handleExport: () => void;
  handleAssign?: () => void;
  exportStatus?: boolean;
  isCreatePermissionEnabled: boolean;
  moduleType?: string;
  showAddBtn?: boolean;
  showAssignBtn?: boolean;
  disabledAssign?: boolean;
  isSwitchBox?: boolean;
  isImport?: boolean;
  
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const {
    handleFilter,
    toggle,
    value,
    handleSearch,
    handleExport,
    exportStatus,
    isCreatePermissionEnabled,
    moduleType,
    showAddBtn = true,
    showAssignBtn = false,
    isImport = true,
    disabledAssign,
    isSwitchBox = false,
    handleAssign,
  } = props;
  const [error, setError] = useState<boolean>(false);
  let ref = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();
  let placeholder: any =
    moduleType === "products"
      ? t("SEARCH_PRODUCTS")
      : moduleType === "batches"
      ? t("SEARCH_BATCHES")
      : moduleType === "reports"
      ? t("Search by SKU, Product Name, Store Name...")
      : t("SEARCH_CUSTOMERS");

  const handleEnterKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

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

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Grid
        sm={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 4,
          justifyContent: "flex-start",
        }}
        container
      >
        <Grid item sm={12} md={8.4} sx={{ display: "flex", gap: "20px" }}>
          <TextField
            inputRef={ref}
            size="small"
            fullWidth
            error={error}
            value={value}
            sx={{ mr: 2 }}
            placeholder={placeholder}
            onChange={(e: any) => handleFilter(e.target.value)}
            onKeyPress={handleEnterKeyPress}
          />
        </Grid>
        <Button
        
          onClick={handleClick}
          variant="outlined"
          size="medium"
          sx={{ px: 1, py: 2 }}
        >
          <Icon fontSize="1.45rem" icon="tabler:search"  />
        </Button>
      </Grid>
      <Grid item sx={{ display: "flex", gap: "10px" }}>
        {isImport && (
          <Button
            color="secondary"
            variant="outlined"
            sx={{ px: 5, py: 2, textTransform: "unset" }}
            startIcon={<Icon icon="tabler:download" />}
          >
            {t("IMPORT")}
          </Button>
        )}
        <Button
          color="primary"
          variant="outlined"
          disabled={!exportStatus}
          sx={{ px: 5, py: 2, textTransform: "unset" }}
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
        {showAddBtn && (
          <Button
            onClick={toggle}
            variant="contained"
            disabled={!isCreatePermissionEnabled}
            startIcon={<FaPlus size={"12px"} />}
            sx={{ px: 5.4, py: 2, textTransform: "unset", fontSize: "12.5px" }}
          >
            {t("ADD_NEW")}
          </Button>
        )} <div style={{ marginLeft: "-10px", marginTop: "-8px" }}>
        {isSwitchBox  && (
      <Box>
        <CommonSwitch /> {t("BY_STORE")}
      </Box>
        )} </div>
      </Grid>
    </Box>
  );
};

export default TableHeader;
