import { DateString, getDaysAway, getISODate } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';
import { LocalStorageSerializer } from '../lib/web/serializer';
import { getElement } from '../lib/web/util';
import { FollowUp, Interview, Todo } from '../lib/interview';
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
    s: {
      todos: {
        rentalHistory: 'available'
      }
    },
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
            <div className="columns" style={{width: '100%'} /* Bulma is so confusing! */}>
              <div className="column is-two-thirds">{followUp.name}</div>
              <div className="column">{daysStr}</div>
            </div>
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

function TodoList(props: { todos: Todo<Tenant>[], onClick: (index: number) => void }): JSX.Element {
  return (
    <ul>
      {props.todos.map((todo, i) => {
        return (
          <li key={todo.name}>
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">
                  <span className="tag is-light">Step {i + 1}</span>&nbsp;{todo.name}
                </p>
              </header>
              <div className="card-content">
                <div className="content">
                  <p>{todo.description}</p>
                </div>
              </div>
              <footer className="card-footer">
                {todo.status === 'available'
                 // This should really be a <button> but Bulma doesn't seem to like that.
                 ? <a onClick={(e) => { e.preventDefault(); props.onClick(i); }}
                      href="#"
                      className="card-footer-item">Start</a>
                 : null}
              </footer>
            </div>
            <br/>
          </li>
        );
      })}
    </ul>
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
  todoIndex?: number;
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
    this.setState({ isInterviewStopped: true, todoIndex: undefined });
    this.handleTitleChange('Dashboard');
  }

  @autobind
  private handleInterviewStateChange(interviewState: InterviewState<Tenant>) {
    this.updateSerState({ interviewState }, 'push');
  }

  @autobind
  private handleTitleChange(title: string) {
    document.title = `${title} - ${getISODate(this.state.serState.date)}`;
  }

  @autobind
  private handleTodoClick(index: number) {
    this.setState({ todoIndex: index });
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
    this.setState({ serState: newState, todoIndex: undefined });
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

    const tenant: Tenant = serState.interviewState.s;
    const followUps = interview ? interview.getFutureFollowUps(tenant) : [];
    const todos = interview ? interview.getTodos(tenant) : [];

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
              todoIndex={this.state.todoIndex}
              onStart={this.handleInterviewStart}
              onStop={this.handleInterviewStop}
              onStateChange={this.handleInterviewStateChange}
              onTitleChange={this.handleTitleChange}
            />
            {isInterviewStopped
              ? (todos.length
                  ? <TodoList todos={todos} onClick={this.handleTodoClick} />
                  : "No more questions for now!")
              : null}
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
