import minimist from 'minimist';
import dotenv from 'dotenv';
import { processMessage, SmsAppState } from './process-message';
import { Storage, FileStorage } from '../lib/sms/storage';

const DOTENV_FILE = '.env';

dotenv.config({ path: DOTENV_FILE });

const DEFAULT_PORT = '8081';

const PORT = parseInt(process.env['PORT'] || DEFAULT_PORT);

const SCRIPT = process.argv[1];

const STATE_FILE = '.sms-app-state.json';

const DEFAULT_SIMULATE_NUMBER = '+5551234567';

const MONGODB_URL = process.env['MONGODB_URL'];

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

Environment variables:

  MONGODB_URL    A MongoDB URL to use for storage (instead of the
                 filesystem).
  PORT           The port to run the webhook server on. Defaults to
                 ${DEFAULT_PORT}.

Environment variables can also be placed in "${DOTENV_FILE}".

By default, the current interview states are stored in "${STATE_FILE}".
You can edit or delete this to change the state of the interviews.
`.trim();

function showHelp() {
  console.log(HELP_TEXT);
}

async function getStorage(): Promise<Storage<SmsAppState>> {
  if (MONGODB_URL) {
    console.log('Using MongoDB storage backend.');
    const { MongoStorage } = await import('../lib/sms/storage-mongodb');
    return new MongoStorage(MONGODB_URL, 'interview-fun-sms-app-states', 'phoneNumber');
  }
  return new FileStorage(STATE_FILE);
}


async function simulate(body: string, argv: minimist.ParsedArgs): Promise<number> {
  if (!body.trim()) {
    console.log('Please provide a message body.');
    return 1;
  }
  const storage = await getStorage();
  const twiml = await processMessage({
    From: (argv.from as string || DEFAULT_SIMULATE_NUMBER),
    Body: body
  }, storage);
  await storage.close();
  console.log(twiml.toString());

  return 0;
}

async function serve(): Promise<void> {
  const { runServer } = await import('./server');
  const storage = await getStorage();

  runServer(PORT, storage);
}

function handleError(e: Error) {
  console.log(e.stack);
  process.exit(1);
}

if (!module.parent) {
  const argv = minimist(process.argv.slice(2));
  const cmd = argv._[0];
  if (argv.h || argv.help) {
    showHelp();
  } else if (cmd === 'simulate') {
    const body = argv._.slice(1).join(' ');
    simulate(body, argv).then(process.exit).catch(handleError);
  } else if (cmd === 'serve') {
    serve().catch(handleError);
  } else {
    if (cmd) {
      console.log(`Invalid command "${cmd}".`);
    }
    showHelp();
    process.exit(1);
  }
}
