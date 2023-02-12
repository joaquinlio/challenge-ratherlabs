import { Module } from '@nestjs/common';
import { SocketModule } from '../socket/socket.module';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  imports: [SocketModule],
})
export class OrderModule {}
