## Description

RatherLabs Challenge

## Installation

```bash
$ npm install
```

## .env example
```bash
WEBSOCKET_URL=wss://api.bitfinex.com/ws/2
PORT=3000
```



## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

### Why did I decide to connecting and subscribing to the channel when get the first request

When receiving a high volume of requests per second or minute, connecting and subscribing to the websocket on each request can consume a lot of resources and negatively impact performance.

To overcome this issue, it's recommended to connect and subscribe to the channel when get the first request and keep the connection open to efficiently respond to requests. By doing this, the connection to the websocket will only be established once and will persist for the lifetime of the application. This eliminates the overhead of establishing a new connection for each request and reduces the overall load on the system.

In summary, connecting and subscribing to the channel when get the first request is more performant when dealing with a high volume of requests as it reduces the resources consumed and improves the overall performance of the system.

## Example Request:

In this example, the endpoint is being queried for the Order Book data for the pair BTC-USD. The response includes the ask and bid arrays, which represent the prices and sizes of the sell and buy orders, respectively.

```bash
GET /orderbook/BTC-USD
```

## Example Response:

```yalm
{
    "bids": [
       {
            "price": 21614,
            "amount": 0.0410872
        },
        {
            "price": 21613,
            "amount": 0.011
        },
    ],
    "asks": [
        {
            "price": 21615,
            "amount": 0.5562686
        },
        {
            "price": 21616,
            "amount": 0.462635
        }
    ]
}
```

## Example Request:

In this example, the endpoint is being used to simulate a trade order. The request includes the pairName, operationType, amount, and priceLimit in the request body. The response includes the effectivePrice and orderSize, which represent the price at which the order was executed and the size of the order.

```bash
POST /order/trade
```

### Body

```bash
{
    "pairName": "BTCUSD",
    "operationType": "buy",
    "amount": 10,
    "priceLimit": 30000
}
```

## Example Response:

```bash
{
    "effectivePrice": 30000,
    "orderSize": 1.372655092648243
}
```

## How it can be expanded

The current API connects to two predetermined channels, which limits its functionality. To make the channels dynamic, the API will be updated to allow users to specify the channels they want to connect to. This can be done by adding the names of the currency to be used in the app to the env configuration and modifying the connection to the websocket to loop through them and create a connection for each currency.
