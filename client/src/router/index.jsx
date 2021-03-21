import { BrowserRouter, Switch } from "react-router-dom";
import Auth from "../pages/auth";
import Home from "../pages/Home";
import DynamicRoute from "./DynamicRoute";

const index = () => {
  return (
    <BrowserRouter>
      <Switch>
        <DynamicRoute exact path="/" component={Home} authenticated />
      </Switch>
      <Auth />
    </BrowserRouter>
  );
};

export default index;
