// Handlers
import { getDuration, getMonth, getYear } from './timeHandlers'
import { FullCalendar } from './loadFullCalendar'

type InvoiceLine = [string, number, number]

interface Invoice {
  billingMonth: string
  billingYear: string
  hourlyRate: number
  invoiceCount: string
  invoiceDate: string
  lines: InvoiceLine[]
  open: boolean
  totalCost: number
  totalHours: number
  uniqueId: string
}
class Invoice {
  constructor(
    billingMonth: string,
    billingYear: string,
    hourlyRate: number,
    invoiceCount: string,
    invoiceDate: string,
  ) {
    this.billingMonth = billingMonth
    this.billingYear = billingYear
    this.hourlyRate = hourlyRate
    this.invoiceCount = invoiceCount
    this.invoiceDate = invoiceDate
    this.lines = []
    this.open = true
    this.totalCost = 0
    this.totalHours = 0

    // Yeah, I know. not really unique :0
    this.uniqueId = `#${billingYear}-${billingMonth}-inv-${invoiceCount}`

    console.log(`Created Invoice ${this.uniqueId}.`)
  }

  addLine(line: InvoiceLine): void {
    if (!this.open) {
      console.log(
        `Can not add line. Invoice ${this.uniqueId} is already closed.`,
      )
      throw new Error(
        `Can not add line. Invoice ${this.uniqueId} is already closed.`,
      )
    }

    this.totalHours = this.totalHours + line[1]
    this.totalCost = this.totalCost + line[2]
    this.lines.push(line)

    console.log(`Added line #${this.lines.length} to Invoice ${this.uniqueId}.`)
  }

  getLinesFromFullCalendar(fullCalendar: FullCalendar): void {
    Object.keys(fullCalendar).map(key => {
      if (
        fullCalendar[key].type === 'VEVENT' &&
        getMonth(fullCalendar[key].start) === this.billingMonth &&
        getYear(fullCalendar[key].start) === this.billingYear
      ) {
        const title = fullCalendar[key].summary
        const duration = getDuration(
          fullCalendar[key].start,
          fullCalendar[key].end,
        )
        const cost = duration * this.hourlyRate

        this.addLine([title, duration, cost])
      }
    })
    console.log(`Parsed FullCalendar events into Invoice lines.`)
  }

  close(): void {
    if (!this.open) {
      console.log(`Can not close. Invoice ${this.uniqueId} is already closed.`)
      throw new Error(
        `Can not close. Invoice ${this.uniqueId} is already closed.`,
      )
    }

    this.lines.push(['Insgesamt', this.totalHours, this.totalCost])
    this.open = false

    console.log(`Closed Invoice ${this.uniqueId}.`)
  }
}

export default Invoice
