import Handlebars from 'handlebars'
import Puppeteer from 'puppeteer'
import fs from 'fs'

// Modules
import Invoice from './Invoice'
import { loadData } from './loadData'

const invoiceTemplateFilePath = `src/templates/invoice.html`

const getOutputPDFFilePath = (uniqueId: string, shortName: string): string =>
  `out/Invoice ${uniqueId} - ${shortName}.pdf`
const getOutputHTMLFilePath = (uniqueId: string, shortName: string): string =>
  `out/Invoice ${uniqueId} - ${shortName}.html`

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
  isHourly,
  currency,
}: Invoice): Promise<void> => {
  console.log(`Preparing Invoice ${uniqueId} to be exported as PDF...`)

  const data = {
    ...loadData(),
    billingMonth,
    billingYear,
    invoiceDate,
    lines,
    uniqueId,
    currency,
    isHourly,
  }
  console.log(`Data loaded successfully.`)

  const file = fs.readFileSync(invoiceTemplateFilePath, 'utf8')
  const template = Handlebars.compile(file)
  const html = template(data)
  console.log(`Template ${invoiceTemplateFilePath} parsed successfully.`)

  fs.writeFileSync(
    getOutputHTMLFilePath(uniqueId, data.personalData.shortName),
    html,
  )
  console.log(
    `Exported Invoice ${uniqueId} as ${getOutputHTMLFilePath(
      uniqueId,
      data.personalData.shortName,
    )}.`,
  )

  const browser = await Puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(html)
  await page.emulateMedia('screen')
  await page.pdf({
    path: getOutputPDFFilePath(uniqueId, data.personalData.shortName),
    preferCSSPageSize: true,
  })

  await browser.close()
  console.log(
    `Exported Invoice ${uniqueId} as ${getOutputPDFFilePath(
      uniqueId,
      data.personalData.shortName,
    )}.`,
  )
}
