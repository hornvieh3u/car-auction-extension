import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
// import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { AuthProvider } from "./auth-context/auth.context";
import { ProtectedRoute } from "./layouts/protected.route.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from "views/auth/signIn";

let user = localStorage.getItem("user");
user = JSON.parse(user);
ReactDOM.render(
  <ChakraProvider theme={theme}>
    <AuthProvider userData={user}>
      <BrowserRouter>
        <React.StrictMode>
          <HashRouter>
            <Switch>
              {/* <Route path={`/auth`} component={AuthLayout} /> */}
              <Route path={`/auth/sign-in`} component={SignIn} />
              <ProtectedRoute path={`/admin`} component={AdminLayout} />
              <Redirect from='/' to='/admin/dashboards' />
            </Switch>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </HashRouter>
        </React.StrictMode>
      </BrowserRouter>
    </AuthProvider>
  </ChakraProvider>,
  document.getElementById("root")
);
