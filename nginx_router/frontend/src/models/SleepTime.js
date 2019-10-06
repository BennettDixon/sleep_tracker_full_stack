import { getDateTime } from "../constants/utils";

class SleepTime {
  constructor(startStr, stopStr) {
    this.start = getDateTime(startStr);
    this.stop = getDateTime(stopStr);
    this.getMoreData();
  }

  getMoreData() {
    this.milisecondsSlept = this.stop - this.start;
    // TOTAL minutes slept (e.g 500)
    this.totalMinutesSlept = Math.round(this.milisecondsSlept / 1000 / 60);
    // ROUNDED hours slept
    this.hoursSlept = SleepTime.getHoursSlept(this.totalMinutesSlept);
    // REMAINING minutes (from hours round (e.g 20))
    this.minutesSlept = SleepTime.getMinutesSlept(
      this.totalMinutesSlept,
      this.hoursSlept
    );
  }

  static getSmallTimeStr(dateTime) {
    const strParse = dateTime.toTimeString().split(":");
    return strParse[0] + ":" + strParse[1];
  }

  static getHoursSlept(totalMinutesSlept) {
    return Math.floor(totalMinutesSlept / 60);
  }

  static getMinutesSlept(totalMinutes, roundedHours) {
    return Math.round(totalMinutes - roundedHours * 60);
  }
}

export default SleepTime;
