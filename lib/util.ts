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

/**
 * Calculates how many days away the given date is.
 * 
 * @param date The date in the future.
 * @param now The current date.
 */
export function getDaysAway(date: DateString, now: DateString): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.ceil((new Date(date).getTime() - new Date(now).getTime()) / MS_PER_DAY);
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
