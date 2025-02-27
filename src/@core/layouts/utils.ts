// ** Types
import { NavGroup, NavLink } from "src/@core/layouts/types";
import { NextRouter } from "next/router";

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param item
 * @param activeItem
 */
export const handleURLQueries = (
  router: NextRouter,
  path: string | undefined
): boolean => {
  if (Object.keys(router.query).length && path) {
    const arr = Object.keys(router.query);

    return (
      router.asPath.includes(path) &&
      router.asPath.includes(router.query[arr[0]] as string) &&
      path !== "/"
    );
  }

  return false;
};

/**
 * Check if the given item has the given url
 * in one of its children
 *
 * @param item
 * @param currentURL
 */
export const hasActiveChild = (item: NavGroup, currentURL: string): boolean => {
  const { children } = item;

  if (!children) {
    return false;
  }

  for (const child of children) {
    if ((child as NavGroup).children) {
      if (hasActiveChild(child, currentURL)) {
        return true;
      }
    }
    const childPath = (child as NavLink).path;

    // Check if the child has a link and is active
    if (
      child &&
      childPath &&
      currentURL &&
      (childPath === currentURL ||
        (currentURL.includes(childPath) && childPath !== "/"))
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Check if this is a children
 * of the given item
 *
 * @param children
 * @param openGroup
 * @param currentActiveGroup
 */

const NON_ALPHA_NUMERIC = /[^\w\s]/g;

export const removeChildren = (
  children: NavLink[],
  openGroup: string[],
  currentActiveGroup: string[]
) => {
  children.forEach((child: NavLink | any) => {
    if (!currentActiveGroup.includes(child.title)) {
      const index = openGroup.indexOf(child.title);
      if (index > -1) openGroup.splice(index, 1);

      // @ts-ignore
      if (child.children)
        removeChildren(child.children, openGroup, currentActiveGroup);
    }
  });
};

export const Key = (name: any) => {
  if (name == null) return "";
  var str = "";
  str = name.trim();
  str = str.replace(NON_ALPHA_NUMERIC, "_");
  str = str.replace(/\s/g, "_");
  return str.toUpperCase();
};

export function addCommas(nStr: any) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}
