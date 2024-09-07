import { t } from "i18next";
import { RevestCodeFormValidator } from "src/@core/form-validator";
import AppEvent from "src/app/AppEvent";
import * as yup from "yup";

export const CUSTOMER = "CUSTOMER_ATTRIBUTE_CODE";
export const PRODUCT = "PRODUCT_ATTRIBUTE_CODE";

export const buildAttributeUrl = (attributeType: string, tabId: string) => {
    if (attributeType === "Customer") return `CustomerAttribute0${tabId}`;
    return `ProductAttribute0${tabId}`;
};

export const buildAttributeSequenceMappingCode = (attributeType: string, tabId: string) => {
    if (attributeType === "Customer") return `CUSTOMER_ATTRIBUTE_0${tabId}_CODE`;
    return `PRODUCT_ATTRIBUTE_0${tabId}_CODE`;
}

export const tabLabels = ['ATTRIBUTE_ONE', 'ATTRIBUTE_TWO', 'ATTRIBUTE_THIRD', 'ATTRIBUTE_FOUR', 'ATTRIBUTE_FIFTH']

const isNameUnique = (data: any, value: any, currentAttribute: any) => {
    // Check for uniqueness only when creating a new item
    if (!currentAttribute.id) {
        const lowercaseValue = value.toLowerCase();
        const uppercaseValue = value.toUpperCase();
        let unique = data.some((item: any) => {
            const lowercaseItemName = item?.name?.toLowerCase();
            const uppercaseItemName = item?.name?.toUpperCase();
            return (
                lowercaseItemName === lowercaseValue ||
                uppercaseItemName === uppercaseValue
            );
        });
        return !unique;
    }
    // When editing an existing item, check for uniqueness among other records
    const currentItem = data.find(
        (record: any) => record.id === currentAttribute.id
    );
    if (!currentItem) {
        return true; // The current item doesn't exist in the data, so it's effectively unique.
    }
    const matchingItem = data.find((record: any) => {
        const lowercaseItemName = record?.name?.toLowerCase();
        const uppercaseItemName = record?.name?.toUpperCase();
        const lowercaseValue = value.toLowerCase();
        const uppercaseValue = value.toUpperCase();
        return (
            (lowercaseItemName === lowercaseValue ||
                uppercaseItemName === uppercaseValue) &&
            record.id !== currentAttribute.id
        );
    });
    return !matchingItem;
};

const isAltNameUnique = (data: any, value: any, currentAttribute: any) => {
    // Check for uniqueness only when creating a new item
    if (!currentAttribute.id) {
        const lowercaseValue = value.toLowerCase();
        const uppercaseValue = value.toUpperCase();
        let unique = data.some((item: any) => {
            const lowercaseItemAltName = item?.altName?.toLowerCase();
            const uppercaseItemAltName = item?.altName?.toUpperCase();
            return (
                lowercaseItemAltName === lowercaseValue ||
                uppercaseItemAltName === uppercaseValue
            );
        });
        return !unique;
    }
    // When editing an existing item, check for uniqueness among other records
    const currentItem = data.find(
        (record: any) => record.id === currentAttribute.id
    );
    if (!currentItem) {
        return true; // The current item doesn't exist in the data, so it's effectively unique.
    }
    const matchingItem = data.find((record: any) => {
        const lowercaseItemAltName = record?.altName?.toLowerCase();
        const uppercaseItemAltName = record?.altName?.toUpperCase();
        const lowercaseValue = value.toLowerCase();
        const uppercaseValue = value.toUpperCase();
        return (
            (lowercaseItemAltName === lowercaseValue ||
                uppercaseItemAltName === uppercaseValue) &&
            record.id !== currentAttribute.id
        );
    });
    return !matchingItem;
};

const isCodeUnique = (data: any, value: any, currentAttribute: any) => {
    // When editing an existing item
    if (currentAttribute.id) {
        // Check if there's another record with the same code and a different ID
        const matchingItem = data.find((record: any) => {
            return record.code === value && record.id !== currentAttribute.id;
        });
        // If a matching item is found, it's not unique
        return !matchingItem;
    }

    // When creating a new item, check if the code is unique among all records
    return !data.some((record: any) => record.code === value);
};

export const schema = (attributeData: any, currentAttribute: any, isAutoGeneration: any) => yup.object().shape({
    code: isAutoGeneration
    ? yup.string()
    : RevestCodeFormValidator(attributeData, currentAttribute),
    name: yup
        .string()
        .required()
        .test("unique-name", "Name already exists", function (value) {
            return isNameUnique(attributeData, value, currentAttribute);
        }),

    altName: yup
        .string()
        .required()
        .test("unique-altName", "Alt Name already exists", function (value) {
            return isAltNameUnique(attributeData, value, currentAttribute);
        }),
});


export const emmitMessage = (res: any) => {
    let msg = res?.error?.message ?? res?.message;

    if (typeof msg === "string") msg = msg.replace(/ /g, "_");

    AppEvent.messageEmit({
        type: res?.payload?.error ? "error" : "success",
        message: t(msg),
    });
};