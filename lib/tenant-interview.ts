import {
  Tenant,
  LeaseType,
  RequestedRentalHistory,
  RentalHistory
} from './tenant';

import { Interview, FollowUp } from './interview';

import { addDays } from './util';
import { sleep } from './web/util';

const RENTAL_HISTORY_FOLLOWUP_DAYS = 7;

export class TenantInterview extends Interview<Tenant> {
  async askForLeaseType(tenant: Tenant): Promise<Tenant> {
    const leaseType = await this.io.ask(this.io.createMultiChoiceQuestion(
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
      needsRepairs: this.io.createYesNoQuestion('Does your apartment need repairs?'),
      isHarassed: this.io.createYesNoQuestion('Are you being harassed by your landlord?'),
      isFacingEviction: this.io.createYesNoQuestion('Are you facing eviction?'),
      hasLeaseIssues: this.io.createYesNoQuestion('Are you having issues with your lease?'),
      hasNoServices: this.io.createYesNoQuestion('Are you living without essential services, like heat/gas/hot water?'),
      hasOther: this.io.createYesNoQuestion('Do you have any other apartment issues?'),
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
      const permission = await this.io.ask(this.io.createYesNoQuestion('Can we request your rental history from your landlord?'));
      if (permission) {
        return { ...tenant, rentalHistory: { status: 'accepted' } };
      } else {
        this.io.notify("Um, we really need to request your rental history to proceed.");
      }
    }
  }

  async followupRentalHistory(rentalHistory: RequestedRentalHistory): Promise<RentalHistory> {
    const wasReceived = await this.io.ask(this.io.createYesNoQuestion('Have you received your rental history yet?'));

    if (wasReceived) {
      const details = await this.io.askMany({
        dateReceived: this.io.createDateQuestion('When did you receive your rental history?'),
        isRentStabilized: this.io.createYesNoQuestion('Are you rent stabilized?'),
        photo: this.io.createPhotoQuestion('Please submit a photograph of your rental history.')
      });
      return {
        status: 'received',
        dateRequested: rentalHistory.dateRequested,
        ...details
      };
    } else {
      this.io.notify(`Alas, we will ask again in ${RENTAL_HISTORY_FOLLOWUP_DAYS} days.`);
      return {
        ...rentalHistory,
        nextReminder: addDays(this.now, RENTAL_HISTORY_FOLLOWUP_DAYS)
      };
    }
  }

  async askNext(tenant: Tenant): Promise<Tenant> {
    if (!tenant.name) {
      return {
        ...tenant,
        name: await this.io.ask(this.io.createNonBlankQuestion('What is your name?'))
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
        phoneNumber: await this.io.ask(this.io.createNonBlankQuestion('What is your phone number?'))
      };
    }

    if (!tenant.rentalHistory) {
      return this.askForRentalHistory(tenant);
    }

    return tenant;
  }

  async runNextTask(tenant: Tenant): Promise<Tenant> {
    if (tenant.rentalHistory && tenant.rentalHistory.status === 'accepted') {
      // TODO: Actually request rental history.
      this.io.setStatus('Requesting your rental history...');
      await sleep(3000);

      this.io.notify(
        `Rental history requested! We'll ask if you've received it in ` +
        `${RENTAL_HISTORY_FOLLOWUP_DAYS} days.`
      );
      return {
        ...tenant,
        rentalHistory: {
          status: 'requested',
          dateRequested: this.now,
          nextReminder: addDays(this.now, RENTAL_HISTORY_FOLLOWUP_DAYS)
        }
      };
    }

    return tenant;
  }

  getFollowUps(tenant: Tenant): FollowUp<Tenant>[] {
    const followUps: FollowUp<Tenant>[] = [];

    const rentalHistory = tenant.rentalHistory;
    if (rentalHistory && rentalHistory.status === 'requested') {
      followUps.push({
        date: rentalHistory.nextReminder,
        name: 'Rental history follow-up',
        execute: async () => ({
          ...tenant,
          rentalHistory: await this.followupRentalHistory(rentalHistory)
        }),
      });
    }

    return followUps;
  }
}
