import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import TimePicker from "react-time-picker";

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

var INITIAL_STATE = {
  datePicked: new Date(),
  showModal: false,
  modalError: null
};

/**
 * Header for selecting day // week // month
 *
 * @param {*} prop setViewMode (required prop) function to set the view mode
 */
class DateSpanSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  closeModal = event => {
    this.setState({ showModal: false });
  };

  onStartTimeChange = time => {
    this.setState({ startTime: time });
  };

  onStopTimeChange = time => {
    this.setState({ stopTime: time });
  };

  async createCompiled() {
    var resp = await this.props.create();
    if (resp) {
      console.log("succeeded in date creation");
    } else {
      // already date present for today
      this.setState({ showModal: true });
    }
  }

  async replaceTime() {
    if (!this.state.stopTime || !this.state.startTime) {
      this.setState({
        modalError: "Please select both times before replacing"
      });
      return;
    } else {
      this.setState({
        modalError: null
      });
    }
    var resp = await this.props.replaceTime(
      this.state.startTime,
      this.state.stopTime
    );
    console.log(resp);
  }

  render() {
    return (
      <div>
        <ButtonGroup className="date-span-group">
          <Button
            className="date-span-button"
            onClick={this.props.setViewMode.bind(this, VIEW_MODES.DAY)}
          >
            D
          </Button>

          <Button
            className="date-span-button"
            onClick={this.props.setViewMode.bind(this, VIEW_MODES.WEEK)}
          >
            W
          </Button>

          <Button
            className="date-span-button"
            onClick={this.props.setViewMode.bind(this, VIEW_MODES.MONTH)}
          >
            M
          </Button>
          <Button onClick={this.createCompiled.bind(this)}>+</Button>
        </ButtonGroup>

        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Entry Already Present</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="horizontal-center">
              {this.state.modalError ? (
                <p className="form-error">{this.state.modalError}</p>
              ) : (
                ""
              )}
              There is already a date entered for today's date. If you would
              like to replace the current entry for today, enter the new start &
              stop times, then press replace.
              <br />
              <br />
              <h5>Start Time</h5>
              <TimePicker
                name="startTime"
                onChange={this.onStartTimeChange}
                value={this.state.startTime}
                className="time-picker"
              />
              <br />
              <h5>Stop Time</h5>
              <TimePicker
                name="stopTime"
                onChange={this.onStopTimeChange}
                value={this.state.stopTime}
                className="time-picker"
              />
              <br />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.replaceTime.bind(this)}>
              Replace
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

// BEGIN SleepChart class
INITIAL_STATE = {
  sleepTimes: [],
  weekSleepTimes: [],
  monthSleepTimes: [],
  viewMode: VIEW_MODES.DAY
};

/**
 * SleepChart renders together all components needed to display user sleep information
 *
 * it DOES NOT load data in for sleepTimes. It MUST be pased in via props
 *
 * @param {*} props required props: sortedTimes
 */
class SleepChart extends React.Component {
  constructor(props) {
    super(props);
    // if passed via props
    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    var now = new Date();
    console.log(now.toISOString());
    const sortedTimes = this.props.sleepTimes.sort(SleepTime.sortByTime);

    // grab last ele of sorted array
    const latestSleep = sortedTimes[sortedTimes.length - 1];
    // debug
    console.log("fetched latest sleep:");
    console.log(latestSleep.start.toISOString());
    console.log("");

    // update state with new sorted times and latest sleep => needed in next steps of didMount
    this.setState({ sleepTimes: sortedTimes, latestSleep: latestSleep });

    var weekSleepTimes = this.getWeekTimes(now);
    weekSleepTimes = weekSleepTimes.sort(SleepTime.sortByTime);

    var monthSleepTimes = this.getMonthTimes(now);
    monthSleepTimes = monthSleepTimes.sort(SleepTime.sortByTime);

    this.setState({
      weekSleepTimes,
      monthSleepTimes
    });
  }

  /**
   * sets state for week times from weekEndDate - 7
   * fetches from props
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

  /**
   * fetches month times and set states accordingly
   *
   * @param {*} monthEndDate month beginning is calculated off of this, usually should be now
   *
   */
  getMonthTimes(monthEndDate) {
    var monthSleepTimes = [];

    this.props.sleepTimes.forEach(sleepTime => {
      if (SleepTime.verifyMonthAndYear(sleepTime.start, monthEndDate)) {
        monthSleepTimes.push(sleepTime);
      }
    });

    return monthSleepTimes;
  }

  /**
   * sets the view mode to a given mode
   */
  setViewMode = (mode, event) => {
    this.setState({ viewMode: mode });
  };

  async createSleepTime(event) {
    // TODO replace with modal prompting for time
    const start = new Date();
    const stop = new Date();
    // make sure not the same day
    if (SleepTime.verifyDay(start, this.state.latestSleep.start)) {
      return false;
    }
    await this.props.apollo
      .createSleepTime(this.props.uid, {
        start: start.toISOString(),
        stop: stop.toISOString()
      })
      .then(resp => {
        console.log(resp);
      })
      .catch(error => {
        console.log(error.message);
        return false;
      });

    return true;
  }

  async replaceSleepTime(startTime, stopTime) {
    console.log("replacing sleep time");
    console.log(startTime, stopTime);
    console.log();
    return true;
  }

  render() {
    return (
      <div className="sleep-chart-container">
        <DateSpanSelector
          setViewMode={this.setViewMode}
          create={this.createSleepTime.bind(this)}
          replaceTime={this.replaceSleepTime}
        />

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
          <SleepChart
            sleepTimes={this.state.sleepTimes}
            apollo={this.props.apollo}
            uid={this.props.uid}
          />
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
