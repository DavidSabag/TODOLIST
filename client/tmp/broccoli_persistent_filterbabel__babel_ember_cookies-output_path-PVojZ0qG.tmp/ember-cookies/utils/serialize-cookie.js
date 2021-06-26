define("ember-cookies/utils/serialize-cookie", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.serializeCookie = void 0;

  var serializeCookie = function serializeCookie(name, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var cookie = "".concat(name, "=").concat(value);

    if (!Ember.isEmpty(options.domain)) {
      cookie = "".concat(cookie, "; domain=").concat(options.domain);
    }

    if (Ember.typeOf(options.expires) === 'date') {
      cookie = "".concat(cookie, "; expires=").concat(options.expires.toUTCString());
    }

    if (!Ember.isEmpty(options.maxAge)) {
      cookie = "".concat(cookie, "; max-age=").concat(options.maxAge);
    }

    if (options.secure) {
      cookie = "".concat(cookie, "; secure");
    }

    if (options.httpOnly) {
      cookie = "".concat(cookie, "; httpOnly");
    }

    if (!Ember.isEmpty(options.path)) {
      cookie = "".concat(cookie, "; path=").concat(options.path);
    }

    if (!Ember.isEmpty(options.sameSite)) {
      cookie = "".concat(cookie, "; SameSite=").concat(options.sameSite);
    }

    return cookie;
  };

  _exports.serializeCookie = serializeCookie;
});