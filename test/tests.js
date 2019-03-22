import chai from 'chai'
const expect = chai.expect

import Gemini from '../src'

const gemini = new Gemini({key: process.env.APIKEY, secret:process.env.APISECRET, sandbox: true })
const orderParams = {
  amount: `1`,
  price: `100`,
  side: `buy`,
  symbol: `btcusd`,
}

let order_id = {}
let methods = [
  [`getAllSymbols`, []],
  [`getTicker`, [`btcusd`]],
  [`getOrderBook`, [`btcusd`]],
  [`getTradeHistory`, [`btcusd`]],
  [`getCurrentAuction`, [`btcusd`]],
  [`getAuctionHistory`, [`btcusd`]],
  [`newOrder`, [orderParams]],
  [`getMyOrderStatus`, [order_id]],
  [`cancelOrder`, [order_id]],
  [`cancelAllSessionOrders`, []],
  [`cancelAllActiveOrders`, []],
  [`getMyActiveOrders`, []],
  [`getMyPastTrades`, [{ symbol: `btcusd` }]],
  [`getMyTradeVolume`, []],
  [`getMyAvailableBalances`, []],
]

describe('rest API methods', async function() {
  methods.forEach(method => {
    it(`${method[0]}`, async function () {
      let res = await gemini[method[0]](...method[1])
        .catch()
      order_id.order_id = res.order_id && res.order_id || order_id.order_id
    })
  })
})


const TIMEOUT = 15000

describe("WebSocket - market data", function () {
  it('market data', (done) => {
    let isdone  = false
    let open = false
    let message = false
    let timeoutId = setTimeout(function() {
      if (!open) expect(false, 'open has not been received').to.be.ok
      if (!message) expect(false, 'message has not been received').to.be.ok
      isdone || done()
      isdone = true
    }, TIMEOUT)

    const marketDataWebSocket = gemini.newWebSocketMarketData(`btcusd`)
    marketDataWebSocket.onopen = (...args) => {
      open = true
    }

    marketDataWebSocket.onmessage = (...args) => {
      message = true
      clearTimeout(timeoutId);
      isdone || done()
      isdone = true
    }
  })

  it('market data with parameters', (done) => {
    let isdone  = false
    let open = false
    let message = false
    let timeoutId = setTimeout(function() {
      if (!open) expect(false, 'open has not been received').to.be.ok
      if (!message) expect(false, 'message has not been received').to.be.ok
      isdone || done()
      isdone = true
    }, TIMEOUT)

    const marketDataWebSocket = gemini.newWebSocketMarketData(`btcusd`, { 'top_of_book' : 'true', 'offers': true})
    marketDataWebSocket.onopen = (...args) => {
      open = true
    }

    marketDataWebSocket.onmessage = (...args) => {
      message = true
      clearTimeout(timeoutId);
      isdone || done()
      isdone = true
    }
  })

});

describe("WebSocket - order events", function () {
  it('order events', (done) => {
    let isdone  = false
    let open = false
    let message = false
    let timeoutId = setTimeout(function() {
      if (!open) expect(false, 'open has not been received').to.be.ok
      if (!message) expect(false, 'message has not been received').to.be.ok
      isdone || done()
      isdone = true
    }, TIMEOUT)

    const orderEventsWebSocket = gemini.newWebSocketOrderEvents()
    orderEventsWebSocket.onopen = (...args) => {
      open = true
    }

    orderEventsWebSocket.onmessage = (...args) => {
      message = true
      clearTimeout(timeoutId);
      isdone || done()
      isdone = true
    }
  })

  it('order events with parameters', (done) => {
    let isdone  = false
    let open = false
    let timeoutId = setTimeout(function() {
      if (!open) expect(false, 'open has not been received').to.be.ok
      isdone || done()
      isdone = true
    }, TIMEOUT)

    const orderEventsWebSocket = gemini.newWebSocketOrderEvents({ 'symbolFilter': 'btcusd', eventTypeFilter: ['fill', 'closed'] })
    orderEventsWebSocket.onopen = (...args) => {
      open = true
    }

    orderEventsWebSocket.onmessage = (message) => {
      let data  = JSON.parse(message.data)
      if (!isdone) {
        expect(data.symbolFilter[0]).to.be.eq('btcusd')
        if(data.eventTypeFilter[0] === 'fill') {
          expect(data.eventTypeFilter[1]).to.be.eq('closed')
        } else {
          expect(data.eventTypeFilter[0]).to.be.eq('closed')
          expect(data.eventTypeFilter[1]).to.be.eq('fill')
        }

        clearTimeout(timeoutId);
        done()
        isdone = true
      }
    }
  })

});
