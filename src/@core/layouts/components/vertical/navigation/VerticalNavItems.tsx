// ** Type Imports
import {
  NavLink,
  NavGroup,
  LayoutProps,
  NavSectionTitle,
} from "src/@core/layouts/types";

// ** Custom Menu Components
import VerticalNavLink from "./VerticalNavLink";
import VerticalNavGroup from "./VerticalNavGroup";
import VerticalNavSectionTitle from "./VerticalNavSectionTitle";

import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import UserIcon from "src/layouts/components/UserIcon";
import { useAuth } from "src/hooks/useAuth";

interface Props {
  parent?: NavGroup;
  navHover?: boolean;
  navVisible?: boolean;
  groupActive: string[];
  isSubToSub?: NavGroup;
  currentActiveGroup: string[];
  navigationBorderWidth: number;
  settings: LayoutProps["settings"];
  saveSettings: LayoutProps["saveSettings"];
  setGroupActive: (value: string[]) => void;
  setCurrentActiveGroup: (item: string[]) => void;
  verticalNavItems?: LayoutProps["verticalLayoutProps"]["navMenu"]["navItems"];
}

interface MenuItem {
  title: string;
  icon: string;
  module: string;
  children?: MenuItem[];
  path?: string;
  action?: string;
  subject?: string;
}

const resolveNavItemComponent = (
  item: NavGroup | NavLink | NavSectionTitle
) => {
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle;
  if ((item as NavGroup).children) return VerticalNavGroup;

  return VerticalNavLink;
};

const VerticalNavItems = (props: Props) => {
  // ** Props
  const { verticalNavItems } = props;
  const auth = useAuth();
  const { user } = auth;
  const rolePermissions = user?.role?.rolePermissions?.filter(permission => permission?.permissionType?.Read === true);
  const permissionNames = rolePermissions?.map(
    (permission) => permission?.permissions?.name
  );



  const filteredObject = verticalNavItems?.filter((item: any) =>
    permissionNames?.includes(item?.module)
  );

  //filteredObject
  const RenderMenuItems = filteredObject?.map(
    (item: NavGroup | NavLink | NavSectionTitle, index: number) => {
      const TagName: any = resolveNavItemComponent(item);

      return <TagName {...props} key={index} item={item} />;
    }
  );

  return <>{RenderMenuItems}</>;
};

export default VerticalNavItems;
