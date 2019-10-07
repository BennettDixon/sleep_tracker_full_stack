import React from "react";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

import LoadingPage from "../LoadingPage";
import DayChart from "./DayChart";
import TimeSpanChart from "./TimeSpanChart";

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

// BEGIN SleepChart class
var INITIAL_STATE = {
  sleepTimes: [],
  weekSleepTimes: [],
  monthSleepTimes: [],
  viewMode: VIEW_MODES.DAY
};
// Reuseable SleepChart component
class SleepChart extends React.Component {
  constructor(props) {
    super(props);
    // if passed via props
    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    var utcNow = new Date();

    const sortedTimes = this.props.sleepTimes.sort(SleepTime.sortByTime);

    // grab last ele of sorted array
    const latestSleep = sortedTimes[sortedTimes.length - 1];
    // debug
    console.log("fetched latest sleep:");
    console.log(latestSleep);
    console.log("");

    // update state with new sorted times and latest sleep => needed in next steps of didMount
    this.setState({ sleepTimes: sortedTimes, latestSleep: latestSleep });

    var weekSleepTimes = this.getWeekTimes(utcNow);
    weekSleepTimes = weekSleepTimes.sort(SleepTime.sortByTime);

    var monthSleepTimes = this.getMonthTimes(utcNow);
    monthSleepTimes = monthSleepTimes.sort(SleepTime.sortByTime);

    this.setState({
      weekSleepTimes,
      monthSleepTimes
    });
  }

  /**
   * sets state for week times from weekEndDate - 7
   *
   * @param {*} weekEndDate the end of the week, fetches 7 days back
   */
  getWeekTimes(weekEndDate) {
    var weekSleepTimes = [];
    var weekStartDate = new Date(
      weekEndDate.getFullYear(),
      weekEndDate.getMonth(),
      weekEndDate.getDate() - 7
    );

    this.props.sleepTimes.forEach(sleepTime => {
      if (sleepTime.start > weekStartDate) {
        weekSleepTimes.push(sleepTime);
      }
    });

    return weekSleepTimes;
  }

  getMonthTimes(monthEndDate) {
    var monthSleepTimes = [];

    this.props.sleepTimes.forEach(sleepTime => {
      if (SleepTime.verifyMonthAndYear(sleepTime.start, monthEndDate)) {
        monthSleepTimes.push(sleepTime);
      }
    });

    return monthSleepTimes;
  }

  setViewMode = (mode, event) => {
    this.setState({ viewMode: mode });
  };

  render() {
    return (
      <div className="sleep-chart-container">
        <DateSpanSelector setViewMode={this.setViewMode} />

        <div className="data-view">
          {this.state.viewMode === VIEW_MODES.DAY ? (
            <DayChart sleepTime={this.state.latestSleep} />
          ) : this.state.viewMode === VIEW_MODES.WEEK ? (
            <TimeSpanChart
              sleepTimes={this.state.weekSleepTimes}
              chartHeader="This Week"
            />
          ) : (
            <TimeSpanChart
              sleepTimes={this.state.monthSleepTimes}
              chartHeader="This Month"
            />
          )}
        </div>
      </div>
    );
  }
}

// BEGIN SleepChartPage class
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
    return (
      <div className="horizontal-center fill">
        {this.props.uid &&
        this.state.sleepTimes &&
        this.state.sleepTimes.length > 0 ? (
          <SleepChart sleepTimes={this.state.sleepTimes} />
        ) : (
          <LoadingPage />
        )}
      </div>
    );
  }
}

export { SleepChart };
export default compose(
  withApollo,
  withUid
)(SleepChartPage);
