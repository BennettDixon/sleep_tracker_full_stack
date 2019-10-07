import React from "react";

import "./SmallTimeText.css";

import SleepTime from "../../models/SleepTime";

const SmallTimeText = ({ date, militaryTime }) => {
  const dateTimeStr = SleepTime.getSmallTimeStr(date, militaryTime);
  return (
    <div>
      <span className="small-time-text">{dateTimeStr}</span>
    </div>
  );
};

export default SmallTimeText;
