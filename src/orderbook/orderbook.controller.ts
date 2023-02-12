import {
  Controller,
  Get,
  Param,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrderbookDto } from './dto/orderbook.dto';
import { SocketService } from '../socket/socket.service';
import { sortOrderbook } from '../utils/orderbookBuilder';

@Controller('orderbook')
export class OrderbookController {
  constructor(@Inject(SocketService) private socketService: SocketService) {}

  @Get(':pairName')
  async getPairTips(
    @Param() params: OrderbookDto,
  ): Promise<Orderbook.orderbook | HttpException> {
    try {
      // Get the order book data from the Bitfinex API through the SocketService
      let orderbook: Orderbook.orderbook =
        await this.socketService.getOrderbookByPairName(params.pairName);

      // Sort the orderbook by price in descending order for bids and ascending order for asks
      orderbook = sortOrderbook(orderbook);

      return orderbook;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
