import React from 'react';
import autobind from 'autobind-decorator';
import { WebInterviewIO } from '../io';
import { ModalBuilder } from '../modal';
import { DateString } from '../../util';
import { IOCancellationError } from '../../interview-io';
import { RecordableInterviewIO, IoActionType } from '../../recordable-io';
import { makeElement } from '../util';
import { InterviewOptions, Interview, Command } from '../../interview';
import { RecordedAction } from '../../recorder';

export interface InterviewState<S> {
  s: S;
  recording: RecordedAction<IoActionType>[];
}

export interface ICProps<S> {
  modalTemplate: HTMLTemplateElement;
  initialState: InterviewState<S>;
  interviewClass: new (options: InterviewOptions<S>) => Interview<S>;
  todoIndex?: number;
  now: DateString;
  onStateChange?: (state: InterviewState<S>) => void;
  onTitleChange?: (title: string) => void;
  onStart?: (interview: Interview<S>) => void;
  onStop?: () => void;
}

type ICState<S> = {
  interviewId: number;
} & InterviewState<S>;

/**
 * This class wraps an Interview in a React component.
 */
export class InterviewComponent<S> extends React.Component<ICProps<S>, ICState<S>> {
  div: React.RefObject<HTMLDivElement>;
  innerDiv: HTMLDivElement|null = null;
  io: WebInterviewIO|null = null;
  recordableIo: RecordableInterviewIO|null = null;
  interview: Interview<S>|null = null;

  constructor(props: ICProps<S>) {
    super(props);
    this.state = { interviewId: 0, ...this.props.initialState };
    this.div = React.createRef();
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
    this.recordableIo.recorder.on('begin-recording-action', this.handleBeginRecordingAction);
    this.interview = new this.props.interviewClass({
      io: this.recordableIo,
      now: new Date(this.props.now)
    });
    this.interview.on('change', this.handleInterviewChange);
    if (this.props.onStart) {
      this.props.onStart(this.interview);
    }
    this.interview.execute(this.props.initialState.s, this.getTodoCommand()).then((finalState) => {
      if (this.props.onStop) {
        this.props.onStop();
      }
    }).catch(err => {
      if (err instanceof IOCancellationError && this.state.interviewId > interviewId) {
        // The interview was waiting for some kind of user input or timeout
        // but this component has since been refreshed, so this exception is to
        // be expected.
        return;
      }
      throw err;
    });
  }

  private getTodoCommand(): Command<S>|undefined {
    if (!this.interview) {
      throw new Error('Assertion failure');
    }
    const { todoIndex } = this.props;
    if (todoIndex !== undefined) {
      const todo = this.interview.getTodos(this.props.initialState.s)[todoIndex];
      if (!todo || todo.status !== 'available') {
        throw new Error(`Assertion failure, todo index ${todoIndex} does not exist or is not actionable`);
      }
      return todo;
    }
    return undefined;
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

  @autobind
  private handleBeginRecordingAction(type: IoActionType) {
    if (type === 'ask' || type === 'askMany' || type === 'notify') {
      if (!this.recordableIo) {
        throw new Error('Assertion failure!');
      }
      const recording = this.recordableIo.recorder.getRecording();
      if (recording.length > this.state.recording.length) {
        this.setState({ recording });
      }
    }
  }

  @autobind
  private handleTitleChange(title: string) {
    if (this.props.onTitleChange) {
      this.props.onTitleChange(title);
    }
  }

  @autobind
  private handleInterviewChange(_: S, s: S) {
    if (!this.recordableIo) {
      throw new Error('Assertion failure!');
    }
    this.setState({
      s,
      recording: this.recordableIo.recorder.resetRecording()
    });
  }

  private ensureUnchanged(prevProps: ICProps<S>, props: (keyof ICProps<S>)[]) {
    for (let prop of props) {
      if (prevProps[prop] !== this.props[prop]) {
        throw new Error(`Changing the "${prop}" prop on ${this.constructor.name} is currently unsupported`);
      }
    }
  }

  componentDidUpdate(prevProps: ICProps<S>, prevState: ICState<S>) {
    this.ensureUnchanged(prevProps, ['interviewClass', 'modalTemplate']);
    const initialStateChanged = (
      this.props.initialState.s !== prevProps.initialState.s ||
      this.props.initialState.recording !== prevProps.initialState.recording
    );
    const initialStateIsCurrentState = (
      this.props.initialState.s === this.state.s ||
      this.props.initialState.recording === this.state.recording
    );
    const todoIndexWasSet = (
      typeof(this.props.todoIndex) === 'number' &&
      prevProps.todoIndex === undefined
    );
    if ((initialStateChanged && !initialStateIsCurrentState) ||
        todoIndexWasSet ||
        new Date(this.props.now).getTime() !== new Date(prevProps.now).getTime()) {
      this.teardownInterview();
      this.setState({
        ...this.props.initialState,
        interviewId: prevState.interviewId + 1,
      });
    } else if (this.state.interviewId === prevState.interviewId) {
      if (this.props.onStateChange &&
          (this.state.recording !== prevState.recording ||
           this.state.s !== prevState.s)) {
        this.props.onStateChange({
          s: this.state.s,
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
