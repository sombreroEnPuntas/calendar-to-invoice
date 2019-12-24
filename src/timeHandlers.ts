import moment from 'moment'

/**
 * Returns the Month in MM format of a given timestamp
 * @param timeStamp Date containing a time stamp
 */
export const getMonth = (timeStamp: Date): string =>
  moment(timeStamp).format('MM')

/**
 * Returns the year in YYYY format of a given timestamp
 * @param timeStamp Date containing a time stamp
 */
export const getYear = (timeStamp: Date): string =>
  moment(timeStamp).format('YYYY')

/**
 * Returns the year in YYYY-MM-DD format of a given timestamp
 * @param timeStamp Date containing a time stamp, default to today
 */
export const getDate = (timeStamp: Date = new Date()): string =>
  moment(timeStamp).format('YYYY-MM-DD')

/**
 * Returns delta in hours of a given time interval
 * @param startTimeStamp Date start timestamp
 * @param endTimeStamp Date end timestamp
 */
export const getDuration = (startTimeStamp: Date, endTimeStamp: Date): number =>
  moment.duration(moment(endTimeStamp).diff(moment(startTimeStamp))).asHours()

/**
 * Returns the year in YYYY-MM-DD format of a given timestamp
 * @param timeStamp Date containing a time stamp, default to today
 */
export const getFutureDate = (
  timeStamp: Date = new Date(),
  amount: number,
  unit: moment.unitOfTime.DurationConstructor,
): string =>
  moment(timeStamp)
    .add(amount, unit)
    .format('YYYY-MM-DD')
