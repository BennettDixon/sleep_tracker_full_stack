import React from "react";

import TimeLabel from "./TimeLabel";

import "./DateRange.css";

const DateRange = ({ sleepTimes }) => {
  if (typeof sleepTimes !== typeof array) {
    console.log("date range not array");
  }
  return (
    <div className="date-range">
      <TimeLabel label={"Date range"} fontSize={20} />
    </div>
  );
};

export default DateRange;
