import React from 'react';
import { Tenant } from '../lib/tenant';
import { WebInterviewIO } from '../lib/web/io';
import { ModalBuilder } from '../lib/web/modal';
import { DateString } from '../lib/util';
import { IOCancellationError } from '../lib/interview-io';
import { RecordedAction, RecordableInterviewIO, IoActionType } from '../lib/recordable-io';
import { makeElement } from '../lib/web/util';
import { InterviewOptions, Interview } from '../lib/interview';

export interface InterviewState {
  tenant: Tenant;
  recording: RecordedAction[];
}

export interface ICProps {
  modalTemplate: HTMLTemplateElement;
  initialState: InterviewState;
  interviewClass: new (options: InterviewOptions<Tenant>) => Interview<Tenant>;
  now: DateString;
  onStateChange?: (state: InterviewState) => void;
  onTitleChange?: (title: string) => void;
}

type ICState = {
  interviewId: number;
} & InterviewState;

export class InterviewComponent extends React.Component<ICProps, ICState> {
  div: React.RefObject<HTMLDivElement>;
  innerDiv: HTMLDivElement|null = null;
  io: WebInterviewIO|null = null;
  recordableIo: RecordableInterviewIO|null = null;
  interview: Interview<Tenant>|null = null;

  constructor(props: ICProps) {
    super(props);
    this.state = { interviewId: 0, ...this.props.initialState };
    this.div = React.createRef();
    this.handleInterviewChange = this.handleInterviewChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBeginRecordingAction = this.handleBeginRecordingAction.bind(this);
  }
  private setupInterview() {
    if (!this.div.current) {
      throw new Error('Assertion failure, expected component to be mounted!');
    }

    const interviewId = this.state.interviewId;

    this.innerDiv = makeElement('div', { appendTo: this.div.current });
    this.io = new WebInterviewIO(this.innerDiv, new ModalBuilder(this.props.modalTemplate));
    this.io.on('title', this.handleTitleChange);
    this.recordableIo = new RecordableInterviewIO(this.io, this.props.initialState.recording);
    this.recordableIo.on('begin-recording-action', this.handleBeginRecordingAction);
    this.interview = new this.props.interviewClass({
      io: this.recordableIo,
      now: new Date(this.props.now)
    });
    this.interview.on('change', this.handleInterviewChange);
    this.interview.execute(this.props.initialState.tenant).catch(err => {
      if (err instanceof IOCancellationError && this.state.interviewId > interviewId) {
        // The interview was waiting for some kind of user input or timeout
        // but this component has since been refreshed, so this exception is to
        // be expected.
        return;
      }
      throw err;
    });
  }
  private teardownInterview() {
    if (!this.io || !this.recordableIo || !this.interview) {
      throw new Error('Assertion failure!');
    }
    this.io.removeAllListeners();
    this.recordableIo.removeAllListeners();
    this.interview.removeAllListeners();
    this.io.close();
    this.io = null;
    this.recordableIo = null;
    this.interview = null;
    if (this.innerDiv && this.div.current) {
      this.div.current.removeChild(this.innerDiv);
      this.innerDiv = null;
    }
  }
  private handleBeginRecordingAction(type: IoActionType) {
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
  private handleTitleChange(title: string) {
    if (this.props.onTitleChange) {
      this.props.onTitleChange(title);
    }
  }
  private handleInterviewChange(_: Tenant, tenant: Tenant) {
    if (!this.recordableIo) {
      throw new Error('Assertion failure!');
    }
    this.setState({
      tenant,
      recording: this.recordableIo.resetRecording()
    });
  }
  private ensureUnchanged(prevProps: ICProps, props: (keyof ICProps)[]) {
    for (let prop of props) {
      if (prevProps[prop] !== this.props[prop]) {
        throw new Error(`Changing the "${prop}" prop on ${this.constructor.name} is currently unsupported`);
      }
    }
  }
  componentDidUpdate(prevProps: ICProps, prevState: ICState) {
    this.ensureUnchanged(prevProps, ['interviewClass', 'modalTemplate']);
    if ((this.props.initialState !== prevProps.initialState) ||
        (new Date(this.props.now).getTime() !== new Date(prevProps.now).getTime())) {
      this.teardownInterview();
      this.setState({
        ...this.props.initialState,
        interviewId: prevState.interviewId + 1,
      });
    } else if (this.state.interviewId === prevState.interviewId) {
      if (this.props.onStateChange &&
          (this.state.recording !== prevState.recording ||
           this.state.tenant !== prevState.tenant)) {
        this.props.onStateChange({
          tenant: this.state.tenant,
          recording: this.state.recording
        });
      }
    } else {
      this.setupInterview();
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
