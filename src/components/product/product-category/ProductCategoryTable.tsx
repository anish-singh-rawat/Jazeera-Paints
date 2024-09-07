import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Chip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import CommonAddNewModel from "src/components/common/CommonAddNewModel";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import GridCustomExport from "src/components/export/GridCustomExport";
import {
  ProductcategoryDelete,
  ProductcategoryGetById,
} from "src/store/apps/product/product-category";
import { updateNameAndId } from "src/store/apps/product/product-search";
import ProductCategoryView from "./ProductCategoryView";

const ProductCategoryTable = (props: any) => {
  const [visible, setVisible] = useState<any>(false);
  const [productSubCategoryView, setProductSubCategoryciew] = useState([]);
  const { data, handleEditPage, item, setItem, selectedRecord, isLoading } =
    props;

  const { t } = useTranslation();

  interface UserStatusType {
    [key: string]: ThemeColor;
  }
  const dispatch = useDispatch();

  const handleDialogClose = () => {
    setVisible(false);
  };
  const userStatusObj: UserStatusType = {
    Active: "success",
    pending: "warning",
    Inactive: "secondary",
  };

  const handleLinkClick = (row: any) => {
    dispatch(updateNameAndId({ id: row.id, name: row.name }));
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
      minWidth: 120,
      headerName: t("CODE"),
      flex: 1,
    },
    {
      field: "name",
      minWidth: 130,
      headerName: t("NAME"),
      flex: 1,
    },
    {
      field: "altName",
      minWidth: 130,
      headerName: t("ALTERNATE_NAME"),
      flex: 1,
    },

    {
      field: "externalReference",
      minWidth: 148,
      headerName: t("REFERENCE"),
      flex: 1,
    },
    {
      field: "productSubCategory",
      headerName: t("PRODUCT_SUBCATEGORY"),
      align: "center",
      flex: 1,
      minWidth: 60,
      renderCell: ({ row }: any) => {
        const length = row?.productSubCategory?.length;
        return length !== undefined ? (
          <Link
            href={`product-subcategory`}
            style={{ textDecoration: "none", color: "#3586C7" }}
            onClick={() => handleLinkClick(row)}
          >
            {length}
          </Link>
        ) : (
          <span aria-disabled>0</span>
        );
      },
      valueGetter: ({ row }: any) => row?.productSubCategory?.length ?? 0,
    },
    {
      field: "totalProducts",
      minWidth: 138,
      headerName: t("TOTAL_PRODUCTS"),
      flex: 1,
      renderCell: (params: any) => (params.row.totalProducts ? params.row.totalProducts : 0)
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
      valueGetter: ({ row }: any) => (row.active ? "Active" : "Inactive"),
    },
    {
      headerName: t("ACTIONS"),
      disableExport: true,
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
              deleteCall={ProductcategoryDelete}
              entityCall={ProductcategoryGetById}
              view={true}
            />
          </div>
        );
      },
    },
  ];
  return (
    <>
      <GridCustomExport
        rows={data}
        columns={columns}
        isLoading={isLoading}
        handleEditPage={handleEditPage}
      />
      {visible && (
        <CommonAddNewModel
          handleDialogClose={handleDialogClose}
          title={"ProductSubCategory"}
        >
          <ProductCategoryView
            data={productSubCategoryView ? productSubCategoryView : []}
          />
        </CommonAddNewModel>
      )}
    </>
  );
};

export default ProductCategoryTable;
