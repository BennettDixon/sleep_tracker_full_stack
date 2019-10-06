import React from "react";

import "./SleepTimeText.css";

const SleepTimeText = ({ hours, minutes }) => {
  return (
    <div className="sleep-time">
      <span className="sleep-time-time">{hours}</span>
      <span>h</span>
      <span className="sleep-time-time">{minutes}</span>
      <span>m</span>
    </div>
  );
};

export default SleepTimeText;
