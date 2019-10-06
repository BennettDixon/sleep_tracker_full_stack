import React from "react";

const MonthChart = ({ sleepTimes }) => {
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
      <h1>Months</h1>
      <ul>{sleepMap}</ul>
    </div>
  );
};

export default MonthChart;
