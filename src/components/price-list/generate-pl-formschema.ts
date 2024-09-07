import router from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "src/hooks/useAuth";
import { AppDispatch, RootState } from "src/store";
import { updateField } from "src/store/apps/price-form/price-formSlice";
import { CommonTextFieldProps } from "./CommonTextField";

const defaultValueStatus = {
    id: 46,
    uuid: "d0ab7e87-c3e7-4b8b-845f-0a6804949271",
    code: "DRAFT",
    name: "Draft",
    altName: "مسودة",
    lookupTypesCode: "PRICE_STATUS",
};


export default function usePriceListForm(rows: any[]) {
    // states 
    const [errorState, setErrors] = useState<Record<string, boolean>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEdition] = useState(-2);

    //hooks
    const dispatch = useDispatch<AppDispatch>();
    const auth = useAuth();

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

    //route handlers 
    const { id, isEdit } = router.query;


    //custom variables 
    const getCurrency = auth?.user?.company?.currency;



    //custom functions
    const handler = (value: string, key: string): void => {
        if (router.query?.reload)
            return;
        let temp = isEditing;
        temp = temp + 1
        setIsEdition(temp)
        dispatch(updateField({ value, key }));
        if (key === "name") dispatch(updateField({ value, key: "altName" }));
        setErrors({});
        if (!router.query?.editFocus && temp >= 0) {
            router.replace({ query: { ...router.query, editFocus: temp } })
        }
    };

    const inputSchema: CommonTextFieldProps[] = [
        {
            label: "CODE",
            customErrorMessage: "REQUIRED",
            defaultValue: "",
            errorState,
            handler,
            base: "code",
            type: "TEXT",
            valueState: getFormValue,
            required: getPriceListCodeStatus ? false : true,
            disabled: getPriceListCodeStatus ? true : false,
            placeholder: getPriceListCodeStatus ? "AUTO_GENERATED" : "CODE",
            errorRule: getPriceListCodeStatus
                ? undefined
                : {
                    length: { size: 5, errorMessage: "CODE_LENGTH_ERR" },
                },
        },
        {
            label: "NAME",
            customErrorMessage: "REQUIRED",
            defaultValue: "",
            errorState,
            handler,
            base: "name",
            type: "TEXT",
            valueState: getFormValue,
            required: true,
            errorRule: {
                maxLength: { size: 25, errorMessage: "MAX_LENGTH_ERROR" },
                minLength: { size: 2, errorMessage: "MIN_LENGTH_ERROR" },
            },
        },
        {
            label: "ALTERNATE_NAME",
            customErrorMessage: "REQUIRED",
            defaultValue: "",
            errorState,
            handler,
            base: "altName",
            type: "TEXT",
            valueState: getFormValue,
            required: false,
            errorRule: {
                maxLength: { size: 25, errorMessage: "MAX_LENGTH_ERROR" },
                minLength: { size: 2, errorMessage: "MIN_LENGTH_ERROR" },
            },
        },
        {
            label: "EXTERNAL_REFERENCE",
            customErrorMessage: "REQUIRED",
            defaultValue: "",
            errorState,
            handler,
            base: "externalReference",
            type: "TEXT",
            valueState: getFormValue,
            required: false,
        },
    ];

    const selectSchema: CommonTextFieldProps[] = [
        {
            label: "CURRENCY_TYPE",
            customErrorMessage: "REQUIRED",
            defaultValue: getCurrency as any,
            options: [getCurrency as any],
            errorState,
            handler,
            base: "currencyType",
            type: "SELECT",
            valueState: getFormValue,
            required: true,
            disabled: true,
        },
        {
            label: "PRICE_TYPE",
            customErrorMessage: "REQUIRED",
            defaultValue: "",
            errorState,
            handler,
            base: "priceType",
            type: "SELECT",
            valueState: getFormValue,
            required: true,
            options: getPriceTypeValue,
        },
        {
            label: "STATUS",
            customErrorMessage: "REQUIRED",
            errorState,
            handler,
            defaultValue: defaultValueStatus as any,
            base: "status",
            type: "SELECT",
            valueState: getFormValue,
            required: true,
            options: getPriceValueStatus,
        },
    ];


    return {
        id,
        inputSchema,
        isOpen,
        isEdit,
        open,
        rows,
        selectSchema,
        setIsOpen
    };

}