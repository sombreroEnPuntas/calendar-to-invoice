// Generated from: https://developers.google.com/calendar/quickstart/nodejs
const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

// USER INPUTS
const INV_PERIOD_START = process.argv[2]
const INV_PERIOD_END = process.argv[3]
const INV_PERIOD_JSON_FILE =
  'out/' + INV_PERIOD_START + '_' + INV_PERIOD_END + '.json'

// GOOGLE AUTH
const CREDENTIALS_PATH = 'data/googleClient/credentials.json'
const TOKEN_PATH = 'data/googleClient/token.json'
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

/**
 * ENTRY POINT
 * 1. Loads credentials from CREDENTIALS_PATH
 * 2. Calls `authorize` to get access to calendar API
 * 3. Use previous access token, or generate a new one with `getAccessToken`
 * 4. `listEvents` saves events to disk
 */
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err)
  authorize(JSON.parse(content), listEvents)
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  )

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    console.log('oAuth2 client credentials set')
    callback(oAuth2Client)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', code => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Lists events on the user's primary calendar.
 * Range: from INV_PERIOD_START to INV_PERIOD_END.
 * Saves output to a json file at INV_PERIOD_JSON_FILE.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth })
  calendar.events.list(
    {
      calendarId: 'primary',
      timeMin: new Date(INV_PERIOD_START).toISOString(),
      timeMax: new Date(INV_PERIOD_END).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      const events = res.data.items
      const lines = {}
      if (events.length) {
        events.map(event => {
          const line = {
            [event.iCalUID]: {
              attendees: event.attendees,
              creator: event.creator,
              description: event.description,
              end: event.end.dateTime,
              htmlLink: event.htmlLink,
              location: event.location,
              organizer: event.organizer,
              recurrence: event.recurrence,
              start: event.start.dateTime,
              status: event.status,
              summary: event.summary,
              type: 'VEVENT',
            },
          }
          Object.assign(lines, line)
        })
        console.log('Found events:', events.length)
        fs.writeFile(
          INV_PERIOD_JSON_FILE,
          JSON.stringify(lines, null, 4),
          err => {
            if (err) return console.error(err)
            console.log('Wrote to file', INV_PERIOD_JSON_FILE)
          },
        )
      } else {
        console.log('No events found.')
      }
    },
  )
}
