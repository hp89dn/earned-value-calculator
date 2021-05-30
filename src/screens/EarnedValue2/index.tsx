import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import React from "react";
import { MaterialTable } from "../../containers";

export const EarnedValue2 = () => {
  const rows: GridRowsProp = [
    { id: 1, col1: "Hello", col2: "World" },
    { id: 2, col1: "XGrid", col2: "is Awesome" },
    { id: 3, col1: "Material-UI", col2: "is Amazing" },
  ];

  const columns: GridColDef[] = [
    { field: "col1", headerName: "Column 1", width: 150 },
    { field: "col2", headerName: "Column 2", width: 150 },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <MaterialTable />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
