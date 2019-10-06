import React from "react";

import { SleepTimeText, SmallTimeText, TimeLabel } from "../TimeText";

const DayChart = ({ sleepTime }) => {
  return (
    <div>
      <h1>Days</h1>
      <div>
        <TimeLabel label="Time Slept" />
        <SleepTimeText
          hours={sleepTime.hoursSlept}
          minutes={sleepTime.minutesSlept}
        />

        <TimeLabel label="In bed at" />
        <SmallTimeText date={sleepTime.start} />

        <TimeLabel label="In bed until" />
        <SmallTimeText date={sleepTime.stop} />
      </div>
    </div>
  );
};

export default DayChart;
