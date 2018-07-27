import { DateString, getDaysAway, getISODate } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';
import { LocalStorageSerializer } from '../lib/web/serializer';
import { getElement } from '../lib/web/util';
import { FollowUp, Interview } from '../lib/interview';
import React from 'react';
import ReactDom from 'react-dom';
import { InterviewComponent, InterviewState } from '../lib/web/components/interview';
import autobind from '../node_modules/autobind-decorator';

interface SerializableAppState {
  version: 3,
  date: DateString,
  interviewState: InterviewState<Tenant>
}

const INITIAL_APP_STATE: SerializableAppState = {
  version: 3,
  date: new Date(),
  interviewState: {
    s: {},
    recording: [],
  },
};

function FollowUpsPanel<S>(props: {followUps: FollowUp<S>[], now: DateString}): JSX.Element {
  return (
    <nav className="panel">
      <p className="panel-heading">Follow-ups</p>
      {props.followUps.map(followUp => {
        const days = getDaysAway(followUp.date, props.now);
        const daysStr = `${days} ${days === 1 ? ' day' : ' days'}`;
        return (
          <div key={followUp.name} className="panel-block">
            {followUp.name} We'll follow-up in {daysStr}.
          </div>
        );
      })}
    </nav>
  );
}

function DateField(props: {onChange: (date: Date) => void, value: DateString, children: string}): JSX.Element {
  return (
    <div className="field">
      <label className="label" htmlFor="date">{props.children}</label>
      <div className="control">
        <input className="input" type="date"
               value={getISODate(props.value)}
               onChange={(e) => props.onChange(e.target.valueAsDate)}  />
      </div>
    </div>
  );
}

function Button(props: {onClick: () => void, children: string}): JSX.Element {
  return (
    <div className="control">
      <button onClick={props.onClick} className="button">{props.children}</button>
    </div>
  );
}

interface AppProps {
  modalTemplate: HTMLTemplateElement;
  serializer: LocalStorageSerializer<SerializableAppState>;
}

interface AppState {
  serState: SerializableAppState;
  interview: Interview<Tenant>|null;
  isInterviewStopped: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      serState: this.props.serializer.get(),
      interview: null,
      isInterviewStopped: true
    };
  }

  @autobind
  private handleResetClick() {
    this.updateSerState(this.props.serializer.defaultState, 'push');
  }

  @autobind
  private handleDateChange(date: Date) {
    this.updateSerState({ date }, 'push');
  }

  @autobind
  private handleInterviewStart(newInterview: Interview<Tenant>) {
    this.setState({
      interview: newInterview,
      isInterviewStopped: false
    });
  }

  @autobind
  private handleInterviewStop() {
    this.setState({ isInterviewStopped: true });
  }

  @autobind
  private handleInterviewStateChange(interviewState: InterviewState<Tenant>) {
    this.updateSerState({ interviewState }, 'push');
  }

  @autobind
  private handleTitleChange(title: string) {
    document.title = title;
  }

  private updateSerState(updates: Partial<SerializableAppState>, historyAction: 'push'|'replace'|null = null) {
    const newState = {
      ...this.state.serState,
      ...updates
    };
    this.props.serializer.set(newState);
    if (historyAction === 'push') {
      window.history.pushState(newState, '', null);
    } else if (historyAction === 'replace') {
      window.history.replaceState(newState, '', null);
    }
    this.setState({ serState: newState });
  }

  componentDidMount() {
    window.onpopstate = (event) => {
      if (event.state && event.state.version === this.props.serializer.version) {
        this.updateSerState(event.state);
      }
    };  

    this.updateSerState(this.state.serState, 'replace');
  }

  render() {
    const {
      serializer
    } = this.props;

    const {
      serState,
      interview,
      isInterviewStopped
     } = this.state;

    const followUps = interview ? interview.getFutureFollowUps(serState.interviewState.s) : [];

    return (
      <div className="container">
        <h1 className="title">JustFix interview fun</h1>
        <div className="columns">
          <div className="column is-three-quarters">
            <InterviewComponent
              modalTemplate={this.props.modalTemplate}
              interviewClass={TenantInterview}
              initialState={serState.interviewState}
              now={serState.date}
              onStart={this.handleInterviewStart}
              onStop={this.handleInterviewStop}
              onStateChange={this.handleInterviewStateChange}
              onTitleChange={this.handleTitleChange}
            />
            {isInterviewStopped ? "No more questions for now!" : null}
          </div>
          <div className="column">
            {followUps.length ?
              <FollowUpsPanel followUps={followUps} now={serState.date} /> : null}
            <div className="box has-background-light">
              <DateField onChange={this.handleDateChange} value={serState.date}>
                Current simulated date:
              </DateField>
              <Button onClick={this.handleResetClick}>Reset interview</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const modalTemplate = getElement('template', '#modal');
  const mainSection = getElement('section', '#main');
  const serializer = new LocalStorageSerializer('tenantAppState', INITIAL_APP_STATE, INITIAL_APP_STATE.version);

  ReactDom.render(
    <App modalTemplate={modalTemplate} serializer={serializer} />,
    mainSection
  );
});
