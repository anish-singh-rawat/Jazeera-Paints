import { Card } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriceListTable from "src/components/price-list/PriceListTable";
import { AppDispatch, RootState } from "src/store";
import { clearFields } from "src/store/apps/price-form/price-formSlice";
import { getPriceCodeMapping } from "src/store/apps/pricelist/price-status";
import {
  clearCheckedItems,
  clearEverything,
} from "src/store/apps/product-items";
import { defaultValues } from "src/types/forms/productDivisionTypes";

const Division = () => {
  const [groupItem, setGroupItem] = useState(defaultValues);
  const [viewOpen, setViewOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const priceListData: any = useSelector(
    (state: RootState) => state.priceListData
  );

  const handleEditPage = () => {
    dispatch(clearCheckedItems());
    dispatch(clearFields());
    dispatch(clearEverything());
    router.push("create-price");
  };

  const viewToggle = () => {
    setViewOpen(!viewOpen);
  };

  const selectedRecord = (data: any) => {
    setViewOpen(true);
  };

  useEffect(() => {
    Promise.allSettled([
      // dispatch(getPriceListData({})),
      dispatch(getPriceCodeMapping()),
    ]).catch(console.error);
  }, []);

  return (
    <Card>
      <PriceListTable
        data={priceListData?.data ?? []}
        isLoading={priceListData.isLoading}
        selectedRecord={selectedRecord}
        handleEditPage={handleEditPage}
        setGroupItem={setGroupItem}
        groupItem={groupItem}
        rowCount={priceListData?.totalCount}
      />
    </Card>
  );
};

export default Division;
