gemini-api-node
====
[![Build Status](https://travis-ci.com/dutu/gemini-api-node.svg?branch=master)](https://travis-ci.com/dutu/gemini-api-node) [![Dependency Status](https://dependencyci.com/github/dutu/gemini-api-node/badge)](https://dependencyci.com/github/dutu/gemini-api-node) 

**gemini-api-node** is a simple node.js wrapper for Gemini REST and WebSocket API.

### Contents
* [Changelog](#changelog)
* [Installation](#installation)
* [Quick examples](#quick-examples)
* [API](#api)
	* REST API
	* WebSocket API
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

### WebSocket API example:

```js
import Gemini from 'gemini-api-node'

const gemini = new Gemini({ key, secret, sandbox: false })
gemini.newWebSocketOrderEvents()

gemini.onopen = () => {
  console.log('Websocket is open')
}
  
gemini.onmessage = (...args) => {
  console.log('Websocket message received')
}
```

# API

## REST
All methods return promises.
* getAllSymbols()
* getTicker(symbol)
* getOrderBook(symbol, params = {})
* getTradeHistory(symbol, params = {})
* getCurrentAuction(symbol)
* getAuctionHistory(symbol, params = {})
* newOrder(params = {})
* cancelOrder({ order_id })
* cancelAllSessionOrders()
* cancelAllActiveOrders()
* getMyOrderStatus({ order_id })
* getMyActiveOrders()
* getMyPastTrades(params = {})
* getMyTradeVolume()
* getMyAvailableBalances()
* newAddress(currency)

## WebSocket
* newWebSocketMarketData(symbol)
* newWebSocketOrderEvents()

# Contributors


# License

[MIT](LICENSE)
