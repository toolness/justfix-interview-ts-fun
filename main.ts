import minimist from 'minimist';
import chalk from 'chalk';

import { addDays } from './lib/util';
import { Tenant } from './lib/tenant';
import { TenantInterview } from './lib/tenant-interview';
import { ReadlineInterviewIO } from './lib/interview-io';
import { FileSerializer } from './lib/serializer';

const SCRIPT = process.argv[1];

const STATE_FILE = '.tenant-interview-state.json';

const HELP_TEXT = `
Usage:

  ${SCRIPT} [arguments]

Arguments:

  --days=DAYS    Set the current date to DAYS days from now.
  --help         Show this help text.

The current interview state is stored in "${STATE_FILE}".
You can edit or delete this to change the state of the interview.
`.trim();

function log(msg: string) {
  console.log(chalk.gray(msg));
}

if (module.parent === null) {
  const argv = minimist(process.argv.slice(2));
  let now = new Date();

  if (argv.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (!isNaN(parseInt(argv.days))) {
    now = addDays(now, parseInt(argv.days));
  }

  const io = new ReadlineInterviewIO();
  const interview = new TenantInterview({ io, now });
  const serializer = new FileSerializer(STATE_FILE, {} as Tenant);
  interview.on('change', (_, tenant) => {
    log(`Writing state to ${STATE_FILE}...`);
    serializer.set(tenant);
  });

  interview.execute(serializer.get()).then(tenant => {
    log(`Interview complete. Final state is in ${STATE_FILE}.`);
    io.close();
  }).catch((e: any) => {
    log(e);
    process.exit(1);
  });
}
