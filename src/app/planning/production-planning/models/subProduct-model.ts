/**
 * Created by marvinlott on 13.11.17.
 */
export interface SbProduct {
  id: number;
  dependency: number[];
  orders: number;
  plannedWHEnd: number;
  inWarehouse: number;
  inWaitlist: number;
  inProduction: number;
  amountneeded: number;
}

export class SubProduct implements SbProduct {
  id: number;
  dependency: number[];
  orders: number;
  plannedWHEnd: number;
  inWarehouse: number;
  inWaitlist: number;
  inProduction: number;
  amountneeded:  number;
  constructor() {}
}
