import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Checkbox, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import Image from "next/image";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "./price-list-style";
import { useRouter } from "next/router";

const label = { inputProps: { "aria-label": "Switch demo" } };
export interface TableCustomProps {
  rows: any[]; // Change this type to match the actual type of your rows
  setRows: React.Dispatch<React.SetStateAction<any[]>>;
  searchItem: any[];
  setSearchItem: React.Dispatch<React.SetStateAction<any[]>>;
  // Change this type to match the actual type of your setRows function
}

export interface FilterOperator {
  value: string;
  requiresFilterValue?: boolean;
}

export interface TableColumn {
  width: number;
  minWidth: number;
  maxWidth: number | null;
  hide: boolean;
  hideable: boolean;
  sortable: boolean;
  resizable: boolean;
  filterable: boolean;
  groupable: boolean;
  pinnable: boolean;
  aggregable: boolean;
  editable: boolean;
  type: string;
  align: string;
  filterOperators: FilterOperator[];
  headerAlign: string;
  field: string;
  disableColumnMenu: boolean;
  disableReorder: boolean;
  disableExport: boolean;
  cellClassName: string;
  headerClassName: string;
  headerName: string;
  computedWidth: number;
}

export interface ProductType {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
}

export interface ProductGroup {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
}

export interface ProductCategory {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
}

export interface ProductSubCategory {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
}

export interface ProductDivision {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
}

export interface SkuCodeType {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
}

export interface ProductSkuCodeMapping {
  id: number;
  skuCode: string;
  skuCodeTypes: SkuCodeType;
}

export interface ProductSource {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
}

export interface ProductClassification {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
}

export interface ProductPrice {
  productId: number;
  isTaxesIncluded: boolean;
  minimumPrice: number;
  startDate: string;
  endDate: string;
  active: boolean;
  price: number;
  priceList: {
    id: number;
    code: string;
    name: string;
    altName: string;
    priceType: string;
  };
  currency: {
    id: number;
    code: string;
    name: string;
  };
}

export interface TableRow {
  id: number;
  uuid: string;
  shortName: string;
  altShortName: string;
  longName: string;
  altLongName: string;
  description: string;
  altDescription: string;
  productClassification: string;
  hasVariant: boolean;
  productType: ProductType;
  productGroup: ProductGroup;
  productCategory: ProductCategory;
  productSubCategory: ProductSubCategory;
  productDivision: ProductDivision;
  externalReference: string;
  sellOnPos: boolean;
  sellOnline: boolean;
  active: boolean;
  hasSerialNumber: boolean;
  retailPrice: number;
  isDeleted: boolean;
  createdOn: string;
  updatedOn: string;
  productSkuCodeMapping: ProductSkuCodeMapping[];
  productSources: ProductSource;
  productClassifications: ProductClassification;
  image: string;
  code: string;
  isAssociate: boolean;
  isExclusive: boolean;
  productSource: string;
  productPrice: ProductPrice[];
  edit: boolean;
  startDate: string;
  endDate: string;
}

export interface TableColumnData {
  id: number;
  columns: TableColumn[];
  row: TableRow;
}

export default function TableCustom({
  rows,
  setRows,
  searchItem,
  setSearchItem,
}: TableCustomProps) {
  const [edit, setEdit] = React.useState("");
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [disabled, setDisabled] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);

  const classes = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { id, isEdit } = router.query;

  const handleEditClick = (ele: any) => () => {
    setEdit(ele.id);
    setRows((prevItems) =>
      prevItems.map(
        (item: any) =>
          item.uniqueId == ele.id ? { ...item, edit: !item.row?.edit } : item
        // console.log(item,"888888888888888888888888888888888888888")
      )
    );
  };

  const handleSaveClick = (ele: TableColumnData) => () => {
    setRows((prevItems) =>
      prevItems.map((item: any) =>
        item.uniqueId == ele.id ? { ...item, edit: false } : item
      )
    );
  };

  const handleDeleteClick = (item: TableColumnData) => () => {
    setRows(rows.filter((row) => row.uniqueId !== item.id));
  };

  const handleCancelClick = (ele: TableColumnData) => () => {
    setRows((prevItems) =>
      prevItems.map((item: any) =>
        item.id == ele.id ? { ...item, edit: !item.edit } : item
      )
    );
  };

  const handleAltChange = (
    item: TableColumnData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    //console.log(item,e)

    setRows((prevData) =>
      prevData.map((ele) =>
        ele.id === item.id ? { ...ele, altShortName: e.target.value } : ele
      )
    );
  };

  const handleEndDateChange = (
    item: TableColumnData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRows((prevData) =>
      prevData.map((ele) =>
        ele.uniqueId === item.id ? { ...ele, endDate: e.target.value } : ele
      )
    );
  };

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (
    item: TableColumnData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRows((prevData) =>
      prevData.map((ele) =>
        ele.uniqueId === item.id ? { ...ele, startDate: e.target.value } : ele
      )
    );
  };

  const handleSwitch = (checked: Boolean, item: TableColumnData | any) => {
    setRows((prevData) =>
      prevData.map((ele) =>
        ele.uniqueId === item.id ? { ...ele, active: checked } : ele
      )
    );
  };

  const handleMinPrice = (
    item: TableColumnData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRows((prevData) =>
      prevData.map((ele) =>
        ele.uniqueId === item.id
          ? { ...ele, minimumPrice: e.target.value }
          : ele
      )
    );
  };

  const handleConversion = (
    item: TableColumnData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRows((prevData) =>
      prevData.map((ele) =>
        ele.uniqueId === item.id
          ? { ...ele, conversion: e.target.checked }
          : ele
      )
    );
  };

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: t("IMAGE") as any,
      width: 100,
      headerClassName: classes.customHeader,
      renderCell: (item) => (
        <Image src={item.value} alt={"Product Pic"} height={50} width={50} />
      ),
    },

    {
      field: "shortName",
      headerName: t("PRODUCT_NAME") as any,
      type: "string",
      width: 200,
      align: "left",
      headerAlign: "left",
      headerClassName: classes.customHeader,
      renderCell: (item) => (
        // console.log(item ,"KKKKKKKKKKK")
        <TextField
          disabled={true}
          value={item?.row?.product?.shortName}
          sx={{
            border: "none",
            "& fieldset": { border: "none" },
            cursor: "pointer",
          }}
          type="text"
        />
      ),
    },

    {
      field: "SKU",
      headerName: t("SKU") as any,
      type: "string",
      width: 70,
      align: "left",
      headerAlign: "left",
      headerClassName: classes.customHeader,
    },

    {
      field: "UOM",
      headerName: t("UOM") as any,
      type: "string",
      width: 70,
      align: "left",
      headerAlign: "left",
      headerClassName: classes.customHeader,
    },

    {
      field: "retailPrice",
      headerName: t("PRICE") as any,
      type: "string",
      width: 100,
      align: "left",
      headerAlign: "left",
      headerClassName: classes.customHeader,
    },
    {
      field: "minPrice",
      headerName: t("MIN_PRICE") as string,
      width: 100,
      align: "left",
      headerAlign: "left",
      headerClassName: classes.customHeader,
      type: "number",
      renderCell: (item) => (
        <TextField
          disabled={!item.row.edit}
          value={item.row.minimumPrice}
          sx={
            !item.row.edit
              ? {
                  border: "none",
                  "& fieldset": { border: "none" },
                  cursor: "pointer",
                }
              : {
                  border: "none",
                  "& fieldset": { border: "none" },
                  cursor: "pointer",
                  backgroundColor: "white",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }
          }
          type="number"
          onChange={(e) => handleMinPrice(item, e)}
        />
      ),
    },
    {
      field: "startDate",
      headerName: t("START_DATE") as string,
      width: 200,
      type: "date",
      editable: true,
      headerClassName: classes.customHeader,
      renderCell: (item) => (
        <TextField
          value={formatDate(item.row.startDate)}
          sx={
            !item.row.edit
              ? {
                  border: "none",
                  "& fieldset": { border: "none" },
                  cursor: "pointer",
                }
              : {
                  border: "none",
                  "& fieldset": { border: "none" },
                  cursor: "pointer",
                  backgroundColor: "white",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }
          }
          type="date"
          disabled={!item.row.edit}
          onChange={(e) => handleStartDateChange(item, e)}
        />
      ),
    },
    {
      field: "endDate",
      headerName: t("END_DATE") as string,
      width: 200,
      headerClassName: classes.customHeader,
      type: "date",
      editable: true,
      renderCell: (item) => (
        <TextField
          value={formatDate(item.row.endDate)}
          disabled={!item.row.edit}
          sx={
            !item.row.edit
              ? {
                  border: "none",
                  "& fieldset": { border: "none" },
                  cursor: "pointer",
                }
              : {
                  border: "none",
                  "& fieldset": { border: "none" },
                  cursor: "pointer",
                  backgroundColor: "white",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }
          }
          type="date"
          onChange={(e) => handleEndDateChange(item, e)}
        />
      ),
    },
    {
      field: "CONVERSION",
      headerName: t("CONVERSION") as string,
      width: 100,
      headerClassName: classes.customHeader,
      renderCell: (item) => (
        <Checkbox
          disabled={!item.row.edit}
          sx={{ border: "none", "& fieldset": { border: "none" } }}
          onChange={(e) => handleConversion(item, e)}
        />
      ),
    },
    {
      field: "active",
      headerName: t("STATUS") as any,
      width: 100,
      headerClassName: classes.customHeader,
      renderCell: (item) => {
        let isInEditMode = item.row.edit;
        return [
          <Switch
            {...label}
            disabled={!item.row.edit}
            onChange={(e) => handleSwitch(e.target.checked, item)}
            checked={item.row.active}
            sx={{ marginRight: "2rem" }}
          />,
        ];
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 180,
      cellClassName: "actions",
      headerClassName: classes.customHeader,
      getActions: (item: any) => {
        let isInEditMode = item.row.edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(item)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(item)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(item)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(item)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleCellEditChange = (item) => {
    let { props } = item;
    let date = formatDate(props.value);

    setRows((prevData) =>
      prevData.map((ele) =>
        ele.uniqueId === item.id ? { ...ele, startDate: date } : ele
      )
    );

    // setRows((prevData) =>
    //   prevData.map((ele) =>
    //     ele.uniqueId === item.id ? { ...ele, endDate: date } : ele
    //   )
    // );
  };

  return (
    <Box sx={{ height: 400 }}>
      <DataGrid
        sx={{ background: "white" }}
        rows={rows}
        columns={columns}
        checkboxSelection
        getRowId={(row) => row?.uniqueId}
        onEditCellPropsChange={(params) => handleCellEditChange(params)}
      />
    </Box>
    // </Box>
  );
}
