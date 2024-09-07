import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "src/@core/components/spinner";
import Header from "src/components/roles-list/header-role";
import RoleList from "src/components/roles-list/role-list";
import { AppDispatch, RootState } from "src/store";
import { Role, fetchRoles, fetchRolesUsers } from "src/store/apps/roles";
import { useForm } from "react-hook-form";
import { defaultValues } from "src/types/forms/tax/taxMatrics";
import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  getCurrentModulePermission,
  mapPermission,
} from "src/components/roles-list/utils";

const RolesList = () => {
  const [item, setItem] = useState(defaultValues);

  const {
    control,
    setValue,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm({
    defaultValues: item,
    mode: "onChange",
  });
  const [text, setText] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector((state: RootState) => state.roles.data.role);
  const typePermissionValue = watch("typePermission");
  const [searchData, setSearchData] = useState<Role[]>([]);

  const handleClick = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (text.length > 1) {
      const searchdata = roles.filter((item) =>
        item.name
          ?.toLocaleLowerCase()
          ?.includes(text.trim().toLocaleLowerCase())
      );

      setSearchData(searchdata);
      searchButtonHandleClick();
      setIsSearchClicked(true);
    } else {
      setSearchData(roles);
      dispatch(fetchRolesUsers()).then((d) =>
        setSearchData(d.payload as Role[])
      );
    }
    setIsSearchClicked(true);
  };

  const searchButtonHandleClick = () => {};
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchRolesUsers()).then((d) => setSearchData(d.payload as Role[]));
  }, []);

  useEffect(() => {
    if (typePermissionValue === null) {
      dispatch(fetchRolesUsers()).then((d) =>
        setSearchData(d.payload as Role[])
      );
      return;
    }
    dispatch(fetchRoles(typePermissionValue)).then((d) =>
      setSearchData(d.payload as Role[])
    );
  }, [typePermissionValue]);

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

  useEffect(() => {
    if (text.length < 1) {
      if (typePermissionValue){
        dispatch(fetchRoles(typePermissionValue)).then((d) =>
          setSearchData(d.payload as Role[])
        );
      }
      else
        {
          dispatch(fetchRolesUsers()).then((d) =>
          setSearchData(d.payload as Role[])
        );
        }
      return;
    }
  }, [text]);

  return (
    <>
      <Typography sx={{ fontSize: "22px", fontWeight: "600" }} color="dark">
        {t("ROLE_LIST")}
      </Typography>
      <Typography sx={{ mt: "10px", mb: "2rem" }} color="dark">
        {t("CREATE_A_ROLE")}
      </Typography>
      <Header
        text={text}
        setText={setText}
        handleClick={handleClick}
        isSearchClicked={isSearchClicked}
        setIsSearchClicked={setIsSearchClicked}
        searchButtonHandleClick={searchButtonHandleClick}
        control={control as any}
        setValue={setValue as any}
        clearErrors={clearErrors}
        watch={watch}
        errors={errors as any}
        isEditPermissionEnabled={isEditPermissionEnabled ?? false}
      />
      {Array.isArray(roles) && !roles.length ? (
        <>
          <Loader />
        </>
      ) : (
        <RoleList
          searchData={searchData}
          isCreatePermissionEnabled={isCreatePermissionEnabled ?? false}
          isEditPermissionEnabled={isEditPermissionEnabled ?? false}
        />
      )}
    </>
  );
};

export default RolesList;
