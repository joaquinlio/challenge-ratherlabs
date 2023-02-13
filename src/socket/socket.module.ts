import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocketService } from './socket.service';

@Module({
  providers: [SocketService],
  exports: [SocketService],
  imports: [ConfigModule],
})
export class SocketModule {}
