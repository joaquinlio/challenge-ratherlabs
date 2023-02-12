import {
  Controller,
  Post,
  Inject,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TradeOrderDto } from './dto/trade-order.dto';
import { SocketService } from '../socket/socket.service';
import { simulateOrderOperation } from '../utils/simulateOrderOperation';
import { sortOrderbook } from '../utils/orderbookBuilder';

@Controller('order')
export class OrderController {
  constructor(@Inject(SocketService) private socketService: SocketService) {}

  @Post('/trade')
  async tradeOrder(@Body() body: TradeOrderDto) {
    try {
      // Get the order book data from the Bitfinex API through the SocketService
      let orderbook: Orderbook.orderbook =
        await this.socketService.getOrderbookByPairName(body.pairName);

      // Sort the orderbook by price in descending order for bids and ascending order for asks
      orderbook = sortOrderbook(orderbook);

      // Simulate the order with the orderbook data
      const simulatedOrder = simulateOrderOperation({ ...body, orderbook });

      return simulatedOrder;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
