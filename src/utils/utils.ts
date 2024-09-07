export const checkUndefinedValues = (...values: unknown[]) => {
    for (const value of values) {
        if (typeof value === "undefined")
            return false;
    }
    return true;
}

export const activeMap = (data: unknown) => {
    if (Array.isArray(data)) {
        return data.filter(data => data?.active)
    }
    return []
}

export const checkEmptyKeys = (data: Record<string, unknown>) => {

    for (const key of Object.keys(data)) {
        if (key in data) {
            if (JSON.stringify(data[key]) == JSON.stringify({}))
                delete data[key]
        }
    }
}

export const populateCustomField = (data: Record<string, unknown>) => {
    if (Array.isArray(data["customerCustomFieldsMapping"]))
        for (const customField of data["customerCustomFieldsMapping"]) {
            data[customField?.["customFields"]?.["name"]] = customField["values"]
        }
}


export function isValidDate(d: any) {
    return d instanceof Date && !isNaN(d as any) ? d : new Date();
}

export const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export const sortItemsByName = (inputArray: any) => {
    if (inputArray?.length > 0) {
        return inputArray.sort((a: any, b: any) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        });
    } else {
        return [];
    }
};

import CryptoJS from 'crypto-js';

export const encryptPriceId = (id: string | string[] | number | undefined) => {
    if (!id || Array.isArray(id)) {
        return ""
    }
    return encodeURIComponent(CryptoJS.AES.encrypt(id.toString(), "").toString());
}

// Function to decrypt the ID
export const decryptPriceId = (encryptedId: string | string[] | undefined) => {
    if (!encryptedId || Array.isArray(encryptedId)) {
        return ""
    }
    let decodedId = decodeURIComponent(encryptedId)
    const bytes = CryptoJS.AES.decrypt(decodedId, "");
    return decodeURIComponent(bytes.toString(CryptoJS.enc.Utf8));
}

export const encryptSalesInvoiceId = (id: string | string[] | number | undefined) => {
    if (!id || Array.isArray(id)) {
        return ""
    }
    return encodeURIComponent(CryptoJS.AES.encrypt(id.toString(), "").toString());
}

export const decryptSalesInvoiceId = (encryptedId: string | string[] | undefined) => {
    if (!encryptedId || Array.isArray(encryptedId)) {
        return ""
    }
    let decodedId = decodeURIComponent(encryptedId)
    const bytes = CryptoJS.AES.decrypt(decodedId, "");
    return decodeURIComponent(bytes.toString(CryptoJS.enc.Utf8));
}