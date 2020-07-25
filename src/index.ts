// Handlers
import { getDate, getFutureDate } from './timeHandlers'
import { loadFullCalendar } from './loadFullCalendar'
import { writeInvoiceToPDF } from './writeInvoiceToPDF'

// Modules
import Invoice from './Invoice'
import { loadData } from './loadData'

interface UserInputs {
  billingMonth: string
  billingYear: string
  currency: string
  invoiceCount: string
  invoiceDate: string
  isHourly: boolean
  rate: string
}

const app = ({
  billingMonth,
  billingYear,
  currency,
  invoiceCount,
  invoiceDate,
  isHourly,
  rate,
}: UserInputs): void => {
  const CurrentInvoice = new Invoice(
    billingMonth,
    billingYear,
    rate,
    invoiceCount,
    invoiceDate,
    isHourly,
    currency,
  )

  if (isHourly) {
    const billingPeriodStart = getDate(
      new Date(`${billingYear}-${billingMonth}`),
    )
    const billingPeriodEnd = getFutureDate(
      new Date(`${billingYear}-${billingMonth}`),
      1,
      'month',
    )

    const fullCalendar = loadFullCalendar(billingPeriodStart, billingPeriodEnd)

    CurrentInvoice.getLinesFromFullCalendar(fullCalendar)
  } else {
    const title = loadData(['personalData']).personalData.professionDescription

    CurrentInvoice.addLine({
      cost: parseInt(rate),
      title,
    })
  }

  CurrentInvoice.close()

  writeInvoiceToPDF(CurrentInvoice)
}

const userInputs: UserInputs = require('yargs')
  .parserConfiguration({
    'parse-numbers': false,
  })
  .usage(
    'Usage: --billingMonth [MM] --billingYear [YYYY] --rate [number] --invoiceCount [number] --invoiceDate [YYYY-MM-DD] --isHourly [boolean] --currency [string]',
  )
  .default({
    invoiceDate: getDate(new Date()),
    currency: 'EUR',
  })
  .demandOption([
    'billingMonth',
    'billingYear',
    'rate',
    'invoiceCount',
    'invoiceDate',
  ]).argv

app(userInputs)
