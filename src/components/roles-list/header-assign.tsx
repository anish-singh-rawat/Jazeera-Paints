import {
  Autocomplete,
  Box,
  Card,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Icon from "src/@core/components/icon";
import AppEvent from "src/app/AppEvent";
import { UserType } from "src/context/types";
import { AppDispatch, RootState } from "src/store";

import { getRoleData } from "src/store/apps/get-roles";
import { fetchUserTypes } from "src/store/apps/role_permission";
import { copyNewRole } from "src/store/apps/roles";
import { clearUsers } from "src/store/apps/roles_ids/assign_users";
import { toggleIdClear } from "src/store/apps/roles_ids/roles_ids";
import {
  RolePermissionsCreate,
  RolePermissionsUpdate,
} from "src/store/apps/user_assign/user-assign";
import { getUserTypePermission } from "src/store/apps/user_assign/user-type-permission";
import AssignModal from "./assign-modals";
import CopyCode from "./copy-code";
import AssignRole from "./role-modal";
import ClearIcon from "@mui/icons-material/Clear";
import { Loader } from "src/@core/components/spinner";
import { makeTranslationKey } from "src/@core/utils/general";
import { truncateSync } from "fs";

const useStyles = makeStyles({
  commonHeaderRoot: {
    padding: "16px 24px",
    border: "1px solid rgba(75, 70, 92, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "none",
  },
  search: {
    gap: "16px",
  },
  search_button: {
    textTransform: "capitalize",
  },

  cancel_button: {
    marginRight: "10px",
    width: "90px",
  },
  actionBtns: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
  },
  createRecordBtn: {
    textTransform: "unset",
    fontSize: "12.5px",
  },
  redSearch: {
    "& input": {
      border: "1px solid red",
    },
  },
  option: {
    padding: "0 5px",
    "&:hover": {
      backgroundColor: "rgba(115, 103, 240, 0.08) !important",
      color: "#3586C7",
      borderRadius: "5px",
    },
    '&[aria-selected="true"]': {
      backgroundColor: "#3586C7 !important",
      borderRadius: "5px",
      padding: "0 5px",
      "&:hover": {
        color: "#ffffff",
      },
    },
    height: "40px",
  },
});

const HeaderAssign = ({
  datahandled,
  setPermissionName,
  searchInput,
  setSearchInput,
  edit,
  isCreatePermissionEnabled,
  isEditPermissionEnabled,
  defaultUserType = {
    id: 99999990,
    uuid: "",
    name: "ALL",
    altName: "ALL",
    active: true,
  },
  roleName = "",
  updateFocus,
  pageLoading,
}: any) => {
  const [item, setItem] = useState<{ name: string; typePermission: UserType }>({
    name: roleName,
    typePermission: defaultUserType,
  });
  const style = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [error, setError] = useState<{
    name: boolean;
    typePermission: boolean;
    searchError: boolean;
  }>({
    name: false,
    typePermission: false,
    searchError: false,
  });
  const [existsError, setExistsErorr] = useState(false);
  const [lengthError, setLengthErorr] = useState(false);
  const [mostLengthError, setMostLengthError] = useState(false);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currentPermission, setCurrentPermission] = useState();
  const [copyroleOpen, setCopyRoleOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const searchButtonHandleClick = () => {
    setIsSearchClicked(true);
  };

  const dispatch = useDispatch<AppDispatch>();
  const usersPermission = useSelector((state: RootState) =>
    state?.userTypes?.data.map((p) => ({
      ...p,
      name: t(p?.name.replace(/[^a-zA-Z0-9]/g, "_"))
        ? t(p?.name.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase())
        : p.name,
    }))
  );

  const getUerAssignUsers = useSelector(
    (state: RootState) => state?.assignedUsersReducer?.data
  );

  const getRoles = useSelector((state: RootState) => state.getRoles?.data);

  useEffect(() => {
    dispatch(fetchUserTypes());
  }, []);

  const classes = useStyles();

  useEffect(() => {
    setTimeout(() => {
      setIsSearchClicked(false);
    }, 2000);
  }, [isSearchClicked]);

  let assignUsers = useSelector((state: RootState) => state?.rolesIds);

  useEffect(() => {
    dispatch(getRoleData());
  }, []);

  const handleRoles = async () => {
    let validation = false;
    if (!item.name) {
      setError((p) => ({ ...p, name: true }));
      validation = true;
    }
    if (!item.typePermission) {
      setError((p) => ({ ...p, typePermission: true }));
      validation = true;
    }
    if (item.name.length < 2 || item.name.length > 25) {
      setError((p) => ({ ...p, name: true }));
      validation = true;
    }

    if (validation) return;

    if (Array.isArray(getRoles)) {
      const checkExisitingRoleWithFilter = edit?.id
        ? getRoles.filter((d) => d?.id != edit?.id)
        : getRoles;
      const checkExisting = checkExisitingRoleWithFilter.find(
        (d) => d?.name.toLowerCase() == item?.name.toLowerCase()
      );
      if (checkExisting) {
        setExistsErorr(true);
        return;
      }
    }

    try {
      setLoading(true);
      let rolePermissions = datahandled.flatMap((p: any) => p?.permissions);
      const data = rolePermissions.map((item: any) => ({
        active: item.active,
        externalReference: item.externalReference,
        permissionId: item.permissionId,
        permissionType: item.permissionType,
      }));

      const payload: any = {
        name: item.name,
        userTypeId:
          item.typePermission?.id === 99999990
            ? undefined
            : item.typePermission?.id,
        assignUsers: !assignUsers?.length ? undefined : assignUsers,
        rolePermissions: data,
      };

      let res: any;

      if (edit?.isEdit === "true") {
        payload.roleId = edit?.id;
        payload.assignUsers = getUerAssignUsers.map((item) => ({
          id: item.id,
        }));

        res = await dispatch(RolePermissionsUpdate(payload));
      } else {
        res = await dispatch(RolePermissionsCreate(payload));
      }
      setCheckedUsers([]);
      dispatch(toggleIdClear());
      dispatch(clearUsers());
      router.push("/users-roles/roles");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchPermission(value: UserType) {
    await dispatch(getUserTypePermission(value?.id));
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchValue) setError((p) => ({ ...p, searchError: true }));
    setSearchInput(searchValue);
  };

  useEffect(() => {
    if (Array.isArray(usersPermission)) {
      const data = usersPermission.find(
        (item) => item?.id == defaultUserType?.id
      );
      const permissionTypeData = { ...data };
      permissionTypeData.name = makeTranslationKey(data?.name as string, t);
      setValues("typePermission", permissionTypeData as any);
      setValues("name", roleName as any);
    }
  }, [defaultUserType?.id, roleName]);

  useEffect(() => {
    dispatch(getRoleData());
  }, []);

  function setValues(key: "name" | "typePermission", value: string | UserType) {
    setItem((p) => ({ ...p, [key]: value } as any));
    setError((p) => ({ ...p, [key]: false }));
    setExistsErorr(false);
    setLengthErorr(false);
    setMostLengthError(false);
    if (key === "typePermission") {
      fetchPermission(value as UserType);
      updateFocus(value?.id);
    }
  }

  const copyRole = async (roleName: string) => {
    setCopyRoleOpen(false);
    let rolePermissions = datahandled.flatMap((p: any) => p?.permissions);
    const data = rolePermissions.map((item: any) => ({
      active: item.active,
      externalReference: item.externalReference,
      permissionId: item.permissionId,
      permissionType: item.permissionType,
    }));

    const payload: any = {
      name: roleName,
      userTypeId:
        item.typePermission?.id === 99999990
          ? undefined
          : item.typePermission?.id,
      assignUsers: !assignUsers?.length ? undefined : assignUsers,
      rolePermissions: data,
    };

    await dispatch(copyNewRole(payload)).catch(console.error);
    AppEvent.messageEmit({
      type: "success",
      message: t("ROLE_COPIED"),
    });

    router.push("/users-roles/roles");
    return;
  };

  const handleChange = (text: string) => {
    setSearchValue(text);
    if (!text.length) setSearchInput("");
    setError((p) => ({ ...p, searchError: false }));
  };
  const handleNameChange = (e: any) => {
    const newName = e.target.value;
    setValues("name", newName);
    if (Array.isArray(getRoles)) {
      const checkExisitingRoleWithFilter = edit?.id
        ? getRoles.filter((d) => d?.id != edit?.id)
        : getRoles;
      const checkExisting = checkExisitingRoleWithFilter.find(
        (d) => d?.name.toLowerCase() == newName.toLowerCase()
      );
      if (checkExisting) {
        setExistsErorr(true);
        return;
      }
      if (newName.length < 2) {
        setLengthErorr(true);
        return;
      }

      if (newName.length > 25) {
        setMostLengthError(true);
      }
    }
  };
  const handleBlur = () => {
    setExistsErorr(false);
    setLengthErorr(false);
    setMostLengthError(false);
  };

  const handlCancel = () => {
    router.back();
  };

  if (!pageLoading) return <Loader />;

  function getHelperText() {
    if (existsError) {
      return t("ROLE_ALREADY_EXISTS");
    }

    if (error?.name) {
      return t("REQUIRED");
    }
    if (lengthError) {
      return t("LENGTH_ERROR");
    }
    if (mostLengthError) {
      return t("LENGTH_ERROR");
    }
    return "";
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "90%",
          gap: "20px",
          flexDirection: { xs: "column", sm: "column", md: "row" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label>{t("ROLE_NAME")}*</label>
          <TextField
            variant="outlined"
            placeholder={t("ROLE_NAME") as string}
            size="small"
            onChange={(e) => handleNameChange(e)}
            error={error?.name || existsError || lengthError || mostLengthError}
            helperText={getHelperText()}
            onBlur={handleBlur}
            value={item?.name}
          />
        </Box>
        <Box sx={{ width: { md: "23%", xs: "100%", sm: "100%" } }}>
          <label>{t("SELECT_TYPES_OF_PERMISSION")}*</label>
          <FormControl fullWidth>
            <Autocomplete
              size="small"
              options={usersPermission ?? []}
              value={
                item?.typePermission?.name
                  ? item?.typePermission
                  : defaultUserType
              }
              getOptionLabel={(option: any) => option.name}
              clearIcon={false}
              onChange={(_e, value) =>
                setValues("typePermission", value as any)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={t("SELECT_TYPES_OF_PERMISSION")!}
                  error={error?.typePermission}
                  helperText={error?.typePermission ? t("REQUIRED") : ""}
                />
              )}
            />
          </FormControl>
        </Box>
      </Box>

      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "10px",
          flexWrap: "wrap",
          mx: "auto",
          paddingLeft: "10px",
          marginTop: "20px",
          "@media (max-width:750px)": { flexDirection: "column" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "40%",
            marginTop: "15px",
            "@media (max-width:750px)": { width: "100%" },
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <TextField
              size="small"
              fullWidth
              sx={{ mr: 2, width: "230px" }}
              value={searchValue}
              placeholder={t("SEARCH_BY_MODULE_NAME") as string}
              onChange={(e) => handleChange(e.target.value)}
              error={error.searchError}
              InputProps={{
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Clear"
                      onClick={() => handleChange("")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="outlined"
              size="medium"
              className={classes.search_button}
              type="submit"
              onBlur={() => setError((p) => ({ ...p, searchError: false }))}
            >
              <Icon fontSize="1.45rem" icon="tabler:search" />
            </Button>
          </form>
        </Box>

        <Box
          sx={{
            "@media (max-width:750px)": { width: "100%" },
            marginRight: "30px",
            marginTop: "10px",
          }}
        >
          {edit?.id && (
            <Button
              onClick={() => setCopyRoleOpen((p) => !p)}
              disabled={!isEditPermissionEnabled || !isCreatePermissionEnabled}
              startIcon={<Icon icon="tabler:copy" />}
            >
              {" "}
              {t("COPY_CODE")}
            </Button>
          )}
          <Button onClick={handleOpen} disabled={!pageLoading}>
            {t("ASSIGNED_USERS")}
          </Button>

          <Button
            onClick={handlCancel}
            variant="outlined"
            className={classes.cancel_button}
            sx={{ textTransform: "none" }}
          >
            {t("CANCEL")}
          </Button>

          <Button
            variant={"contained"}
            onClick={handleRoles}
            sx={{ width: "90px", textTransform: "none" }}
            disabled={
              !pageLoading ||
              loading ||
              (edit?.id ? !isEditPermissionEnabled : !isCreatePermissionEnabled)
            }
          >
            {!pageLoading ? `${t("LOADING")} ...` : t("SAVE")}
          </Button>
        </Box>
      </Card>
      {!edit?.id ? (
        <AssignModal
          open={open}
          handleClose={handleClose}
          checkedUsers={checkedUsers}
          setCheckedUsers={setCheckedUsers as any}
        />
      ) : (
        <AssignRole
          open={open}
          setOpen={(b: boolean) => setOpen(b)}
          handleOpen={() => setOpen(true)}
          handleClose={() => setOpen(false)}
          checkedUsers={checkedUsers}
          setCheckedUsers={setCheckedUsers}
        />
      )}

      {edit?.id && (
        <CopyCode
          onSubmit={copyRole}
          open={copyroleOpen}
          setOpen={setCopyRoleOpen}
          onClose={() => setCopyRoleOpen(false)}
        />
      )}
    </>
  );
};

export default HeaderAssign;
