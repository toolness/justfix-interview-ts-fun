import React from 'react';
import { Tenant } from '../lib/tenant';
import { WebInterviewIO } from '../lib/web/io';
import { ModalBuilder } from '../lib/web/modal';
import { TenantInterview } from '../lib/tenant-interview';
import { DateString } from '../lib/util';
import { IOCancellationError } from '../lib/interview-io';
import { RecordedAction, RecordableInterviewIO, IoActionType } from '../lib/recordable-io';
import { makeElement } from '../lib/web/util';

interface InterviewState {
  tenant: Tenant;
  recording: RecordedAction[];
}

export interface ICProps {
  modalTemplate: HTMLTemplateElement;
  initialState: InterviewState;
  now: DateString;
  onStateChange?: (state: InterviewState) => void;
  onTitleChange?: (title: string) => void;
}

type ICState = InterviewState;

export class InterviewComponent extends React.Component<ICProps, ICState> {
  div: React.RefObject<HTMLDivElement>;
  innerDiv: HTMLDivElement|null = null;
  io: WebInterviewIO|null = null;
  recordableIo: RecordableInterviewIO|null = null;
  interview: TenantInterview|null = null;

  constructor(props: ICProps) {
    super(props);
    this.state = this.props.initialState;
    this.div = React.createRef();
    this.handleInterviewChange = this.handleInterviewChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBeginRecordingAction = this.handleBeginRecordingAction.bind(this);
  }
  private setupInterview() {
    if (!this.div.current) {
      throw new Error('Assertion failure, expected component to be mounted!');
    }

    this.innerDiv = makeElement('div', { appendTo: this.div.current });
    this.io = new WebInterviewIO(this.innerDiv, new ModalBuilder(this.props.modalTemplate));
    this.io.on('title', this.handleTitleChange);
    this.recordableIo = new RecordableInterviewIO(this.io, this.props.initialState.recording);
    this.recordableIo.on('begin-recording-action', this.handleBeginRecordingAction);
    this.interview = new TenantInterview({
      io: this.recordableIo,
      now: new Date(this.props.now)
    });
    this.interview.on('change', this.handleInterviewChange);
    this.interview.execute(this.props.initialState.tenant).catch(err => {
      if (err instanceof IOCancellationError && !this.div.current) {
        // The interview was waiting for some kind of user input or timeout
        // but this component has since been unmounted, so this exception is to
        // be expected.
        return;
      }
      throw err;
    });
  }
  private teardownInterview() {
    if (this.io) {
      this.io.off('title', this.handleTitleChange);
      this.io.close();
      this.io = null;
    }
    if (this.recordableIo) {
      this.recordableIo.off('begin-recording-action', this.handleBeginRecordingAction);
      this.recordableIo = null;
    }
    if (this.interview) {
      this.interview.off('change', this.handleInterviewChange);
      this.interview = null;
    }
    if (this.innerDiv && this.div.current) {
      this.div.current.removeChild(this.innerDiv);
      this.innerDiv = null;
    }
  }
  handleBeginRecordingAction(type: IoActionType) {
    if (type === 'ask' || type === 'askMany' || type === 'notify') {
      if (!this.recordableIo) {
        throw new Error('Assertion failure!');
      }
      const recording = this.recordableIo.getRecording();
      if (recording.length > this.state.recording.length) {
        this.setState({ recording });
      }
    }
  }
  handleTitleChange(title: string) {
    if (this.props.onTitleChange) {
      this.props.onTitleChange(title);
    }
  }
  handleInterviewChange(_: Tenant, tenant: Tenant) {
    if (!this.recordableIo) {
      throw new Error('Assertion failure!');
    }

    this.setState({
      tenant,
      recording: this.recordableIo.resetRecording()
    });
  }
  componentDidUpdate(prevProps: ICProps, prevState: ICState) {
    if ((this.props.initialState !== prevProps.initialState) ||
        (new Date(this.props.now).getTime() !== new Date(prevProps.now).getTime())) {
      this.teardownInterview();
      this.setupInterview();
    }
    if (this.props.onStateChange) {
      if ((this.state.recording !== prevState.recording) ||
          (this.state.tenant !== prevState.tenant)) {
        this.props.onStateChange(this.state);
      }
    }
  }
  componentDidMount() {
    this.setupInterview();
  }
  componentWillUnmount() {
    this.teardownInterview();
  }
  render() {
    return <div ref={this.div}></div>;
  }
}
