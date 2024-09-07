// ** React Imports
import { useEffect, useState } from "react";

// ** Axios Import
import axios from "axios";

// ** Type Import
import { VerticalNavItemsType } from "src/@core/layouts/types";

// const menuCustomArrray = [
//   {
//     title: 'Dashboard',
//     path: '/home',
//     icon: 'tabler:smart-home'
//   },
//   {
//     title: 'Invoice',
//     path: '/second-page',
//     icon: 'tabler:mail'
//   },
//   {
//     path: '/customers',
//     action: 'read',
//     subject: 'acl-page',
//     title: 'Customers',
//     icon: 'tabler:shield'
//   },
//   {
//     title: 'Roles & Permission',
//     path: '/roles&Permission',
//     icon: 'tabler:smart-home'
//   },
//   {
//     title: 'Authentication',
//     path: '/authentication',
//     icon: 'tabler:mail'
//   },
//   {
//     title: 'Wizard Examples',
//     path: '/wizardExamples',
//     icon: 'tabler:shield'
//   },
//   {
//     title: 'Modal Examples',
//     path: '/modalExamples',
//     icon: 'tabler:mail'
//   }
// ]
const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([]);

  useEffect(() => {
    axios.get("/api/vertical-nav/data").then((response) => {
      const menuArray = response.data;

      setMenuItems(menuArray);
    });

    // setMenuItems(menuCustomArrray)
  }, []);
};

export default ServerSideNavItems;
