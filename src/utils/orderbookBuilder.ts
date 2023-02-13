/**
 * buildOrderbook is a function that takes in data received from a Bitfinex websocket
 * and returns an object representation of the order book.
 *
 * @param data - The data received from the Bitfinex websocket
 * @returns A formatted order book object
 */
export const buildOrderbook = (
  data: any,
  pair: Orderbook.pair,
): Orderbook.orderbook => {
  const { orderbook, messageType } = pair;
  const BIDS = 'bids';
  const ASKS = 'asks';
  if (messageType === 'snapShot') {
    const tips: Orderbook.wsMessage[] = data[1];

    tips.forEach(([price, _count, amount]) => {
      // Determine the type of order based on the amount (positive for bids, negative for asks)
      const type: Orderbook.type = amount >= 0 ? BIDS : ASKS;

      orderbook[type][price] = {
        price,
        amount: Math.abs(amount),
      };
    });
  } else {
    const [price, count, amount]: Orderbook.wsMessage = data[1];

    const type: Orderbook.type = amount >= 0 ? BIDS : ASKS;

    // If the count is 0, delete the price level from the order book
    if (!count) {
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
  orderbook.bids = sortTips(Object.values(orderbook.bids), 'desc');

  // Sort the ask array in ascending order by price
  orderbook.asks = sortTips(Object.values(orderbook.asks), 'asc');

  return orderbook;
};

const sortTips = (tips: Orderbook.tip[], orderBy: string) =>
  tips.sort((a: any, b: any) =>
    orderBy === 'desc' ? b.price - a.price : a.price - b.price,
  );
