import * as http from 'http';
import express from 'express';
import * as twilio from 'twilio';

const PORT = parseInt(process.env['PORT'] || '8081');

const app = express();

app.post('/sms', (req, res) => {
  // TODO: Verify that the POST is actually coming from Twilio.
  const twiml = new twilio.TwimlResponse();
  twiml.message('um hello there i suppose?!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
