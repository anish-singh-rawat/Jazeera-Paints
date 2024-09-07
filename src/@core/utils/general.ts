import { TFunction } from "i18next"

export function getName(firstName: unknown, lastName: unknown) {
    const fN = firstName ? firstName : ""
    const ln = lastName ? lastName : ""
    return `${fN} ${ln}`
}
export function getNameInitials(firstName: unknown, lastName: unknown) {
    const fN = firstName && typeof firstName === "string" ? firstName?.charAt(0) : ""
    const ln = lastName && typeof lastName === "string" ? lastName?.charAt(0) : ""
    return `${fN}${ln}`
}
export function makeTranslationKey(text: string, t: TFunction) {
    if (!text)
        return text
    return t(text.replace(/[^a-zA-Z0-9]/g, '_')) ? t(text.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()) : text
}
export function getTotalUser(count: unknown, t: TFunction) {
        return `${t("TOTAL")} ${count} ${t("USER")}`
}
