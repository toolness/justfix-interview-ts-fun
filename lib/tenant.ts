import { DateString, Photo } from './util';

export enum LeaseType {
  /** Market rate or free market lease. */
  MarketRate = 'mr',

  /** Rent stabilized (or rent controlled). */
  RentStabilized = 'rs',

  /** Public housing. */
  NYCHA = 'nycha',

  /** Other housing can be e.g. month to month without a lease, coop, shelter, sublet, Mitchell Lama. */
  Other = 'other',

  /** The tenant is uncertain of their actual lease type. */
  Unknown = 'unknown',
}

export interface HousingIssues {
  /** Whether the tenant needs repairs in their apartment. */
  needsRepairs: boolean;

  /** Whether the tenant is being harassed by their landlord. */
  isHarassed: boolean;

  /** Whether the tenant is being faced with eviction. */
  isFacingEviction: boolean;

  /** Whether the tenant is having issues with their lease. */
  hasLeaseIssues: boolean;

  /** Whether the tenant is living without essential services (heat/gas/hot water). */
  hasNoServices: boolean;

  /** Whether the tenant is facing any other issues. */
  hasOther: boolean;
}

export interface AcceptedRentalHistory {
  /**
   * The state indicating that the user has given their permission for us
   * to request their rental history.
   */
  status: 'accepted';
}

export interface RequestedRentalHistory {
  status: 'requested';

  /** When the tenant requested their rental history. */
  dateRequested: DateString;

  /** The date when we'll next ask the tenant if they've received the history yet. */
  nextReminder: DateString;
}

export interface ReceivedRentalHistory {
  status: 'received';

  dateRequested: DateString;

  /** When the tenant received their rental history. */
  dateReceived: DateString;

  /** Whether the rental history asserts that the tenant's dwelling is rent stabilized. */
  isRentStabilized: boolean;

  /** The user's photograph of their rental history. */
  photo: Photo;
}

export type RentalHistory = AcceptedRentalHistory | RequestedRentalHistory | ReceivedRentalHistory;

/**
 * The status of a to-do item can be one of the following:
 * 
 *   * available - The to-do is displayed on the user's to-do list.
 *   * initiated - The user has taken explicit action to begin the to-do item, e.g.
 *       by clicking on the to-do or something similar.
 */
export type TenantTodoStatus = 'available'|'initiated';

interface _Tenant {
  /** The tenant's full name. */
  name: string;

  /** The tenant's phone number. (TODO: how should this be formatted?) */
  phoneNumber: string;

  leaseType: LeaseType;
  housingIssues: HousingIssues;
  rentalHistory: RentalHistory;

  /* This describes what to-do items to show on the user's to-do list. */
  todos: {
    rentalHistory?: TenantTodoStatus;
  }
}

export type Tenant = Readonly<Partial<_Tenant>>;
