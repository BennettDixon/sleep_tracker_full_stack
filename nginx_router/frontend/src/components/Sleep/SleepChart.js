import React from "react";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

import LoadingPage from "../LoadingPage";

import { withApollo } from "../Apollo";
import { withUid } from "../UidContext";

import { sleep, getDateTime } from "../../constants/utils";

import { compose } from "recompose";

import "./SleepChart.css";

const VIEW_MODES = {
  DAY: 1,
  WEEK: 2,
  MONTH: 3
};

var INITIAL_STATE = {
  sleepTimes: [],
  viewMode: VIEW_MODES.DAY
};

// Reuseable SleepChart component
class SleepChart extends React.Component {
  constructor(props) {
    super(props);
    // if passed via props
    if (props.sleepTimes !== undefined) {
      INITIAL_STATE.sleepTimes = props.sleepTimes;
    }
    this.state = INITIAL_STATE;
  }

  setViewMode = (mode, event) => {
    this.setState({ viewMode: mode });
  };

  render() {
    const sleepMap = this.state.sleepTimes.map(sleepTime => {
      const milisecondsSlept = sleepTime.stop - sleepTime.start;
      // TOTAL minutes slept (e.g 500)
      const minutesSlept = Math.round(milisecondsSlept / 1000 / 60);
      // ROUNDED hours slept
      const hoursSlept = Math.round(minutesSlept / 60);
      // REMAINING minutes (from hours round (e.g 20))
      const remainderMinutes = minutesSlept - hoursSlept * 60;
      return (
        <li key={sleepTime.id}>
          Hours: {hoursSlept}
          <br />
          Minutes: {remainderMinutes}
        </li>
      );
    });
    console.log(this.state.viewMode);
    return (
      <div className="sleep-chart-container">
        <ButtonGroup className="date-span-group">
          <Button
            className="date-span-button"
            onClick={this.setViewMode.bind(this, VIEW_MODES.DAY)}
          >
            D
          </Button>

          <Button
            className="date-span-button"
            onClick={this.setViewMode.bind(this, VIEW_MODES.WEEK)}
          >
            W
          </Button>

          <Button
            className="date-span-button"
            onClick={this.setViewMode.bind(this, VIEW_MODES.MONTH)}
          >
            M
          </Button>
        </ButtonGroup>

        <div className="data-view">
          {this.state.viewMode === VIEW_MODES.DAY ? (
            <ul>{sleepMap}</ul>
          ) : this.state.viewMode === VIEW_MODES.WEEK ? (
            <h1>week mode</h1>
          ) : (
            <h1>month mode</h1>
          )}
        </div>
      </div>
    );
  }
}

INITIAL_STATE = {
  sleepTimes: []
};

/**
 * SleepChartPage - Component that loads sleep times for users and passes to sleepchart
 * used as a layer of abstraction from chart view itself
 */
class SleepChartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  async componentDidMount() {
    /*
     * wait for us to get uid, more likely this will be a uidToken for auth in production
     * and is hence fetched from the backend or 3rd party
     * so we must wait for it before fetching with it
     */
    while (!this.props.uid) {
      await sleep(100);
    }
    // fetch sleep times, convert, & set state
    this.props.apollo.getUserSleepTimes(this.props.uid).then(resp => {
      const sleepTimes = resp.data.userSleepTimes;
      // convert the sleepTimes we fetched from json strings to Date objects
      sleepTimes.forEach(sleepTime => {
        sleepTime.start = getDateTime(sleepTime.start);
        sleepTime.stop = getDateTime(sleepTime.stop);
      });
      this.setState({ sleepTimes });
    });
  }

  render() {
    // if we have uid and have fetched sleep times render view, otherwise loading page
    return this.props.uid &&
      this.state.sleepTimes &&
      this.state.sleepTimes.length > 0 ? (
      <div className="horizontal-center fill">
        <SleepChart sleepTimes={this.state.sleepTimes} />
      </div>
    ) : (
      <LoadingPage />
    );
  }
}

export { SleepChart };
export default compose(
  withApollo,
  withUid
)(SleepChartPage);
