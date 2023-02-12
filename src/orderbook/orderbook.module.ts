import { Module } from '@nestjs/common';
import { SocketModule } from '../socket/socket.module';
import { OrderbookController } from './orderbook.controller';

@Module({
  controllers: [OrderbookController],
  imports: [SocketModule],
})
export class OrderbookModule {}
