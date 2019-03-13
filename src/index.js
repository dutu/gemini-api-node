import WebSocket from 'ws'
import axios from 'axios'
import crypto from 'crypto';

const createRequestConfig = function createRequestConfig ({ key, secret, payload }) {
  const encodedPayload = (Buffer.from(JSON.stringify(payload)))
    .toString(`base64`)

  const signature = crypto
    .createHmac(`sha384`, secret)
    .update(encodedPayload)
    .digest(`hex`)

  return {
    headers: {
      'X-GEMINI-APIKEY': key,
      'X-GEMINI-PAYLOAD': encodedPayload,
      'X-GEMINI-SIGNATURE': signature,
    },
  }
}

export default class Gemini {
  constructor({ key, secret, sandbox = false } = { sandbox: false }) {
    this.key = key;
    this.secret = secret;
    const subdomain = sandbox ? `api.sandbox` : `api`;
    this.baseUrl = `https://${subdomain}.gemini.com`;
  }

  async requestPublic(endpoint, params = {}) {
    let res  = await axios.get(`${this.baseUrl}/v1${endpoint}`, { params })
    return res.data
  }

  async requestPrivate(endpoint, params = {}) {
    if (!this.key || !this.secret) {
      throw new Error(
        `API key and secret key required to use authenticated methods`,
      );
    }

    const requestPath = `/v1${endpoint}`;
    const requestUrl = `${this.baseUrl}${requestPath}`;
    const payload = {
      nonce: Date.now(),
      request: requestPath,
      ...params,
    };

    const config = createRequestConfig({
      payload,
      key: this.key,
      secret: this.secret,
    });

    let res = await axios.post(requestUrl, {}, config)
    return res.data
  }

  // Public API
  getAllSymbols() {
    return this.requestPublic(`/symbols`)
  }

  getTicker(symbol) {
    return this.requestPublic(`/pubticker/${symbol}`)
  }

  getOrderBook(symbol, params = {}) {
    return this.requestPublic(`/book/${symbol}`, params)
  }

  getTradeHistory(symbol, params = {}) {
    return this.requestPublic(`/trades/${symbol}`, params)
  }

  getCurrentAuction(symbol) {
    return this.requestPublic(`/auction/${symbol}`)
  }

  getAuctionHistory(symbol, params = {}) {
    return this.requestPublic(`/auction/${symbol}/history`, params)
  }

  // Order Placement API
  newOrder(params = {}) {
    return this.requestPrivate(`/order/new`, {
      type: `exchange limit`,
      ...params,
    })
  }

  cancelOrder({ order_id } = {}) {
    return this.requestPrivate(`/order/cancel`, { order_id })
  }

  cancelAllSessionOrders() {
    return this.requestPrivate(`/order/cancel/session`)
  }


  cancelAllActiveOrders() {
    return this.requestPrivate(`/order/cancel/all`)
  }

  // Order Status API
  getMyOrderStatus({ order_id } = {}) {
    return this.requestPrivate(`/order/status`, { order_id })
  }

  getMyActiveOrders() {
    return this.requestPrivate(`/orders`)
  }


  getMyPastTrades (params = {}) {
    return this.requestPrivate(`/mytrades`, params)
  }

  getMyTradeVolume() {
    return this.requestPrivate(`/tradevolume`)
  }

  // Fund Management API
  getMyAvailableBalances() {
    return this.requestPrivate(`/balances`)
  }

  newAddress(currency) {
    return this.requestPrivate(`/deposit/${currency}/newAddress`)
  }

  // WebSocket
  newWebSocketOrderEvents() {
    const requestPath = `/v1/order/events`;
    this.orderUrl = `${this.baseUrl}${requestPath}`;
    return new WebSocket(this.orderUrl, createRequestConfig({
      key: this.key,
      secret: this.secret,
      payload: {
        nonce: Date.now(),
        request: requestPath,
      },
    }))
  }

  newWebSocketMarketData(symbol) {
    return new WebSocket(`${this.baseUrl}/v1/marketdata/${symbol}`)
  }
}
