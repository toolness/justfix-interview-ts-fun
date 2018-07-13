/** A photo is just a URL to an image. */
type Photo = string;

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

export interface BaseRentalHistory {
  status: string;

  /** When the tenant requested their rental history. */
  dateRequested: string;
}

export interface RequestedRentalHistory extends BaseRentalHistory {
  status: 'requested';

  /** The date when we'll next ask the tenant if they've received the history yet. */
  nextReminder: string;
}

export interface ReceivedRentalHistory extends BaseRentalHistory {
  status: 'received';

  /** When the tenant received their rental history. */
  dateReceived: string;

  /** Whether the rental history asserts that the tenant's dwelling is rent stabilized. */
  isRentStabilized: boolean;

  /** The user's photograph of their rental history. */
  photo: Photo;
}

export type RentalHistory = RequestedRentalHistory | ReceivedRentalHistory;

interface _Tenant {
  name: string;
  phoneNumber: string;
  leaseType: LeaseType;
  housingIssues: HousingIssues;
  rentalHistory: RentalHistory;
}

export type Tenant = Readonly<Partial<_Tenant>>;
