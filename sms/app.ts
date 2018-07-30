import * as http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import * as twilio from 'twilio';

const PORT = parseInt(process.env['PORT'] || '8081');

const app = express();

interface SmsPostBody {
  ToCountry: string,          // e.g. 'US'
  ToState: string,            // e.g. 'NY'
  SmsMessageSid: string,
  NumMedia: string,           // e.g. '0'
  ToCity: string,             // e.g. 'BROOKLYN'
  FromZip: string,            // e.g. '94107'
  SmsSid: string,
  FromState: string,          // e.g. 'CA'
  SmsStatus: string,          // e.g. 'received'
  FromCity: string,           // e.g. 'SAN FRANCISCO'
  Body: string,               // e.g. 'hello'
  FromCountry: string,        // e.g. 'US'
  To: string,                 // e.g. '+17181234567'
  ToZip: string,              // e.g. '11418'
  NumSegments: string,        // e.g. '1'
  MessageSid: string,
  AccountSid: string,
  From: string,               // e.g. '+14151234567'
  ApiVersion: string,         // e.g. '2010-04-01'
}

app.post('/sms', bodyParser.urlencoded({ extended: true }), (req, res) => {
  // TODO: Verify that the POST is actually coming from Twilio.
  const body = req.body as SmsPostBody;
  const twiml = new twilio.TwimlResponse();
  twiml.message(`Well "${body.Body}" right back atcha, ${body.From}!`);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});

