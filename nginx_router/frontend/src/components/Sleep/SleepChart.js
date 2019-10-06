import React from "react";

import LoadingPage from "../LoadingPage";

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

  render() {
    return this.state.sleepTimes && this.state.sleepTimes.length > 0 ? (
      <div>
        <SleepChart sleepTimes={this.state.sleepTimes} />
      </div>
    ) : (
      <LoadingPage />
    );
  }
}

export { SleepChart };
export default SleepChartPage;
