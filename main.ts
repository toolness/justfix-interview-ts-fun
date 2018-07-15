import * as fs from 'fs';
import chalk from 'chalk';

import { TenantInterview } from './lib/tenant-interview';

import { ReadlineInterviewIO } from './lib/interview-io';

const STATE_FILE = '.tenant-interview-state.json';

function log(msg: string) {
  console.log(chalk.gray(msg));
}

if (module.parent === null) {
  const io = new ReadlineInterviewIO();
  const interview = new TenantInterview({ io });
  interview.on('change', (_, tenant) => {
    log(`Writing state to ${STATE_FILE}...`);
    fs.writeFileSync(STATE_FILE, JSON.stringify(tenant, null, 2), { encoding: 'utf-8' });
  });
  let initialState = {};

  try {
    initialState = JSON.parse(fs.readFileSync(STATE_FILE, { encoding: 'utf-8' }));
  } catch (e) {}

  interview.execute(initialState).then(tenant => {
    log(`Interview complete. Final state is in ${STATE_FILE}.`);
    io.close();
  }).catch((e: any) => {
    log(e);
    process.exit(1);
  });
}
