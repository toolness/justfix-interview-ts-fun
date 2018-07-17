import * as fs from 'fs';
import minimist from 'minimist';
import chalk from 'chalk';

import { addDays } from './lib/util';

import { TenantInterview } from './lib/tenant-interview';

import { ReadlineInterviewIO } from './lib/interview-io';

const STATE_FILE = '.tenant-interview-state.json';

function log(msg: string) {
  console.log(chalk.gray(msg));
}

if (module.parent === null) {
  const argv = minimist(process.argv.slice(2));
  let now = new Date();

  if (!isNaN(parseInt(argv.days))) {
    now = addDays(now, parseInt(argv.days));
  }

  const io = new ReadlineInterviewIO();
  const interview = new TenantInterview({ io, now });
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
