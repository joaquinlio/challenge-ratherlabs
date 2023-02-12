declare namespace SimulationOrder {
  export type params = {
    amount: number;
    priceLimit?: number;
    orderbook: Orderbook.orderbook;
    operationType: string;
    pairName: string;
  };

  export type result = {
    effectivePrice: number;
    orderSize: number;
  };
}
