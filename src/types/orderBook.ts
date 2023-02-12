declare namespace Orderbook {
  export interface pair {
    wsConnected: boolean;
    orderbook: {
      bids: object;
      asks: object;
    };
    messageType: string;
  }
  export interface pairs {
    BTCUSD: pair;
    ETHUSD: pair;
  }

  export interface tip {
    price: number;
    amount: number;
    count: number;
  }

  export interface tips {
    [key: string]: tip;
  }

  export interface orderbook {
    bids: tip[];
    asks: tip[];
  }

  export type type = string;

  export type wsMessage = [number, number, number];
}
