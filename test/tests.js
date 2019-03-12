import chai from 'chai'
const expect = chai.expect

import GeminiAPI from '../src'

const restAPI = new GeminiAPI({key: process.env.APIKEY, secret:process.env.APISECRET, sandbox: true })
const websocketAPI = new GeminiAPI.WebsocketClient({key: process.env.APIKEY, secret:process.env.APISECRET, sandbox: true })
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
      let res = await restAPI[method[0]](...method[1])
        .catch()
      order_id.order_id = res.order_id && res.order_id || order_id.order_id
    })
  })
})


const fiveSeconds = 5000;
/*

test(`market data websocket API`, t =>
  new Promise((resolve, reject) => {
    websocketAPI.openMarketSocket(`btcusd`, resolve);
    setTimeout(reject, fiveSeconds);
  })
  .then(() => t.pass())
  .catch(err => t.fail(err.message))
);

test(`order events websocket API`, t =>
  new Promise((resolve, reject) => {
    websocketAPI.openOrderSocket(resolve);
    setTimeout(reject, fiveSeconds);
  })
  .then(() => t.pass())
  .catch(err => t.fail(err.message))
);
*/
