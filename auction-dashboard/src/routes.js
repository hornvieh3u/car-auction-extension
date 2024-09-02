import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdDataUsage,
  MdOutlineShoppingCart,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Proxys from "views/admin/proxy";
import Users from "views/admin/user";
import UserActivities from "views/admin/userActivity";
import Invoices from "views/admin/invoice";
import Accounts from "views/admin/account";

// import SignIn from "views/auth/signIn/index.jsx";
// import SignUp from "views/auth/signUp/index.jsx";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "User",
    layout: "/admin",
    path: "/users",
    icon: (
      <Icon as={MdPerson} width='20px' height='20px' color='inherit' />
    ),
    component: Users,
    secondary: true,
  },
  {
    name: "Account",
    layout: "/admin",
    path: "/account",
    icon: <Icon as={MdOutlineAccountBalanceWallet} width='20px' height='20px' color='inherit' />,
    component: Accounts,
  },
  {
    name: "Activity",
    layout: "/admin",
    icon: <Icon as={MdDataUsage} width='20px' height='20px' color='inherit' />,
    path: "/usr-activities",
    component: UserActivities,
  },
  {
    name: "Proxy",
    layout: "/admin",
    path: "/proxy",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    component: Proxys,
  },
  {
    name: "Invoice",
    layout: "/admin",
    path: "/invoice",
    icon: <Icon as={MdOutlineShoppingCart} width='20px' height='20px' color='inherit' />,
    component: Invoices,
  },
];

export default routes;
