import minimist from 'minimist';
import chalk from 'chalk';

import { addDays } from '../lib/util';
import { Tenant } from '../lib/tenant';
import { TenantInterview } from '../lib/tenant-interview';
import { TextInterviewIO, RecordableTextIO, ConsoleIO, TextIOAction } from '../lib/console/readline-io';
import { FileSerializer } from '../lib/console/serializer';
import { RecordableInterviewIO, IoActionType } from '../lib/recordable-io';
import { Recorder, RecordedAction } from '../lib/recorder';

interface SerializableConsoleAppState {
  /**
   * Input that has been entered so far at a fairly high level,
   * before a formal interview state change has occurred.
   * 
   * This can be used to replay the interview at a later time, to
   * get back to the place the user was at when they were last
   * using the app.
   */
  recording: RecordedAction<IoActionType>[];
  /**
   * Input that has been entered at the most granular level, e.g.
   * as part of a set of questions that would be answered in a
   * single form on the web version of the interview.
   * 
   * This can be used to replay the interview at a later time, to
   * get back to the place the user was at when they were last
   * using the app.
   */
  textRecording: RecordedAction<TextIOAction>[];
  /** The state of the interview. */
  tenant: Tenant
}

const SCRIPT = process.argv[1];

const STATE_FILE = '.tenant-interview-state.json';

const INITIAL_STATE: SerializableConsoleAppState = {
  recording: [],
  textRecording: [],
  tenant: {
    todos: {
      // Initiate to-dos automatically, since we don't currently
      // provide any UI for the user to do it themselves.
      rentalHistory: 'initiated'
    }
  }
};

const HELP_TEXT = `
Usage:

  ${SCRIPT} [arguments]

Arguments:

  --days=DAYS    Set the current date to DAYS days from now.
  --help         Show this help text.

The current interview state is stored in "${STATE_FILE}".
You can edit or delete this to change the state of the interview.
`.trim();

function log(msg: string) {
  console.log(chalk.gray(msg));
}

if (!module.parent) {
  const argv = minimist(process.argv.slice(2));
  let now = new Date();

  if (argv.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (!isNaN(parseInt(argv.days))) {
    now = addDays(now, parseInt(argv.days));
  }

  const serializer = new FileSerializer(STATE_FILE, INITIAL_STATE);

  const recordableTextIo = new RecordableTextIO(
    new ConsoleIO(),
    new Recorder(serializer.get().textRecording)
  );
  recordableTextIo.recorder.on('begin-recording-action', action => {
    serializer.set({
      ...serializer.get(),
      textRecording: recordableTextIo.recorder.getRecording(),
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
  interview.on('change', (_, tenant) => {
    log(`Interview state changed. Writing state to ${STATE_FILE}...`);
    serializer.set({
      ...serializer.get(),
      textRecording: recordableTextIo.recorder.resetRecording(),
      recording: recordableIo.recorder.resetRecording(),
      tenant
    });
  });

  interview.execute(serializer.get().tenant).then(tenant => {
    log(`Interview complete. Final state is in ${STATE_FILE}.`);
    io.close();
  }).catch((e: any) => {
    log(e);
    process.exit(1);
  });
}
