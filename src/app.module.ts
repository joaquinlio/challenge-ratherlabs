import { Module } from '@nestjs/common';
import { OrderbookModule } from './orderbook/orderbook.module';
import { OrderModule } from './order/order.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [OrderbookModule, OrderModule, SocketModule],
})
export class AppModule {}
