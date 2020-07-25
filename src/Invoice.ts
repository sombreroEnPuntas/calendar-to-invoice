// Handlers
import { getDuration, getMonth, getYear } from './timeHandlers'
import { FullCalendar } from './loadFullCalendar'

interface InvoiceLine {
  cost: number
  duration?: number
  title: string
}

interface Invoice {
  billingMonth: string
  billingYear: string
  currency: string
  invoiceCount: string
  invoiceDate: string
  isHourly: boolean
  lines: InvoiceLine[]
  open: boolean
  rate: number
  totalCost: number
  totalHours: number
  uniqueId: string
}
class Invoice {
  constructor(
    billingMonth: string,
    billingYear: string,
    rate: string,
    invoiceCount: string,
    invoiceDate: string,
    isHourly: boolean,
    currency: string,
  ) {
    this.billingMonth = billingMonth
    this.billingYear = billingYear
    this.rate = parseInt(rate)
    this.invoiceCount = invoiceCount
    this.invoiceDate = invoiceDate
    this.isHourly = !!isHourly
    this.lines = []
    this.open = true
    this.totalCost = 0
    this.totalHours = 0
    this.currency = currency

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

    if (this.isHourly) this.totalHours = this.totalHours + line.duration

    this.totalCost = this.totalCost + line.cost
    this.lines.push(line)

    console.log(`Added line #${this.lines.length} to Invoice ${this.uniqueId}.`)
  }

  getLinesFromFullCalendar(fullCalendar: FullCalendar): void {
    Object.keys(fullCalendar).map(key => {
      if (
        fullCalendar[key].type === 'VEVENT' &&
        getMonth(new Date(fullCalendar[key].start)) === this.billingMonth &&
        getYear(new Date(fullCalendar[key].start)) === this.billingYear
      ) {
        const title = fullCalendar[key].summary
        const duration = getDuration(
          new Date(fullCalendar[key].start),
          new Date(fullCalendar[key].end),
        )
        const cost = duration * this.rate

        this.addLine({ cost, duration, title })
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

    this.lines.push({
      cost: this.totalCost,
      ...(this.isHourly && { duration: this.totalHours }),
      title: 'Insgesamt',
    })
    this.open = false

    console.log(`Closed Invoice ${this.uniqueId}.`)
  }
}

export default Invoice
