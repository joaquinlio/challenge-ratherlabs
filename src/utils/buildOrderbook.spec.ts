import { Test, TestingModule } from '@nestjs/testing';
import { buildOrderbook } from './orderbookBuilder';

describe('BuildOrderbook', () => {
  let emptyOrderbook;
  beforeEach(async () => {
    emptyOrderbook = {
      asks: {},
      bids: {},
    };
  });

  describe('Order', () => {
    it('should return an orderbook with the websocket snapshot message', async () => {
      const wsMessage = [
        212839,
        [
          [10, 2, 5],
          [10, 2, -5],
        ],
      ];
      const orderbook = {
        asks: {},
        bids: {},
      };

      const result = buildOrderbook(wsMessage, {
        orderbook,
        messageType: 'snapShot',
        wsConnected: false,
      });

      expect(result).toEqual({
        asks: { '10': { price: 10, amount: 5 } },
        bids: { '10': { price: 10, amount: 5 } },
      });
    });

    it('should return an orderbook with the websocket update message', async () => {
      const wsMessage = [17082, [10, 2, -30]];
      const orderbook = {
        asks: { '10': { price: 10, amount: 5 } },
        bids: { '10': { price: 10, amount: 5 } },
      };
      expect(
        buildOrderbook(wsMessage, {
          orderbook,
          messageType: 'update',
          wsConnected: false,
        }),
      ).toEqual({
        asks: { '10': { price: 10, amount: 30 } },
        bids: { '10': { price: 10, amount: 5 } },
      });
    });

    it('should return an orderbook without sell tip', async () => {
      const wsMessage = [17082, [10, 0, -5]];
      const orderbook = {
        asks: { '10': { price: 10, amount: 5 } },
        bids: { '10': { price: 10, amount: 5 } },
      };
      expect(
        await buildOrderbook(wsMessage, {
          orderbook: orderbook,
          messageType: 'update',
          wsConnected: false,
        }),
      ).toEqual({
        asks: {},
        bids: { '10': { price: 10, amount: 5 } },
      });
    });
  });
});
