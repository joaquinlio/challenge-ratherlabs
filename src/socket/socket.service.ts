import { Injectable, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { SocketEventsMannager } from './socketEventsMannager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocketService {
  constructor(private configService: ConfigService) {}
  public readonly logger = new Logger(SocketService.name);
  public wsUrl: string = this.configService.get('wsUrl');
  public resolveCallback: any = false;

  public static pairs: Orderbook.pairs = {
    BTCUSD: {
      wsConnected: false,
      orderbook: {
        bids: {},
        asks: {},
      },
      messageType: 'snapShot',
    },
    ETHUSD: {
      wsConnected: false,
      orderbook: {
        bids: {},
        asks: {},
      },
      messageType: 'snapShot',
    },
  };

  connect(pairName: string) {
    this.logger.log(`Connecting to ${pairName} webSocket`);
    // Create a new WebSocket connection
    const client = new WebSocket(this.wsUrl);

    const eventMannager = new SocketEventsMannager(
      this.logger,
      SocketService.pairs,
      this.wsUrl,
    );
    // Assign event listeners
    eventMannager.assignEventListeners(client, pairName, this.resolveCallback);
  }

  // Gets data from the WebSocket for the given pair name
  async getOrderbookByPairName(pairName: string): Promise<Orderbook.orderbook> {
    // If the WebSocket is not connected, create a connection
    if (!SocketService.pairs[pairName].wsConnected) {
      this.logger.log(
        `${pairName} webSocket is disconnected, creating connection`,
      );

      // Returns a Promise that resolves when websocket recives a message
      return await new Promise((resolve, reject) => {
        // Stores the resolve function for later use
        this.resolveCallback = resolve;
        this.connect(pairName);
      });
    }
    this.logger.log(`Returning orderbook from ${pairName} websocket `);
    return SocketService.pairs[pairName].orderbook;
  }
}
