import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Icon from "src/@core/components/icon";
import CommonSelect from "src/components/common/CommonSelect";
import { AppDispatch, RootState } from "src/store";
import { fetchUserTypes } from "src/store/apps/role_permission";
import { clearUsers } from "src/store/apps/roles_ids/assign_users";
import { toggleIdClear } from "src/store/apps/roles_ids/roles_ids";
import { RolePermissionsUpdate } from "src/store/apps/user_assign/user-assign";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import * as yup from "yup";
import CommonInput from "../common/CommonInput";
import CopyCode from "./copy-code";
import AssignRole from "./role-modal";
import { copyNewRole } from "src/store/apps/roles";
import AppEvent from "src/app/AppEvent";
import { getUserTypePermission } from "src/store/apps/user_assign/user-type-permission";
import CommonTypePermission from "../common/CommonTypePermission";
import { isValueUnique } from "src/@core/utils/check-unique";
import { getRoleData } from "src/store/apps/get-roles";

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
});

const HeaderUnAssign = ({
  roleById,
  searchInput,
  setSearchInput,
  handleSearch,
  defaultRoleName,
  getPermissionValue,
  setPermissionValue,
  datahandled,
  defaultTypeOfPermission,
  id,
  isEditPermissionEnabled,
}: any) => {
  const [item, setItem] = useState(defaultValues);

  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [assingRoleOpen, setAssingRoleOpen] = useState(false);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [copyRoleOpen, setCopyRoleOpen] = useState(false);
  const [permissionName, setPermissionName] = useState("");
  const [edit, setEdit] = useState<any>("");

  const router = useRouter();
  const searchButtonHandleClick = () => {
    setIsSearchClicked(true);
  };
  const getRoles = useSelector((state: RootState) => state.getRoles?.data);
  const dispatch = useDispatch<AppDispatch>();
  const validationSchema = yup.object({
    name: yup
      .string()
      .required()
      .test("unique-name", "Name already exists", function (value) {
        return isValueUnique(getRoles, value, "name", edit);
      }),
    typePermission: yup.mixed(),
  });

  const {
    control,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
    handleSubmit,
    watch, // Add handleSubmit to handle form submission
  } = useForm({
    defaultValues: item,
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    dispatch(fetchUserTypes());
  }, []);

  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    setIsSearchClicked(false);
  }, [isSearchClicked]);

  const handleSearchClick = () => {
    searchButtonHandleClick();
    setIsSearchClicked(true);
  };

  const usersPermission = useSelector(
    (state: RootState) => state?.userTypes?.data
  );
  const assignPermission = useSelector(
    (state: RootState) => state.assignedUsersReducer.data
  );

  useEffect(() => {
    if (router.isReady) {
      const { slug } = router.query;
      setEdit({ id: slug });
    }
  }, [router.isReady]);

  const handleRoles = async (d: any) => {
    const payload = {
      roleId: edit?.id,
      name: d.name,
      userTypeId: d.typePermission?.id,
      assignUsers: assignPermission.map((item) => ({
        id: item.id,
      })),
      rolePermissions: getPermissionValue
        ? datahandled
        : roleById.rolePermissions,
    };

    const data = await dispatch(RolePermissionsUpdate(payload));
    if (data.payload?.message) {
      toast.success(data.payload.message);
      reset();
      dispatch(toggleIdClear());
      dispatch(clearUsers());
      setCheckedUsers([]);
    }
    router.push("/users-roles/roles");
  };

  const copyRole = async (roleName: string) => {
    setCopyRoleOpen(false);
    await dispatch(
      copyNewRole({
        ...roleById,
        name: roleName,
      })
    ).catch(console.error);

    AppEvent.messageEmit({
      type: "success",
      message: t("ROLE_COPIED"),
    });

    router.push("/users-roles/roles");
    return;
  };

  useEffect(() => {
    if (defaultRoleName) {
      setValue("name", defaultRoleName);
    }
  }, [defaultRoleName]);

  const typeOfPermission = watch("typePermission");

  const typeOfname = watch("name");

  useEffect(() => {
    dispatch(getRoleData());
  }, []);
  useEffect(() => {
    if (defaultTypeOfPermission) {
      setValue("typePermission", defaultTypeOfPermission);
    }
  }, [defaultTypeOfPermission]);

  return (
    <>
      <Box sx={{ display: "flex", width: "90%", gap: "20px" }}>
        <div style={{ width: "35%" }}>
          <CommonInput
            name="name"
            id="name"
            label="role name"
            defaultValue={"999"}
            required={true}
            control={control}
            errors={errors}
          />
        </div>

        <div style={{ width: "35%" }}>
          {defaultTypeOfPermission && (
            <CommonTypePermission
              name="typePermission"
              options={usersPermission ?? []}
              control={control}
              label={"Types of Permission"}
              placeholder={t("SELECT_TYPE_OF_PERMISSION")}
              validateForm={{}}
              required={true}
              errors={errors}
              setValue={setValue}
              noOptionsText={false}
              clearErrors={clearErrors}
              active={true}
              defaultValue={defaultTypeOfPermission}
              setPermissionValue={setPermissionValue}
              id={id}
              defaultRoleName={defaultRoleName}
              roleById={roleById?.userType}
              edit={true}
            />
          )}
        </div>
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
          <TextField
            size="small"
            fullWidth
            sx={{ mr: 2 }}
            // error={isSearchClicked && searchValue === ""}
            placeholder={t("SEARCH_BY_MODULE_NAME") as string}
            onChange={(e: any) => setSearchInput(e.target.value)}
            // onKeyPress={(event: any) => {
            //   if (event.key === "Enter") {
            //     searchButtonHandleClick();
            //   }
            // }}
          />

          {/* {/* <Button
            variant="outlined"
            size="medium"
            className={classes.search_button}
            onClick={handleSearch}
          > 
            <Icon fontSize="1.45rem" icon="tabler:search" />
          </Button> */}
        </Box>

        <Box
          sx={{
            "@media (max-width:750px)": { width: "100%" },
            marginRight: "30px",
            marginTop: "10px",
          }}
        >
          <Button onClick={() => setCopyRoleOpen(true)}>
            {t("COPY_CODE")}
          </Button>

          <Button onClick={() => setAssingRoleOpen(true)}>
            {t("ASSIGNED_USERS")}
          </Button>
          <Button
            variant="contained"
            disabled={!isEditPermissionEnabled}
            onClick={handleSubmit(handleRoles)}
            sx={{ textTransform: "none" }}
          >
            {t("SAVE")}
          </Button>
        </Box>
      </Card>
      <AssignRole
        open={assingRoleOpen}
        setOpen={setAssingRoleOpen}
        handleOpen={() => setAssingRoleOpen(true)}
        handleClose={() => setAssingRoleOpen(false)}
        checkedUsers={checkedUsers}
        setCheckedUsers={setCheckedUsers}
      />

      <CopyCode
        onSubmit={copyRole}
        open={copyRoleOpen}
        setOpen={setCopyRoleOpen}
        onClose={() => setCopyRoleOpen(false)}
      />
    </>
  );
};

export default HeaderUnAssign;
