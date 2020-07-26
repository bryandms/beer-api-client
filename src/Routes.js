import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import { connect } from "react-redux";

import Beer from "./pages/Beer";
import BeerList from "./pages/BeerList";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

const PrivateRoute = (props) => {
  const hasToken = localStorage.getItem("token") || null;
  return !hasToken ? <Redirect to="/" /> : <Route {...props} />;
};

const Routes = (props) => {
  const { setUserId, setToken, setIsAuth } = props;

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = () => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");

    if (!token || !expiryDate) return;

    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }

    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();

    setIsAuth(true);
    setToken(token);
    setUserId(userId);
    setAutoLogout(remainingMilliseconds);
  };

  const setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const logoutHandler = () => {
    setIsAuth(false);
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => <Login {...props} setAutoLogout={setAutoLogout} />}
        />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/beers" exact component={BeerList} />
        <PrivateRoute path="/beer/:beerId" exact component={Beer} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

const mapState = (state) => ({
  userId: state.userId,
  token: state.token,
  isAuth: state.isAuth,
});

const mapDispatch = (dispatch) => ({
  setUserId: dispatch.userId.setUserId,
  setToken: dispatch.token.setToken,
  setIsAuth: dispatch.isAuth.setIsAuth,
});

export default connect(mapState, mapDispatch)(Routes);
