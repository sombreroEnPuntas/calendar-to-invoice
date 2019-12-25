import Handlebars from 'handlebars'
import Puppeteer from 'puppeteer'
import fs from 'fs'

// Modules
import Invoice from './Invoice'
import { loadData } from './loadData'

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
