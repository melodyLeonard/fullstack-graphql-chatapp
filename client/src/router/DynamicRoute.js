import React, { useContext } from "react";
import { AuthStateContext } from "../context/authentication/authContext";
import { Route, Redirect } from "react-router-dom";

const DynamicRoute = (props) => {
  const authStateContext = useContext(AuthStateContext);
  const { user } = authStateContext;
  if (props.authenticated && !user) {
    return <Redirect to="/login" />;
  } else if (props.guest && user) {
    return <Redirect to="/" />;
  } else {
    return <Route component={props.component} {...props} />;
  }
};

export default DynamicRoute;
