"use strict";

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ws = _interopRequireDefault(require("ws"));

var _axios = _interopRequireDefault(require("axios"));

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var createRequestConfig = function createRequestConfig(_ref) {
  var key = _ref.key,
      secret = _ref.secret,
      payload = _ref.payload;
  var encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");

  var signature = _crypto.default.createHmac("sha384", secret).update(encodedPayload).digest("hex");

  return {
    headers: {
      'X-GEMINI-APIKEY': key,
      'X-GEMINI-PAYLOAD': encodedPayload,
      'X-GEMINI-SIGNATURE': signature
    }
  };
};

var Gemini =
/*#__PURE__*/
function () {
  function Gemini() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      sandbox: false
    },
        key = _ref2.key,
        secret = _ref2.secret,
        _ref2$sandbox = _ref2.sandbox,
        sandbox = _ref2$sandbox === void 0 ? false : _ref2$sandbox;

    _classCallCheck(this, Gemini);

    this.key = key;
    this.secret = secret;
    var subdomain = sandbox ? "api.sandbox" : "api";
    this.baseUrl = "https://".concat(subdomain, ".gemini.com");
  }

  _createClass(Gemini, [{
    key: "requestPublic",
    value: function () {
      var _requestPublic = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(endpoint) {
        var params,
            res,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                params = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                _context.next = 3;
                return _axios.default.get("".concat(this.baseUrl, "/v1").concat(endpoint), {
                  params: params
                });

              case 3:
                res = _context.sent;
                return _context.abrupt("return", res.data);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function requestPublic(_x) {
        return _requestPublic.apply(this, arguments);
      }

      return requestPublic;
    }()
  }, {
    key: "requestPrivate",
    value: function () {
      var _requestPrivate = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(endpoint) {
        var params,
            requestPath,
            requestUrl,
            payload,
            config,
            res,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};

                if (!(!this.key || !this.secret)) {
                  _context2.next = 3;
                  break;
                }

                throw new Error("API key and secret key required to use authenticated methods");

              case 3:
                requestPath = "/v1".concat(endpoint);
                requestUrl = "".concat(this.baseUrl).concat(requestPath);
                payload = _objectSpread({
                  nonce: Date.now(),
                  request: requestPath
                }, params);
                config = createRequestConfig({
                  payload: payload,
                  key: this.key,
                  secret: this.secret
                });
                _context2.next = 9;
                return _axios.default.post(requestUrl, {}, config);

              case 9:
                res = _context2.sent;
                return _context2.abrupt("return", res.data);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function requestPrivate(_x2) {
        return _requestPrivate.apply(this, arguments);
      }

      return requestPrivate;
    }() // Public API

  }, {
    key: "getAllSymbols",
    value: function getAllSymbols() {
      return this.requestPublic("/symbols");
    }
  }, {
    key: "getTicker",
    value: function getTicker(symbol) {
      return this.requestPublic("/pubticker/".concat(symbol));
    }
  }, {
    key: "getOrderBook",
    value: function getOrderBook(symbol) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.requestPublic("/book/".concat(symbol), params);
    }
  }, {
    key: "getTradeHistory",
    value: function getTradeHistory(symbol) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.requestPublic("/trades/".concat(symbol), params);
    }
  }, {
    key: "getCurrentAuction",
    value: function getCurrentAuction(symbol) {
      return this.requestPublic("/auction/".concat(symbol));
    }
  }, {
    key: "getAuctionHistory",
    value: function getAuctionHistory(symbol) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.requestPublic("/auction/".concat(symbol, "/history"), params);
    } // Order Placement API

  }, {
    key: "newOrder",
    value: function newOrder() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.requestPrivate("/order/new", _objectSpread({
        type: "exchange limit"
      }, params));
    }
  }, {
    key: "cancelOrder",
    value: function cancelOrder() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          order_id = _ref3.order_id;

      return this.requestPrivate("/order/cancel", {
        order_id: order_id
      });
    }
  }, {
    key: "cancelAllSessionOrders",
    value: function cancelAllSessionOrders() {
      return this.requestPrivate("/order/cancel/session");
    }
  }, {
    key: "cancelAllActiveOrders",
    value: function cancelAllActiveOrders() {
      return this.requestPrivate("/order/cancel/all");
    } // Order Status API

  }, {
    key: "getMyOrderStatus",
    value: function getMyOrderStatus() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          order_id = _ref4.order_id;

      return this.requestPrivate("/order/status", {
        order_id: order_id
      });
    }
  }, {
    key: "getMyActiveOrders",
    value: function getMyActiveOrders() {
      return this.requestPrivate("/orders");
    }
  }, {
    key: "getMyPastTrades",
    value: function getMyPastTrades() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.requestPrivate("/mytrades", params);
    }
  }, {
    key: "getMyTradeVolume",
    value: function getMyTradeVolume() {
      return this.requestPrivate("/tradevolume");
    } // Fund Management API

  }, {
    key: "getMyAvailableBalances",
    value: function getMyAvailableBalances() {
      return this.requestPrivate("/balances");
    }
  }, {
    key: "newAddress",
    value: function newAddress(currency) {
      return this.requestPrivate("/deposit/".concat(currency, "/newAddress"));
    } // WebSocket

  }, {
    key: "newWebSocketOrderEvents",
    value: function newWebSocketOrderEvents() {
      var requestPath = "/v1/order/events";
      this.orderUrl = "".concat(this.baseUrl).concat(requestPath);
      return new _ws.default(this.orderUrl, createRequestConfig({
        key: this.key,
        secret: this.secret,
        payload: {
          nonce: Date.now(),
          request: requestPath
        }
      }));
    }
  }, {
    key: "newWebSocketMarketData",
    value: function newWebSocketMarketData(symbol) {
      return new _ws.default("".concat(this.baseUrl, "/v1/marketdata/").concat(symbol));
    }
  }]);

  return Gemini;
}();

exports.default = Gemini;
//# sourceMappingURL=index.js.map