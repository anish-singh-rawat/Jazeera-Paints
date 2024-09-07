import React from "react";
import ProductByBatchDataTable from "src/components/productsBatch/productByBatchDataTable";

const ProductByBatch = () => {
  const [fetchLatestData, setFetchLatestData] = React.useState(false);

  return (
    <>
      <ProductByBatchDataTable />
    </>
  );
};

export default ProductByBatch;
