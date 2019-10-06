import React from "react";

const WeekChart = ({ sleepTimes }) => {
  const sleepMap = sleepTimes.map(sleepTime => {
    return (
      <li key={sleepTime.id}>
        Hours: {sleepTime.hoursSlept}
        <br />
        Minutes: {sleepTime.minutesSlept}
      </li>
    );
  });
  return (
    <div>
      <h1>This Week</h1>
      <ul>{sleepMap}</ul>
    </div>
  );
};

export default WeekChart;
