import { Module } from '@nestjs/common';
import { OrderbookModule } from './orderbook/orderbook.module';
import { OrderModule } from './order/order.module';
import { SocketModule } from './socket/socket.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    OrderbookModule,
    OrderModule,
    SocketModule,
  ],
})
export class AppModule {}
