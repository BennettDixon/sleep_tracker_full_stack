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
import SleepTimePicker from "./SleepTimePicker";

const VIEW_MODES = {
  DAY: 1,
  WEEK: 2,
  MONTH: 3,
  PICKER: 4
};

var INITIAL_STATE = {
  datePicked: new Date(),
  showModal: false,
  propOverride: true,
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
    this.setState({ propOverride: false });
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
      console.log("got OK resp from creation, could just be presenting view");
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
    this.closeModal();
    console.log(resp);
  }

  render() {
    console.log(this.state);
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
  viewMode: 1
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
    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    // set default view mode
    if (this.state.viewMode === undefined) {
      this.setState({ viewMode: VIEW_MODES.DAY });
    }
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

    var monthSleepTimes = this.getMonthTimes(now);

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
    // use props on first load if state not set yet
    const sleepTimes =
      this.state.sleepTimes.length > 0
        ? this.state.sleepTimes
        : this.props.sleepTimes;

    sleepTimes.forEach(sleepTime => {
      if (sleepTime.start > weekStartDate && sleepTime.start < weekEndDate) {
        weekSleepTimes.push(sleepTime);
      }
    });
    return weekSleepTimes.sort(SleepTime.sortByTime);
  }

  /**
   * fetches month times and set states accordingly
   *
   * @param {*} monthEndDate month beginning is calculated off of this, usually should be now
   *
   */
  getMonthTimes(monthEndDate) {
    var monthSleepTimes = [];
    const sleepTimes =
      this.state.sleepTimes.length > 0
        ? this.state.sleepTimes
        : this.props.sleepTimes;

    sleepTimes.forEach(sleepTime => {
      if (SleepTime.verifyMonthAndYear(sleepTime.start, monthEndDate)) {
        monthSleepTimes.push(sleepTime);
      }
    });

    return monthSleepTimes.sort(SleepTime.sortByTime);
  }

  /**
   * sets the view mode to a given mode
   */
  setViewMode = (mode, event) => {
    this.setState({ viewMode: mode });
  };

  async createSleepTime(startDate, stopDate) {
    console.log(startDate, stopDate);

    if (startDate === undefined || stopDate === undefined) {
      // if undefined set view mode to picker (request didnt originate from picker)
      this.setViewMode(VIEW_MODES.PICKER);
      return true;
    }
    if (SleepTime.verifyDay(startDate, this.state.latestSleep.start)) {
      // make sure not the same day
      console.log("same day");
      return false;
    }
    var resp = await this.props.apollo
      .createSleepTime(this.props.uid, {
        start: startDate.toISOString(),
        stop: stopDate.toISOString()
      })
      .catch(error => {
        console.log(error.message);
        return false;
      });

    if (resp) {
      console.log(resp);
      var sleepTime = resp.data.createSleepTime.sleepTime;
      console.log(sleepTime);
      sleepTime = new SleepTime(sleepTime.id, sleepTime.start, sleepTime.stop);
      this.state.sleepTimes.push(sleepTime);
      this.state.sleepTimes.sort(SleepTime.sortByTime);
      this.setState({
        latestSleep: sleepTime,
        weekSleepTimes: this.getWeekTimes(new Date()),
        monthSleepTimes: this.getMonthTimes(new Date())
      });
    }

    return true;
  }

  async replaceSleepTime(startTime, stopTime) {
    console.log("replacing sleep time");
    console.log(startTime, stopTime);
    // TODO delete with apollo and create new one
    console.log(this.state.latestSleep);

    // update the hours and minutes from the time picked
    const [stopHours, stopMinutes] = stopTime.split(":");
    const [startHours, startMinutes] = startTime.split(":");

    this.state.latestSleep.stop.setHours(stopHours);
    this.state.latestSleep.stop.setMinutes(stopMinutes);

    this.state.latestSleep.start.setHours(startHours);
    this.state.latestSleep.start.setMinutes(startMinutes);

    this.state.latestSleep.getMoreData();

    const prevLatest = this.state.latestSleep;
    console.log(prevLatest);

    var resp = await this.props.apollo
      .deleteSleepTime(this.props.uid, this.state.latestSleep.id)
      .catch(error => {
        console.log(error);
        return false;
      });
    console.log(resp);
    // proceed with new creation, delete succeeded
    resp = await this.props.apollo
      .createSleepTime(this.props.uid, {
        start: prevLatest.start.toISOString(),
        stop: prevLatest.stop.toISOString()
      })
      .catch(error => {
        console.log("failed to replace sleepTime: ");
        console.log(error);
      });
    console.log(resp);
    return true;
  }

  render() {
    console.log("cur view mode: " + this.state.viewMode);
    return (
      <div className="sleep-chart-container">
        <DateSpanSelector
          setViewMode={this.setViewMode}
          create={this.createSleepTime.bind(this)}
          replaceTime={this.replaceSleepTime.bind(this)}
        />

        <div className="data-view">
          {this.state.viewMode === VIEW_MODES.DAY ? (
            <DayChart sleepTime={this.state.latestSleep} />
          ) : this.state.viewMode === VIEW_MODES.WEEK ? (
            <TimeSpanChart
              sleepTimes={this.state.weekSleepTimes}
              chartHeader="This Week"
            />
          ) : this.state.viewMode === VIEW_MODES.MONTH ? (
            <TimeSpanChart
              sleepTimes={this.state.monthSleepTimes}
              chartHeader="This Month"
            />
          ) : (
            <SleepTimePicker submitDate={this.createSleepTime.bind(this)} />
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
        convertedTimes.push(
          new SleepTime(sleepTime.id, sleepTime.start, sleepTime.stop)
        );
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
