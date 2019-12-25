// Handlers
import { getDate, getFutureDate } from './timeHandlers'
import { loadFullCalendar } from './loadFullCalendar'
import { writeInvoiceToPDF } from './writeInvoiceToPDF'

// Modules
import Invoice from './Invoice'

interface UserInputs {
  billingMonth: string
  billingYear: string
  hourlyRate: number
  invoiceCount: string
  invoiceDate: string
}

const app = ({
  billingMonth,
  billingYear,
  hourlyRate,
  invoiceCount,
  invoiceDate,
}: UserInputs): void => {
  const NovemberInvoice = new Invoice(
    billingMonth,
    billingYear,
    hourlyRate,
    invoiceCount,
    invoiceDate,
  )

  const billingPeriodStart = getDate(new Date(`${billingYear}-${billingMonth}`))
  const billingPeriodEnd = getFutureDate(
    new Date(`${billingYear}-${billingMonth}`),
    1,
    'month',
  )

  const fullCalendar = loadFullCalendar(billingPeriodStart, billingPeriodEnd)

  NovemberInvoice.getLinesFromFullCalendar(fullCalendar)

  NovemberInvoice.close()

  writeInvoiceToPDF(NovemberInvoice)
}

const userInputs: UserInputs = require('yargs')
  .parserConfiguration({
    'parse-numbers': false,
  })
  .usage(
    'Usage: --billingMonth [MM] --billingYear [YYYY] --hourlyRate [number] --invoiceCount [number] --invoiceDate [YYYY-MM-DD]',
  )
  .default({
    hourlyRate: 65,
    invoiceDate: getDate(new Date()),
  })
  .demandOption([
    'billingMonth',
    'billingYear',
    'hourlyRate',
    'invoiceCount',
    'invoiceDate',
  ]).argv

app(userInputs)
