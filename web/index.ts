import { addDays } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';
import { LocalStorageSerializer } from '../lib/web/serializer';
import { WebInterviewIO } from '../lib/web/io';
import { getElement } from '../lib/web/util';

interface AppState {
  days: number,
  tenant: Tenant,
}

const INITIAL_APP_STATE: AppState = {
  days: 0,
  tenant: {}
};

function restart() {
  const resetButton = getElement('button#reset') as HTMLButtonElement;
  const daysInput = getElement('input#days') as HTMLInputElement;
  const timeTravelForm = getElement('form#time-travel') as HTMLFormElement;
  const mainDiv = getElement('div#main') as HTMLDivElement;

  mainDiv.innerHTML = '';

  const serializer = new LocalStorageSerializer('tenantAppState', INITIAL_APP_STATE);
  const io = new WebInterviewIO(mainDiv);

  const interview = new TenantInterview({
    io,
    now: addDays(new Date(), serializer.get().days)
  });

  daysInput.value = serializer.get().days.toString();

  resetButton.onclick = () => {
    serializer.set(INITIAL_APP_STATE);
    restart();
  };

  timeTravelForm.onsubmit = (e) => {
    e.preventDefault();
    serializer.set({
      ...serializer.get(),
      days: parseInt(daysInput.value)
    });
    restart();
  };

  interview.on('change', (_, nextState) => {
    console.log(`Updating localStorage['${serializer.keyname}'].`);
    serializer.set({
      ...serializer.get(),
      tenant: nextState
    });
  });

  interview.execute(serializer.get().tenant);
}

window.addEventListener('load', () => {
  restart();
});
