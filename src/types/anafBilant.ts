
export interface BalanceIndicator {
  indicator: string;
  val_indicator: number;
  val_den_indicator: string;
}

export interface CompanyBalance {
  an: number;
  cui: number;
  deni: string;
  caen: number;
  den_caen: string;
  i: BalanceIndicator[];
}
