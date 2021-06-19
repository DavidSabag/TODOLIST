define("ember-simple-auth/mixins/application-route-mixin", ["exports", "ember-simple-auth/configuration", "ember-simple-auth/utils/is-fastboot"], function (_exports, _configuration, _isFastboot) {
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

  (true && !(false) && Ember.deprecate('Ember Simple Auth: The ApplicationRouteMixin is now deprecated; it can be safely removed.', false, {
    id: 'ember-simple-auth.mixins.application-route-mixin',
    until: '4.0.0'
  }));
  /**
    The mixin for the application route, __defining methods that are called when
    the session is successfully authenticated (see
    {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}})
    or invalidated__ (see
    {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}).
  
    __Using this mixin is optional.__ The session events can also be handled
    manually, e.g. in an instance initializer:
  
    ```js
    // app/instance-initializers/session-events.js
    export function initialize(instance) {
      const applicationRoute = instance.container.lookup('route:application');
      const session          = instance.container.lookup('service:session');
      session.on('authenticationSucceeded', function() {
        applicationRoute.transitionTo('index');
      });
      session.on('invalidationSucceeded', function() {
        applicationRoute.transitionTo('bye');
      });
    };
  
    export default {
      initialize,
      name:  'session-events',
      after: 'ember-simple-auth'
    };
    ```
  
    __When using the `ApplicationRouteMixin` you need to specify
    `needs: ['service:session']` in the application route's unit test.__
  
    @class ApplicationRouteMixin
    @deprecated Call the session service's setup method in the application route's constructor instead
    @module ember-simple-auth/mixins/application-route-mixin
    @extends Ember.Mixin
    @public
  */

  var _default = Ember.Mixin.create({
    /**
      The session service.
       @property session
      @readOnly
      @type SessionService
      @public
    */
    session: Ember.inject.service('session'),

    /**
      The route to transition to after successful authentication.
       @property routeAfterAuthentication
      @type String
      @default 'index'
      @public
    */
    routeAfterAuthentication: 'index',
    init: function init() {
      this._super.apply(this, arguments);

      this.__usesApplicationRouteMixn__ = true;
      this._isFastBoot = this.hasOwnProperty('_isFastBoot') ? this._isFastBoot : (0, _isFastboot.default)(Ember.getOwner(this));

      this._subscribeToSessionEvents();
    },
    _subscribeToSessionEvents: function _subscribeToSessionEvents() {
      var _this = this;

      Ember.A([['authenticationSucceeded', 'sessionAuthenticated'], ['invalidationSucceeded', 'sessionInvalidated']]).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            event = _ref2[0],
            method = _ref2[1];

        _this.get('session').on(event, function () {
          return _this[method].apply(_this, arguments);
        });
      });
    },

    /**
      This method handles the session's
      {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
      event. If there is a transition that was previously intercepted by the
      {{#crossLink "AuthenticatedRouteMixin/beforeModel:method"}}
      AuthenticatedRouteMixin's `beforeModel` method{{/crossLink}} it will retry
      it. If there is no such transition, the `ember_simple_auth-redirectTarget`
      cookie will be checked for a url that represents an attemptedTransition
      that was aborted in Fastboot mode, otherwise this action transitions to the
      {{#crossLink "AuthenticatedRouteMixin/routeAfterAuthentication:property"}}{{/crossLink}}.
        @method sessionAuthenticated
      @public
    */
    sessionAuthenticated: function sessionAuthenticated() {
      this.get('session').handleAuthentication(this.get('routeAfterAuthentication'));
    },

    /**
      This method handles the session's
      {{#crossLink "SessionService/invalidationSucceeded:event"}}{{/crossLink}}
      event. __It reloads the Ember.js application__ by redirecting the browser
      to the application's root URL so that all in-memory data (such as Ember
      Data stores etc.) gets cleared.
       If the Ember.js application will be used in an environment where the users
      don't have direct access to any data stored on the client (e.g.
      [cordova](http://cordova.apache.org)) this action can be overridden to e.g.
      simply transition to the index route.
       @method sessionInvalidated
      @public
    */
    sessionInvalidated: function sessionInvalidated() {
      if (!Ember.testing) {
        this.get('session').handleInvalidation(_configuration.default.rootURL);
      }
    }
  });

  _exports.default = _default;
});