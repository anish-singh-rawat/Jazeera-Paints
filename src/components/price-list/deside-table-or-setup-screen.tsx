import FullFeaturedCrudGrid from "./price-list-table";
import ProductPriceSetUp from "./product-price-setup";

interface DesideTableOrSetupGridProps {
  checkedElements: Record<string, any>;
  rows?: any[];
  searchedEver: boolean;
  setData: (innerfunction: any) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
  setDeletedProducts: React.Dispatch<React.SetStateAction<any[]>>;
  setEditedProducts: React.Dispatch<React.SetStateAction<any[]>>;
  tableLoading: boolean;
  deleteSelectedPageItems: (ids: any) => Promise<void>;
  isId: string;
  isFirstTimeEdit: boolean;
  updateOneRow: (data: Record<string, any>) => Promise<void>;
  deleteAllProducts:()=>Promise<void>
}

export default function DesideTableOrSetupGrid({
  checkedElements,
  rows = [],
  searchedEver,
  setData,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalCount,
  setDeletedProducts,
  setEditedProducts,
  tableLoading,
  deleteSelectedPageItems,
  isId,
  isFirstTimeEdit,
  updateOneRow,
  deleteAllProducts
}: DesideTableOrSetupGridProps) {
  const hasData =
    Object.keys(checkedElements).length > 0 || rows.length > 0 || searchedEver;

  return (
    <>
      {hasData ? (
        <FullFeaturedCrudGrid
          data={rows}
          setData={setData}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalCount={totalCount}
          setDeletedProducts={setDeletedProducts}
          setEditedProducts={setEditedProducts}
          searchLoading={tableLoading}
          deleteSelectedPageItems={deleteSelectedPageItems}
          updateOneRow={updateOneRow}
          deleteAllProducts={deleteAllProducts}
        />
      ) : (
        <ProductPriceSetUp
          isCardDisable={!!isId}
          priceListId={isId}
          isFirstTimeEdit={isFirstTimeEdit}
        />
      )}
    </>
  );
}
