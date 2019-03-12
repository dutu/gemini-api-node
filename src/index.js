import WebSocket from 'ws'
import axios from 'axios'
import get from 'lodash/fp/get';
import shortid from 'shortid';
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

  requestPublic = (endpoint, params = {}) =>
    axios.get(`${this.baseUrl}/v1${endpoint}`, { params })
      .then(get(`data`))
      .catch(err => Promise.reject(err.response.data));

    requestPrivate = (endpoint, params = {}) => {
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

        return axios.post(requestUrl, {}, config)
      .then(get(`data`))
      .catch(err => Promise.reject(err.response.data));
  }

  // Public API
  getAllSymbols = () =>
    this.requestPublic(`/symbols`)

  getTicker = symbol =>
    this.requestPublic(`/pubticker/${symbol}`)

  getOrderBook = (symbol, params = {}) =>
    this.requestPublic(`/book/${symbol}`, params)

  getTradeHistory = (symbol, params = {}) =>
    this.requestPublic(`/trades/${symbol}`, params)

  getCurrentAuction = symbol =>
    this.requestPublic(`/auction/${symbol}`);

  getAuctionHistory = (symbol, params = {}) =>
    this.requestPublic(`/auction/${symbol}/history`, params)

  // Order Placement API
  newOrder = (params = {}) =>
    this.requestPrivate(`/order/new`, {
      client_order_id: shortid(),
      type: `exchange limit`,
      ...params,
    })

  cancelOrder = ({ order_id } = {}) =>
    this.requestPrivate(`/order/cancel`, { order_id })

  cancelAllSessionOrders = () =>
    this.requestPrivate(`/order/cancel/session`)

  cancelAllActiveOrders = () =>
    this.requestPrivate(`/order/cancel/all`)

  // Order Status API
  getMyOrderStatus = ({ order_id } = {}) =>
    this.requestPrivate(`/order/status`, { order_id })

  getMyActiveOrders = () =>
    this.requestPrivate(`/orders`)

  getMyPastTrades = (params = {}) =>
    this.requestPrivate(`/mytrades`, params)

  getMyTradeVolume = () =>
    this.requestPrivate(`/tradevolume`)

  // Fund Management API
  getMyAvailableBalances = () =>
    this.requestPrivate(`/balances`)

  newAddress = (currency) =>
    this.requestPrivate(`/deposit/${currency}/newAddress`)

  newOrderEventsWebSocket() {
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

  newMarketDataWebSocket(symbol) {
    return new WebSocket(`${this.baseUrl}/v1/marketdata/${symbol}`)
  }
}
