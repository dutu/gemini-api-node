gemini-api-node
====
[![Build Status](https://travis-ci.com/dutu/gemini-api-node.svg?branch=master)](https://travis-ci.com/dutu/gemini-api-node) [![Dependency Status](https://dependencyci.com/github/dutu/gemini-api-node/badge)](https://dependencyci.com/github/dutu/gemini-api-node) 

**gemini-api-node** is a simple node.js wrapper for Gemini REST and WebSocket API.

### Contents
* [Changelog](#changelog)
* [Installation](#installation)
* [Quick examples](#quick-examples)
* [API](#api)
* [Contributors](#contributors)
* [License](#license)


# Changelog

See detailed [Changelog](CHANGELOG.md)

# Installation

```
npm install --save gemini-api-node
```

# Quick examples

Clients for both the [REST API](https://docs.gemini.com/rest-api/) and
[streaming WebSocket API](https://docs.gemini.com/websocket-api/) are included.
Private endpoints as indicated in the API docs require authentication with an API
key and secret key.

### REST API example:

```js
import Gemini from 'gemini-api-node'

const gemini = new Gemini({ key, secret, sandbox: false })
gemini.getOrderBook('btcusd', { limit_asks: 10, limit_bids: 10 })
  .then(console.log)
  .catch(console.error)
```

### WebSocket API examples:

```js
import Gemini from 'gemini-api-node'

const gemini = new Gemini()
let ws = gemini.newWebSocketMarketData('btcusd', { 'top_of_book' : 'true', 'offers': true })

ws.onopen = () => {
  console.log('Websocket is open')
}
  
ws.onmessage = (message) => {
  let data = JSON.parse(message.data)
  console.log('Websocket data received')
}
```

```js
import Gemini from 'gemini-api-node'

const gemini = new Gemini({ key, secret, sandbox: true })
let ws = gemini.newWebSocketOrderEvents({ symbolFilter: ['btcusd'], eventTypeFilter: ['fill', 'closed']})

ws.onopen = () => {
  console.log('Websocket is open')
}
  
ws.onmessage = (message) => {
  let data = JSON.parse(message.data)
  console.log('Websocket data received')
}
```


# API

## REST
All methods return promises.
* `getAllSymbols()`
* `getTicker(symbol)`
* `getOrderBook(symbol, params = {})`
* `getTradeHistory(symbol, params = {})`
* `getCurrentAuction(symbol)`
* `getAuctionHistory(symbol, params = {})`
* `newOrder(params = {})`
* `cancelOrder({ order_id })`
* `cancelAllSessionOrders()`
* `cancelAllActiveOrders()`
* `getMyOrderStatus({ order_id })`
* `getMyActiveOrders()`
* `getMyPastTrades(params = {})`
* `getMyTradeVolume()`
* `getMyAvailableBalances()`
* `newAddress(currency)`

## WebSocket
All methods return a [`WebSocket`](https://github.com/websockets/ws) object.
* `newWebSocketMarketData(symbol, params = {})`
* `newWebSocketOrderEvents(params = {})`

# License

[MIT](LICENSE)
