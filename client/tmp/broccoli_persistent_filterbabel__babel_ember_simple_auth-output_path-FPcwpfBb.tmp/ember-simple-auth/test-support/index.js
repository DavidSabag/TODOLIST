define("ember-simple-auth/test-support/index", ["exports", "@ember/test-helpers", "ember-simple-auth/authenticators/test"], function (_exports, _testHelpers, _test) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.authenticateSession = authenticateSession;
  _exports.currentSession = currentSession;
  _exports.invalidateSession = invalidateSession;
  var SESSION_SERVICE_KEY = 'service:session';
  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(owner) {
    var authenticator = owner.lookup(TEST_CONTAINER_KEY);

    if (!authenticator) {
      owner.register(TEST_CONTAINER_KEY, _test.default);
    }
  }
  /**
   * Authenticates the session.
   *
   * @param {Object} sessionData Optional argument used to mock an authenticator
   * response (e.g. a token or user).
   * @return {Promise}
   * @public
   */


  function authenticateSession(sessionData) {
    var _getContext = (0, _testHelpers.getContext)(),
        owner = _getContext.owner;

    var session = owner.lookup(SESSION_SERVICE_KEY);
    ensureAuthenticator(owner);
    return session.authenticate(TEST_CONTAINER_KEY, sessionData).then(function () {
      return (0, _testHelpers.settled)();
    });
  }
  /**
   * Returns the current session.
   *
   * @return {Object} a session service.
   * @public
   */


  function currentSession() {
    var _getContext2 = (0, _testHelpers.getContext)(),
        owner = _getContext2.owner;

    return owner.lookup(SESSION_SERVICE_KEY);
  }
  /**
   * Invalidates the session.
   *
   * @return {Promise}
   * @public
   */


  function invalidateSession() {
    var _getContext3 = (0, _testHelpers.getContext)(),
        owner = _getContext3.owner;

    var session = owner.lookup(SESSION_SERVICE_KEY);
    var isAuthenticated = Ember.get(session, 'isAuthenticated');
    return Ember.RSVP.resolve().then(function () {
      if (isAuthenticated) {
        return session.invalidate();
      }
    }).then(function () {
      return (0, _testHelpers.settled)();
    });
  }
});