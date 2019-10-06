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
    this.hoursSlept = Math.round(this.totalMinutesSlept / 60);
    // REMAINING minutes (from hours round (e.g 20))
    this.minutesSlept = this.totalMinutesSlept - this.hoursSlept * 60;
  }

  static getSmallTimeStr(dateTime) {
    const strParse = dateTime.toTimeString().split(":");
    return strParse[0] + ":" + strParse[1];
  }
}

export default SleepTime;
