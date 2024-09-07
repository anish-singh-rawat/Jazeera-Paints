import React, { useEffect } from "react";
import CommonHorizontalTabs from "src/components/common/CommonHorizontalTabs";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
import { Grid } from "@mui/material";
import { t } from "i18next";
import { AppDispatch, RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import InvoiceHistoryDataTable from "src/components/invoice-history/invoiceHistoryDataTable";
import { invoiceHistoryTiles } from "src/store/apps/invoiceHistory/invoiceHistory";
import 'devextreme/dist/css/dx.light.css';
 
import Button from 'devextreme-react/button';
import Chart, {
    ArgumentAxis,
    Series,
    Legend
} from 'devextreme-react/chart';
import PivotGrid, {
  FieldChooser,Scrolling, Export
} from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import {
  downloadInvoice,
  getInvoiceHistoryById,
  invoiceEmail,
  invoiceHistoryList,
} from "src/store/apps/invoiceHistory/invoiceHistory";
import 'devextreme/dist/css/dx.light.css';
 
 
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportPivotGrid } from 'devextreme/excel_exporter';
 

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [fetchLatestData, setFetchLatestData] = React.useState(false);

  const invoiceHistory = useSelector(
    (state: RootState) => state.invoiceHistory
  );
  
  const data = [{
    arg: 1990,
    val: 5320816667
}, {
    arg: 2000,
    val: 6127700428
}, {
    arg: 2010,
    val: 6916183482
    }];
  useEffect(() => {
          dispatch(invoiceHistoryList({limit:500}));
 
  }, []);

  const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Store',
    width: 120,
    dataField: 'store.code',
    
    dataType:'string',
    area: 'row',
    selector(data:any) {
      return `${data?.store?.name } (${data?.store?.code})`;
    },
    }, {
    caption: 'Invoice Num',
    dataField: 'invoiceNum',
    width: 150,
    area: 'row',
      },
    {
    caption: 'Customer Name',
    dataField: 'firstName',  
    area: 'row',
    selector(data:any) {
      return `${data?.firstName} (${data?.lastName})`;
    },
      },   
    {
    caption: 'Gross Amt',
    dataField: 'grossAmount',
    width: 150,
    area: 'data',
    dataType:'number',
    summaryType: 'sum',
      isMeasure: true, 
      format(value:any) {
        // Format value to desired number of decimal places
        return parseFloat(value).toFixed(2);
      }
  
    },
    {
    caption: 'Total Disc',
    dataField: 'totalDiscount',
    width: 150,
    area: 'data',
    summaryType: 'sum',
      isMeasure: true, 
    format(value:any) {
        // Format value to desired number of decimal places
        return parseFloat(value).toFixed(2);
      }
    },
    {
    caption: 'Vat',
    dataField: 'tax',
    width: 150,
    area: 'data',
    summaryType: 'sum',
      isMeasure: true, 
    format(value:any) {
        // Format value to desired number of decimal places
        return parseFloat(value).toFixed(2);
      }
    },
    {
    caption: 'Invoice Amt',
    dataField: 'invoiceAmount',
    width: 150,
    area: 'data',
      summaryType: 'sum',
    format(value:any) {
        // Format value to desired number of decimal places
        return parseFloat(value).toFixed(2);
      }
      },
    {
      dataField: 'id',
      visible: false // hides this field in the Field Chooser 
      },
    {
      dataField: 'uuid',
      visible: false // hides this field in the Field Chooser 
      },
    ],
  store: invoiceHistory.data,
});


  useEffect(() => {
    dispatch(invoiceHistoryTiles());
  }, []);
  // const handleChangeStore = (stores: any, startDate: any, endDate: any) => {
  //   let payload = {};

  //   if (stores && stores.length > 0 && stores[0].id) {
  //     payload = { ...payload, storeId: stores[0].id };
  //   }

  //   if (startDate) {
  //     payload = { ...payload, startDate: startDate };
  //   }

  //   if (endDate) {
  //     payload = { ...payload, endDate: endDate };
  //   }

  //   if (Object.keys(payload).length > 0) {
  //     dispatch(invoiceHistoryTiles(payload));
  //   }
  // };
  function exportGrid(e) {
    const workbook = new Workbook(); 
    const worksheet = workbook.addWorksheet("Sales"); 
    exportPivotGrid({ 
        worksheet: worksheet, 
        component: e.component
    }).then(function() {
        workbook.xlsx.writeBuffer().then(function(buffer) { 
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Sales.xlsx"); 
        }); 
    });
}

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={6}
            // justifyContent={"center"}
          >
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                icon="tabler:box"
                showDifference={false}
                stats={invoiceHistory?.tilesData?.totalSales}
                trendDiff={0}
                title={t("TOTAL_SALES")}
                subtitle="Last 30 days"
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:box"
                title={t("TOTAL_RETURNS")}
                stats={invoiceHistory?.tilesData?.totalReturns}
                trendDiff={0}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={6}>
              <CardStatsHorizontalWithDetails
                showDifference={false}
                icon="tabler:box"
                title={t("NET_SALES")}
                stats={invoiceHistory?.tilesData?.totalNetSales}
                trendDiff={0}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br></br>
      <React.Fragment>
    {/* <div className="long-title">
      <h3>Sales Amount by Region</h3>
    </div> */}
    <PivotGrid
      id="sales"
      onExporting={exportGrid}
      dataSource={dataSource}
      allowSortingBySummary={true}
      allowSorting={true}
      allowFiltering={true}
      allowExpandAll={true}
      rowHeaderLayout="tree"
      height={500}
      showBorders={true}
    >
          <FieldChooser enabled={true} />
          <Scrolling mode="virtual" />
          <Export enabled={true} />
    </PivotGrid>
  </React.Fragment>
      {/* <InvoiceHistoryDataTable
        setFetchLatestData={setFetchLatestData}
        handleChangeStore={handleChangeStore}
      /> */}
    </>
  );
}
