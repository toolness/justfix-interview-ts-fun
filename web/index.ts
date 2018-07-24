import { addDays } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';
import { LocalStorageSerializer } from '../lib/web/serializer';
import { WebInterviewIO } from '../lib/web/io';
import { getElement } from '../lib/web/util';
import { ModalBuilder } from '../lib/web/modal';

interface AppState {
  days: number,
  tenant: Tenant,
}

const INITIAL_APP_STATE: AppState = {
  days: 0,
  tenant: {}
};

interface RestartOptions {
  pushState: boolean;
}

let io: WebInterviewIO|null = null;

function restart(options: RestartOptions = { pushState: true }) {
  const resetButton = getElement('button', '#reset');
  const daysInput = getElement('input', '#days');
  const mainDiv = getElement('div', '#main');
  const dateSpan = getElement('span', '#date');
  const modalTemplate = getElement('template', '#modal');

  if (io) {
    io.close();
    io = null;
  }

  const serializer = new LocalStorageSerializer('tenantAppState', INITIAL_APP_STATE);
  const myIo = new WebInterviewIO(mainDiv, new ModalBuilder(modalTemplate));
  io = myIo;

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

  const interview = new TenantInterview({
    io,
    now: addDays(new Date(), serializer.get().days)
  });

  dateSpan.textContent = interview.now.toDateString();
  daysInput.value = serializer.get().days.toString();

  resetButton.onclick = () => {
    serializer.set(INITIAL_APP_STATE);
    restart();
  };

  daysInput.onchange = (e) => {
    e.preventDefault();
    serializer.set({
      ...serializer.get(),
      days: parseInt(daysInput.value)
    });
    restart();
  };

  interview.on('change', (_, nextState) => {
    serializer.set({
      ...serializer.get(),
      tenant: nextState
    });
    window.history.pushState(serializer.get(), '', null);
  });

  myIo.on('title', title => {
    document.title = `${title} - ${interview.now.toDateString()}`;
  });

  interview.execute(serializer.get().tenant).then((tenant) => {
    const followupCount = interview.getFollowUps(tenant).length;
    const status = followupCount ?
      `No more questions for now, but ${followupCount} followup(s) remain.` :
      `Interview complete, no more followups to process.`;
    myIo.setStatus(status);
  });
}

window.addEventListener('load', () => {
  restart({ pushState: false });
});
