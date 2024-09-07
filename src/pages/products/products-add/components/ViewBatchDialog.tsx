import React from "react";
import Typography from "@mui/material/Typography";
import differenceInDays from "date-fns/differenceInDays";
import { t } from "i18next";
import moment from "moment";
import Chip from "src/@core/components/mui/chip";
import ResponsiveDialog from "src/components/common/CommonDialog";
import GridCustomExport from "src/components/export/GridCustomExport";
import { ThemeColor } from "src/@core/layouts/types";

export interface ViewBatchDialogProps {
  openBatchDialog: boolean;
  setOpenBatchDialog: boolean | any;
  dialogBoxTitle: string;
  data: any;
  showActionBtn?: boolean;
  maxWidth?: any;
  sx?: any;
}
const ViewBatchDialog = (props: ViewBatchDialogProps) => {
  interface UserStatusType {
    [key: string]: ThemeColor;
  }

  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

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
    // {
    //   field: "TotalShelfLife",
    //   minWidth: 120,
    //   headerName: t("TOTAL_SHELF_LIFE"),
    //   flex: 1,
    //   renderCell: ({ row }: any) => {
    //     let { dateOfManufacture, shelfLifeExpiryDate } = row;
    //     return (
    //       <>
    //         {dateOfManufacture &&
    //           differenceInDays(
    //             new Date(shelfLifeExpiryDate),
    //             new Date(dateOfManufacture)
    //           )}
    //       </>
    //     );
    //   },
    // },
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
  ];

  return (
    <ResponsiveDialog
      open={props.openBatchDialog}
      setOpen={props.setOpenBatchDialog}
      dialogBoxTitle={t(props.dialogBoxTitle)}
      dialogComponent={() => (
        <GridCustomExport
          rows={props.data}
          columns={columns}
          checkboxSelection={false}
          rowsPerPageOptions={[]}
          showHeaderActionBtn={false}
        />
      )}
      showActionBtn={props.showActionBtn}
      maxWidth={props.maxWidth}
      sx={props.sx}
    />
  );
};

export default ViewBatchDialog;
