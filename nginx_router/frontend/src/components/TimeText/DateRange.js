import React from "react";

import TimeLabel from "./TimeLabel";

import SleepTime from "../../models/SleepTime";

import "./DateRange.css";

const DateRange = ({ sleepTimes }) => {
  if (sleepTimes.length === undefined) {
    // not an array, render singular object
    console.log("date range not array");
  }
  const dateRange = SleepTime.getDateRangeText(sleepTimes);
  return (
    <div className="date-range">
      <TimeLabel label={dateRange} fontSize={20} />
    </div>
  );
};

export default DateRange;
