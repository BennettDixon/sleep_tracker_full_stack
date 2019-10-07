export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDateTime(string) {
  var dateTimeZone = string.split("+");
  var dateTime = dateTimeZone[0];
  var timeZone = dateTimeZone[1];
  const newDate = new Date(dateTime);
  return newDate;
}
