export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDateTime(string) {
  const newDate = new Date(string);
  return newDate;
}
