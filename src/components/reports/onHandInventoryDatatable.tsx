import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Icon from "src/@core/components/icon";
import Image from "next/image";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { t } from "i18next";
import CommonServerSidePaging from "src/components/common/CommonServerSidePaging/CommonServerSidePaging";
import Chip from "src/@core/components/mui/chip";
import { getstockOnhand } from "src/store/apps/reports";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Autocomplete,
  Checkbox,
  FormControl,
  Grid,
  ListItemText,
  TextField,
} from "@mui/material";
// import { storesListGet } from "src/store/apps/storeSettings/storeSettings";
import { fetchAllStoresList, storesListGet } from "src/store/apps/storeSettings/storeSettings";
import { useSelector } from "react-redux";

const onHandInventoryDatatable = (props: any) => {
  const {
    handleEditPage,
    isLoading,
    data,
    classification,
    byStore,
    viewStoreDetails,
    viewWeightDetails,
    rowCount,
    handleByStoreSelect,
    handleNavigation,
    selectedRecord,
    storeItem,
    setStoreItem,
    handleDelete,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  
  const { t } = useTranslation();
  const [newValue, setNewValue] = useState([]);
  const storeSettingsStore: any = useSelector(
    (state: RootState) => state?.storeSettingsStore
    );
  const additionalParams = {
    classification: classification,
    byStore: byStore,
    storeId: newValue.length > 0 ? newValue.map((item: any) => item.id).join(",") : "",
  };
  console.log(classification, "classification");


  const handleSelectionChange = (event: any, newValue: any) => {
    setNewValue(newValue);
  };

  useEffect(() => {
    Promise.allSettled([
      //   dispatch(invoiceHistoryList({})),
    ]).catch(console.error);
    dispatch(fetchAllStoresList());
    // handleFetchInvoiceHistory();
  }, []);

  useEffect(()=>{
    props.handleChangeStore(newValue)
  },[newValue])

  const columns: any = [
    // Can be used in Future
    // {
    //   field: "id",
    //   headerName: t("ID"),
    //   hide: true,
    //   hideable: false,
    //   filterable: false,
    // },
    {
      field: "sku",
      minWidth: 70,
      headerName: t("SKU"),
      flex: 0.35,
      valueGetter: (params: any) => {
        return params?.row?.product?.code;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row.product?.code ? `${row.product?.code}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "productName",
      minWidth: 130,
      headerName: t("PRODUCT_NAME"),
      flex: 1,
      valueGetter: (params: any) => {
        return params?.row?.product?.shortName;
      },
      renderCell: ({ row }: any) => {
        return (
          <>
            {" "}
            <img
              width={40}
              style={{ marginRight: "10px" }}
              alt={`${row?.name}`}
              src={`/images/avatars/1.png`}
            />
            <Typography>
              {row?.product?.shortName ? `${row?.product?.shortName}` : "-"}
            </Typography>
            ;
          </>
        );
      },
    },
    {
      field: "UOM",
      minWidth: 75,
      headerName: t("UOM"),
      flex: 0.35,
      valueGetter: (params: any) => {
        return params?.row?.baseUom?.name;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.baseUom?.name ? `${row?.baseUom?.name}` : "-"}
          </Typography>
        );
      },
    },
    ...(byStore
      ? [
          {
            field: "Store Name",
            minWidth: 70,
            headerName: t("STORE NAME"),
            flex: 0.35,
            valueGetter: (params: any) => {
              return params?.row?.store?.name;
            },
            renderCell: ({ row }: any) => {
              return (
                <Typography>
                  {row?.store?.name ? `${row?.store?.name}` : "-"}
                </Typography>
              );
            },
          },
        ]
      : []),
    ...(classification === "byBatch"
      ? [
          {
            field: "Batch",
            minWidth: 70,
            headerName: t("BATCH"),
            flex: 0.35,
            valueGetter: (params: any) => {
              return params?.row?.productBatch?.code;
            },
            renderCell: ({ row }: any) => {
              return (
                <Typography>
                  {row?.productBatch?.code ? `${row?.productBatch?.code}` : "-"}
                </Typography>
              );
            },
          },
        ]
      : []),
    {
      field: "Stock",
      minWidth: 70,
      headerName: t("STOCK"),
      flex: 0.35,
      valueGetter: (params: any) => {
        return params?.row?.id;
      },
      renderCell: ({ row }: any) => {
        return <Typography>{row?.id ? `${row?.id}` : "-"}</Typography>;
      },
    },
    {
      field: "Availabe",
      minWidth: 80,
      headerName: t("AVAILABLE"),
      flex: 0.35,
      valueGetter: (params: any) => {
        return params?.row?.availableQuantity;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.availableQuantity ? `${row?.availableQuantity}` : "-"}
          </Typography>
        );
      },
    },
    {
      field: "Reserved",
      minWidth: 80,
      headerName: t("RESERVED"),
      flex: 0.35,
      valueGetter: (params: any) => {
        return params?.row?.tenantId;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>{row?.tenantId ? `${row?.tenantId}` : "-"}</Typography>
        );
      },
    },
    {
      field: "Intransit",
      minWidth: 80,
      headerName: t("INTRANSIT"),
      flex: 0.35,
      valueGetter: (params: any) => {
        return params?.row?.transitQuantity;
      },
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {row?.transitQuantity ? `${row?.transitQuantity}` : "-"}
          </Typography>
        );
      },
    },
    ...(classification === "byProduct"
      ? [
          {
            field: "openOrders",
            //minWidth: 100,
            headerName: t("OPEN_ORDERS"),
            flex: 0.4,
            minWidth: 100,
            valueGetter: (params: any) => {
              return params?.row?.openOrder;
            },
            renderCell: ({ row }: any) => {
              return (
                <Typography>
                  {row?.openOrder ? `${row?.openOrder}` : "-"}
                </Typography>
              );
            },
          },
        ]
      : []),
    {
      headerName: t(" "),
      disableExport: true,
      sortable: false,
      disableColumnMenu: true,
      flex: 0.75,
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={storeItem}
              setItem={setStoreItem}
              deleteCall={(id: string) => handleDelete(id)}
              reduxAction={false}
              viewStoreDetails={viewStoreDetails}
              viewWeightDetails={viewWeightDetails}
              viewIcon={false}
              handleNavigation={handleNavigation}
              storeicon={true}
              switchicon={true}
              WeightIcon={true}
              editIcon={false}
              deleteIcon={false}
            />
          </div>
        );
      },
    },
  ];

  return (
    <CommonServerSidePaging
      rows={data || []}
      rowCount={rowCount}
      columns={columns || []}
      isLoading={isLoading}
      handleEditPage={handleEditPage}
      fetchDataWithSearch={getstockOnhand}
      additionalParams={additionalParams}
      statusChange={handleByStoreSelect}
      searchPlaceholder={"Search by SKU, Product Name, Store Name..."}
      hideImport={true}
      byStore={byStore}
      hideAddNew={true}
      isSwitchBox={true}
      moduleType={"reports"}
    >
      {byStore && (
         <FormControl size="small" sx={{ minWidth: 215 }}>
         <Autocomplete
           multiple
           id="checkboxes-tags-demo"
           options={
             [...(storeSettingsStore?.data || [])].sort((a, b) =>
               newValue.some(item => item.id === a.id) ? -1 : newValue.some(item => item.id === b.id) ? 1 : 0
             )
           }
           disableCloseOnSelect
           getOptionLabel={(option: any) => option?.name || ""}
           // filterSelectedOptions
           renderOption={(props, option, { selected }) => (
             <li {...props} key={option.id}>
               <Checkbox
                 icon={<CheckBoxOutlineBlankIcon fontSize="medium" />}
                 checkedIcon={<CheckBoxIcon fontSize="medium" />}
                 style={{ marginRight: 8 }}
                 checked={selected}
               />
               <ListItemText primary={option?.name} />
             </li>
           )}
           style={{ width: 215 }}
           value={newValue}
           onChange={handleSelectionChange}
           renderInput={(params: any) => (
             <TextField
               {...params}
               label={
                 newValue.length > 0
                   ? `${newValue.length}/${storeSettingsStore?.data.length} Selected`
                   : "All Stores"
               }
               InputLabelProps={{
                 style: newValue.length > 0 ? { color: "#2196f3" } : {},
               }}
               size="small"
             />
           )}
           renderTags={() => null}
         />
       </FormControl>
      )}
    </CommonServerSidePaging>
  );
};

export default onHandInventoryDatatable;
