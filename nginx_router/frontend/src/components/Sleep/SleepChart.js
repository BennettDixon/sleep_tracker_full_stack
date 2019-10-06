import React from "react";

import LoadingPage from "../LoadingPage";

import { withApollo } from "../Apollo";
import { withUid } from "../UidContext";

import { sleep } from "../../constants/utils";

import { compose } from "recompose";

const SleepChart = ({ sleepTimes }) => {
  const sleepMap = sleepTimes.map(sleepTime => {
    return (
      <li key={sleepTime.id}>
        {sleepTime.start}:{sleepTime.stop}
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
      this.setState({ sleepTimes });
    });
  }

  render() {
    // if we have uid and have fetched sleep times render view, otherwise loading page
    return this.props.uid &&
      this.state.sleepTimes &&
      this.state.sleepTimes.length > 0 ? (
      <div>
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
