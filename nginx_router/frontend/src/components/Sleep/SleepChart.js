import React from "react";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

import LoadingPage from "../LoadingPage";
import DayChart from "./DayChart";
import WeekChart from "./WeekChart";
import MonthChart from "./MonthChart";

import { withApollo } from "../Apollo";
import { withUid } from "../UidContext";

import { sleep } from "../../constants/utils";

import SleepTime from "../../models/SleepTime";

import { compose } from "recompose";

import "./SleepChart.css";

const VIEW_MODES = {
  DAY: 1,
  WEEK: 2,
  MONTH: 3
};

const DateSpanSelector = ({ setViewMode }) => {
  return (
    <ButtonGroup className="date-span-group">
      <Button
        className="date-span-button"
        onClick={setViewMode.bind(this, VIEW_MODES.DAY)}
      >
        D
      </Button>

      <Button
        className="date-span-button"
        onClick={setViewMode.bind(this, VIEW_MODES.WEEK)}
      >
        W
      </Button>

      <Button
        className="date-span-button"
        onClick={setViewMode.bind(this, VIEW_MODES.MONTH)}
      >
        M
      </Button>
    </ButtonGroup>
  );
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
    console.log(this.state.viewMode);
    return (
      <div className="sleep-chart-container">
        <DateSpanSelector setViewMode={this.setViewMode} />

        <div className="data-view">
          {this.state.viewMode === VIEW_MODES.DAY ? (
            <DayChart sleepTimes={this.state.sleepTimes} />
          ) : this.state.viewMode === VIEW_MODES.WEEK ? (
            <WeekChart sleepTimes={this.state.sleepTimes} />
          ) : (
            <MonthChart sleepTimes={this.state.sleepTimes} />
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
      var convertedTimes = [];
      sleepTimes.forEach(sleepTime => {
        convertedTimes.push(new SleepTime(sleepTime.start, sleepTime.stop));
      });
      this.setState({ sleepTimes: convertedTimes });
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
