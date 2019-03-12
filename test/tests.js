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


const TIMEOUT = 5000

describe("WebSocket - market data", function () {
  it('market data', (done) => {
    let open = false
    let message = false
    let timeoutId = setTimeout(function() {
      if (!open) expect(false, 'open has not been received').to.be.ok
      if (!message) expect(false, 'message has not been received').to.be.ok
      done()
    }, TIMEOUT)

    const marketDataWebSocket = gemini.newMarketDataWebSocket(`btcusd`)
    marketDataWebSocket.onopen = (...args) => {
      open = true
    }

    marketDataWebSocket.onmessage = (...args) => {
      message = true
      clearTimeout(timeoutId);
      done();
    }
  })
});

describe("WebSocket - order events", function () {
  it('market data', (done) => {
    let open = false
    let message = false
    let timeoutId = setTimeout(function() {
      if (!open) expect(false, 'open has not been received').to.be.ok
      if (!message) expect(false, 'message has not been received').to.be.ok
      done()
    }, TIMEOUT)

    const orderEventsWebSocket = gemini.newOrderEventsWebSocket(`btcusd`)
    orderEventsWebSocket.onopen = (...args) => {
      open = true
    }

    orderEventsWebSocket.onmessage = (...args) => {
      message = true
      clearTimeout(timeoutId);
      done();
    }
  })
});
