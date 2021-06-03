import React from "react";

// router
import { Redirect, Route, Switch } from "react-router-dom";

// screens
import {
  DashboardScreen,
  EarnValueScreen,
  CalculatorScreen,
} from "../../screens";

export const Layout = () => {
  return (
    <Switch>
      <Route path="/dashboard" exact component={DashboardScreen} />
      <Route path="/earnvalue/:item_id" exact component={EarnValueScreen} />
      <Route path="/calculator" exact component={CalculatorScreen} />
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="**">
        <h1>404 Not Found</h1>
      </Route>
    </Switch>
  );
};
