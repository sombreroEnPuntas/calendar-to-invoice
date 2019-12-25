# calendar-to-invoice

Parse calendars into nicely formatted PDF invoices 🧾

## Use case

Freelancers in Germany need to bill the hours they dedicate to a customer's project via Invoice.  
This tasks are usually already tracked in the form of events in a managed (self, or company) calendar app.

The invoice needs to comply to a set of rules so that it can be used later for official purposes such as tax declarations and bookkeeping.

## Solution

Connect to a calendar app to obtain billable hours, and build monthly PDF Invoices.

## Considerations

- YOU ARE AWARE OF THE REQUIREMENTS AND OBLIGATIONS THAT APPLY ON YOUR CASE  
  (this is not a tax advisor service, and it might be outdated or inaccurate)
- all billable hours are events on a calendar
- calendar is in google calendar
- **WARNING:** setting up credentials to your google account will grant read only access to your calendar.  
   MAKE SURE YOU ARE ALLOWED TO DO THIS, AND TAKE THE NECESSARY PRECAUTIONS  
   (don't share credentials and make sure the data retrieved is not publicly accessible)

## Project

### Usage

1. Checkout project locally, on `PROJECT_PATH` (we'll need this path)
1. Set up the specified data [`here`](src/loadData.ts), as json files on `[PROJECT_PATH]/data/`
1. Go to [google calendar developer guides](https://developers.google.com/calendar/quickstart/nodejs) and login with your account  
   (if it is a manged account, ask to your admin first ;) )
1. Follow instructions to set up calendar API credentials, you'll get a `credentials.json` file
1. Save it on `[PROJECT_PATH]/data/googleClient/credentials.json`
1. Run `yarn dev --billingYear 2019 --billingMonth 12 --invoiceCount 01` to get an invoice

### TODOs

Level 1

- [ ] implement better logs!
- [ ] implement error handling!
- [ ] drop intermediate JSON files? Those are not really needed...

Level 2

- [ ] write a better `google-client` implementation
- [ ] write an `ics` loader (couldn't find nice ones out there)
- [ ] write an `html-to-pdf` module? Using `puppeteer` currently, but does not support all `css` used :'(

Level 3

- [ ] write a `configuration` module to populate data folder and set google credentials
- [ ] write a (friendly) interface 🤖
