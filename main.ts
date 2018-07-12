import { TenantInterview } from './tenant-interview';

if (module.parent === null) {
  const interview = new TenantInterview();
  const initialState = {};

  interview.execute(initialState).then(tenant => {
    console.log('final tenant state is:', tenant);
  }).catch((e: any) => {
    console.exception(e);
    process.exit(1);
  });
}
