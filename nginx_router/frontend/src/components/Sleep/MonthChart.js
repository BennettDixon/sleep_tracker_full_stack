import React from "react";

const MonthChart = ({ sleepTimes }) => {
  const sleepMap = sleepTimes.map(sleepTime => {
    const milisecondsSlept = sleepTime.stop - sleepTime.start;
    // TOTAL minutes slept (e.g 500)
    const minutesSlept = Math.round(milisecondsSlept / 1000 / 60);
    // ROUNDED hours slept
    const hoursSlept = Math.round(minutesSlept / 60);
    // REMAINING minutes (from hours round (e.g 20))
    const remainderMinutes = minutesSlept - hoursSlept * 60;
    return (
      <li key={sleepTime.id}>
        Hours: {hoursSlept}
        <br />
        Minutes: {remainderMinutes}
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
