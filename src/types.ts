export interface IStrategyState {
  initial: string;
  oldPrice: string;
  currentPrice: string;
}

export interface ITaxState {
  initial: string;
  buyPrice: string;
  currentPrice: string;
  targetProfit: string;
}

export interface IFuturesState {
  initial: string;
  price: string;
  leverage: string;
  position: string;
}