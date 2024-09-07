import React, { useEffect, useState } from "react";
import CommonClientSidePagination from "src/components/common/CommonClientSidePagination";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { useTranslation } from "react-i18next";
import CommonAddNewModel from "src/components/common/CommonAddNewModel";
import CommonButton from "src/components/common/CommonButton";
//import ProductCategoryView from "./ProductCategoryView";
import {
  paymentDelete,
  paymentGetById,
} from "src/store/apps/payment-terms/payment_terms";

const ProductTermTable = (props: any) => {
  const [visible, setVisible] = useState<any>(false);
  const [productSubCategoryView, setProductSubCategoryciew] = useState([]);
  const {
    data,
    handleEditPage,
    item,
    setItem,
    selectedRecord,
    searchEnabled,
    isLoading,
  } = props;

  const { t } = useTranslation();

  interface UserStatusType {
    [key: string]: ThemeColor;
  }

  const handleDialogClose = () => {
    setVisible(false);
  };
  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

  const getDate = (date: any) => {
    const startDate = new Date(date);
    const [month, day, year] = [
      startDate.getMonth(),
      startDate.getDate(),
      startDate.getFullYear(),
    ];

    return `${day >= 10 ? day : "0" + day}/${
      month >= 10 ? month + 1 : "0" + (month + 1)
    }/${year}`;
  };
  const handleButton = (row: any) => {
    setVisible(!visible);
    setProductSubCategoryciew(row);
  };

  const mydata = data.map((item: any) => {
    return item.productSubCategory;
  });

  const columns: any = [
    {
      field: "code",
      minWidth: 110,
      headerName: t("CODE"),
      flex: 1,
    },
    {
      field: "name",
      minWidth: 120,
      headerName: t("NAME"),
      flex: 1,
    },
    {
      field: "altName",
      minWidth: 120,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },

    {
      field: "paymentMethod",
      minWidth: 138,
      headerName: t("PAYMENT_METHOD"),
      flex: 1,
    },
    {
      field: "externalReference",
      headerName: t("REFERENCE"),
      flex: 1,
    },
    {
      field: "active",
      headerName: t("STATUS"),
      flex: 1,
      minWidth: 100,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            rounded
            skin="light"
            size="small"
            label={row.active ? "Active" : "Inactive"}
            color={userStatusObj[row.active ? "Active" : "Inactive"]}
            sx={{ fontSize: "1rem" }}
          />
        );
      },
    },
    {
      headerName: t("ACTIONS"),
      sortable: false,
      disableColumnMenu: true,
      flex: 1.5,
      minWidth: 130,
      // align: "center",
      renderCell: ({ row }: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <span
                  style={{
                    cursor: "pointer",
                    color: "#3586C7",
                    fontSize: "15px",
                    fontWeight: 400,
                  }}
                  onClick={() => selectedRecord(row)}
                >
                  More
                </span> */}
            <CommonRowoptions
              id={row.id}
              row={row}
              selectedRecord={selectedRecord}
              handleEditPage={handleEditPage}
              item={item}
              setItem={setItem}
              deleteCall={paymentDelete}
              entityCall={paymentGetById}
              view={true}
            />
          </div>
        );
      },
    },
  ];
  return (
    <>
      <CommonClientSidePagination
        rows={data}
        columns={columns}
        searchEnabled={searchEnabled}
        isLoading={isLoading}
      />
      {visible && (
        <CommonAddNewModel
          handleDialogClose={handleDialogClose}
          title={"ProductSubCategory"}
        >
          {/* <ProductCategoryView
            data={productSubCategoryView ? productSubCategoryView : []}
          />  */}
        </CommonAddNewModel>
      )}
    </>
  );
};

export default ProductTermTable;
