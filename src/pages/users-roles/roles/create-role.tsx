import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Loader } from "src/@core/components/spinner";
import HeaderAssign from "src/components/roles-list/header-assign";
import RoleTableContainer, {
  AllPermissions,
  TransformedPermission,
  accessType,
} from "src/components/roles-list/role-table-container";
import {
  getCurrentModulePermission,
  mapPermission,
} from "src/components/roles-list/utils";
import { UserType } from "src/context/types";

import { useAuth } from "src/hooks/useAuth";
import { AppDispatch, RootState } from "src/store";
import { getUserassigned } from "src/store/apps/add-user";
import { fetchRolesById, singleRoleType } from "src/store/apps/roles";
import { UserTypeDataObject } from "src/store/apps/user_assign/user-type-permission";
import { getUserunassigned } from "src/store/apps/user_assign/user-unassign-list";
import { v4 as uuidv4 } from "uuid";

interface EditPermission {
  id: string;
  isEdit: string;
  userTypeId?: string;
  name?: string;
  focus?: boolean;
}

function transformRolePermissions(
  data: UserTypeDataObject[]
): AllPermissions[] {
  const finalResult: AllPermissions[] = [];
  if (Array.isArray(data))
    for (const item of data) {
      const transformedRolePermissions: TransformedPermission[] = [];
      for (const perm of item.userTypePermissions) {
        transformedRolePermissions.push({
          permissionId: perm.permissionId,
          externalReference: "",
          active: true,
          name: perm.permissions?.name || "",
          key: uuidv4(),
          ...perm?.permissions,
        } as any);
      }
      let permissions: AllPermissions = {
        altName: item.altName.toUpperCase().replace(" ", "_"),
        name: item.name.toUpperCase().replace(" ", "_"),
        permissions: transformedRolePermissions,
        id: item.id,
      };
      if (item?.active) finalResult.push(permissions);
    }

  return finalResult;
}

function transformCurrentRole(payload: singleRoleType): {
  permission: AllPermissions[];
  userType?: Omit<UserType, "uuid">;
  name: string;
} {
  let finalResult: AllPermissions[] = [];
  let userType = payload?.userType;
  if (!payload?.rolePermissions && !Array.isArray(payload?.rolePermissions))
    return { permission: [], userType, name: payload?.name };

  for (const permission of payload.rolePermissions) {
    const transformedRolePermissions: TransformedPermission[] = [];
    for (const item of permission?.userTypePermissionsList) {
      transformedRolePermissions.push({
        active: true,
        externalReference: "",
        key: uuidv4(),
        name: item?.permissions?.name,
        permissionId: item.permissionId,
        permissionType: item.permissionType,
      });
    }
    let permissions: AllPermissions = {
      altName: permission?.name,
      name: permission?.name?.toUpperCase().replace(" ", "_"),
      permissions: transformedRolePermissions,
      id: permission?.id,
    };
    finalResult.push(permissions);
  }

  finalResult = finalResult.sort(
    (d) =>
      d.permissions.filter(
        (l) =>
          l.permissionType?.Create ||
          l.permissionType?.Read ||
          l.permissionType?.Delete ||
          l.permissionType?.Edit ||
          l.permissionType?.Allowed
      ) as any
  );

  return { permission: finalResult, userType, name: payload?.name };
}

export default function CreateRole() {
  const [checkedAll, setCheckedAll] = useState<Record<string, boolean>>({});
  const [searchInput, setSearchInput] = useState("");
  const [roles, setRoles] = useState<AllPermissions[]>();
  const [rolesEdit, setRolesEdit] = useState<AllPermissions[]>();
  const [focusedUserTypeId, SetFocusedUserTypeId] = useState<any>();
  const [edit, setEdit] = useState<EditPermission>();
  const auth = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setPermissionName] = useState<string>("ALL");
  const [rolesLoaded, setRolesLoaded] = useState(false);

  const handleChecked = (
    checked: boolean,
    permissionId: number,
    access: accessType,
    key: any
  ) => {
    if (!Array.isArray(roles)) return;

    const z = cloneDeep(roles);

    for (let i of z) {
      if (i.id === permissionId) {
        for (let j of i.permissions) {
          if (j?.key === key) {
            j.permissionType[access] = checked;
            if (["Edit", "Create", "Delete"].includes(access) && checked)
              j.permissionType.Read = true;
            if (access == "Read" && !checked) {
              j.permissionType.Create = false;
              j.permissionType.Delete = false;
              j.permissionType.Edit = false;
            }
            if (!checked)
              setCheckedAll((p) => ({ ...p, [permissionId]: false }));
            break;
          }
        }
      }
    }
    setRoles(z);
  };

  const handleCheckedAll = (checked: boolean, id: any) => {
    if (!Array.isArray(roles)) return;
    const z = cloneDeep(roles);

    for (let i of z) {
      if (i.id === id) {
        for (let j of i.permissions) {
          if (j.name === "dashboards") continue;
          if (j.permissionType.Allowed !== undefined && i.name === "POS") {
            j.permissionType.Allowed = checked;
          } else {
            j.permissionType.Read = checked;
            j.permissionType.Create = checked;
            j.permissionType.Edit = checked;
            j.permissionType.Delete = checked;
          }
        }
      }
    }
    setRoles(z);
    setCheckedAll((p) => ({ ...p, [id]: checked }));
  };

  const permissionType = useSelector(
    (state: RootState) => state?.userTypePermission?.data?.userTypePermission
  );

  const permissionTypeLoading = useSelector(
    (state: RootState) => state?.userTypePermission?.isLoading
  );

  const getCheckedAllById = (id: any) =>
    typeof checkedAll === "object" && checkedAll.hasOwnProperty(id)
      ? checkedAll[id as keyof typeof checkedAll]
      : false;

  useEffect(() => {
    if (!router.isReady) return;
    const edit = router.query as unknown as EditPermission;
    if (!edit) return;
    if (edit?.isEdit === "true") {
      setEdit({ id: edit?.id, isEdit: edit?.isEdit });
      dispatch(fetchRolesById({ roleId: edit?.id }))
        .then((d) => d.payload)
        .then((d: any) => transformCurrentRole(d))
        .then((d: any) => {
          setRoles(d?.permission);
          setRolesEdit(d?.permission);
          setEdit(
            (p) =>
              ({
                ...p,
                userTypeId: d?.["userType"],
                name: d?.name,
                focus: true,
              } as any)
          );
        })
        .then(() => {
          dispatch(getUserassigned(edit?.id)).catch(console.error);
          dispatch(getUserunassigned(edit?.id)).catch(console.error);
        })
        .then(() => setRolesLoaded(true))
        .catch(console.error);
    } else {
      setRoles(transformRolePermissions(permissionType) as AllPermissions[]);
      setRolesLoaded(true);
    }
    return () => setRoles([]);
  }, [router.isReady]);

  useEffect(() => {
    if (edit?.id) {
      if (focusedUserTypeId === edit?.userTypeId?.id) {
        setRoles(rolesEdit);
        return;
      }
    }
    setRoles(transformRolePermissions(permissionType) as AllPermissions[]);
  }, [permissionType]);

  const currentModuleName = router.route.substring(1).split("/")[0];
  const gettingPermission = auth?.user?.role.rolePermissions;
  const permission = mapPermission(gettingPermission);
  const currentModulePermission = getCurrentModulePermission(
    permission,
    currentModuleName
  );

  const isCreatePermissionEnabled =
    currentModulePermission && currentModulePermission.permissionType.Create;
  const isEditPermissionEnabled =
    currentModulePermission && currentModulePermission.permissionType.Edit;

  return (
    <>
      <HeaderAssign
        datahandled={roles}
        setPermissionName={setPermissionName}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        edit={edit}
        isCreatePermissionEnabled={isCreatePermissionEnabled}
        isEditPermissionEnabled={isEditPermissionEnabled}
        defaultUserType={edit?.userTypeId}
        roleName={edit?.name}
        updateFocus={(focus: number) => SetFocusedUserTypeId(focus)}
        pageLoading={rolesLoaded}
      />
      {permissionTypeLoading ? (
        <Loader />
      ) : (
        <RoleTableContainer
          roles={roles}
          getChecked={getCheckedAllById}
          handleChecked={handleChecked}
          searchInput={searchInput}
          handleCheckedAll={handleCheckedAll}
        />
      )}
    </>
  );
}
