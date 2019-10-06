import React, { Component } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { UidContext } from "../UidContext";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SleepChartPage from "../Sleep";
import * as ROUTES from "../../constants/routes";

class App extends Component {
  // TODO uidContext should be included in authentication scheme
  // current implementation is hardcoded id in App
  render() {
    return (
      <Router>
        <UidContext.Provider value={1}>
          <div>
            <Navigation />
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SLEEP_CHARTS} component={SleepChartPage} />
          </div>
        </UidContext.Provider>
      </Router>
    );
  }
}
export default App;
