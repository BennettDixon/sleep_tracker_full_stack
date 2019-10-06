import React from "react";

import SleepTimeText from "../SleepTimeText";

const DayChart = ({ sleepTime }) => {
  return (
    <div>
      <h1>Days</h1>
      <div>
        <span>TIME ASLEEP</span>
        <SleepTimeText
          hours={sleepTime.hoursSlept}
          minutes={sleepTime.minutesSlept}
        />
      </div>
    </div>
  );
};

export default DayChart;
