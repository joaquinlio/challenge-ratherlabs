import { Logger } from '@nestjs/common';

export const simulateOrderOperation = (
  params: SimulationOrder.params,
): SimulationOrder.result | string => {
  const logger = new Logger(simulateOrderOperation.name);
  const {
    amount: tradeAmount,
    priceLimit = Infinity,
    orderbook,
    operationType,
    pairName,
  } = params;

  // Determine the type of order based on the operation type
  const orderType: Orderbook.type = operationType === 'buy' ? 'asks' : 'bids';

  logger.log(`Simulating ${operationType} order for ${pairName}`);

  let effectivePrice = 0;
  let orderSize = 0;
  for (const tip of orderbook[orderType]) {
    let { price, amount } = tip;
    const amountPrice = price * amount;

    // If the current tip fits within the trade amount and price limit, add it to the order
    if (
      orderSize + amount <= tradeAmount &&
      effectivePrice + amountPrice <= priceLimit
    ) {
      effectivePrice += amountPrice;
      orderSize += amount;
    } else {
      // If the current tip exceeds the trade amount or price limit, calculate the partial cost
      let remaining = tradeAmount - orderSize;
      let cost = Math.min(price * remaining, priceLimit - effectivePrice);
      effectivePrice += cost;
      orderSize += cost / price;
      break;
    }
  }

  if (!effectivePrice) {
    const message = `The order ${operationType} for ${pairName} cannot be simulated with the current tips`;
    logger.log(message);
    return message;
  }

  return {
    effectivePrice,
    orderSize,
  };
};
