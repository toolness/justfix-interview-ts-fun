import { addDays } from '../lib/util';
import { TenantInterview } from '../lib/tenant-interview';
import { Tenant } from '../lib/tenant';
import { LocalStorageSerializer } from '../lib/web/serializer';
import { WebInterviewIO } from '../lib/web/io';
import { getElement, getQuerystringParam } from '../lib/web/util';


window.addEventListener('load', () => {
  const io = new WebInterviewIO(getElement('#main'));
  let now = new Date();
  const days = parseInt(getQuerystringParam('days'));
  const resetButton = document.createElement('button');

  if (!isNaN(days)) {
    now = addDays(now, days);
  }

  const interview = new TenantInterview({ io, now });
  const serializer = new LocalStorageSerializer('tenantState', {} as Tenant);

  resetButton.textContent = "Reset interview";
  resetButton.onclick = () => {
    serializer.set({});
    window.location.reload();
  };
  io.root.appendChild(resetButton);

  interview.on('change', (_, nextState) => {
    console.log(`Updating localStorage['${serializer.keyname}'].`);
    serializer.set(nextState);
  });
  interview.execute(serializer.get()).then(tenant => {
    console.log('Interview complete.');
  });
});
