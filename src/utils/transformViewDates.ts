import { hours12 } from "src/@core/utils/format";

export const getDate = (date: any) => {
    const startDate = new Date(date);
    const [month, day, year] = [
        startDate.getMonth(),
        startDate.getDate(),
        startDate.getFullYear(),
    ];

    return `${day >= 10 ? day : "0" + day}-${month >= 10 ? month + 1 : "0" + (month + 1)
        }-${year}`;
};

export const transformViewDates = (value: Date) => {
    return `${getDate(value)}
    | ${hours12(value)}`;
}