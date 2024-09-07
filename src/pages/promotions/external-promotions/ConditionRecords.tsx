import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Typography } from "@mui/material";
import { AppDispatch, RootState } from "src/store";
import { t } from "i18next";
import ConditionRecordsDataTable from "src/components/promotion/extrenalPromotion/ConditionRecordsDataTable";
import ConditionalRecordHeader from "src/components/promotion/extrenalPromotion/ConditionalRecordHeader";
import {
  externalPromotionHeaderList,
  legalEntity,
} from "src/store/apps/promotion/externalPromotion/externalPromotion";
import {
  freeGoods,
  instantDiscount,
  lineDiscount,
  pricingList,
} from "src/store/apps/promotion/externalPromotion/externalPromotionColumn";
import { getDateFormate } from "src/@core/utils/format";
const ConditionRecords: React.FC = () => {
  const [selectedFieldType, setSelectedFieldType] = useState<any>("all");
  const [selectedLegalEntityId, setSelectedLegalEntityId] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const userProfileString: any = localStorage.getItem("userData");
  const userProfileData = JSON.parse(userProfileString);

  // ** Dummy Data for Experimental DataGrid
  // const data = [
  //   {
  //     id: 22,
  //     uuid: "fdb0cc33-1695-46ec-b7e0-98685607df99",
  //     externalPromotionHeader: {
  //       id: 3,
  //       uuid: "f5e1247d-1dee-484d-b1ee-041d71972cbf",
  //       promotionHeaderColumnsMapping: [
  //         {
  //           id: 22,
  //           promotionHeaderColumns: {
  //             id: 1,
  //             uuid: "e58bbc41-2428-4c10-8d5a-246b8d87d51a",
  //             code: "customer",
  //             name: "customer",
  //             altName: "customer",
  //             active: true,
  //             tenantId: 1,
  //             companyId: 1,
  //             externalReference: "customer",
  //             createdBy: 20,
  //             type: "CUSTOMER",
  //             columns: ["id", "code", "firstName", "lastName", "email"],
  //             technicalColumnName: "customerId",
  //           },
  //         },
  //         {
  //           id: 23,
  //           promotionHeaderColumns: {
  //             id: 3,
  //             uuid: "c620ffaf-8ba5-447b-a7fa-cb265fcf7559",
  //             code: "product",
  //             name: "product",
  //             altName: "product",
  //             active: true,
  //             tenantId: 1,
  //             companyId: 1,
  //             externalReference: "product",
  //             createdBy: 20,
  //             type: "PRODUCT",
  //             columns: ["id", "code", "shortName", "altShortName", "email"],
  //             technicalColumnName: "productId",
  //           },
  //         },
  //       ],
  //     },

  //     customer: {
  //       id: 26688,
  //       uuid: "39a1a02e-3c69-4863-82ad-c6df311d555c",
  //       code: "601001",
  //       firstName: "Mohammad md",
  //       lastName: "EPr",
  //       email: "mohammad@ep-pricing.com",
  //     },
  //     product: {
  //       id: 1,
  //       uuid: "04b9f5e7-0907-45e2-b9a2-4ce6c937b528",
  //       code: "11000000",
  //       shortName: "EPOXY ZINC PHOSPHATE PRIMER HDNR 2.0L",
  //       altShortName: "ايبوكسي زنك فوسفايت برايمر هاردنر (CLEAR",
  //     },
  //     totalCount: 3,
  //   },
  // ];
  const externalPromotionColumn: any = useSelector(
    (state: RootState) => state.externalPromotionColumn
  );

  useEffect(() => {
    dispatch(
      externalPromotionHeaderList({
        promotionType: selectedFieldType,
        legalEntityId: selectedLegalEntityId,
        companyId: userProfileData?.company?.id,
      })
    );
    dispatch(legalEntity(true));
  }, [selectedFieldType]);

  const pricingStaticColumn: any = [
    {
      field: "amount",
      minWidth: 120,
      headerName: t("AMOUNT"),
      flex: 1,
    },
    {
      field: "validFrom",
      minWidth: 120,
      headerName: t("validFrom"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.validFrom ? getDateFormate(data?.row?.validFrom) : "-"}
          </div>
        );
      },
    },
    {
      field: "validTo",
      minWidth: 120,
      headerName: t("validTo"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.validTo ? getDateFormate(data?.row?.validTo) : "-"}
          </div>
        );
      },
    },
  ];

  const lineDiscountStaticColumn: any = [
    {
      field: "discountPercent",
      minWidth: 120,
      headerName: t("discountPercent"),
      flex: 1,
    },
    {
      field: "validFrom",
      minWidth: 120,
      headerName: t("validFrom"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.validFrom ? getDateFormate(data?.row?.validFrom) : "-"}
          </div>
        );
      },
    },
    {
      field: "validTo",
      minWidth: 120,
      headerName: t("validTo"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.validTo ? getDateFormate(data?.row?.validTo) : "-"}
          </div>
        );
      },
    },
  ];

  const freeGoodsStaticColumn: any = [
    {
      field: "minimumQuantity",
      minWidth: 120,
      headerName: t("minimumQuantity"),
      flex: 1,
    },
    {
      field: "forQuantity",
      minWidth: 120,
      headerName: t("forQuantity"),
      flex: 1,
    },
    {
      field: "calculationRule",
      minWidth: 120,
      headerName: t("calculationRule"),
      flex: 1,
    },
    {
      field: "freeGoodType",
      minWidth: 120,
      headerName: t("freeGoodType"),
      flex: 1,
    },
    {
      field: "freeProductId",
      minWidth: 120,
      headerName: t("freeProductId"),
      flex: 1,
      renderCell: ({ row }: any) => {
        return <Typography>{`${row.product?.id}`}</Typography>;
      },
    },
    {
      field: "freeQuantity",
      minWidth: 120,
      headerName: t("freeQuantity"),
      flex: 1,
    },
    {
      field: "validFrom",
      minWidth: 120,
      headerName: t("validFrom"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.validFrom ? getDateFormate(data?.row?.validFrom) : "-"}
          </div>
        );
      },
    },
    {
      field: "validTo",
      minWidth: 120,
      headerName: t("validTo"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.validTo ? getDateFormate(data?.row?.validTo) : "-"}
          </div>
        );
      },
    },
  ];

  const instantDiscountStaticColumn: any = [
    {
      field: "discountPercent",
      minWidth: 120,
      headerName: t("discountPercent"),
      flex: 1,
    },
    {
      field: "scaleSequence",
      minWidth: 120,
      headerName: t("scaleSequence"),
      flex: 1,
    },
    {
      field: "fromValue",
      minWidth: 120,
      headerName: t("fromValue"),
      flex: 1,
    },
    {
      field: "toValue",
      minWidth: 120,
      headerName: t("toValue"),
      flex: 1,
    },
    {
      field: "validFrom",
      minWidth: 120,
      headerName: t("validFrom"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.validFrom ? getDateFormate(data?.row?.validFrom) : "-"}
          </div>
        );
      },
    },
    {
      field: "validTo",
      minWidth: 120,
      headerName: t("validTo"),
      flex: 1,
      renderCell: (data: any) => {
        return (
          <div style={{ textTransform: "capitalize" }}>
            {data?.row?.validTo ? getDateFormate(data?.row?.validTo) : "-"}
          </div>
        );
      },
    },
  ];

  const handleFormSubmit = (selectedValues: any) => {
    switch (selectedValues?.selectedFieldType) {
      case "PRICING":
        dispatch(
          pricingList({
            externalPromotionHeaderIds: selectedValues?.externalPromotionHeader,
          })
        );
        break;
      case "INSTANT_DISCOUNT":
        dispatch(
          instantDiscount({
            externalPromotionHeaderIds: selectedValues?.externalPromotionHeader,
          })
        );
        break;
      case "LINE_DISCOUNT":
        dispatch(
          lineDiscount({
            externalPromotionHeaderIds: selectedValues?.externalPromotionHeader,
          })
        );
        break;
      case "FREE_GOODS":
        dispatch(
          freeGoods({
            externalPromotionHeaderIds: selectedValues?.externalPromotionHeader,
          })
        );
        break;
      default:
        break;
    }
  };

  const getConditionalData = () => {
    switch (selectedFieldType) {
      case "PRICING":
        return externalPromotionColumn?.pricingData || [];
      case "INSTANT_DISCOUNT":
        return externalPromotionColumn?.instantDiscountData || [];
      case "LINE_DISCOUNT":
        return externalPromotionColumn?.lineDiscountData || [];
      case "FREE_GOODS":
        return externalPromotionColumn?.freeGoodsData || [];
      default:
        return [];
    }
  };

  const getConditionalHeader = () => {
    switch (selectedFieldType) {
      case "PRICING":
        return pricingStaticColumn || [];
      case "INSTANT_DISCOUNT":
        return instantDiscountStaticColumn || [];
      case "LINE_DISCOUNT":
        return lineDiscountStaticColumn || [];
      case "FREE_GOODS":
        return freeGoodsStaticColumn || [];
      default:
        return [];
    }
  };

  return (
    <>
      <Card>
        <ConditionalRecordHeader
          selectedFieldType={selectedFieldType}
          setSelectedFieldType={setSelectedFieldType}
          setSelectedLegalEntityId={setSelectedLegalEntityId}
          externalPromotionColumn={externalPromotionColumn}
          onSubmitForm={handleFormSubmit}
          userProfileData={userProfileData}
        />
      </Card>
      <br />
      <Card>
        <ConditionRecordsDataTable
          data={getConditionalData()}
          isLoading={externalPromotionColumn?.isLoading}
          staticHeaderCol={getConditionalHeader()}
        />
      </Card>
    </>
  );
};

export default ConditionRecords;
