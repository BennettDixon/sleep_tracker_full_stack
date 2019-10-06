export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDateTime(string) {
  var converted = Date.parse(string);
  return new Date(converted);
}
