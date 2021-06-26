define("ember-simple-auth/initializers/setup-session-service", ["exports", "ember-simple-auth/utils/inject"], function (_exports, _inject) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = setupSessionStore;

  function setupSessionStore(registry) {
    (0, _inject.default)(registry, 'service:session', 'session', 'session:main');
  }
});