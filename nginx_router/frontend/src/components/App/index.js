import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SleepChartPage from "../Sleep";
import * as ROUTES from "../../constants/routes";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SLEEP_CHARTS} component={SleepChartPage} />
        </div>
      </Router>
    );
  }
}
export default App;
