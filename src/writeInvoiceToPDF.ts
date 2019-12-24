import Handlebars from 'handlebars'
import Puppeteer from 'puppeteer'
import fs from 'fs'

// Modules
import Invoice from './Invoice'

interface BankData {
  bankName: string
  bic: string
  iban: string
}
interface ContactData {
  email: string
  tel: string
}
interface CustomerData {
  addressLine1: string
  addressLine2: string
  name: string
  organization: string
}
interface PersonalData {
  addressLine1: string
  addressLine2: string
  name: string
  shortName: string
}
interface TaxData {
  taxId: string
  vatId: string
}
interface Data {
  bankData: BankData
  contactData: ContactData
  customerData: CustomerData
  personalData: PersonalData
  taxData: TaxData
}

const loadData = (): Data => {
  const data = {}
  ;['bankData', 'contactData', 'customerData', 'personalData', 'taxData'].map(
    entity => {
      const file = fs.readFileSync(`data/${entity}.json`, 'utf8')

      data[entity] = JSON.parse(file)
    },
  )

  return data as Data
}
const invoiceTemplateFilePath = `src/templates/invoice.html`
const getOutputPDFFilePath = (uniqueId: string, shortName: string): string =>
  `out/Invoice ${uniqueId} - ${shortName}.pdf`
/**
 * Write an Invoice in PDF format
 * @param {Invoice} invoice - Invoice to be exported
 */
export const writeInvoiceToPDF = async ({
  billingMonth,
  billingYear,
  invoiceDate,
  lines,
  uniqueId,
}: Invoice): Promise<void> => {
  console.log(`Preparing Invoice ${uniqueId} to be exported as PDF...`)

  const data = {
    ...loadData(),
    billingMonth,
    billingYear,
    invoiceDate,
    lines,
    uniqueId,
  }
  console.log(`Data loaded successfully.`)

  const file = fs.readFileSync(invoiceTemplateFilePath, 'utf8')
  const template = Handlebars.compile(file)
  const html = template(data)
  console.log(`Template ${invoiceTemplateFilePath} parsed successfully.`)

  const browser = await Puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(html)
  await page.emulateMedia('screen')
  await page.pdf({
    path: getOutputPDFFilePath(uniqueId, data.personalData.shortName),
  })

  await browser.close()
  console.log(
    `Exported Invoice ${uniqueId} as ${getOutputPDFFilePath(
      uniqueId,
      data.personalData.shortName,
    )}.`,
  )
}
