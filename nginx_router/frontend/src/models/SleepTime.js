import { getDateTime } from "../constants/utils";

class SleepTime {
  constructor(startStr, stopStr) {
    this.start = getDateTime(startStr);
    console.log(startStr, this.start.toISOString());
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

  /**
   * Gets date range text for display from array, or just singular
   *
   * @param {*} sleepTimes SleepTime array to get range from, or singular sleep time
   */
  static getDateRangeText(sleepTimes) {
    return "daterange text";
  }

  static sortByTime = (a, b) => {
    if (a.start === b.start) {
      return 0;
    } else if (a.start < b.start) {
      // if date a is before date b it should come first
      console.log("a comes first");
      return -1;
    }
    // a > b
    return 1;
  };

  static getSmallTimeStr(dateTime) {
    const strParse = dateTime
      .toISOString()
      .split("T")[1]
      .split(":");
    return strParse[0] + ":" + strParse[1];
  }

  static getHoursSlept(totalMinutesSlept) {
    return Math.floor(totalMinutesSlept / 60);
  }

  static getMinutesSlept(totalMinutes, roundedHours) {
    return Math.round(totalMinutes - roundedHours * 60);
  }

  static verifyYear(date, validationDate) {
    var endYear = validationDate.getFullYear();
    var instanceYear = date.getFullYear();
    if (instanceYear === endYear) {
      return true;
    }
    return false;
  }

  /**
   * verifies date and endDate have the same month and year
   *
   * @param {*} date Date to verify
   * @param {*} endDate Date to check date against
   */
  static verifyMonthAndYear(date, endDate) {
    var endMonth = endDate.getMonth();
    var instanceMonth = date.getMonth();

    if (instanceMonth === endMonth && SleepTime.verifyYear(date, endDate)) {
      return true;
    }
    return false;
  }
}

export default SleepTime;
