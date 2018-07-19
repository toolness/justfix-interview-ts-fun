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

  if (!isNaN(days)) {
    now = addDays(now, days);
  }

  const interview = new TenantInterview({ io, now });
  const serializer = new LocalStorageSerializer('tenantState', {} as Tenant);

  (window as any).serializer = serializer;

  interview.on('change', (_, nextState) => {
    console.log(`Updating localStorage['${serializer.keyname}'].`);
    serializer.set(nextState);
  });
  interview.execute(serializer.get()).then(tenant => {
    console.log('Interview complete.');
  });
});
