import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Tooltip, Typography } from "@mui/material";
import GridCustomExport from "src/components/export/GridCustomExport";

interface HeaderKey {
  name: string;
  columns: string[] | any;
}

interface RowData {
  externalPromotionHeader?: {
    promotionHeaderColumnsMapping: { promotionHeaderColumns: HeaderKey }[];
  };
  [key: string]: any;
  staticHeaderCol: [];
}

const ConditionRecordsDataTable = (props: RowData) => {
  const { data, staticHeaderCol } = props;

  const createColumns = (): GridColDef[] => {
    const uniqueColumnNames: Set<string> = new Set<string>();
    let columns: GridColDef[] = data.reduce(
      (acc: GridColDef[], rowData: RowData, rowIndex: number) => {
        const rowColumns = (
          rowData.externalPromotionHeader?.promotionHeaderColumnsMapping || []
        ).reduce((colAcc, mapping) => {
          const header = mapping.promotionHeaderColumns;
          header.columns.forEach((columnName: string) => {
            const columnNameToShow = `${header.name} ${columnName}`;
            if (
              !uniqueColumnNames.has(columnNameToShow) &&
              !columnNameToShow.toLowerCase().includes("id") // enable this to filter id column
            ) {
              uniqueColumnNames.add(columnNameToShow);
              colAcc.push({
                field: `${columnNameToShow}_${rowIndex}`,
                headerName: (
                  <Tooltip title={columnNameToShow as string} placement="top">
                    <Typography>{columnNameToShow as string}</Typography>
                  </Tooltip>
                ),
                hide: false,
                minWidth: 130,
                flex: 1,
                hideable: true,
                filterable: true,
                // renderHeader: ({ colDef }) => (
                //   <Tooltip title={colDef.headerName} placement="top">
                //     <Typography>{colDef.headerName}</Typography>
                //   </Tooltip>
                // ),
                valueGetter: (params) =>
                  params.row?.[header.name]?.[columnName],
                renderCell: ({ row }) => (
                  <Typography>
                    {row?.[header.name]?.[columnName]
                      ? row?.[header.name]?.[columnName]
                      : "-"}
                  </Typography>
                ),
              });
            }
          });

          return colAcc;
        }, [] as GridColDef[]);

        return [...acc, ...rowColumns];
      },
      [] as GridColDef[]
    );

    // Add static columns based on selectedFieldType

    if (data.length > 0) {
      columns = [...columns, ...staticHeaderCol];
    }

    return columns;
  };
  const columns = createColumns();

  return (
    <GridCustomExport
      rows={data}
      columns={columns}
      showNewBtn={true}
      // handleEditPage={handleEditPage}
    />
  );
};

export default ConditionRecordsDataTable;
