// ** React Imports
import { ReactNode, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Types
import type { ACLObj, AppAbility } from "src/configs/acl";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** Config Import
import { buildAbilityFor } from "src/configs/acl";

// ** Component Import
import NotAuthorized from "src/pages/401";
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Hooks
import { useAuth } from "src/hooks/useAuth";
import { AuthValuesType } from "src/context/types";

interface AclGuardProps {
  children: ReactNode;
  guestGuard: boolean;
  aclAbilities: ACLObj;
}

interface Permissions {
  permissionId: number;
  createAccess: boolean;
  readAccess: boolean;
  editAccess: boolean;
  deleteAccess: boolean;
  permissions: {
    id: number;
    name: string;
    createdBy: string;
  };
}

interface Role {
  rolePermissions?: Permissions[];
}

interface User {
  role?: Role;
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props;

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined);

  // ** Hooks
  const auth: AuthValuesType = useAuth();
  const router = useRouter();

  // Usage
  const { user } = auth;
  const rolePermissions = user?.role?.rolePermissions;

  const resultArray =
    rolePermissions?.map((permission) => ({
      readAccess: permission?.permissions?.name === "dashboards" ? true : permission?.permissionType?.Read,
      name: permission?.permissions?.name,
    })) || [];
  // Ensure myPermission is defined before using it

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (
    guestGuard ||
    router.route === "/404" ||
    router.route === "/500" ||
    router.route === "/"
  ) {
    return <>{children}</>;
  }
  //return <>{children}</>
  // User is logged in, build ability for the user based on his role
  const currentModuleName = router.route.substring(1).split("/")[0];


  let checked = resultArray.some(
    (item) => item.name === currentModuleName && item.readAccess === true
  );

  if (!checked) {
    return (
      <BlankLayout>
        <NotAuthorized />
      </BlankLayout>
    );
  }

  if (auth.user && auth.user.role && !ability) {
    setAbility(buildAbilityFor(auth?.user?.role?.name, aclAbilities.subject));
  }

  // Check the access of current user and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return (
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    );
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  );
};

export default AclGuard;
