import { Permission, PermissionType } from "src/context/types";

export interface PermissionItem {
    permissionType: PermissionType;
    permissions: Permission;
}
export function mapPermission(permission: unknown): PermissionItem[] {
    if (!permission)
        return []
    if (Array.isArray(permission)) {
        return permission.map<PermissionItem>((item) => ({
            permissionType: item?.permissionType,
            permissions: item?.permissions,
        }))
    }
    return []
}

export function getCurrentModulePermission(permission: PermissionItem[], currentModuleName: string) {
    return permission.find(
        (permission) =>
            permission.permissions.name.toLowerCase() ===
            currentModuleName.toLowerCase()
    )
}