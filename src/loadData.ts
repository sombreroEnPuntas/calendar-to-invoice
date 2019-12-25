import fs from 'fs'

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

export const loadData = (): Data => {
  const data = {}
  ;['bankData', 'contactData', 'customerData', 'personalData', 'taxData'].map(
    entity => {
      const file = fs.readFileSync(`data/${entity}.json`, 'utf8')

      data[entity] = JSON.parse(file)
    },
  )

  return data as Data
}
