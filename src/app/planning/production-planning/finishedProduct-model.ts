/**
 * Created by marvinlott on 13.11.17.
 */

export interface Product {
  id: number;
  orders: number;
  plannedWHEnd: number;
  inWarehouse: number;
  inWaitlist: number;
  inProduction: number;
  amountneeded: number;
}

export class FinishedProduct implements Product {
  id: number;
  orders: number;
  plannedWHEnd: number;
  inWarehouse: number;
  inWaitlist: number;
  inProduction: number;
  amountneeded: number;
  constructor(){}
}
