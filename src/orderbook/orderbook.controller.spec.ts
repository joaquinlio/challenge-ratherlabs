import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SocketModule } from '../socket/socket.module';
import { SocketService } from '../socket/socket.service';
import { OrderbookController } from './orderbook.controller';
import { ValidationPipe } from '@nestjs/common';

describe('OrderbookController', () => {
  let controller: OrderbookController;
  let service: SocketService;
  const mockResponse = {
    asks: [],
    bids: [
      {
        amount: 3.3,
        count: 3,
        price: 7254.7,
      },
    ],
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderbookController],
      imports: [SocketModule],
      providers: [ValidationPipe],
    }).compile();

    controller = module.get<OrderbookController>(OrderbookController);
    service = module.get<SocketService>(SocketService);
  });

  describe('Orderbook', () => {
    it('should return orderbook for the given pair name', async () => {
      const orderbook = async (): Promise<Orderbook.orderbook> => {
        return await new Promise((resolve, reject) => {
          return resolve(mockResponse);
        });
      };

      jest
        .spyOn(service, 'getOrderbookByPairName')
        .mockImplementation(orderbook);

      expect(await controller.getOrderbook({ pairName: 'BTCUSD' })).toEqual(
        mockResponse,
      );
    });

    it('should return error if the websocket connection fails', async () => {
      const orderbook = async (): Promise<Orderbook.orderbook> => {
        throw new InternalServerErrorException('Internal server error');
      };

      jest
        .spyOn(service, 'getOrderbookByPairName')
        .mockRejectedValue(orderbook);

      try {
        await controller.getOrderbook({ pairName: 'BTCUSD' });
      } catch (error) {
        expect(error.message).toBe('Http Exception');
      }
    });
  });
});
