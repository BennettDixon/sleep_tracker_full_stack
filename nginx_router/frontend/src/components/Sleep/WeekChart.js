import React from "react";

import { SleepTimeText } from "../TimeText";

import SleepTime from "../../models/SleepTime";

const WeekChart = ({ sleepTimes }) => {
  var totalMinutesSlept = 0;

  sleepTimes.forEach(sleepTime => {
    totalMinutesSlept += sleepTime.totalMinutesSlept;
  });
  var avgTotalMinutes = Math.round(totalMinutesSlept / sleepTimes.length);
  console.log("gopt avg mins: " + avgTotalMinutes);
  var avgHours = SleepTime.getHoursSlept(avgTotalMinutes);
  console.log("got avg hours: " + avgHours);
  var avgMinutes = SleepTime.getMinutesSlept(avgTotalMinutes, avgHours);
  console.log("got avgggggg minutes: " + avgMinutes);
  return (
    <div>
      <h1>This Week</h1>
      <SleepTimeText hours={avgHours} minutes={avgMinutes} />
    </div>
  );
};

export default WeekChart;
