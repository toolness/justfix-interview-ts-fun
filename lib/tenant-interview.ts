import {
  Tenant,
  LeaseType
} from './tenant';

import { Interview } from './interview';

import {
  MultiChoiceQuestion,
  NonBlankQuestion
} from './question';

export class TenantInterview extends Interview<Tenant> {
  async askForBasicInfo(tenant: Tenant): Promise<Tenant> {
    const basicInfo = await this.askMany({
      name: new NonBlankQuestion('What is your name?'),
      phoneNumber: new NonBlankQuestion('What is your phone number?'),
    });

    return {...tenant, ...basicInfo};
  }

  async askForLeaseInfo(tenant: Tenant): Promise<Tenant> {
    const leaseType = await this.ask(new MultiChoiceQuestion(
      'What kind of lease do you have?',
      [
        [LeaseType.MarketRate, 'Market rate'],
        [LeaseType.RentStabilized, 'Rent stabilized'],
        [LeaseType.NYCHA, 'Public housing (NYCHA)'],
        [LeaseType.Other, 'Other (e.g. month-to-month)'],
        [LeaseType.Unknown, 'Not sure'],
      ]
    ));

    return {...tenant, leaseType};
  }

  async askNext(tenant: Tenant): Promise<Tenant> {
    if (!(tenant.name && tenant.phoneNumber)) {
      return this.askForBasicInfo(tenant);
    }

    if (!tenant.leaseType) {
      return this.askForLeaseInfo(tenant);
    }

    return tenant;
  }
}
