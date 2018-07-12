import * as fs from 'fs';

import { TenantInterview } from './tenant-interview';

const STATE_FILE = '.tenant-interview-state.json';

if (module.parent === null) {
  const interview = new TenantInterview({
    onChange: tenant => {
      console.log(`Writing state to ${STATE_FILE}...`);
      fs.writeFileSync(STATE_FILE, JSON.stringify(tenant, null, 2), { encoding: 'utf-8' });
    }
  });
  let initialState = {};

  try {
    initialState = JSON.parse(fs.readFileSync(STATE_FILE, { encoding: 'utf-8' }));
  } catch (e) {}

  interview.execute(initialState).then(tenant => {
    console.log(`Interview complete. Final state is in ${STATE_FILE}.`);
  }).catch((e: any) => {
    console.log(e);
    process.exit(1);
  });
}
