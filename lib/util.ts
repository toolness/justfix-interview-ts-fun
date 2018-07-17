/**
 * A string that represents a date in ISO format, *or* a native Date (which is converted to
 * an ISO string upon JSON serialization).
 */
export type DateString = Date|string;

/** A photo is just a URL to an image. */
export type Photo = string;

// https://stackoverflow.com/a/3674550/2422398
export function addDays(date: DateString, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
