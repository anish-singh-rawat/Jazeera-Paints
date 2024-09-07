import { t } from "i18next";
import moment from "moment";
import router from "next/router";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppEvent from "src/app/AppEvent";
import { useAuth } from "src/hooks/useAuth";
import { AppDispatch, RootState } from "src/store";
import { ROOT_BASE_API } from "src/store/apps";
import { clearFields, updateField } from "src/store/apps/price-form/price-formSlice";
import { createPrice, getPriceListByID, priceUpdate } from "src/store/apps/price-list";
import { clearCheckedItems, updateData } from "src/store/apps/product-items";
import { decryptPriceId, encryptPriceId } from "src/utils/utils";
import { Product } from "./makeData";

const checkFormErrors = (
    formData: Record<string, any>,
    keys: string[]
): [boolean, Record<string, boolean>] => {
    const errors: Record<string, any> = {};
    let returnFlag = false;
    for (const key of keys) {
        if (!formData[key]) {
            errors[key as any] = true;
            returnFlag = true;
        }
    }
    return [returnFlag, errors];
};

const checkAlreadyExistsError = (
    record: any[],
    tofind: string,
    keyToCheck: string,
    skipName: string
) => {
    const find = record.find((d) => d[keyToCheck] == tofind);

    if (!find) return false;

    return Boolean(record.find((d) => d[keyToCheck] == tofind)?.name != skipName);
};

export const prepareCreatePayload = (
    formdata: Record<string, any>,
    tableData: Product[],
    currency: Record<string, any>,
    isEditMode = false
) => {
    // let productPrice;
    // if (isEditMode && tableData?.length) {
    //     productPrice = [];
    //     for (const data of tableData) {
    //         productPrice.push({
    //             price: data.price,
    //             UOMId: data?.UOMId?.id,
    //             sku: data.sku,
    //             minimumPrice: data.minimumPrice,
    //             productId: data.productId,
    //             id: data?.deleteId,
    //             startDate: moment(data.startDate).format("YYYY-MM-DD"),
    //             endDate: moment(data.endDate).format("YYYY-MM-DD"),
    //             active: data.active,
    //             conversion: data.conversion,
    //             status: data.status,
    //             companyId: data.companyId,
    //             tenantId: data.tenantId,
    //         });
    //     }
    // }
    return {
        code: formdata["code"],
        name: formdata["name"],
        altName: formdata["altName"] ?? formdata["name"],
        externalReference: formdata["externalReference"],
        priceType: formdata["priceType"]?.["code"],
        status: formdata["status"]?.["code"],
        active: true,
        currencyId: currency?.id,
        // productPrice: productPrice,
    };
};



export default function usePriceListTable(rows: any[]) {
    //local states
    const [loading, setLoading] = useState(true);
    const [isFirstTimeEdit, setIsFirstTimeEdit] = useState(true);
    const [isId, setIsId] = useState<number | string | undefined>();
    const [completed, setCompleted] = useState<boolean | null>(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchedEver, setSearchedEver] = useState<boolean>(false);
    const [errorState, setErrors] = useState<Record<string, boolean>>({});
    const [isdisable, setIsDisable] = useState(false);
    const [isCardDisable, setIsCardDisable] = useState(true);
    const [deletedProducts, setDeletedProducts] = useState<(string | number)[]>(
        []
    );
    const [editedProducts, setEditedProducts] = useState<(string | number)[]>([]);
    const [currentName, setCurrentname] = useState("");
    const [currentCode, setCurrentcode] = useState("");

    //custom or redux hooks
    const dispatch = useDispatch<AppDispatch>();
    const auth = useAuth()

    //redux selectors
    const getPriceValueStatus =
        useSelector((state: RootState) => state?.priceListStatus?.data) || [];

    const getPriceTypeValue =
        useSelector((state: RootState) => state?.priceTypeList?.data) || [];

    const getFormValue =
        useSelector((state: RootState) => state.PriceSlice) || {};

    const getPriceListCodeStatus = useSelector(
        (state: RootState) => state.priceListStatus.code
    );
    const priceListData: any =
        useSelector((state: RootState) => state.priceListData.data) || [];

    //route handlers 
    const { id, isEdit } = router.query;



    //custom variables 
    const getCurrency = auth?.user?.company?.currency;

    //custom functions
    function setData(innerFunction: (data: any) => any) {
        const data = innerFunction(rows);
        dispatch(updateData(data));
    }


    const mapState = useCallback(
        (data: Record<string, any>) => {
            dispatch(updateField({ value: data["code"], key: "code" }));
            dispatch(updateField({ value: data["altName"], key: "altName" }));
            dispatch(updateField({ value: data["name"], key: "name" }));
            setCurrentname(data["name"]);
            setCurrentcode(data["code"]);
            dispatch(
                updateField({
                    value: data["externalReference"],
                    key: "externalReference",
                })
            );
            dispatch(updateField({ value: data["priceType"], key: "priceType" }));
            dispatch(updateField({ value: data["status"], key: "status" }));
            setCompleted(data?.isCompleted);
        },
        [getPriceValueStatus, getPriceTypeValue]
    );

    const fetchData = async () => {
        if (router.isReady && id && isEdit) {
            if (!router.query?.reload) {
                setTableLoading(true);
            }
            const decryptedId = decryptPriceId(id);
            let params = `${decryptedId}/?skip=${page}&limit=${pageSize}`;
            if (id && typeof id === "string") {
                setIsId(encodeURIComponent(id));
            }
            const productSearch = router.query?.searchItem;
            if (productSearch) {
                setSearchedEver(true);
                params += `&searchItem=${productSearch}`;
            }
            try {
                const response = await dispatch(getPriceListByID(params));
                const editData = response?.payload?.productPriceList || [];
                setTotalCount(response?.payload?.totalCount);
                setIsFirstTimeEdit(!Boolean(response?.payload?.totalCount));
                mapState(response?.payload);
                if (!productSearch) {
                    setSearchedEver(false);
                }

                if (response?.payload?.["isCompleted"]) {
                    const routerQuery = { ...router.query };
                    delete routerQuery["reload"];
                    router.replace({ query: routerQuery });
                }

                let datamapped: Record<string, any> = {};
                for (const item of editData) {
                    datamapped[item.id] = {
                        ...item,
                        UOMId: item?.product?.salesUOM,
                        image: item?.product?.image,
                        productName: item?.product?.shortName,
                        id: item?.id,
                        deleteId: item?.productId,
                    };
                }
                dispatch(updateData(Object.values(datamapped).filter((d) => !!d)));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setTableLoading(false);
            }
        }
    };

    const onSubmit = async () => {
        setIsDisable(true);
        setLoading(true);
        let editedProductsData = [];

        if (editedProducts.length) {
            editedProductsData = rows.filter((product) =>
                editedProducts.includes(product.id)
            );
        }

        try {
            const payload: any = prepareCreatePayload(
                getFormValue,
                editedProductsData,
                getCurrency as any,
                isEdit ? true : false
            );

            const errorArray = ["priceType", "status"];
            if (!getPriceListCodeStatus) {
                errorArray.push("code");
            }

            const formErros = checkFormErrors(getFormValue, errorArray);
            
            if (formErros[0]) {
                setErrors(formErros[1]);
                setIsDisable(false);
                return;
            }
            const isNameAlreadyExists = checkAlreadyExistsError(
                priceListData,
                getFormValue?.name,
                "name",
                currentName
            );

            if (isNameAlreadyExists) {
                setIsDisable(false);
                return;
            }
            let res: any = {};

            if (isEdit) {
                payload.id = +decryptPriceId(id);
                if (deletedProducts.length) {
                    await deleteProducts(false);
                    await fetchData();
                    setDeletedProducts([]);
                }
                res = await dispatch(priceUpdate(payload as any));
                setEditedProducts([]);
                setIsDisable(false);
            } else {
                res = await dispatch(createPrice(payload as any));
            }
            if (!!res.payload?.id) setIsId(encryptPriceId(res.payload?.id));

            if (res?.payload?.error) {
                setIsDisable(false);
                return;
            }
            if (isEdit) {
                router.push("price-list");
            }
            if (!isEdit) {
                dispatch(clearFields());
                dispatch(clearCheckedItems());
            }
            setIsCardDisable(false);
        } catch (error) {
            setIsDisable(false);
            console.error("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProducts = async (ids: any) => {
        let token = localStorage.getItem("accessToken");
        const decryptedId = decryptPriceId(id);
        const payload = {
            priceListId: decryptedId,
            productIds: ids ? ids : deletedProducts,
        };

        token = token ? `Bearer ${token}` : null;
        await fetch(ROOT_BASE_API + "ProductPriceList", {
            method: "DELETE",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                Authorization: token || "",
            },
            body: JSON.stringify(payload),
        }).catch(console.log);
    };

    const deleteSelectedPageItems = async (ids: any) => {
        if (ids) {
            await deleteProducts(ids);
            await fetchData();
        }
    };

    const updateOneRow = async (data: any) => {
        const payload: any = {
            id: data?.priceListId,
            productPrice: [{
                price: data.price,
                UOMId: data?.UOMId?.id,
                sku: data.sku,
                minimumPrice: data.minimumPrice,
                productId: data.productId,
                startDate: moment(data.startDate).format("YYYY-MM-DD"),
                endDate: moment(data.endDate).format("YYYY-MM-DD"),
                active: data.active,
                conversion: data.conversion,
                id:data?.id
            }]
        }
        await dispatch(priceUpdate(payload))
        await fetchData()
    }

    const deleteAllProducts = async () => {
        let token = localStorage.getItem("accessToken");
        token = token ? `Bearer ${token}` : null;
        await fetch(ROOT_BASE_API + "ProductPriceList", {
            method: "DELETE",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                Authorization: token || "",
            },
            body: JSON.stringify({
                priceListId: decryptPriceId(isId as any),
                all: true,
            }),
        })
            .then((res) => res.json())
            .then(console.log)
            .catch(console.log);
        await fetchData();
    };


    return {
        deleteSelectedPageItems,
        deleteAllProducts,
        errorState,
        fetchData,
        isFirstTimeEdit,
        isId,
        isdisable,
        loading,
        onSubmit,
        page,
        pageSize,
        searchedEver,
        setData,
        setDeletedProducts,
        setEditedProducts,
        setPage,
        setPageSize,
        tableLoading,
        totalCount,
        updateOneRow
    };


}