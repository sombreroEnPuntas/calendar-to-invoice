import fs from 'fs'
import { execFileSync } from 'child_process'

export interface FullCalendar {
  [uid: string]: { end: any; start: any; summary: string; type: string }
}
const googleClientPath = 'googleClient/index.js'
const getFullCalendarFilePath = (
  periodStart: string,
  periodEnd: string,
): string => `out/${periodStart}_${periodEnd}.json`
/**
 * Load fullCalendar data.
 * Pings a google calendar thru a client and saves it as JSON.
 * @return {FullCalendar} A parsed fullCalendar
 */
export const loadFullCalendar = (
  periodStart: string,
  periodEnd: string,
): FullCalendar => {
  execFileSync('node', [googleClientPath, periodStart, periodEnd], {
    stdio: 'inherit',
  })
  console.log(`Downloaded data from google calendar api`)

  const jsonCalendar = fs.readFileSync(
    getFullCalendarFilePath(periodStart, periodEnd),
    'utf8',
  )

  const fullCalendar = JSON.parse(jsonCalendar)

  console.log(`Loaded fullCalendar`)
  return fullCalendar
}
