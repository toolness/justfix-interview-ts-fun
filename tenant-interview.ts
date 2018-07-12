import { Tenant } from './tenant';

import {
  Interview,
  NonBlankQuestion
} from './interview';

export class TenantInterview extends Interview<Tenant> {
  async askNext(tenant: Tenant): Promise<Tenant> {
    if (!tenant.name || !tenant.phoneNumber) {
      return {
        ...tenant,
        ...await this.askMany({
          name: new NonBlankQuestion('What is your name?'),
          phoneNumber: new NonBlankQuestion('What is your phone number?'),
        })
      };
    }
    return tenant;
  }
}
