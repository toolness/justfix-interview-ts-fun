import * as http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import { processMessage, SmsAppState } from './process-message';
import { Storage } from '../lib/sms/storage';
import { SmsPostBody } from '../lib/sms/post-body';

function createApp(storage: Storage<SmsAppState>): express.Application {
  const app = express();

  app.post('/sms', bodyParser.urlencoded({ extended: true }), async (req, res) => {
    // TODO: Verify that the POST is actually coming from Twilio.
    const twiml = await processMessage(req.body as SmsPostBody, storage);

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });
  
  return app;
}

export function runServer(port: number, storage: Storage<SmsAppState>) {
  http.createServer(createApp(storage)).listen(port, () => {
    console.log(`Express server listening on port ${port}.`);
  });
}
