import { DateString, getDaysAway, getISODate } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';
import { LocalStorageSerializer } from '../lib/web/serializer';
import { getElement } from '../lib/web/util';
import { FollowUp } from '../lib/interview';
import React from 'react';
import ReactDom from 'react-dom';
import { InterviewComponent, ICProps, InterviewState } from '../lib/web/components/interview';
import { NullIO } from '../lib/null-io';

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

window.addEventListener('DOMContentLoaded', () => {
  const modalTemplate = getElement('template', '#modal');
  const mainSection = getElement('section', '#main');
  const serializer = new LocalStorageSerializer('tenantAppState', INITIAL_APP_STATE, INITIAL_APP_STATE.version);

  const handleResetClick = () => {
    setState(INITIAL_APP_STATE, 'push');
  };

  const handleDateChange = (date: Date) => {
    setState({
      ...serializer.get(),
      date
    }, 'push');
  };

  window.onpopstate = (event) => {
    if (event.state && event.state.version === INITIAL_APP_STATE.version) {
      setState(event.state);
    }
  };

  function setState(newState: SerializableAppState, historyAction: 'push'|'replace'|null = null) {
    serializer.set(newState);
    if (historyAction === 'push') {
      window.history.pushState(newState, '', null);
    } else if (historyAction === 'replace') {
      window.history.replaceState(newState, '', null);
    }
    render(newState);
  }

  let isInterviewStopped = false;

  function render(appState: SerializableAppState) {
    const interviewClass = TenantInterview;
    const nullInterview = new interviewClass({
      io: new NullIO(),
      now: new Date(appState.date)
    });
    const followUps = nullInterview.getFollowUps(appState.interviewState.s).filter(followUp => {
      // We are strictly interested in follow-ups that are not ready for follow-up
      // right now.
      return new Date(appState.date) < new Date(followUp.date);
    });

    const interviewProps: ICProps<Tenant> = {
      modalTemplate,
      interviewClass,
      initialState: appState.interviewState,
      now: appState.date,
      onStart: () => {
        isInterviewStopped = false;
        render(appState);
      },
      onStop: () => {
        isInterviewStopped = true;
        render(appState);
      },
      onStateChange: (interviewState) => {
        setState({
          ...appState,
          interviewState
        }, 'push');
      },
      onTitleChange: (title) => {
        document.title = title;
      }
    };

    ReactDom.render(
      <div className="container">
        <h1 className="title">JustFix interview fun</h1>
        <div className="columns">
          <div className="column is-three-quarters">
            <InterviewComponent {...interviewProps} />
            {isInterviewStopped ? "No more questions for now!" : null}
          </div>
          <div className="column">
            {followUps.length ?
              <FollowUpsPanel followUps={followUps} now={appState.date} /> : null}
            <div className="box has-background-light">
              <DateField onChange={handleDateChange} value={appState.date}>
                Current simulated date:
              </DateField>
              <Button onClick={handleResetClick}>Reset interview</Button>
            </div>
          </div>
        </div>
      </div>,
      mainSection
    );
  }

  setState(serializer.get(), 'replace');
});
