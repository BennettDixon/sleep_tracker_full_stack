import React from "react";

import TimeLabel from "./TimeLabel";

import SleepTime from "../../models/SleepTime";

import "./DateRange.css";

const DateRange = ({ sleepTimes }) => {
  const dateRange = SleepTime.getDateRangeText(sleepTimes);
  console.log(dateRange);
  return (
    <div className="date-range">
      <TimeLabel label={dateRange} fontSize={20} />
    </div>
  );
};

export default DateRange;
