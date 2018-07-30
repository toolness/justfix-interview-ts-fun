import * as twilio from 'twilio';
import { Tenant } from '../lib/tenant';
import { TextIOAction, TextInterviewIO, RecordableTextIO } from '../lib/console/readline-io';
import { RecordedAction, Recorder } from '../lib/recorder';
import { IoActionType, RecordableInterviewIO } from '../lib/recordable-io';
import { FileSerializer } from '../lib/console/serializer';
import { TenantInterview } from '../lib/tenant-interview';
import { SmsIOAction, SmsIO, SmsIsAwaitingAnswerError } from '../lib/sms/sms-io';
import { SmsPostBody } from '../lib/sms/post-body';

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

export async function processMessage(msg: SmsPostBody): Promise<twilio.TwimlResponse> {
  let text: string|null = msg.MediaUrl0 ? msg.MediaUrl0 : msg.Body;
  const twiml = new twilio.TwimlResponse();
  const serializer = new FileSerializer(`.sms${msg.From}.json`, createInitialState(msg.From));
  let state = serializer.get();

  function setState(updates: Partial<SmsAppState>) {
    state = { ...state, ...updates };
  }

  if (text === 'reset' && state.status === 'started') {
    setState(serializer.defaultState);
  }

  if (state.status === 'uninitialized') {
    twiml.message('Welcome to JustFix interview fun!');
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

  const io = new TextInterviewIO(recordableTextIo);
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

  serializer.set(state);

  return twiml;
}
