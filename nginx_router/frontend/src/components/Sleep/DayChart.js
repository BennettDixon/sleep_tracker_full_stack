import React from "react";

import { SleepTimeText, SmallTimeText } from "../TimeText";

const DayChart = ({ sleepTime }) => {
  return (
    <div>
      <h1>Days</h1>
      <div>
        <span className="time-label">TIME ASLEEP</span>
        <SleepTimeText
          hours={sleepTime.hoursSlept}
          minutes={sleepTime.minutesSlept}
        />
        <span className="time-label">IN BED AT</span>
        <SmallTimeText date={sleepTime.start} />
      </div>
    </div>
  );
};

export default DayChart;
