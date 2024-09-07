// ** React Imports
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";
import {
  fetchProductsBatchListData,
  productBatchDelete,
  productsBatchGetById,
} from "src/store/apps/productBatch/productBatch";
import differenceInDays from "date-fns/differenceInDays";
import CommonRowoptions from "../common/CommonRowoptions";
import moment from "moment";
import CommonAssignUnAssignModal from "../common/CommonAssignUnAssignModal";
import { fetchProductsListData } from "src/store/apps/products/products-add/productsAdd";
import CommonServerSidePaging from "../common/CommonServerSidePaging/CommonServerSidePaging";
import { GridColDef } from "@mui/x-data-grid";
import Chip from "src/@core/components/mui/chip";
import CommonRowOptionswithOutApiCall from "../common/CommonRowOptionswithOutApiCall";

const ProductsBatchDataTable = (props: any) => {
  const {
    handleEditPage,
    isLoading,
    data,
    rowCount,
    selectedRecord,
    setBatchItem,
  } = props;
  // ** Hook & Var
  const [selectedBatchId, setSelectedBatchId] = useState<string[]>([]);
  const [assignedStoresAndTerminals, setAssignedStoresAndTerminals] =
    useState<any>([]);
  const [existingStoresAndTerminalsData, setExistingStoresAndTerminalsData] =
    useState<any>([]);
  const [openAssignDialog, setOpenAssignDialog] = useState<boolean>(false);
  const { t } = useTranslation();
  const handleAssign = () => {
    setOpenAssignDialog(true);
  };

  interface UserStatusType {
    [key: string]: ThemeColor;
  }

  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

  const setItems = (data: any) => {
    setBatchItem({
      ...data,
      dateOfManufacture: new Date(data?.dateOfManufacture),
      shelfLifeExpiryDate: new Date(data?.shelfLifeExpiryDate),
    });
  };

  // old(new) Columns
  // const columns: any = [
  //   {
  //     field: "code",
  //     minWidth: 100,
  //     headerName: t("BATCH_NO"),
  //     flex: 1,
  //     renderCell: ({ row }: any) => {
  //       return <Typography>{`${row.code}`}</Typography>;
  //     },
  //   },
  //   {
  //     field: "dateOfManufacture",
  //     minWidth: 120,
  //     headerName: t("MANUFACTURING_DATE"),
  //     flex: 1,
  //     renderCell: ({ row }: any) => {
  //       return (
  //         <Typography>
  //           {moment(row?.dateOfManufacture).format("DD-MM-YYYY")}
  //         </Typography>
  //       );
  //     },
  //   },
  //   {
  //     field: "shelfLifeExpiryDate",
  //     minWidth: 120,
  //     headerName: t("EXPIRY_DATE"),
  //     flex: 1,
  //     renderCell: ({ row }: any) => {
  //       return (
  //         <Typography>
  //           {moment(row?.shelfLifeExpiryDate).format("DD-MM-YYYY")}
  //         </Typography>
  //       );
  //     },
  //   },
  //   {
  //     field: "TotalShelfLife",
  //     minWidth: 120,
  //     headerName: t("TOTAL_SHELF_LIFE"),
  //     flex: 1,
  //     renderCell: ({ row }: any) => {
  //       let { dateOfManufacture, shelfLifeExpiryDate } = row;
  //       return (
  //         <>
  //           {dateOfManufacture &&
  //             differenceInDays(
  //               new Date(shelfLifeExpiryDate),
  //               new Date(dateOfManufacture)
  //             )}
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     field: "remainingShelfLife",
  //     minWidth: 120,
  //     headerName: t("REMAINING_SHELF_LIFE"),
  //     flex: 1,
  //     renderCell: ({ row }: any) => {
  //       let { dateOfManufacture, shelfLifeExpiryDate } = row;
  //       return (
  //         <>
  //           {dateOfManufacture &&
  //             differenceInDays(new Date(shelfLifeExpiryDate), new Date())}
  //         </>
  //       );
  //     },
  //   },
  //   // ** in future use
  //   // {
  //   //   field: "active",
  //   //   headerName: t("STATUS"),
  //   //   flex: 0.8,
  //   //   minWidth: 120,
  //   //   renderCell: ({ row }: any) => {
  //   //     return (
  //   //       <Chip
  //   //         rounded
  //   //         skin="light"
  //   //         size="small"
  //   //         label={row.active ? t("ACTIVE") : t("INACTIVE")}
  //   //         color={userStatusObj[row.active ? "Active" : "Inactive"]}
  //   //         sx={{ fontSize: "1rem" }}
  //   //       />
  //   //     );
  //   //   },
  //   //   valueGetter: ({ row }: any) => (row.active ? "Active" : "Inactive"),
  //   // },
  //   {
  //     headerName: t("ACTIONS"),
  //     disableExport: true,
  //     sortable: false,
  //     disableColumnMenu: true,
  //     flex: 1,
  //     minWidth: 120,
  //     renderCell: ({ row }: any) => {
  //       return (
  //         <Box style={{ display: "flex", alignItems: "center" }}>
  //           <CommonRowoptions
  //             id={row.id}
  //             row={row}
  //             selectedRecord={null}
  //             handleEditPage={handleEditPage}
  //             item={null}
  //             setItem={null}
  //             deleteCall={productBatchDelete}
  //             entityCall={productsBatchGetById}
  //           />
  //         </Box>
  //       );
  //     },
  //   },
  // ];

  const columns: any = [
    {
      field: "id",
      headerName: t("ID"),
      hide: true,
      hideable: false,
      filterable: false,
    },
    {
      field: "code",
      minWidth: 100,
      headerName: t("CODE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.code}`}</Typography>;
      },
    },
    // {
    //   field: "name",
    //   minWidth: 120,
    //   headerName: t("NAME"),
    //   flex: 1,
    // },
    // {
    //   field: "altName",
    //   minWidth: 120,
    //   headerName: t("ALTERNATE_NAME"),
    //   flex: 1,
    // },
    // {
    //   field: "supplierId",
    //   minWidth: 120,
    //   headerName: t("SUPPLIER_ID"),
    //   flex: 1,
    // },
    // {
    //   field: "supplierBatchNumber",
    //   minWidth: 120,
    //   headerName: t("SUPPLIER_BATCH_NO"),
    //   flex: 1,
    // },
    {
      field: "products",
      minWidth: 120,
      headerName: t("PRODUCTS"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row?.products?.shortName ?? ""}`}</Typography>;
      },
    },
    {
      field: "dateOfManufacture",
      minWidth: 120,
      headerName: t("MANUFACTURING_DATE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {moment(row?.dateOfManufacture).format("DD-MM-YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "shelfLifeExpiryDate",
      minWidth: 120,
      headerName: t("EXPIRY_DATE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography>
            {moment(row?.shelfLifeExpiryDate).format("DD-MM-YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "TotalShelfLife",
      minWidth: 120,
      headerName: t("TOTAL_SHELF_LIFE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        let { dateOfManufacture, shelfLifeExpiryDate } = row;
        return (
          <>
            {dateOfManufacture &&
              differenceInDays(
                new Date(shelfLifeExpiryDate),
                new Date(dateOfManufacture)
              )}
          </>
        );
      },
    },
    {
      field: "remainingShelfLife",
      minWidth: 120,
      headerName: t("REMAINING_SHELF_LIFE"),
      flex: 1,
      renderCell: ({ row }: any) => {
        let { dateOfManufacture, shelfLifeExpiryDate } = row;
        return (
          <>
            {dateOfManufacture &&
              differenceInDays(new Date(shelfLifeExpiryDate), new Date())}
          </>
        );
      },
    },
    {
      field: "active",
      headerName: t("STATUS"),
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.active ? t("ACTIVE") : t("INACTIVE")}
            color={userStatusObj[row.active ? "Active" : "Inactive"]}
            sx={{ fontSize: "1rem" }}
          />
        );
      },
      valueGetter: ({ row }: any) => (row.active ? "Active" : "Inactive"),
    },
    {
      headerName: t("ACTIONS"),
      disableExport: true,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={null}
              handleEditPage={handleEditPage}
              item={null}
              setItem={null}
              deleteCall={productBatchDelete}
              entityCall={productsBatchGetById}
            /> */}
            <CommonRowOptionswithOutApiCall
              row={row}
              selectedRecord={selectedRecord}
              setSelectedRecord={(row: any) => setItems(row)}
              handleEditPage={handleEditPage}
              deleteCell={productBatchDelete}
            />
          </div>
        );
      },
    },
  ];

  // const columnsProduct: GridColDef[] = [
  //   {
  //     field: "shortName",
  //     minWidth: 100,
  //     headerName: t("NAME") || "",
  //     headerAlign: "center",
  //     flex: 1,
  //     sortable: false,
  //     renderHeader: (params) => (
  //       <Typography component={"div"}>{params.colDef.headerName}</Typography>
  //     ),
  //     renderCell: ({ row }: any) => (
  //       <Grid
  //         component={"div"}
  //         sx={{ display: "flex", flexDirection: "column" }}
  //       >
  //         <Typography component={"div"}>{row.shortName}</Typography>
  //         <Typography variant={"subtitle1"} sx={{ color: "#a9a9a9" }}>
  //           {`SKU: ${row.code}`}
  //         </Typography>
  //       </Grid>
  //     ),
  //   },
  // ];

  const productListData: any = useSelector(
    (state: RootState) => state?.productsAdd
  );

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            {
              <CommonServerSidePaging
                rows={data || []}
                rowCount={rowCount}
                columns={columns || []}
                isLoading={isLoading}
                handleEditPage={handleEditPage}
                fetchDataWithSearch={fetchProductsBatchListData}
                moduleType={"batches"}
                showAssignBtn={false} // enable this to use Assign/Unassign Modal
                handleAssign={handleAssign}
                setSelectedBatchId={setSelectedBatchId}
                searchPlaceholder={"SEARCH_BATCHES"}
              />
            }

            {/* // Assign Modal - Assign/Unassign Modal Component  uncomment columnProduct also */}
            {/* <CommonAssignUnAssignModal
              assignedStoresAndTerminals={assignedStoresAndTerminals || []}
              existingStoresAndTerminalsData={
                existingStoresAndTerminalsData || []
              }
              isDialogOpen={openAssignDialog}
              setAssignedStoresAndTerminals={setAssignedStoresAndTerminals}
              setIsDialogOpen={setOpenAssignDialog}
              stores={productListData?.data}
              title={"Products"}
              subTitle={"Assign Product to the Batches"}
              noDataMsg={"No Products Assigned"}
              searchPlaceHolder={"Search by Product"}
              maxWidth={"lg"}
              fullWidth={false}
              selectedBatchId={selectedBatchId}
              columnsProduct={columnsProduct}
              fetchProductsListData={fetchProductsListData}
            /> */}
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};

export default ProductsBatchDataTable;
