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
- calendar is in ics format

## Project

### TODOs

Level 1

- [ ] implement better logs!
- [ ] implement error handling!

Level 2

- [ ] write a better `google-client` implementation, that saves to ics
- [ ] write an `ics` loader
- [ ] write an `html-to-pdf` module?

Level 3

- [ ] write an interface 🤖
- [ ] write a `configuration` module to populate data folder and set google credentials
