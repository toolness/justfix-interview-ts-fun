import * as http from 'http';
import minimist from 'minimist';
import express from 'express';
import bodyParser from 'body-parser';
import * as twilio from 'twilio';
import { Tenant } from '../lib/tenant';
import { TextIOAction, TextInterviewIO, RecordableTextIO } from '../lib/console/readline-io';
import { RecordedAction, Recorder } from '../lib/recorder';
import { IoActionType, RecordableInterviewIO } from '../lib/recordable-io';
import { FileSerializer } from '../lib/console/serializer';
import { TenantInterview } from '../lib/tenant-interview';
import { SmsPostBody } from '../lib/sms/post-body';
import { SmsIOAction, SmsIO, SmsIsAwaitingAnswerError } from '../lib/sms/sms-io';

const PORT = parseInt(process.env['PORT'] || '8081');

const SCRIPT = process.argv[1];

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

The current interview state is stored in ".sms+PHONENUMBER.json", where
PHONENUMBER is the phone number of the sender.
You can edit or delete this to change the state of the interview.
`.trim();

const app = express();

interface SmsAppState {
  phoneNumber: string;
  status: 'uninitialized'|'started';
  recording: RecordedAction<IoActionType>[];
  textRecording: RecordedAction<TextIOAction>[];
  askedRecording: RecordedAction<SmsIOAction>[];
  tenant: Tenant;
}

function createInitialState(phoneNumber: string): SmsAppState {
  return {
    phoneNumber,
    status: 'uninitialized',
    recording: [],
    textRecording: [],
    askedRecording: [],
    tenant: {
      phoneNumber,
      todos: {
        // Initiate to-dos automatically, since we don't currently
        // provide any UI for the user to do it themselves.
        rentalHistory: 'initiated'
      }
    }
  };
};


async function processMessage(msg: SmsPostBody): Promise<twilio.TwimlResponse> {
  let text: string|null = msg.MediaUrl0 ? msg.MediaUrl0 : msg.Body;
  const twiml = new twilio.TwimlResponse();
  const serializer = new FileSerializer(`.sms${msg.From}.json`, createInitialState(msg.From));
  let state = serializer.get();

  if (text === 'reset' && state.status === 'started') {
    serializer.set(serializer.defaultState);
    state = serializer.get();
  }

  if (state.status === 'uninitialized') {
    twiml.message('Welcome to JustFix interview fun!');
    text = null;
    serializer.set({ ...state, status: 'started' });
    state = serializer.get();
  }

  const now = new Date();
  const smsIo = new SmsIO(twiml, new Recorder(serializer.get().askedRecording), text);
  smsIo.recorder.on('end-recording-action', action => {
    serializer.set({
      ...serializer.get(),
      askedRecording: smsIo.recorder.getRecording()
    });
  });

  const recordableTextIo = new RecordableTextIO(
    smsIo,
    new Recorder(serializer.get().textRecording)
  );
  recordableTextIo.recorder.on('begin-recording-action', action => {
    serializer.set({
      ...serializer.get(),
      textRecording: recordableTextIo.recorder.getRecording(),
    });
  });
  recordableTextIo.recorder.on('end-recording-action', action => {
    serializer.set({
      ...serializer.get(),
      askedRecording: smsIo.recorder.resetRecording(),
    });
  });

  const io = new TextInterviewIO(recordableTextIo);
  const recordableIo = new RecordableInterviewIO(io, serializer.get().recording);
  recordableIo.recorder.on('begin-recording-action', action => {
    serializer.set({
      ...serializer.get(),
      recording: recordableIo.recorder.getRecording(),
    });
  });
  recordableIo.recorder.on('end-recording-action', action => {
    serializer.set({
      ...serializer.get(),
      textRecording: recordableTextIo.recorder.resetRecording(),
    });
  });

  const interview = new TenantInterview({ io: recordableIo, now });
  interview.on('change', (_, tenant: Tenant) => {
    serializer.set({
      ...serializer.get(),
      askedRecording: smsIo.recorder.resetRecording(),
      textRecording: recordableTextIo.recorder.resetRecording(),
      recording: recordableIo.recorder.resetRecording(),
      tenant
    });
  });

  try {
    await interview.execute(state.tenant);
    twiml.message("We don't have any more questions for you right now.");
  } catch (e) {
    if (e instanceof SmsIsAwaitingAnswerError) {
    } else {
      throw e;
    }
  }

  return twiml;
}

function showHelp() {
  console.log(HELP_TEXT);
}

app.post('/sms', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  // TODO: Verify that the POST is actually coming from Twilio.
  const twiml = await processMessage(req.body as SmsPostBody);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

async function simulate(argv: minimist.ParsedArgs) {
  if (argv._.length === 0) {
    console.log('Please provide a message body.');
    process.exit(1);
  }
  const twiml = await processMessage({
    From: (argv.from as string || DEFAULT_SIMULATE_NUMBER),
    Body: argv._.join(' ')
  });
  console.log(twiml.toString());
}

if (!module.parent) {
  const argv = minimist(process.argv.slice(2));
  if (argv.h || argv.help) {
    showHelp();
  } else if (argv._[0] === 'simulate') {
    simulate({ ...argv, _: argv._.slice(1) });
  } else if (argv._[0] === 'serve') {
    http.createServer(app).listen(PORT, () => {
      console.log(`Express server listening on port ${PORT}.`);
    });
  } else {
    showHelp();
    process.exit(1);
  }
}
