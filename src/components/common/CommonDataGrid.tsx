import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const CommonDataGrid = (props: any) => {
  const {
    rows,
    columns,
    rowHeight,
    checkboxSelection,
    rowsPerPageOptions,
    pageSize,
    components,
    initialState,
  } = props;

  return (
    <DataGrid
      autoHeight
      rowHeight={rowHeight || 56}
      rows={rows}
      pageSize={pageSize || 10}
      rowsPerPageOptions={rowsPerPageOptions || [10]}
      disableSelectionOnClick
      getRowId={(row: any) => row?.id}
      columns={columns || []}
      checkboxSelection={checkboxSelection || false}
      pagination
      components={components}
    />
  );
};

export default CommonDataGrid;
