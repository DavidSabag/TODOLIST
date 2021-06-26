define("ember-simple-auth/mixins/unauthenticated-route-mixin", ["exports", "ember-simple-auth/-internals/routing"], function (_exports, _routing) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  (true && !(false) && Ember.deprecate("Ember Simple Auth: The UnauthenticatedRouteMixin is now deprecated; call the session service's prohibitAuthentication method in the respective route's beforeModel method instead.", false, {
    id: 'ember-simple-auth.mixins.unauthenticated-route-mixin',
    until: '4.0.0'
  }));
  /**
    __This mixin is used to make routes accessible only if the session is
    not authenticated__ (e.g., login and registration routes). It defines a
    `beforeModel` method that aborts the current transition and instead
    transitions to the
    {{#crossLink "UnauthenticatedRouteMixin/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}
    if the session is authenticated.
  
    ```js
    // app/routes/login.js
    import Route from '@ember/routing/route';
    import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
  
    export default class LoginRoute extends Route.extend(UnauthenticatedRouteMixin) {}
    ```
  
    @class UnauthenticatedRouteMixin
    @deprecated Call the session service's prohibitAuthentication method in the respective route's beforeModel method instead
    @module ember-simple-auth/mixins/unauthenticated-route-mixin
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
      The route to transition to if a route that implements the
      {{#crossLink "UnauthenticatedRouteMixin"}}{{/crossLink}} is accessed when
      the session is authenticated.
       @property routeIfAlreadyAuthenticated
      @type String
      @default 'index'
      @public
    */
    routeIfAlreadyAuthenticated: 'index',

    /**
      Checks whether the session is authenticated and if it is aborts the current
      transition and instead transitions to the
      {{#crossLink "UnauthenticatedRouteMixin/routeIfAlreadyAuthenticated:property"}}{{/crossLink}}.
       __If `beforeModel` is overridden in a route that uses this mixin, the route's
     implementation must call `this._super(...arguments)`__ so that the mixin's
     `beforeModel` method is actually executed.
       @method beforeModel
      @public
    */
    beforeModel: function beforeModel() {
      var routeIfAlreadyAuthenticated = this.get('routeIfAlreadyAuthenticated');
      (true && !(this.get('routeName') !== routeIfAlreadyAuthenticated) && Ember.assert('The route configured as UnauthenticatedRouteMixin.routeIfAlreadyAuthenticated cannot implement the UnauthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== routeIfAlreadyAuthenticated));
      var owner = Ember.getOwner(this);
      var sessionService = owner.lookup('service:session');

      if (sessionService.get('isAuthenticated')) {
        (0, _routing.prohibitAuthentication)(owner, routeIfAlreadyAuthenticated);
      } else {
        return this._super.apply(this, arguments);
      }
    }
  });

  _exports.default = _default;
});