import React from "react";

import "./SmallTimeText.css";

import SleepTime from "../../models/SleepTime";

const SmallTimeText = ({ date }) => {
  console.log(date);
  const dateTimeStr = SleepTime.getSmallTimeStr(date);
  return (
    <div>
      <span className="small-time-text">{dateTimeStr}</span>
    </div>
  );
};

export default SmallTimeText;
