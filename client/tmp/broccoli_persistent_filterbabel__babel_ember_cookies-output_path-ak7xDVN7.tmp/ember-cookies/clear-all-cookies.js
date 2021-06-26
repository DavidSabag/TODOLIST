define("ember-cookies/clear-all-cookies", ["exports", "ember-cookies/utils/serialize-cookie"], function (_exports, _serializeCookie) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;
  var assign = Object.assign || Ember.assign || Ember.merge;

  function _default() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (true && !(!options.httpOnly) && Ember.assert('Cookies cannot be set to be HTTP-only from a browser!', !options.httpOnly));
    (true && !(Ember.isEmpty(options.expires) && Ember.isEmpty(options.maxAge) && Ember.isEmpty(options.raw)) && Ember.assert('Expires, Max-Age, and raw options cannot be set when clearing cookies', Ember.isEmpty(options.expires) && Ember.isEmpty(options.maxAge) && Ember.isEmpty(options.raw)));
    options = assign({}, options, {
      expires: new Date(0)
    });
    var cookies = document.cookie.split(';');
    cookies.forEach(function (cookie) {
      var cookieName = cookie.split('=')[0];
      document.cookie = (0, _serializeCookie.serializeCookie)(cookieName, '', options);
    });
  }
});