import React from "react";

import { SleepTimeText, TimeLabel } from "../TimeText";

import SleepTime from "../../models/SleepTime";
import LoadingPage from "../LoadingPage";

const TimeSpanChart = ({ sleepTimes, chartHeader }) => {
  var totalMinutesSlept = 0;
  if (sleepTimes === undefined) {
    return <LoadingPage />;
  } else if (sleepTimes.length <= 0) {
    // if length is 0 there is no data loaded, but it is defined
    return <TimeLabel label={"no data loaded for " + chartHeader} />;
  }
  sleepTimes.forEach(sleepTime => {
    totalMinutesSlept += sleepTime.totalMinutesSlept;
  });
  var avgTotalMinutes = Math.round(totalMinutesSlept / sleepTimes.length);
  var avgHours = SleepTime.getHoursSlept(avgTotalMinutes);
  var avgMinutes = SleepTime.getMinutesSlept(avgTotalMinutes, avgHours);

  return (
    <div>
      <h1>{chartHeader}</h1>
      <TimeLabel label="Average Time Slept" />
      <SleepTimeText hours={avgHours} minutes={avgMinutes} />
    </div>
  );
};

export default TimeSpanChart;
