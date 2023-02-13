export default () => ({
  wsUrl: process.env.WEBSOCKET_URL || 'wss://api.bitfinex.com/ws/2',
});
