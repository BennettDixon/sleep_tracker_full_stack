import { getDateTime } from "../constants/utils";

class SleepTime {
  constructor(id, startStr, stopStr) {
    this.id = id;
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

  /**
   * gets a short date string for display
   * @param {*} date date to get short date from
   */
  static getShortDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    return month + "-" + day;
  }

  /**
   * Gets date range text for display from array, or just singular
   *
   * @param {*} sleepTimes SleepTime array to get range from, or singular sleep time
   */
  static getDateRangeText(sleepTimes) {
    if (sleepTimes.length === undefined) {
      // not an array, render singular object
      return "(" + SleepTime.getShortDate(sleepTimes.start) + ")";
    } else {
      console.log(sleepTimes);
      const genStr =
        "(" +
        SleepTime.getShortDate(sleepTimes[0].start) +
        "..." +
        SleepTime.getShortDate(sleepTimes[sleepTimes.length - 1].start) +
        ")";
      console.log(genStr);
      return genStr;
    }
  }

  static sortByTime = (a, b) => {
    if (a.start === b.start) {
      return 0;
    } else if (a.start < b.start) {
      // if date a is before date b it should come first
      return -1;
    }
    // a > b
    return 1;
  };

  static getSmallTimeStr(dateTime, militaryTime) {
    const strParse = dateTime.toTimeString().split(":");

    // convert to AM/PM or leave as military time
    var hours = parseInt(strParse[0]);
    var amPm = "";
    if (hours > 12 && !militaryTime) {
      hours = hours - 12;
      amPm = "PM";
    } else if (!militaryTime) {
      amPm = "AM";
    }
    return hours + ":" + strParse[1] + " " + amPm;
  }

  static getHoursSlept(totalMinutesSlept) {
    return Math.floor(totalMinutesSlept / 60);
  }

  static getMinutesSlept(totalMinutes, roundedHours) {
    return Math.round(totalMinutes - roundedHours * 60);
  }

  static verifyDay(date, validationDate) {
    var endDay = validationDate.getDate();
    var instanceDay = date.getDate();
    return endDay === instanceDay ? true : false;
  }

  static verifyYear(date, validationDate) {
    var endYear = validationDate.getFullYear();
    var instanceYear = date.getFullYear();
    return instanceYear === endYear ? true : false;
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
