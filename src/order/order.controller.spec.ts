import { Test, TestingModule } from '@nestjs/testing';
import { SocketModule } from '../socket/socket.module';
import { SocketService } from '../socket/socket.service';
import { OrderController } from './order.controller';

describe('OrderController', () => {
  let controller: OrderController;
  let service: SocketService;
  let orderbook: () => Promise<Orderbook.orderbook>;
  const mockResponse = {
    asks: [
      {
        amount: 5,
        count: 2,
        price: 10,
      },
    ],
    bids: [
      {
        amount: 5,
        count: 2,
        price: 10,
      },
    ],
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      imports: [SocketModule],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<SocketService>(SocketService);

    orderbook = async (): Promise<Orderbook.orderbook> => {
      return await new Promise((resolve, reject) => {
        return resolve(mockResponse);
      });
    };
  });

  describe('Order', () => {
    const tradeInputs = [
      {
        tradeDto: {
          pairName: 'BTCUSD',
          operationType: 'buy',
          amount: 10,
        },
        expected: {
          effectivePrice: 50,
          orderSize: 5,
        },
      },
      {
        tradeDto: {
          pairName: 'ETHUSD',
          operationType: 'sell',
          amount: 10,
        },
        expected: {
          effectivePrice: 50,
          orderSize: 5,
        },
      },
      {
        tradeDto: {
          pairName: 'BTCUSD',
          operationType: 'buy',
          amount: 10,
          priceLimit: 40,
        },
        expected: {
          effectivePrice: 40,
          orderSize: 4,
        },
      },
    ];

    it.each(tradeInputs)(
      'Should return the price and order size that will result if the order is executed',
      async ({ tradeDto, expected }) => {
        jest
          .spyOn(service, 'getOrderbookByPairName')
          .mockImplementation(orderbook);

        expect(await controller.tradeOrder(tradeDto)).toEqual(expected);
      },
    );

    it('should return error if there are no orders to complete the order simulation', async () => {
      orderbook = async (): Promise<Orderbook.orderbook> => {
        return await new Promise((resolve, reject) => {
          return resolve({
            asks: [],
            bids: [],
          });
        });
      };

      jest
        .spyOn(service, 'getOrderbookByPairName')
        .mockImplementation(orderbook);

      expect(
        await controller.tradeOrder({
          pairName: 'BTCUSD',
          operationType: 'buy',
          amount: 10,
        }),
      ).toEqual(
        'The order buy for BTCUSD cannot be simulated with the current tips',
      );
    });
  });
});
