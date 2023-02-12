import { Injectable, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { SocketEventsMannager } from '../utils/socketEventsMannager';

@Injectable()
export class SocketService {
  public readonly logger = new Logger(SocketService.name);
  private resolveCallback: any = false;

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

  //constructor() {}

  connect(pairName: string) {
    this.logger.log(`Connecting to ${pairName} webSocket`);
    // Create a new WebSocket connection
    const client = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    const eventMannager = new SocketEventsMannager(
      this.logger,
      SocketService.pairs,
    );
    // Assign event listeners
    eventMannager.assignEventListeners(client, pairName, this.resolveCallback);
  }

  // Gets data from the WebSocket for the given pair name
  async getOrderbookByPairName(pairName: string): Promise<Orderbook.orderbook> {
    if (!SocketService.pairs[pairName].wsConnected) {
      this.logger.log(
        `${pairName} webSocket is disconnected, creating connection`,
      );

      // Returns a Promise that resolves to the data received from the WebSocket
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
