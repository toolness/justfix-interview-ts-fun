import { Tenant } from './tenant';

import {
  Interview,
  NonBlankQuestion
} from './interview';

export class TenantInterview extends Interview<Tenant> {
  async askNext(tenant: Tenant): Promise<Tenant> {
    if (!tenant.name) {
      return {
        ...tenant,
        name: await this.ask(new NonBlankQuestion('What is your name?'))
      };
    }
    return tenant;
  }
}
