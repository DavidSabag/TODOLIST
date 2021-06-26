define("ember-simple-auth/services/session", ["exports", "ember-simple-auth/configuration", "ember-simple-auth/-internals/routing"], function (_exports, _configuration, _routing) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var SESSION_DATA_KEY_PREFIX = /^data\./;
  var enableEventsDeprecation = true;

  function deprecateSessionEvents() {
    if (enableEventsDeprecation) {
      (true && !(false) && Ember.deprecate("Ember Simple Auth: The session service's events API is deprecated; to add custom behavior to the authentication or invalidation handling, override the handleAuthentication or handleInvalidation methods.", false, {
        id: 'ember-simple-auth.events.session-service',
        until: '4.0.0'
      }));
    }
  }
  /**
    __The session service provides access to the current session as well as
    methods to authenticate it, invalidate it, etc.__ It is the main interface for
    the application to Ember Simple Auth's functionality. It can be injected via
  
    ```js
    // app/components/login-form.js
    import Component from '@ember/component';
    import { inject as service } from '@ember/service';
  
    export default class LoginFormComponent extends Component {
      @service session;
    }
    ```
  
    @class SessionService
    @module ember-simple-auth/services/session
    @extends Ember.Service
    @uses Ember.Evented
    @public
  */


  var _default = Ember.Service.extend(Ember.Evented, {
    /**
      Triggered whenever the session is successfully authenticated. This happens
      when the session gets authenticated via
      {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}} but also
      when the session is authenticated in another tab or window of the same
      application and the session state gets synchronized across tabs or windows
      via the store (see
      {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).
       When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
      event will automatically get handled (see
      {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).
       @event authenticationSucceeded
      @public
    */

    /**
      Triggered whenever the session is successfully invalidated. This happens
      when the session gets invalidated via
      {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}} but also
      when the session is invalidated in another tab or window of the same
      application and the session state gets synchronized across tabs or windows
      via the store (see
      {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).
       When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
      event will automatically get handled (see
      {{#crossLink "ApplicationRouteMixin/sessionInvalidated:method"}}{{/crossLink}}).
       @event invalidationSucceeded
      @public
    */

    /**
      Returns whether the session is currently authenticated.
       @property isAuthenticated
      @type Boolean
      @readOnly
      @default false
      @public
    */
    isAuthenticated: Ember.computed.oneWay('session.isAuthenticated'),

    /**
      The current session data as a plain object. The
      `authenticated` key holds the session data that the authenticator resolved
      with when the session was authenticated (see
      {{#crossLink "BaseAuthenticator/authenticate:method"}}{{/crossLink}}) and
      that will be cleared when the session is invalidated. This data cannot be
      written. All other session data is writable and will not be cleared when
      the session is invalidated.
       @property data
      @type Object
      @readOnly
      @default { authenticated: {} }
      @public
    */
    data: Ember.computed.oneWay('session.content'),

    /**
      The session store.
       @property store
      @type BaseStore
      @readOnly
      @default null
      @public
    */
    store: Ember.computed.oneWay('session.store'),

    /**
      A previously attempted but intercepted transition (e.g. by the
      {{#crossLink "AuthenticatedRouteMixin"}}{{/crossLink}}). If an attempted
      transition is present, the
      {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} will retry it when the
      session becomes authenticated (see
      {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).
       @property attemptedTransition
      @type Transition
      @default null
      @public
    */
    attemptedTransition: Ember.computed.alias('session.attemptedTransition'),
    init: function init() {
      this._super.apply(this, arguments);

      this._forwardSessionEvents();
    },
    set: function set(key, value) {
      var setsSessionData = SESSION_DATA_KEY_PREFIX.test(key);

      if (setsSessionData) {
        var sessionDataKey = "session.".concat(key.replace(SESSION_DATA_KEY_PREFIX, ''));
        return this._super(sessionDataKey, value);
      } else {
        return this._super.apply(this, arguments);
      }
    },
    _forwardSessionEvents: function _forwardSessionEvents() {
      var _arguments = arguments,
          _this = this;

      Ember.A(['authenticationSucceeded', 'invalidationSucceeded']).forEach(function (event) {
        var session = _this.get('session'); // the internal session won't be available in route unit tests


        if (session) {
          session.on(event, function () {
            enableEventsDeprecation = false;

            _this.trigger.apply(_this, [event].concat(_toConsumableArray(_arguments)));

            enableEventsDeprecation = true;
          });
        }
      });
    },
    on: function on() {
      deprecateSessionEvents();
      return this._super.apply(this, arguments);
    },
    one: function one() {
      deprecateSessionEvents();
      return this._super.apply(this, arguments);
    },
    off: function off() {
      deprecateSessionEvents();
      return this._super.apply(this, arguments);
    },
    has: function has() {
      deprecateSessionEvents();
      return this._super.apply(this, arguments);
    },
    trigger: function trigger() {
      deprecateSessionEvents();
      return this._super.apply(this, arguments);
    },
    _setupHandlers: function _setupHandlers() {
      var _this2 = this;

      this.get('session').on('authenticationSucceeded', function () {
        return _this2.handleAuthentication(_configuration.default.routeAfterAuthentication);
      });
      this.get('session').on('invalidationSucceeded', function () {
        return _this2.handleInvalidation(_configuration.default.rootURL);
      });
    },

    /**
      __Authenticates the session with an `authenticator`__ and appropriate
      arguments. The authenticator implements the actual steps necessary to
      authenticate the session (see
      {{#crossLink "BaseAuthenticator/authenticate:method"}}{{/crossLink}}) and
      returns a promise after doing so. The session handles the returned promise
      and when it resolves becomes authenticated, otherwise remains
      unauthenticated. All data the authenticator resolves with will be
      accessible via the
      {{#crossLink "SessionService/data:property"}}session data's{{/crossLink}}
      `authenticated` property.
       __This method returns a promise. A resolving promise indicates that the
      session was successfully authenticated__ while a rejecting promise
      indicates that authentication failed and the session remains
      unauthenticated. The promise does not resolve with a value; instead, the
      data returned from the authenticator is available via the
      {{#crossLink "SessionService/data:property"}}{{/crossLink}} property.
       When authentication succeeds this will trigger the
      {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
      event.
       @method authenticate
      @param {String} authenticator The authenticator to use to authenticate the session
      @param {Any} [...args] The arguments to pass to the authenticator; depending on the type of authenticator these might be a set of credentials, a Facebook OAuth Token, etc.
      @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully and rejects otherwise
      @public
    */
    authenticate: function authenticate() {
      var session = this.get('session');
      return session.authenticate.apply(session, arguments);
    },

    /**
      __Invalidates the session with the authenticator it is currently
      authenticated with__ (see
      {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}}). This
      invokes the authenticator's
      {{#crossLink "BaseAuthenticator/invalidate:method"}}{{/crossLink}} method
      and handles the returned promise accordingly.
       This method returns a promise. A resolving promise indicates that the
      session was successfully invalidated while a rejecting promise indicates
      that invalidation failed and the session remains authenticated. Once the
      session is successfully invalidated it clears all of its authenticated data
      (see {{#crossLink "SessionService/data:property"}}{{/crossLink}}).
       When invalidation succeeds this will trigger the
      {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}
      event.
       When calling the {{#crossLink "BaseAuthenticator/invalidate:method"}}{{/crossLink}}
      on an already unauthenticated session, the method will return a resolved Promise
      immediately.
       @method invalidate
      @param {Array} ...args arguments that will be passed to the authenticator
      @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully and rejects otherwise
      @public
    */
    invalidate: function invalidate() {
      var session = this.get('session');
      return session.invalidate.apply(session, arguments);
    },

    /**
      Checks whether the session is authenticated and if it is not, transitions
      to the specified route or invokes the specified callback.
       If a transition is in progress and is aborted, this method will save it in the
      session service's
      {{#crossLink "SessionService/attemptedTransition:property"}}{{/crossLink}}
      property so that  it can be retried after the session is authenticated. If
      the transition is aborted in Fastboot mode, the transition's target URL
      will be saved in a `ember_simple_auth-redirectTarget` cookie for use by the
      browser after authentication is complete.
       @method requireAuthentication
      @param {Transition} transition A transition that triggered the authentication requirement or null if the requirement originated independently of a transition
      @param {String|Function} routeOrCallback The route to transition to in case that the session is not authenticated or a callback function to invoke in that case
      @return {Boolean} true when the session is authenticated, false otherwise
      @public
    */
    requireAuthentication: function requireAuthentication(transition, routeOrCallback) {
      var isAuthenticated = (0, _routing.requireAuthentication)(Ember.getOwner(this), transition);

      if (!isAuthenticated) {
        var argType = _typeof(routeOrCallback);

        if (argType === 'string') {
          (0, _routing.triggerAuthentication)(Ember.getOwner(this), routeOrCallback);
        } else if (argType === 'function') {
          routeOrCallback();
        } else {
          (true && !(false) && Ember.assert("The second argument to requireAuthentication must be a String or Function, got \"".concat(argType, "\"!"), false));
        }
      }

      return isAuthenticated;
    },

    /**
      Checks whether the session is authenticated and if it is, transitions
      to the specified route or invokes the specified callback.
       @method prohibitAuthentication
      @param {String|Function} routeOrCallback The route to transition to in case that the session is authenticated or a callback function to invoke in that case
      @return {Boolean} true when the session is not authenticated, false otherwise
      @public
    */
    prohibitAuthentication: function prohibitAuthentication(routeOrCallback) {
      var isAuthenticated = this.get('isAuthenticated');

      if (isAuthenticated) {
        var argType = _typeof(routeOrCallback);

        if (argType === 'string') {
          (0, _routing.prohibitAuthentication)(Ember.getOwner(this), routeOrCallback);
        } else if (argType === 'function') {
          routeOrCallback();
        } else {
          (true && !(false) && Ember.assert("The first argument to prohibitAuthentication must be a String or Function, got \"".concat(argType, "\"!"), false));
        }
      }

      return !isAuthenticated;
    },

    /**
      This method is called whenever the session goes from being unauthenticated
      to being authenticated. If there is a transition that was previously
      intercepted by the
      {{#crossLink "SessionService/requireAuthentication:method"}}{{/crossLink}},
      it will retry it. If there is no such transition, the
      `ember_simple_auth-redirectTarget` cookie will be checked for a url that
      represents an attemptedTransition that was aborted in Fastboot mode,
      otherwise this action transitions to the specified
      routeAfterAuthentication.
       @method handleAuthentication
      @param {String} routeAfterAuthentication The route to transition to
      @public
    */
    handleAuthentication: function handleAuthentication(routeAfterAuthentication) {
      (0, _routing.handleSessionAuthenticated)(Ember.getOwner(this), routeAfterAuthentication);
    },

    /**
      This method is called whenever the session goes from being authenticated to
      not being authenticated. __It reloads the Ember.js application__ by
      redirecting the browser to the specified route so that all in-memory data
      (such as Ember Data stores etc.) gets cleared.
       If the Ember.js application will be used in an environment where the users
      don't have direct access to any data stored on the client (e.g.
      [cordova](http://cordova.apache.org)) this action can be overridden to e.g.
      simply transition to the index route.
       @method handleInvalidation
      @param {String} routeAfterInvalidation The route to transition to
      @public
    */
    handleInvalidation: function handleInvalidation(routeAfterInvalidation) {
      (0, _routing.handleSessionInvalidated)(Ember.getOwner(this), routeAfterInvalidation);
    }
  });

  _exports.default = _default;
});