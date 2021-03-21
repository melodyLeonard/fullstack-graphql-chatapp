import React from "react";
import { Switch } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "./auth.scss";
import DynamicRoute from "../../router/DynamicRoute";

const index = () => {
  return (
    <Switch>
      <DynamicRoute exact path="/register" component={Register} guest />
      <DynamicRoute exact path="/login" component={Login} guest />
    </Switch>
  );
};

export default index;
