import fs from 'fs'

interface PaymentData {
  eur: {
    bankName: string
    bic: string
    iban: string
  }
  paypal: string
  usd: {
    accountNumber: string
    bic: string
    routingNumber: string
    wireTransferNumber: string
  }
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
  professionDescription: string
  professionTitle: string
  shortName: string
}
interface TaxData {
  taxId: string
  vatId: string
}
interface Data {
  contactData: ContactData
  customerData: CustomerData
  paymentData: PaymentData
  personalData: PersonalData
  taxData: TaxData
}

export const loadData = (
  fileList = [
    'contactData',
    'customerData',
    'paymentData',
    'personalData',
    'taxData',
  ],
): Data => {
  const data = {}

  fileList.map(entity => {
    const file = fs.readFileSync(`data/${entity}.json`, 'utf8')

    data[entity] = JSON.parse(file)
  })

  return data as Data
}
