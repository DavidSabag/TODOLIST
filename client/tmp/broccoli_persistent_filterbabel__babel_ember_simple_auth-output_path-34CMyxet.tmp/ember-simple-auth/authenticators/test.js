define("ember-simple-auth/authenticators/test", ["exports", "ember-simple-auth/authenticators/base"], function (_exports, _base) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _base.default.extend({
    restore: function restore(data) {
      return Ember.RSVP.resolve(data);
    },
    authenticate: function authenticate(data) {
      return Ember.RSVP.resolve(data);
    },
    invalidate: function invalidate() {
      return Ember.RSVP.resolve();
    }
  });

  _exports.default = _default;
});