import React from "react";

import {
  SleepTimeText,
  SmallTimeText,
  TimeLabel,
  DateRange
} from "../TimeText";

const DayChart = ({ sleepTime, militaryTime }) => {
  console.log(sleepTime);
  return (
    <div>
      <h1>Last Sleep</h1>
      <div>
        <DateRange sleepTimes={sleepTime} />
        <TimeLabel label="Time Slept" />
        <SleepTimeText
          hours={sleepTime.hoursSlept}
          minutes={sleepTime.minutesSlept}
        />

        <TimeLabel label="In bed at" />
        <SmallTimeText date={sleepTime.start} militaryTime={militaryTime} />

        <TimeLabel label="In bed until" />
        <SmallTimeText date={sleepTime.stop} militaryTime={militaryTime} />
      </div>
    </div>
  );
};

export default DayChart;
