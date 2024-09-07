import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { ThemeColor } from "src/@core/layouts/types";
import { useTranslation } from "react-i18next";
import GridCustomExport from "src/components/export/GridCustomExport";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Icon from "src/@core/components/icon";
import Image from "next/image";
import CommonRowoptions from "src/components/common/CommonRowoptions";
import { deleteUnitOfMeasure, productDelete } from "src/store/apps/products/products-add/productsAdd";

const UOMConversionFactorListDataTable = (props: any) => {
    const { handleEditPage, isLoading, data } = props;
    const dispatch = useDispatch<AppDispatch>();

    interface UserStatusType {
        [key: string]: ThemeColor;
    }

    const userStatusObj: UserStatusType = {
        Active: "success",
        pending: "warning",
        Inactive: "secondary",
    };

    const { t } = useTranslation();

    const columns: any = [
        {
            field: "id",
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            headerName: t("ID"),
        },
        {
            field: "code",
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            headerName: t("CODE"),
        },
        {
            field: "uomCode",
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            headerName: t("UOM_CODE"),
        },
        {
            field: "name",
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            headerName: t("NAME"),
        },
        {
            field: "altName",
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            headerName: t("ALTERNATE_NAME"),
        },
        {
            field: "unitClass",
            minWidth: 150,
            headerName: t("UNIT_CLASS"),
            flex: 1,
            renderCell: ({ row }: any) => {
                return <Typography>{`${row?.unitClass}`}</Typography>;
            },
        },
        {
            headerName: t("ACTIONS"),
            sortable: false,
            disableColumnMenu: true,
            disableExport: true,
            flex: 1,
            renderCell: ({ row }: any) => {
                return (
                    <Box style={{ display: "flex", alignItems: "center" }}>
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
                            selectedRecord={null}
                            handleEditPage={handleEditPage}
                            item={null}
                            setItem={null}
                            deleteCall={deleteUnitOfMeasure}
                            entityCall={null}
                        />
                    </Box>
                );
            },
        },
    ];

    return (
        <GridCustomExport
            rows={data}
            columns={columns}
            isLoading={isLoading}
            handleEditPage={handleEditPage}
            unitOfMeasure={true}
        />
    );
};

export default UOMConversionFactorListDataTable;
