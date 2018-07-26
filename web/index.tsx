import { DateString, getDaysAway, getISODate } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';
import { LocalStorageSerializer } from '../lib/web/serializer';
import { WebInterviewIO } from '../lib/web/io';
import { getElement, makeElement } from '../lib/web/util';
import { ModalBuilder } from '../lib/web/modal';
import { RecordableInterviewIO, RecordedAction } from '../lib/recordable-io';
import { IOCancellationError } from '../lib/interview-io';
import { FollowUp, Interview } from '../lib/interview';
import React, { ReactElement } from 'react';
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

interface AppProps<S> {
  onResetClick: () => void;
  onDateChange: (date: Date) => void;
  followUps: FollowUp<S>[];
  now: DateString;
  children: JSX.Element;
}

function App<S>(props: AppProps<S>): JSX.Element {
  return (
    <div className="container">
      <h1 className="title">JustFix interview fun</h1>
      <div className="columns">
        <div className="column is-three-quarters">
          {props.children}
        </div>
        <div className="column">
          {props.followUps.length ?
            <FollowUpsPanel followUps={props.followUps} now={props.now} /> : null}
          <div className="box has-background-light">
            <DateField onChange={props.onDateChange} value={props.now}>Current simulated date:</DateField>
            <Button onClick={props.onResetClick}>Reset interview</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.addEventListener('DOMContentLoaded', () => {
  const modalTemplate = getElement('template', '#modal');
  const mainSection = getElement('section', '#main');
  const serializer = new LocalStorageSerializer('tenantAppState', INITIAL_APP_STATE, INITIAL_APP_STATE.version);

  const handleResetClick = () => {
    serializer.set(INITIAL_APP_STATE);
    window.history.pushState(serializer.get(), '', null);
    render(serializer.get());
  };

  const handleDateChange = (date: Date) => {
    serializer.set({
      ...serializer.get(),
      date
    });
    window.history.pushState(serializer.get(), '', null);
    render(serializer.get());
  };

  window.onpopstate = (event) => {
    if (event.state) {
      serializer.set(event.state);
      render(serializer.get());
    }
  };

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

    const props: ICProps<Tenant> = {
      modalTemplate,
      interviewClass,
      initialState: appState.interviewState,
      now: appState.date,
      onStateChange: (interviewState) => {
        serializer.set({
          ...appState,
          interviewState
        });
        window.history.pushState(serializer.get(), '', null);
      },
      onTitleChange: (title) => {
        document.title = title;
      }
    };

    ReactDom.render(
      <App
         onResetClick={handleResetClick}
         onDateChange={handleDateChange}
         now={appState.date}
         followUps={followUps}>
        <InterviewComponent {...props} />
      </App>,
      mainSection
    );
  }

  window.history.replaceState(serializer.get(), '', null);
  render(serializer.get());
});
