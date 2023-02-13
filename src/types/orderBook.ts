declare namespace Orderbook {
  export interface pair {
    wsConnected: boolean;
    orderbook: orderbook;
    messageType: string;
  }
  export interface pairs {
    BTCUSD: pair;
    ETHUSD: pair;
  }

  export interface tip {
    price: number;
    amount: number;
    count?: number;
  }

  export interface objectTip {
    [key: string]: tip;
  }

  export interface orderbook {
    bids: tip[] | objectTip;
    asks: tip[] | objectTip;
  }

  export type type = string;

  export type wsMessage = [number, number, number];
}
