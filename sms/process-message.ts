import { Tenant } from '../lib/tenant';
import { TextIOAction, TextInterviewIO, RecordableTextIO } from '../lib/console/readline-io';
import { RecordedAction, Recorder } from '../lib/recorder';
import { IoActionType, RecordableInterviewIO } from '../lib/recordable-io';
import { TenantInterview } from '../lib/tenant-interview';
import { SmsIOAction, SmsIO, SmsIsAwaitingAnswerError } from '../lib/sms/sms-io';
import { SmsPostBody } from '../lib/sms/post-body';
import { Storage } from '../lib/sms/storage';
import SimpleTwimlResponse from '../lib/sms/simple-twiml-response';

const RESET_CMD = "reset";

export interface SmsAppState {
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

class SmsInterviewIO extends TextInterviewIO {
  /** 
   * Sleeping when processing text messages is not allowed, especially
   * since we may be running in a serverless environment, in which
   * case we don't want to unnecessarily spend compute cycles.
   */
  async sleep(ms: number): Promise<void> {
  }
}

export async function processMessage(msg: SmsPostBody, storage: Storage<SmsAppState>): Promise<SimpleTwimlResponse> {
  let text: string|null = msg.MediaUrl0 ? msg.MediaUrl0 : msg.Body;
  const twiml = new SimpleTwimlResponse();
  let state = (await storage.get(msg.From)) || createInitialState(msg.From);

  function setState(updates: Partial<SmsAppState>) {
    state = { ...state, ...updates };
  }

  if (text === RESET_CMD && state.status === 'started') {
    setState(createInitialState(msg.From));
  }

  if (state.status === 'uninitialized') {
    twiml.message(
      `Welcome to JustFix interview fun! Text "${RESET_CMD}" ` +
      `at any time to reset this interview.`
    );
    text = null;
    setState({ status: 'started' });
  }

  const now = new Date();
  const smsIo = new SmsIO(twiml, new Recorder(state.askedRecording), text);
  smsIo.recorder.on('end-recording-action', action => {
    setState({ askedRecording: smsIo.recorder.getRecording() });
  });

  const recordableTextIo = new RecordableTextIO(
    smsIo,
    new Recorder(state.textRecording)
  );
  recordableTextIo.recorder.on('begin-recording-action', action => {
    setState({ textRecording: recordableTextIo.recorder.getRecording() });
  });
  recordableTextIo.recorder.on('end-recording-action', action => {
    setState({ askedRecording: smsIo.recorder.resetRecording() });
  });

  const io = new SmsInterviewIO(recordableTextIo);
  const recordableIo = new RecordableInterviewIO(io, state.recording);
  recordableIo.recorder.on('begin-recording-action', action => {
    setState({ recording: recordableIo.recorder.getRecording() });
  });
  recordableIo.recorder.on('end-recording-action', action => {
    setState({ textRecording: recordableTextIo.recorder.resetRecording() });
  });

  const interview = new TenantInterview({ io: recordableIo, now });
  interview.on('change', (_, tenant: Tenant) => {
    setState({
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

  await storage.set(msg.From, state);

  return twiml;
}
