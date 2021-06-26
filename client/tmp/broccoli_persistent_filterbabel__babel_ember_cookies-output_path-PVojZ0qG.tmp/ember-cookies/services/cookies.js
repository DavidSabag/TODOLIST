define("ember-cookies/services/cookies", ["exports", "ember-cookies/utils/serialize-cookie"], function (_exports, _serializeCookie2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  var keys = Object.keys;
  var assign = Object.assign || Ember.assign || Ember.merge;
  var DEFAULTS = {
    raw: false
  };
  var MAX_COOKIE_BYTE_LENGTH = 4096;

  var _default = Ember.Service.extend({
    init: function init() {
      this._super.apply(this, arguments);

      this._document = this._document || window.document;

      if (typeof this._fastBoot === 'undefined') {
        var owner = Ember.getOwner(this);
        this._fastBoot = owner.lookup('service:fastboot');
      }
    },
    _getDocumentCookies: function _getDocumentCookies() {
      var all = this._document.cookie.split(';');

      var filtered = this._filterDocumentCookies(all);

      return filtered.reduce(function (acc, cookie) {
        if (!Ember.isEmpty(cookie)) {
          var _cookie = _slicedToArray(cookie, 2),
              key = _cookie[0],
              value = _cookie[1];

          acc[key.trim()] = (value || '').trim();
        }

        return acc;
      }, {});
    },
    _getFastBootCookies: function _getFastBootCookies() {
      var fastBootCookies = Ember.get(this._fastBoot, 'request.cookies');
      fastBootCookies = keys(fastBootCookies).reduce(function (acc, name) {
        var value = fastBootCookies[name];
        acc[name] = {
          value: value
        };
        return acc;
      }, {});
      var fastBootCookiesCache = this._fastBootCookiesCache || {};
      fastBootCookies = assign({}, fastBootCookies, fastBootCookiesCache);
      this._fastBootCookiesCache = fastBootCookies;
      return this._filterCachedFastBootCookies(fastBootCookies);
    },
    read: function read(name) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options = assign({}, DEFAULTS, options || {});
      (true && !(Ember.isEmpty(options.domain) && Ember.isEmpty(options.expires) && Ember.isEmpty(options.maxAge) && Ember.isEmpty(options.path)) && Ember.assert('Domain, Expires, Max-Age, and Path options cannot be set when reading cookies', Ember.isEmpty(options.domain) && Ember.isEmpty(options.expires) && Ember.isEmpty(options.maxAge) && Ember.isEmpty(options.path)));
      var all;

      if (this._isFastBoot()) {
        all = this._getFastBootCookies();
      } else {
        all = this._getDocumentCookies();
      }

      if (name) {
        return this._decodeValue(all[name], options.raw);
      } else {
        keys(all).forEach(function (name) {
          return all[name] = _this._decodeValue(all[name], options.raw);
        });
        return all;
      }
    },
    write: function write(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      options = assign({}, DEFAULTS, options || {});
      (true && !(!options.signed) && Ember.assert("Cookies cannot be set as signed as signed cookies would not be modifyable in the browser as it has no knowledge of the express server's signing key!", !options.signed));
      (true && !(Ember.isEmpty(options.expires) || Ember.isEmpty(options.maxAge)) && Ember.assert('Cookies cannot be set with both maxAge and an explicit expiration time!', Ember.isEmpty(options.expires) || Ember.isEmpty(options.maxAge)));
      value = this._encodeValue(value, options.raw);
      (true && !(this._isCookieSizeAcceptable(value)) && Ember.assert("Cookies larger than ".concat(MAX_COOKIE_BYTE_LENGTH, " bytes are not supported by most browsers!"), this._isCookieSizeAcceptable(value)));

      if (this._isFastBoot()) {
        this._writeFastBootCookie(name, value, options);
      } else {
        (true && !(!options.httpOnly) && Ember.assert('Cookies cannot be set to be HTTP-only from a browser!', !options.httpOnly));
        options.path = options.path || this._normalizedDefaultPath();

        this._writeDocumentCookie(name, value, options);
      }
    },
    clear: function clear(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options = assign({}, options || {});
      (true && !(Ember.isEmpty(options.expires) && Ember.isEmpty(options.maxAge) && Ember.isEmpty(options.raw)) && Ember.assert('Expires, Max-Age, and raw options cannot be set when clearing cookies', Ember.isEmpty(options.expires) && Ember.isEmpty(options.maxAge) && Ember.isEmpty(options.raw)));
      options.expires = new Date('1970-01-01');
      options.path = options.path || this._normalizedDefaultPath();
      this.write(name, null, options);
    },
    exists: function exists(name) {
      var all;

      if (this._isFastBoot()) {
        all = this._getFastBootCookies();
      } else {
        all = this._getDocumentCookies();
      }

      return all.hasOwnProperty(name);
    },
    _writeDocumentCookie: function _writeDocumentCookie(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var serializedCookie = this._serializeCookie(name, value, options);

      this._document.cookie = serializedCookie;
    },
    _writeFastBootCookie: function _writeFastBootCookie(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var responseHeaders = Ember.get(this._fastBoot, 'response.headers');

      var serializedCookie = this._serializeCookie.apply(this, arguments);

      if (!Ember.isEmpty(options.maxAge)) {
        options.maxAge *= 1000;
      }

      this._cacheFastBootCookie.apply(this, arguments);

      var replaced = false;
      var existing = responseHeaders.getAll('set-cookie');

      for (var i = 0; i < existing.length; i++) {
        if (existing[i].startsWith("".concat(name, "="))) {
          existing[i] = serializedCookie;
          replaced = true;
          break;
        }
      }

      if (!replaced) {
        responseHeaders.append('set-cookie', serializedCookie);
      }
    },
    _cacheFastBootCookie: function _cacheFastBootCookie(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fastBootCache = this._fastBootCookiesCache || {};
      var cachedOptions = assign({}, options);

      if (cachedOptions.maxAge) {
        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + options.maxAge);
        cachedOptions.expires = expires;
        delete cachedOptions.maxAge;
      }

      fastBootCache[name] = {
        value: value,
        options: cachedOptions
      };
      this._fastBootCookiesCache = fastBootCache;
    },
    _filterCachedFastBootCookies: function _filterCachedFastBootCookies(fastBootCookies) {
      var _Ember$get = Ember.get(this._fastBoot, 'request'),
          requestPath = _Ember$get.path,
          protocol = _Ember$get.protocol; // cannot use deconstruct here


      var host = Ember.get(this._fastBoot, 'request.host');
      return keys(fastBootCookies).reduce(function (acc, name) {
        var _fastBootCookies$name = fastBootCookies[name],
            value = _fastBootCookies$name.value,
            options = _fastBootCookies$name.options;
        options = options || {};
        var _options = options,
            optionsPath = _options.path,
            domain = _options.domain,
            expires = _options.expires,
            secure = _options.secure;

        if (optionsPath && requestPath.indexOf(optionsPath) !== 0) {
          return acc;
        }

        if (domain && host.indexOf(domain) + domain.length !== host.length) {
          return acc;
        }

        if (expires && expires < new Date()) {
          return acc;
        }

        if (secure && !(protocol || '').match(/^https/)) {
          return acc;
        }

        acc[name] = value;
        return acc;
      }, {});
    },
    _encodeValue: function _encodeValue(value, raw) {
      if (Ember.isNone(value)) {
        return '';
      } else if (raw) {
        return value;
      } else {
        return encodeURIComponent(value);
      }
    },
    _decodeValue: function _decodeValue(value, raw) {
      if (Ember.isNone(value) || raw) {
        return value;
      } else {
        return decodeURIComponent(value);
      }
    },
    _filterDocumentCookies: function _filterDocumentCookies(unfilteredCookies) {
      return unfilteredCookies.map(function (c) {
        var separatorIndex = c.indexOf('=');
        return [c.substring(0, separatorIndex), c.substring(separatorIndex + 1)];
      }).filter(function (c) {
        return c.length === 2 && Ember.isPresent(c[0]);
      });
    },
    _serializeCookie: function _serializeCookie(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return (0, _serializeCookie2.serializeCookie)(name, value, options);
    },
    _isCookieSizeAcceptable: function _isCookieSizeAcceptable(value) {
      // Counting bytes varies Pre-ES6 and in ES6
      // This snippet counts the bytes in the value
      // about to be stored as the cookie:
      // See https://stackoverflow.com/a/25994411/6657064
      var _byteCount = 0;
      var i = 0;
      var c;

      while (c = value.charCodeAt(i++)) {
        /* eslint-disable no-bitwise */
        _byteCount += c >> 11 ? 3 : c >> 7 ? 2 : 1;
        /* eslint-enable no-bitwise */
      }

      return _byteCount < MAX_COOKIE_BYTE_LENGTH;
    },
    _normalizedDefaultPath: function _normalizedDefaultPath() {
      if (!this._isFastBoot()) {
        var pathname = window.location.pathname;
        return pathname.substring(0, pathname.lastIndexOf('/'));
      }
    },
    _isFastBoot: function _isFastBoot() {
      return this._fastBoot && this._fastBoot.isFastBoot;
    }
  });

  _exports.default = _default;
});