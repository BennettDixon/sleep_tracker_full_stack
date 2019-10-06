import React from "react";

import LoadingPage from "../LoadingPage";

import { withApollo } from "../Apollo";
import { withUid } from "../UidContext";

import { sleep, getDateTime } from "../../constants/utils";

import { compose } from "recompose";

const SleepChart = ({ sleepTimes }) => {
  const sleepMap = sleepTimes.map(sleepTime => {
    const milisecondsSlept = sleepTime.stop - sleepTime.start;
    // minutesSlept is currently miliseconds slept so convert
    const minutesSlept = Math.round(milisecondsSlept / 1000 / 60);
    const hoursSlept = Math.round(minutesSlept / 60);
    const remainderMinutes = minutesSlept - hoursSlept * 60;
    return (
      <li key={sleepTime.id}>
        Hours: {hoursSlept}
        <br />
        Minutes: {remainderMinutes}
      </li>
    );
  });
  return <ul>{sleepMap}</ul>;
};

const INITIAL_STATE = {
  sleepTimes: []
};

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
    // fetch sleep times & set state
    this.props.apollo.getUserSleepTimes(this.props.uid).then(resp => {
      const sleepTimes = resp.data.userSleepTimes;
      const unixTimeZero = Date.parse("01 Jan 1970 00:00:00 GMT");
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
        <SleepChart
          className="vertical-center"
          sleepTimes={this.state.sleepTimes}
        />
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
