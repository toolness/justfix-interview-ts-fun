import * as http from 'http';
import minimist from 'minimist';
import express from 'express';
import bodyParser from 'body-parser';
import { SmsPostBody } from '../lib/sms/post-body';
import { processMessage, SmsAppState } from './process-message';
import { Storage, FileStorage } from '../lib/sms/storage';

const PORT = parseInt(process.env['PORT'] || '8081');

const SCRIPT = process.argv[1];

const STATE_FILE = '.sms-app-state.json';

const DEFAULT_SIMULATE_NUMBER = '+5551234567';

const HELP_TEXT = `
Usage:

  ${SCRIPT} serve

  ${SCRIPT} simulate <message>

Commands:

  serve          Serve the Twilio webhook app to respond to SMS messages.
  simulate       Simulate the sending of an SMS message.

'simulate' command arguments:

  --from=NUM     The phone number to simulate sending from. Defaults to
                 ${DEFAULT_SIMULATE_NUMBER}.

Global arguments:

  --help         Show this help text.

The current interview states are stored in "${STATE_FILE}".
You can edit or delete this to change the state of the interviews.
`.trim();

function showHelp() {
  console.log(HELP_TEXT);
}

function getStorage(): Storage<SmsAppState> {
  return new FileStorage(STATE_FILE);
}

function createApp(): express.Application {
  const app = express();

  app.post('/sms', bodyParser.urlencoded({ extended: true }), async (req, res) => {
    // TODO: Verify that the POST is actually coming from Twilio.
    const twiml = await processMessage(req.body as SmsPostBody, getStorage());
  
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });
  
  return app;
}

async function simulate(argv: minimist.ParsedArgs) {
  if (argv._.length === 0) {
    console.log('Please provide a message body.');
    process.exit(1);
  }
  const twiml = await processMessage({
    From: (argv.from as string || DEFAULT_SIMULATE_NUMBER),
    Body: argv._.join(' ')
  }, getStorage());
  console.log(twiml.toString());
}

if (!module.parent) {
  const argv = minimist(process.argv.slice(2));
  if (argv.h || argv.help) {
    showHelp();
  } else if (argv._[0] === 'simulate') {
    simulate({ ...argv, _: argv._.slice(1) });
  } else if (argv._[0] === 'serve') {
    http.createServer(createApp()).listen(PORT, () => {
      console.log(`Express server listening on port ${PORT}.`);
    });
  } else {
    showHelp();
    process.exit(1);
  }
}
