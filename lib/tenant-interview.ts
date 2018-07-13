import {
  Tenant,
  LeaseType
} from './tenant';

import { Interview } from './interview';

import { addDays } from './util';

import {
  MultiChoiceQuestion,
  NonBlankQuestion,
  YesNoQuestion,
} from './question';

const RENTAL_HISTORY_FOLLOWUP_DAYS = 7;

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

  async askForRentalHistory(tenant: Tenant): Promise<Tenant> {
    while (true) {
      const permission = await this.io.ask(new YesNoQuestion('Can we request your rental history from your landlord?'));
      if (permission) {
        // TODO: Request rental history.
        this.io.notify(
          `Rental history requested! We'll ask if you've received it in ` +
          `${RENTAL_HISTORY_FOLLOWUP_DAYS} days.`
        );
        return {
          ...tenant,
          rentalHistory: {
            status: 'requested',
            dateRequested: this.getDate().toISOString(),
            nextReminder: addDays(this.getDate(), RENTAL_HISTORY_FOLLOWUP_DAYS).toISOString()
          }
        };
      } else {
        this.io.notify("Um, we really need to request your rental history to proceed.");
      }
    }
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

    if (!tenant.rentalHistory) {
      return this.askForRentalHistory(tenant);
    }

    if (tenant.rentalHistory.status === 'requested') {
      const nextReminder = new Date(tenant.rentalHistory.nextReminder);
      if (this.getDate() >= nextReminder) {
        const wasReceived = await this.io.ask(new YesNoQuestion('Have you received your rental history yet?'));

        if (wasReceived) {
          this.io.notify('Hooray!  Um, we need to implement what happens here.');
        } else {
          this.io.notify(`Alas, we will ask again in ${RENTAL_HISTORY_FOLLOWUP_DAYS} days.`);
          return {
            ...tenant,
            rentalHistory: {
              ...tenant.rentalHistory,
              nextReminder: addDays(nextReminder, RENTAL_HISTORY_FOLLOWUP_DAYS).toISOString()
            }
          };
        }
      }
    }

    return tenant;
  }
}
