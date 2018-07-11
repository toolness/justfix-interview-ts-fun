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

export interface TenantData {
  leaseType: LeaseType;
  housingIssues: HousingIssues;
}
