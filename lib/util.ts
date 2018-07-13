// https://stackoverflow.com/a/3674550/2422398
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
}
