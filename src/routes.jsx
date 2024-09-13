import React from "react";

// Admin Imports
import MainDashboard from "./views/admin/default";
import NFTMarketplace from "./views/admin/marketplace";
import Profile from "./views/admin/profile";
import DataTables from "./views/admin/tables";
import RTLDefault from "./views/rtl/default";

// Auth Imports
import SignIn from "./views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

const routes = [
  {
    name: "Admin Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: MainDashboard,
  },
  {
    name: "Contests",
    layout: "/admin",
    path: "all-contests",
    icon: <MdBarChart className="h-6 w-6" />,
    component: DataTables,
  },
  {
    name: "My Contests",
    layout: "/admin",
    path: "my-contests",
    icon: <MdLock className="h-6 w-6" />,
    component: SignIn,
  },
  {
    name: "Create Contest",
    layout: "/admin",
    path: "create-contest",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: Profile,
  },
];

/*

,
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: RTLDefault,
  },

*/

export default routes;
