import { DateString, getDaysAway } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';
import { LocalStorageSerializer } from '../lib/web/serializer';
import { WebInterviewIO } from '../lib/web/io';
import { getElement, makeElement } from '../lib/web/util';
import { ModalBuilder } from '../lib/web/modal';
import { RecordableInterviewIO, RecordedAction } from '../lib/recordable-io';
import { IOCancellationError } from '../lib/interview-io';
import { FollowUp } from '../lib/interview';

interface AppState {
  date: DateString,
  tenant: Tenant,
  recording: RecordedAction[],
}

const INITIAL_APP_STATE: AppState = {
  date: new Date(),
  tenant: {},
  recording: [],
};

interface RestartOptions {
  pushState: boolean;
}

let io: WebInterviewIO|null = null;

function showFollowUps<S>(nav: HTMLElement, followUps: FollowUp<S>[], now: Date) {
  nav.querySelectorAll('.panel-block').forEach(el => nav.removeChild(el));

  // We are strictly interested in follow-ups that are not ready for follow-up
  // right now.
  followUps = followUps.filter(followUp => now < new Date(followUp.date));

  if (followUps.length === 0) {
    nav.style.display = 'none';
  } else {
    nav.style.display = null;
    followUps.forEach(followUp => {
      const days = getDaysAway(followUp.date, now);
      const daysStr = `${days} ${days === 1 ? ' day' : ' days'}`;
      makeElement('div', {
        classes: ['panel-block'],
        textContent: `${followUp.name} We'll follow-up in ${daysStr}.`,
        appendTo: nav
      });
    });
  }
}

function restart(options: RestartOptions = { pushState: true }) {
  const resetButton = getElement('button', '#reset');
  const dateInput = getElement('input', '#date');
  const mainDiv = getElement('div', '#main');
  const modalTemplate = getElement('template', '#modal');
  const followUpsNav = getElement('nav', '#follow-ups');

  if (io) {
    io.close();
    io = null;
  }

  const serializer = new LocalStorageSerializer('tenantAppState', INITIAL_APP_STATE);
  const myIo = new WebInterviewIO(mainDiv, new ModalBuilder(modalTemplate));
  io = myIo;

  // We want to bind this reset button as early as possible, so that if the
  // serializer state is broken (e.g. because the schema changed recently),
  // it's always possible to reset.
  resetButton.onclick = () => {
    serializer.set(INITIAL_APP_STATE);
    restart();
  };

  if (options.pushState) {
    window.history.pushState(serializer.get(), '', null);
  } else {
    window.history.replaceState(serializer.get(), '', null);
  }

  window.onpopstate = (event) => {
    if (event.state) {
      serializer.set(event.state);
      restart({ pushState: false });
    }
  };

  const redrawFollowUps = () => {
    showFollowUps(followUpsNav, interview.getFollowUps(serializer.get().tenant), interview.now);
  };

  const recordableIo = new RecordableInterviewIO(io, serializer.get().recording);
  const interview = new TenantInterview({
    io: recordableIo,
    now: new Date(serializer.get().date),
  });

  dateInput.valueAsDate = interview.now;

  dateInput.onchange = (e) => {
    e.preventDefault();
    serializer.set({
      ...serializer.get(),
      recording: [],
      date: dateInput.valueAsDate
    });
    restart();
  };

  recordableIo.on('begin-recording-action', type => {
    if ((type === 'ask' || type === 'askMany' || type === 'notify') && io === myIo) {
      const state = serializer.get();
      const recording = recordableIo.newRecording;
      if (recording.length > state.recording.length) {
        // The interview contains multiple question steps before
        // returning a new state. Remember what the user has
        // answered so far, so that they can still easily
        // navigate between the question steps using their
        // browser's back/forward buttons.
        serializer.set({
          ...state,
          recording,
        });
        window.history.pushState(serializer.get(), '', null);
      }
    }
  });

  interview.on('change', (_, nextState) => {
    serializer.set({
      ...serializer.get(),
      recording: recordableIo.resetRecording(),
      tenant: nextState
    });
    window.history.pushState(serializer.get(), '', null);
    redrawFollowUps();
  });

  myIo.on('title', title => {
    document.title = `${title} - ${interview.now.toDateString()}`;
  });

  redrawFollowUps();
  interview.execute(serializer.get().tenant).then(async (tenant) => {
    const status = "We don't have any questions for you right now.";
    await myIo.setStatus(status, { showThrobber: false });
  }).catch((err) => {
    if (err instanceof IOCancellationError && myIo !== io) {
      // The interview was waiting for some kind of user input or timeout
      // but the user has since navigated away from this interview session,
      // so this exception is to be expected.
      console.groupCollapsed(`${err.constructor.name} received, but expected; ignoring it.`);
      console.log(err);
      console.groupEnd();
      return;
    }
    throw err;
  });
}

window.addEventListener('load', () => {
  restart({ pushState: false });
});
