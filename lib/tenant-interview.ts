import {
  Tenant,
  LeaseType
} from './tenant';

import { Interview } from './interview';

import {
  MultiChoiceQuestion,
  NonBlankQuestion,
  YesNoQuestion,
} from './question';

export class TenantInterview extends Interview<Tenant> {
  async askForLeaseType(tenant: Tenant): Promise<Tenant> {
    const leaseType = await this.io.ask(new MultiChoiceQuestion(
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

  async askForHousingIssues(tenant: Tenant): Promise<Tenant> {
    const housingIssues = await this.io.askMany({
      needsRepairs: new YesNoQuestion('Does your apartment need repairs?'),
      isHarassed: new YesNoQuestion('Are you being harassed by your landlord?'),
      isFacingEviction: new YesNoQuestion('Are you facing eviction?'),
      hasLeaseIssues: new YesNoQuestion('Are you having issues with your lease?'),
      hasNoServices: new YesNoQuestion('Are you living without essential services, like heat/gas/hot water?'),
      hasOther: new YesNoQuestion('Do you have any other apartment issues?'),
    });

    if (housingIssues.isFacingEviction) {
      this.io.notify(
        "Since you’re in an eviction, it’s important to try to get legal help right away. " +
        "We’ll point you to a resource that can help you find a lawyer in just a few moments."
      );
    }

    return {...tenant, housingIssues};
  }

  async askNext(tenant: Tenant): Promise<Tenant> {
    if (!tenant.name) {
      return {
        ...tenant,
        name: await this.io.ask(new NonBlankQuestion('What is your name?'))
      };
    }

    if (!tenant.housingIssues) {
      return this.askForHousingIssues(tenant);
    }

    if (!tenant.leaseType) {
      return this.askForLeaseType(tenant);
    }

    if (!tenant.phoneNumber) {
      return {
        ...tenant,
        phoneNumber: await this.io.ask(new NonBlankQuestion('What is your phone number?'))
      };
    }

    return tenant;
  }
}
