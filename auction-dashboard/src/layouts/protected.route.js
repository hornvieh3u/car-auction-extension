import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth } from "../auth-context/auth.context";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export const ProtectedRoute = ({ ...rest }) => {
  const history = useHistory();
  let { user } = useAuth();
  useEffect(() => {
    if (!user || !user.token || user.token === "") {
      toast.info("You must be signed in!");
      history.push("/auth/sign-in");
    }
  }, []);

  return <Route {...rest} />;
};
