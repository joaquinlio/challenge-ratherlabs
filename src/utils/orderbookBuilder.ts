/**
 * buildOrderbook is a function that takes in data received from a Bitfinex websocket
 * and returns an object representation of the order book.
 *
 * @param data - The data received from the Bitfinex websocket
 * @returns A formatted order book object
 */
export const buildOrderbook = (data: any, pair: any): Orderbook.orderbook => {
  const orderbook: Orderbook.orderbook = pair.orderbook;

  if (pair.messageType == 'snapShot') {
    const tips: Orderbook.wsMessage[] = data[1];

    tips.forEach(([price, , amount]: Orderbook.wsMessage) => {
      // Determine the type of order based on the amount (positive for bids, negative for asks)
      const type: Orderbook.type = amount >= 0 ? 'bids' : 'asks';

      orderbook[type][price] = {
        price,
        amount: Math.abs(amount),
      };
    });
  } else {
    const [price, count, amount]: Orderbook.wsMessage = data[1];

    const type: Orderbook.type = amount >= 0 ? 'bids' : 'asks';

    // If the count is 0, delete the price level from the order book
    if (count == 0) {
      if (orderbook[type][price]) {
        delete orderbook[type][price];
      }
    } else {
      orderbook[type][price] = {
        price,
        amount: Math.abs(amount),
      };
    }
  }
  return orderbook;
};

export const sortOrderbook = (orderbook: Orderbook.orderbook) => {
  // Sort the bid array in descending order by price
  const orderedBids: Orderbook.tip[] = Object.values(orderbook.bids).sort(
    (a: any, b: any) => b.price - a.price,
  );

  // Sort the ask array in ascending order by price
  const orderedAsks: Orderbook.tip[] = Object.values(orderbook.asks).sort(
    (a: any, b: any) => a.price - b.price,
  );

  orderbook.bids = orderedBids;
  orderbook.asks = orderedAsks;

  return orderbook;
};
