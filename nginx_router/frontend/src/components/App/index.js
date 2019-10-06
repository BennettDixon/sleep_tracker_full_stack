import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import ProblemsPage from "../Problems";
import ProblemPage from "../Problem";
import LeaderboardPage from "../Leaderboard";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import * as ROUTES from "../../constants/routes";

import { withAuthentication, withPGUserProvider } from "../Session";

import { compose } from "recompose";
import { withUidTokenProvider } from "../UidToken";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.PROBLEMS} component={ProblemsPage} />
          <Route path={ROUTES.LEADERBOARD} component={LeaderboardPage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route
            path={ROUTES.PROBLEM}
            render={props => <ProblemPage {...props} />}
          />
        </div>
      </Router>
    );
  }
}
export default compose(
  withAuthentication,
  withPGUserProvider,
  withUidTokenProvider
)(App);
