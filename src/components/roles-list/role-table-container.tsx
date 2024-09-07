import {
  Fade,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "react-i18next";
import { makeTranslationKey } from "src/@core/utils/general";
import { v4 as uuidv4 } from "uuid";
import RoleToggle from "./role-toggle";

export interface TransformedPermission {
  permissionId: number;
  externalReference: string;
  active: boolean;
  name: string;
  key: any;
  permissionType: {
    Create?: boolean;
    Delete?: boolean;
    Edit?: boolean;
    Read?: boolean;
    Allowed?: boolean;
  };
}

export type accessType = "Read" | "Edit" | "Create" | "Delete" | "Allowed";

export interface AllPermissions {
  name: string;
  altName: string;
  permissions: TransformedPermission[];
  id: any;
}

export interface RoleTableContainerProps {
  roles: AllPermissions[] | undefined;
  handleChecked: (
    checked: boolean,
    permissionId: number,
    access: accessType,
    key: any
  ) => void;
  searchInput: string;
  getChecked: (id: any) => boolean;
  handleCheckedAll: (check: boolean, id: any) => void;
}

function RoleTableContainer({
  roles,
  handleChecked,
  searchInput,
  getChecked,
  handleCheckedAll,
}: RoleTableContainerProps) {
  const { t } = useTranslation();

  const theme = useTheme();
  const SubHeadingStyle = {
    minWidth: 650,
  };

  return (
    <>
      {Array.isArray(roles) &&
        roles?.map((role, index) => (
          <div key={uuidv4()}>
            <TableContainer component={Paper} sx={{ borderRadius: "0" }}>
              <Table
                size="small"
                sx={
                  theme.palette.mode == "dark"
                    ? { ...SubHeadingStyle, background: "rgb(48,52,70)" }
                    : { ...SubHeadingStyle, background: "#f5f5f5" }
                }
              >
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography>
                        <b>{makeTranslationKey(role?.name, t)}</b>{" "}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <FormControlLabel
                        control={
                          <Checkbox
                            defaultChecked
                            onChange={(_, check) =>
                              handleCheckedAll(check, role?.id)
                            }
                            checked={getChecked(role?.id)}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        }
                        color={"secondary"}
                        label={t("SELECT_ALL")}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table
                size="small"
                sx={{ minWidth: 650 }}
                aria-label="caption table"
              >
                <TableBody>
                  {Array.isArray(role?.permissions) &&
                    role.permissions.map((row) => {
                      const permissionName = t(
                        row.name &&
                          row.name.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()
                      );
                      let isNameMatch;

                      if (typeof permissionName === "string") {
                        isNameMatch = permissionName
                          .toLocaleLowerCase()
                          .includes(searchInput?.toLocaleLowerCase());
                      }

                      if (!isNameMatch) {
                        return null;
                      }
                      return (
                        <TableRow key={uuidv4()}>
                          <TableCell component="th" scope="row">
                            <Typography>
                              {t(
                                row.name &&
                                  row.name
                                    .replace(/[^a-zA-Z0-9]/g, "_")
                                    .toUpperCase()
                              )}
                            </Typography>
                          </TableCell>
                          {row.permissionType?.Read !== undefined &&
                            role.name === "BACK_OFFICE" && (
                              <TableCell align="right">
                                <Checkbox
                                  defaultChecked={row.permissionType?.Read}
                                  checked={row.permissionType?.Read}
                                  onChange={(_, checked) =>
                                    handleChecked(
                                      checked,
                                      role?.id,
                                      "Read",
                                      row.key
                                    )
                                  }
                                  disabled={row.name === "dashboards"}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                                {t("READ")}
                              </TableCell>
                            )}
                          {row.permissionType?.Edit !== undefined &&
                            role.name === "BACK_OFFICE" && (
                              <TableCell align="right">
                                <Checkbox
                                  defaultChecked={row.permissionType?.Edit}
                                  checked={row.permissionType?.Edit}
                                  onChange={(_, checked) =>
                                    handleChecked(
                                      checked,
                                      role?.id,
                                      "Edit",
                                      row.key
                                    )
                                  }
                                  disabled={row.name === "dashboards"}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                                {t("EDIT")}
                              </TableCell>
                            )}
                          {row.permissionType?.Create !== undefined &&
                            role.name === "BACK_OFFICE" && (
                              <TableCell align="right">
                                <Checkbox
                                  defaultChecked={row.permissionType?.Create}
                                  checked={row.permissionType?.Create}
                                  onChange={(_, checked) =>
                                    handleChecked(
                                      checked,
                                      role?.id,
                                      "Create",
                                      row.key
                                    )
                                  }
                                  disabled={row.name === "dashboards"}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                                {t("CREATE")}
                              </TableCell>
                            )}
                          {row.permissionType?.Delete !== undefined &&
                            role.name === "BACK_OFFICE" && (
                              <TableCell align="right">
                                <Checkbox
                                  defaultChecked={row.permissionType?.Delete}
                                  checked={row.permissionType?.Delete}
                                  onChange={(_, checked) =>
                                    handleChecked(
                                      checked,
                                      role?.id,
                                      "Delete",
                                      row.key
                                    )
                                  }
                                  disabled={row.name === "dashboards"}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                                {t("DELETE")}
                              </TableCell>
                            )}
                          {row?.permissionType?.Allowed !== undefined &&
                            role.name !== "BACK_OFFICE" && (
                              <TableCell align="right">
                                {/* <Checkbox
                                defaultChecked={row?.permissionType?.Allowed}
                                checked={row?.permissionType?.Allowed}
                                onChange={(_, checked) =>
                                  handleChecked(
                                    checked,
                                    role?.id,
                                    "Allowed",
                                    row.key
                                  )
                                }
                                inputProps={{ "aria-label": "controlled" }}
                              /> */}
                                <RoleToggle
                                  defaultChecked={row?.permissionType?.Allowed}
                                  checked={row?.permissionType?.Allowed}
                                  label={t("ALLOW")}
                                  onChange={(_: any, checked: any) =>
                                    handleChecked(
                                      checked,
                                      role?.id,
                                      "Allowed",
                                      row.key
                                    )
                                  }
                                />
                              </TableCell>
                            )}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))}
    </>
  );
}

export default RoleTableContainer;
