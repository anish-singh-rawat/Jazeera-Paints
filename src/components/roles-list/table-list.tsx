import {
  Box,
  FormControlLabel,
  Typography
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import _, { cloneDeep } from "lodash";
import router from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "src/@core/components/spinner";
import { Permission, PermissionType, RolePermission } from "src/context/types";
import { useAuth } from "src/hooks/useAuth";
import { AppDispatch, RootState } from "src/store";
import { Role, fetchRolesById } from "src/store/apps/roles";
import { v4 as uuidv4 } from "uuid";
import HeaderUnAssign from "./header-assign-unassign";
import { accessType } from "./role-table-container";
import { PermissionItem, getCurrentModulePermission, mapPermission } from "./utils";


interface OriginalPermission {
  permissionId: number;
  permissions?: {
    id: number;
    name: string;
    createdBy: string;
  };
}


interface OriginalData {
  id: number;
  tenantId: number;
  companyId: number;
  userTypePermissions: OriginalPermission[];
}

interface TransformedPermission {
  permissionId: number;
  createAccess: boolean;
  readAccess: boolean;
  editAccess: boolean;
  deleteAccess: boolean;
  externalReference: string;
  active: boolean;
  name: string;
  key: any;
}

function transformRolePermissions(
  data: OriginalData[]
): TransformedPermission[] {
  const transformedRolePermissions: TransformedPermission[] = [];

  if (Array.isArray(data))
    for (const item of data) {
      for (const perm of item.userTypePermissions) {
        transformedRolePermissions.push({
          permissionId: perm.permissionId,
          createAccess: false,
          readAccess: false,
          editAccess: false,
          deleteAccess: false,
          externalReference: "",
          active: true,
          name: perm.permissions?.name || "",
          key: uuidv4(),
        });
      }
    }

  return transformedRolePermissions;
}

export default function TableList({ roleId }: { roleId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const [roleById, setRoleById] = useState<Role>();
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const [getPermissionValue, setPermissionValue] = useState(false);
  const [roles, setRoles] = useState<TransformedPermission[]>();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(fetchRolesById({ roleId })).then((role) =>
      setRoleById(_.cloneDeep(role.payload) as typeof roleById)
    );
  }, []);

  const { t } = useTranslation();

  const handleChecked = (
    checked: boolean,
    permissionId: number,
    access: accessType
  ) => {
    let rows = roleById?.rolePermissions;

    if (!rows) return;
    for (const element of rows) {
      if (element["permissionId"] === permissionId) {
        if (["Edit", "Create", "Delete"].includes(access) && checked) {
          element.permissionType.Read = true;
        }
        if (access == "Read" && !checked) {
          element.permissionType.Create = false;
          element.permissionType.Delete = false;
          element.permissionType.Edit = false;
        }
        element.permissionType[access] = checked;
        break;
      }
    }
    setRoleById((p) => ({ ...p, rolePermissions: rows } as any));
    if (!checked) setCheckedAll(false);
  };

  const handleCheckedAll = (checked: boolean) => {
    let rows = cloneDeep(roleById?.rolePermissions);

    if (!rows) return;

    for (const element of rows) {
      if (element?.permissions?.name === "dashboards") continue;
      if (element.permissionType.hasOwnProperty("Allowed")) {
        element.permissionType.Allowed = checked;
      } else {
        element.permissionType.Read = checked;
        element.permissionType.Edit = checked;
        element.permissionType.Delete = checked;
        element.permissionType.Create = checked;
      }
    }

    setRoleById((p) => ({ ...p, rolePermissions: rows } as any));
    setCheckedAll(checked);
  };

  const handleSearch = () => {
    if (searchValue.length > 1) {
      const searchData = roleById?.rolePermissions.filter(
        (item: any) =>
          item.permissions?.name.toLowerCase() === searchValue.toLowerCase()
      );
    }
  };

  const permissionType = useSelector(
    (state: RootState) => state?.userTypePermission?.data?.userTypePermission
  );

  useEffect(() => {
    setRoles(
      transformRolePermissions(permissionType) as TransformedPermission[]
    );
  }, [permissionType]);


  const auth = useAuth();
  const currentModuleName = router.route.substring(1).split("/")[0];

  const gettingPermission: RolePermission[] = auth.user
    ? auth?.user.role.rolePermissions
    : [];

  const permission: PermissionItem[] = mapPermission(gettingPermission)


  const currentModulePermission = getCurrentModulePermission(permission, currentModuleName)

  const isEditPermissionEnabled =
    currentModulePermission && currentModulePermission?.permissionType?.Edit;
  const isDeletePermissionEnabled =
    currentModulePermission && currentModulePermission?.permissionType?.Delete;


  return (
    <>
      <HeaderUnAssign
        handleSearch={handleSearch}
        roleById={roleById}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        defaultRoleName={roleById?.name}
        getPermissionValue={getPermissionValue}
        setPermissionValue={setPermissionValue}
        datahandled={roles}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        defaultTypeOfPermission={roleById?.userType}
        id={roleById?.id}
        isEditPermissionEnabled={isEditPermissionEnabled}
      />

      <Box
        sx={{
          background: "#EEEEEF",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ marginLeft: "15px", textTransform: "capitalize" }}>
          {t(roleById?.name?.toUpperCase() as string)}
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={(_, check) => handleCheckedAll(check)}
              checked={checkedAll}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label={t("SELECT_ALL")}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableBody>
            {Array.isArray(roleById?.rolePermissions) ? (
              roleById?.rolePermissions.map((row: RolePermission) => {
                const permissionName = t(row?.permissions?.name.toLowerCase());

                const isNameMatch = permissionName.includes(
                  searchInput.toLowerCase()
                );

                if (!isNameMatch) {
                  return null;
                }

                return (
                  <TableRow key={row?.permissionId}>
                    <TableCell component="th" scope="row">
                      {permissionName.toUpperCase()}
                    </TableCell>
                    {row.permissionType?.Read !== undefined && (
                      <TableCell align="right">
                        <Checkbox
                          defaultChecked={row?.permissionType.Read}
                          checked={row?.permissionType.Read}
                          onChange={(_, checked) =>
                            handleChecked(checked, row?.permissionId, "Read")
                          }
                          inputProps={{ "aria-label": "controlled" }}
                          disabled={row.permissions?.name === "dashboards"}
                        />
                        {t("READ")}
                      </TableCell>
                    )}

                    {row.permissionType?.Edit !== undefined && (
                      <TableCell align="right">
                        <Checkbox
                          defaultChecked={row?.permissionType.Edit}
                          checked={row?.permissionType.Edit}
                          onChange={(_, checked) =>
                            handleChecked(checked, row?.permissionId, "Edit")
                          }
                          inputProps={{ "aria-label": "controlled" }}
                          disabled={row.permissions?.name === "dashboards"}
                        />
                        {t("EDIT")}
                      </TableCell>
                    )}

                    {row.permissionType?.Create !== undefined && (
                      <TableCell align="right">
                        <Checkbox
                          defaultChecked={row?.permissionType.Create}
                          checked={row?.permissionType.Create}
                          onChange={(_, checked) =>
                            handleChecked(checked, row?.permissionId, "Create")
                          }
                          disabled={row.permissions?.name === "dashboards"}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                        {t("CREATE")}
                      </TableCell>
                    )}

                    {row.permissionType?.Delete !== undefined && (
                      <TableCell align="right">
                        <Checkbox
                          defaultChecked={row?.permissionType.Delete}
                          checked={row?.permissionType.Delete}
                          onChange={(_, checked) =>
                            handleChecked(checked, row?.permissionId, "Delete")
                          }
                          inputProps={{ "aria-label": "controlled" }}
                          disabled={row.permissions?.name === "dashboards"}
                        />
                        {t("DELETE")}
                      </TableCell>
                    )}

                    {row.permissionType?.Allowed !== undefined && (
                      <>
                        <TableCell align="right" colSpan={4}>
                          <Checkbox
                            defaultChecked={row?.permissionType.Allowed}
                            checked={row?.permissionType.Allowed}
                            onChange={(_, checked) =>
                              handleChecked(
                                checked,
                                row?.permissionId,
                                "Allowed"
                              )
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          {t("Allowed")}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <Loader />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
