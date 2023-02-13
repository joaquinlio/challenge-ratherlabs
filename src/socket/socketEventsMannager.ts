import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { buildOrderbook } from '../utils/orderbookBuilder';

export class SocketEventsMannager {
  private logger: Logger;
  private wsClient: WebSocket;
  private pairs: Orderbook.pairs;
  private wsUrl: string;
  constructor(logger: Logger, pairs: Orderbook.pairs, wsUrl: string) {
    this.logger = logger;
    this.pairs = pairs;
    this.wsUrl = wsUrl;
  }
  assignEventListeners(
    wsClient: WebSocket,
    pairName: string,
    resolveCallback: any,
  ) {
    this.logger.log(`${pairName} webSocket: assigning event listeners`);

    this.wsClient = wsClient;

    // Add a 'open' event listener to the WebSocket
    this.wsClient.on('open', () => this.onOpen(pairName));

    // Add an 'error' event listener to the WebSocket
    this.wsClient.on('error', (err: string) => this.onError(err, pairName));

    // Add a 'close' event listener to the WebSocket
    this.wsClient.on('close', () => this.onClose(pairName));

    // Add a 'message' event listener to the WebSocket
    this.wsClient.on('message', (data: string) =>
      this.onMessage(pairName, data, resolveCallback),
    );
  }

  onOpen(pairName: string) {
    this.logger.log(`${pairName} webSocket: established connection`);

    this.pairs[pairName].wsConnected = true;

    this.subscribeToMarket(pairName);
  }

  onError(err: string, pairName: string) {
    this.logger.log(`${pairName} webSocket error: ${err}`);
    throw new InternalServerErrorException('Internal server error');
  }

  // Function to handle messages received from the WebSocket
  onMessage(pairName: string, data: string, resolveCallback: any) {
    let parsedMessage = JSON.parse(data);

    // If the message is an event or a heartbeat, ignore it
    if (parsedMessage.hasOwnProperty('event') || parsedMessage[1] === 'hb') {
      return;
    }

    this.pairs[pairName].orderbook = buildOrderbook(
      parsedMessage,
      this.pairs[pairName],
    );
    console.log(this.pairs[pairName].messageType);
    // If there's a resolveCallback function and a parsed message
    if (resolveCallback && this.pairs[pairName].messageType === 'snapShot') {
      // Resolve the promise with the parsed message
      resolveCallback(this.pairs[pairName].orderbook);

      resolveCallback = false;
    }

    this.pairs[pairName].messageType = 'update';
  }

  // Handles WebSocket close events
  onClose(pairName: string) {
    this.logger.log(`${pairName} webSocket is closed`);

    // Retries the connection to the WebSocket API after 1 second
    setTimeout(() => {
      this.logger.log(`Retrying the connection to ${pairName} webSocket...`);
      this.wsClient = new WebSocket(this.wsUrl);

      this.assignEventListeners(this.wsClient, pairName, false);
    }, 1000);
  }

  // Subscribes to a market channel with the given pair name
  subscribeToMarket(pairName: string) {
    this.wsClient.send(
      JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        // Indicates the pair name for which data is requested
        symbol: pairName,
        prec: 'P0',
        len: 100,
      }),
    );

    this.logger.log(`Subscribed to ${pairName} channel`);
  }
}
